import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import Stripe from 'stripe'

const prisma = new PrismaClient()
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: '2023-10-16' })

export async function POST(request: NextRequest) {
  const body = await request.text()
  const signature = request.headers.get('stripe-signature')

  if (!signature) {
    return NextResponse.json({ error: 'Brak podpisu' }, { status: 400 })
  }

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(body, signature, process.env.STRIPE_WEBHOOK_SECRET!)
  } catch (err) {
    console.error('Webhook signature verification failed:', err)
    return NextResponse.json({ error: 'Nieprawidłowy podpis' }, { status: 400 })
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed':
        const session = event.data.object as Stripe.Checkout.Session
        const orderId = session.metadata?.orderId

        if (orderId) {
          await prisma.order.update({
            where: { id: parseInt(orderId) },
            data: { status: 'paid' }
          })
          console.log(`Zamówienie ${orderId} zostało opłacone`)
        }
        break

      case 'checkout.session.expired':
        const expiredSession = event.data.object as Stripe.Checkout.Session
        const expiredOrderId = expiredSession.metadata?.orderId

        if (expiredOrderId) {
          await prisma.order.update({
            where: { id: parseInt(expiredOrderId) },
            data: { status: 'expired' }
          })
          console.log(`Zamówienie ${expiredOrderId} wygasło`)
        }
        break

      default:
        console.log(`Nieobsługiwany typ eventu: ${event.type}`)
    }

    return NextResponse.json({ received: true })
  } catch (err) {
    console.error('Błąd podczas przetwarzania webhook:', err)
    return NextResponse.json({ error: 'Błąd serwera' }, { status: 500 })
  } finally {
    await prisma.$disconnect()
  }
} 