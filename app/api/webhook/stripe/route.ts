import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import Stripe from 'stripe'
import { getTranslation } from '@/lib/i18n'

const prisma = new PrismaClient()
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: '2023-10-16' })

export async function POST(request: NextRequest) {
  const body = await request.text()
  const signature = request.headers.get('stripe-signature')

  if (!signature) {
    return NextResponse.json({ error: getTranslation('pl', 'api.missingSignature') }, { status: 400 })
  }

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(body, signature, process.env.STRIPE_WEBHOOK_SECRET!)
  } catch (err) {
    console.error('Webhook signature verification failed:', err)
    return NextResponse.json({ error: getTranslation('pl', 'api.invalidSignature') }, { status: 400 })
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed':
        const session = event.data.object as Stripe.Checkout.Session
        const orderId = session.metadata?.orderId
        const productId = session.metadata?.productId
        const orderType = session.metadata?.orderType

        if (orderId) {
          // Aktualizuj status zamówienia
          await prisma.order.update({
            where: { id: parseInt(orderId) },
            data: { status: 'paid' }
          })
          console.log(getTranslation('pl', 'api.orderPaid').replace('{orderId}', orderId))
          
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
              console.log(getTranslation('pl', 'api.salesIncremented').replace('{productId}', productId))
            } catch (err) {
              console.error(getTranslation('pl', 'api.salesError'), err)
            }
          }
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
          console.log(getTranslation('pl', 'api.orderExpired').replace('{orderId}', expiredOrderId))
        }
        break

      default:
        console.log(getTranslation('pl', 'api.unhandledEvent').replace('{eventType}', event.type))
    }

    return NextResponse.json({ received: true })
  } catch (err) {
    console.error(getTranslation('pl', 'api.webhookError'), err)
    return NextResponse.json({ error: getTranslation('pl', 'api.serverError') }, { status: 500 })
  } finally {
    await prisma.$disconnect()
  }
} 