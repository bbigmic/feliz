import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import Stripe from 'stripe'

const prisma = new PrismaClient()
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: '2023-10-16' })

export async function POST(request: NextRequest) {
  console.log('🔔 Webhook Stripe otrzymany')
  
  // Sprawdź czy STRIPE_WEBHOOK_SECRET jest skonfigurowany
  if (!process.env.STRIPE_WEBHOOK_SECRET) {
    console.error('❌ STRIPE_WEBHOOK_SECRET nie jest skonfigurowany')
    return NextResponse.json({ error: 'Webhook secret nie jest skonfigurowany' }, { status: 500 })
  }

  const body = await request.text()
  const signature = request.headers.get('stripe-signature')

  if (!signature) {
    console.error('❌ Brak podpisu Stripe')
    return NextResponse.json({ error: 'Brak podpisu' }, { status: 400 })
  }

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(body, signature, process.env.STRIPE_WEBHOOK_SECRET)
    console.log(`✅ Podpis zweryfikowany, typ eventu: ${event.type}`)
  } catch (err) {
    console.error('❌ Błąd weryfikacji podpisu:', err)
    return NextResponse.json({ error: 'Nieprawidłowy podpis' }, { status: 400 })
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed':
        const session = event.data.object as Stripe.Checkout.Session
        const orderId = session.metadata?.orderId
        const productId = session.metadata?.productId
        const orderType = session.metadata?.orderType

        console.log(`💰 Płatność zakończona dla zamówienia: ${orderId}`)
        console.log(`📦 ProductId: ${productId}, OrderType: ${orderType}`)

        if (orderId) {
          // Sprawdź czy zamówienie istnieje
          const existingOrder = await prisma.order.findUnique({
            where: { id: parseInt(orderId) }
          })

          if (!existingOrder) {
            console.error(`❌ Zamówienie ${orderId} nie istnieje w bazie danych`)
            return NextResponse.json({ error: 'Zamówienie nie istnieje' }, { status: 404 })
          }

          if (existingOrder.status === 'paid') {
            console.log(`ℹ️ Zamówienie ${orderId} już zostało opłacone`)
            return NextResponse.json({ received: true, message: 'Zamówienie już opłacone' })
          }

          // Aktualizuj status zamówienia
          await prisma.order.update({
            where: { id: parseInt(orderId) },
            data: { status: 'paid' }
          })
          console.log(`✅ Zamówienie ${orderId} zostało oznaczone jako opłacone`)
          
          // Jeśli to demo i mamy productId, zwiększ licznik sprzedaży
          if (orderType === 'demo' && productId) {
            try {
              await prisma.software.update({
                where: { id: parseInt(productId) },
                data: {
                  sales: {
                    increment: 1
                  }
                }
              })
              console.log(`📈 Zwiększono licznik sprzedaży dla oprogramowania ${productId}`)
            } catch (err) {
              console.error('❌ Błąd podczas zwiększania licznika sprzedaży:', err)
            }
          }
        } else {
          console.error('❌ Brak orderId w metadata sesji')
        }
        break

      case 'checkout.session.expired':
        const expiredSession = event.data.object as Stripe.Checkout.Session
        const expiredOrderId = expiredSession.metadata?.orderId

        console.log(`⏰ Sesja wygasła dla zamówienia: ${expiredOrderId}`)

        if (expiredOrderId) {
          await prisma.order.update({
            where: { id: parseInt(expiredOrderId) },
            data: { status: 'expired' }
          })
          console.log(`✅ Zamówienie ${expiredOrderId} oznaczone jako wygasłe`)
        }
        break

      default:
        console.log(`ℹ️ Nieobsługiwany typ eventu: ${event.type}`)
    }

    return NextResponse.json({ received: true })
  } catch (err) {
    console.error('❌ Błąd podczas przetwarzania webhook:', err)
    return NextResponse.json({ error: 'Błąd serwera' }, { status: 500 })
  } finally {
    await prisma.$disconnect()
  }
} 