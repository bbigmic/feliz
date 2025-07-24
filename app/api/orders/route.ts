import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import Stripe from 'stripe'
import nodemailer from 'nodemailer'

const prisma = new PrismaClient()
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: '2023-10-16' })

export async function POST(request: NextRequest) {
  try {
    const { userId, productId, email, phone, info, orderType, termsAccepted, marketingAccepted } = await request.json()
    if (!phone) {
      return NextResponse.json({ error: 'Brak wymaganych danych.' }, { status: 400 })
    }
    // 1. Utwórz zamówienie w bazie
    const order = await prisma.order.create({
      data: {
        userId: userId || null,
        productId: productId || null,
        email: email || null,
        phone,
        info: info || null,
        orderType: orderType || 'demo',
        status: 'pending',
        termsAccepted: !!termsAccepted,
        marketingAccepted: !!marketingAccepted,
      },
    })
    // Wysyłka maila do właściciela
    try {
      const transporter = nodemailer.createTransport({
        host: process.env.SMTP_SERVER,
        port: Number(process.env.SMTP_PORT),
        secure: false,
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
      })
      await transporter.sendMail({
        from: `FelizTrade <${process.env.EMAIL_USER}>`,
        to: process.env.EMAIL_USER,
        subject: order.orderType === 'consultation' ? 'Nowa wycena/konsultacja' : 'Nowe zamówienie demo',
        text: `Nowe zamówienie (${order.orderType === 'consultation' ? 'wycena/konsultacja' : 'demo'}):\nEmail: ${order.email || 'zalogowany użytkownik'}\nTelefon: ${order.phone}\nInfo: ${order.info || '-'}\nID zamówienia: ${order.id}`
      })
    } catch (err) {
      console.error('Błąd wysyłki maila:', err)
    }
    // 2. Utwórz sesję Stripe Checkout
    const isConsultation = orderType === 'consultation' || !productId
    const productName = isConsultation ? 'Konsultacja/Wycena' : 'Demo oprogramowania'
    const productDescription = isConsultation ? 'Zamówienie konsultacji lub wyceny FelizTrade' : 'Zamówienie demo produktu FelizTrade'
    const unitAmount = isConsultation ? 50000 : 150000 // konsultacja/wycena: 500 zł, demo: 1500 zł
    
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'pln',
            product_data: {
              name: productName,
              description: productDescription,
            },
            unit_amount: unitAmount, // 500 zł lub 1500 zł w groszach
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : process.env.NEXT_PUBLIC_BASE_URL}/order-success?orderId=${order.id}`,
      cancel_url: `${process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : process.env.NEXT_PUBLIC_BASE_URL}/`,
      metadata: {
        orderId: order.id.toString(),
      },
      customer_email: userId ? (await prisma.user.findUnique({ where: { id: userId } }))?.email : email,
    })
    // 3. Zaktualizuj zamówienie o stripeSessionId
    await prisma.order.update({ where: { id: order.id }, data: { stripeSessionId: session.id } })
    // 4. Zwróć url do przekierowania
    return NextResponse.json({ url: session.url }, { status: 201 })
  } catch (err) {
    console.error('ORDER error:', err)
    return NextResponse.json({ error: 'Błąd serwera.', details: String(err) }, { status: 500 })
  } finally {
    await prisma.$disconnect()
  }
} 