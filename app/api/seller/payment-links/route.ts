import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import Stripe from 'stripe'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'tajny_klucz'
const prisma = new PrismaClient()
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: '2023-10-16' })

// Middleware do sprawdzania autoryzacji sprzedawcy
async function checkSellerAuth(request: NextRequest) {
  const token = request.cookies.get('token')?.value
  
  if (!token) {
    return null
  }
  
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { id: number; email: string }
    const user = await prisma.user.findUnique({ 
      where: { id: decoded.id },
      select: { id: true, email: true, role: true, isAdmin: true, level: true }
    })
    
    if (!user || (user.role !== 'seller' && user.role !== 'management' && !user.isAdmin)) {
      return null
    }
    
    return user
  } catch (error) {
    return null
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await checkSellerAuth(request)
    if (!user) {
      return NextResponse.json({ error: 'Brak uprawnień' }, { status: 403 })
    }

    const { amount, description, customerEmail, customerPhone } = await request.json()
    
    if (!amount || amount <= 0) {
      return NextResponse.json({ error: 'Nieprawidłowa kwota' }, { status: 400 })
    }

    // Utwórz zamówienie w bazie z określoną kwotą i sellerId
    const order = await prisma.order.create({
      data: {
        sellerId: user.id,
        email: customerEmail || null,
        phone: customerPhone || 'Brak',
        info: description || 'Płatność wygenerowana przez sprzedawcę',
        orderType: 'custom_payment', // Nowy typ zamówienia
        status: 'pending',
        termsAccepted: true,
        marketingAccepted: false,
        language: 'pl',
        customAmount: amount, // Zapisz kwotę w bazie
      }
    })

    // Oblicz prowizję na podstawie poziomu sprzedawcy
    const getCommissionRate = (level: number) => {
      if (level >= 25) return 0.25
      if (level >= 20) return 0.20
      if (level >= 15) return 0.15
      return 0.10
    }

    const commissionRate = getCommissionRate(user.level)

    // Debug URL-i
    const baseUrl = process.env.NODE_ENV === 'production' 
      ? process.env.NEXT_PUBLIC_BASE_URL 
      : (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000')
    
    const successUrl = `${baseUrl}/order-success?orderId=${order.id}`
    const cancelUrl = `${baseUrl}/`

    // Utwórz sesję Stripe Checkout z niestandardową kwotą
    const session = await stripe.checkout.sessions.create({
      line_items: [
        {
          price_data: {
            currency: 'pln',
            product_data: {
              name: 'Płatność',
              description: description || 'Zamówienie wygenerowane przez sprzedawcę',
            },
            unit_amount: Math.round(amount * 100), // Kwota w groszach
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: successUrl,
      cancel_url: cancelUrl,
      metadata: {
        orderId: order.id.toString(),
        orderType: 'custom_payment',
        customAmount: amount.toString(),
      },
      customer_email: customerEmail || undefined,
    })

    // Zaktualizuj zamówienie o stripeSessionId
    await prisma.order.update({ 
      where: { id: order.id }, 
      data: { stripeSessionId: session.id }
    })

    return NextResponse.json({ 
      paymentUrl: session.url,
      orderId: order.id,
      amount,
      commissionAmount: Math.round(amount * commissionRate),
      commissionRate: commissionRate * 100
    }, { status: 201 })

  } catch (error) {
    console.error('Error generating payment link:', error)
    return NextResponse.json({ 
      error: 'Błąd podczas generowania linku płatności', 
      details: String(error) 
    }, { status: 500 })
  } finally {
    await prisma.$disconnect()
  }
}

