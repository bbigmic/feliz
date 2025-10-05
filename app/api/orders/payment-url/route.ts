import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import Stripe from 'stripe'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'tajny_klucz'
const prisma = new PrismaClient()
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: '2023-10-16' })

// Middleware do sprawdzania autoryzacji
async function checkAuth(request: NextRequest) {
  const token = request.cookies.get('token')?.value
  
  if (!token) {
    return null
  }
  
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { id: number; email: string }
    const user = await prisma.user.findUnique({ 
      where: { id: decoded.id },
      select: { id: true, email: true, role: true, isAdmin: true }
    })
    
    if (!user) {
      return null
    }
    
    return user
  } catch (error) {
    return null
  }
}

export async function GET(request: NextRequest) {
  try {
    const user = await checkAuth(request)
    if (!user) {
      return NextResponse.json({ error: 'Brak uprawnień' }, { status: 403 })
    }

    const { searchParams } = new URL(request.url)
    const orderId = searchParams.get('orderId')
    
    if (!orderId) {
      return NextResponse.json({ error: 'Brak ID zamówienia' }, { status: 400 })
    }

    // Pobierz zamówienie
    const order = await prisma.order.findUnique({
      where: { id: parseInt(orderId) }
    })

    if (!order) {
      return NextResponse.json({ error: 'Zamówienie nie istnieje' }, { status: 404 })
    }

    // Sprawdź czy użytkownik ma dostęp do tego zamówienia
    const isOwner = order.sellerId === user.id || order.email === user.email
    const isAdmin = user.isAdmin || user.role === 'admin' || user.role === 'management'
    
    if (!isOwner && !isAdmin) {
      return NextResponse.json({ error: 'Brak dostępu do tego zamówienia' }, { status: 403 })
    }

    // Sprawdź czy zamówienie ma stripeSessionId
    if (!order.stripeSessionId) {
      return NextResponse.json({ error: 'Brak linku płatności dla tego zamówienia' }, { status: 404 })
    }

    // Sprawdź czy zamówienie jest w statusie pending
    if (order.status !== 'pending') {
      return NextResponse.json({ 
        error: 'Link płatności dostępny tylko dla zamówień oczekujących',
        status: order.status 
      }, { status: 400 })
    }

    // Pobierz sesję Stripe
    try {
      const session = await stripe.checkout.sessions.retrieve(order.stripeSessionId)
      
      if (!session.url) {
        return NextResponse.json({ error: 'Link płatności wygasł' }, { status: 410 })
      }

      return NextResponse.json({ 
        paymentUrl: session.url,
        orderId: order.id,
        status: session.status
      })
    } catch (stripeError: any) {
      console.error('Stripe error:', stripeError)
      return NextResponse.json({ 
        error: 'Błąd pobierania linku płatności',
        details: stripeError.message
      }, { status: 500 })
    }

  } catch (error) {
    console.error('Error fetching payment URL:', error)
    return NextResponse.json({ 
      error: 'Błąd serwera', 
      details: String(error) 
    }, { status: 500 })
  } finally {
    await prisma.$disconnect()
  }
}

