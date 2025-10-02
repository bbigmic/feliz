import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import Stripe from 'stripe'
import nodemailer from 'nodemailer'
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
          // Pobierz szczegóły zamówienia
          const order = await prisma.order.findUnique({
            where: { id: parseInt(orderId) },
            include: { user: true }
          })

          if (order) {
            // Aktualizuj status zamówienia
            await prisma.order.update({
              where: { id: parseInt(orderId) },
              data: { status: 'paid' }
            })
            console.log(getTranslation('pl', 'api.orderPaid').replace('{orderId}', orderId))
            

            // Zwiększ poziom sprzedawcy za opłacone zamówienia collaboration/code
            if (order.sellerId && (orderType === 'collaboration' || orderType === 'code')) {
              // Pobierz aktualny poziom sprzedawcy
              const seller = await prisma.user.findUnique({
                where: { id: order.sellerId },
                select: { level: true }
              })
              
              if (seller) {
                // Oblicz aktualny procent prowizji na podstawie poziomu PRZED zwiększeniem
                const getCommissionRate = (level: number) => {
                  if (level >= 25) return 0.25
                  if (level >= 20) return 0.20
                  if (level >= 15) return 0.15
                  return 0.10
                }
                
                const commissionRate = getCommissionRate(seller.level)
                
                // Zapisz procent prowizji w zamówieniu
                await prisma.order.update({
                  where: { id: parseInt(orderId) },
                  data: { commissionRate }
                })
                
                // Zwiększ poziom sprzedawcy
                await prisma.user.update({
                  where: { id: order.sellerId },
                  data: { level: { increment: 1 } }
                })
                
                console.log(`Zapisano prowizję ${commissionRate * 100}% i zwiększono poziom sprzedawcy ID: ${order.sellerId} za zamówienie ${orderType}`)
              }
            }
            
            // Wyślij mail potwierdzający płatność do klienta
            if (order.email) {
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

                const language = order.language || 'pl'
                const greeting = getTranslation(language as 'pl' | 'en', 'email.customerGreeting')
                const thankYou = getTranslation(language as 'pl' | 'en', 'email.customerThankYou')
                
                let paymentSubject, paymentBody
                if (order.orderType === 'consultation') {
                  paymentSubject = language === 'en' 
                    ? 'Payment Confirmed - Consultation Order' 
                    : 'Płatność potwierdzona - Zamówienie konsultacji'
                  paymentBody = language === 'en'
                    ? 'Your consultation order payment has been confirmed. We will contact you soon to discuss your project.'
                    : 'Płatność za zamówienie konsultacji została potwierdzona. Skontaktujemy się z Tobą wkrótce, aby omówić Twój projekt.'
                } else if (order.orderType === 'collaboration') {
                  paymentSubject = language === 'en' 
                    ? 'Payment Confirmed - Collaboration Order' 
                    : 'Płatność potwierdzona - Zamówienie współpracy'
                  paymentBody = language === 'en'
                    ? 'Your collaboration order payment has been confirmed. We will contact you within 24 hours to arrange next steps.'
                    : 'Płatność za zamówienie współpracy została potwierdzona. Skontaktujemy się z Tobą w ciągu 24 godzin, aby ustalić dalsze kroki.'
                } else if (order.orderType === 'code') {
                  paymentSubject = language === 'en' 
                    ? 'Payment Confirmed - Code Order' 
                    : 'Płatność potwierdzona - Zamówienie kodu'
                  paymentBody = language === 'en'
                    ? 'Your code order payment has been confirmed. Code with instructions will be delivered within 7 working days.'
                    : 'Płatność za zamówienie kodu została potwierdzona. Kod z instrukcjami zostanie dostarczony w ciągu 7 dni roboczych.'
                }

                const paymentEmailText = `${greeting}!

${paymentBody}

${language === 'en' ? 'Order Details' : 'Szczegóły zamówienia'}:
${language === 'en' ? 'Order ID' : 'ID zamówienia'}: ${order.id}
${language === 'en' ? 'Order Type' : 'Typ zamówienia'}: ${order.orderType === 'consultation' ? (language === 'en' ? 'Consultation/Quote' : 'Konsultacja/Wycena') : order.orderType === 'collaboration' ? (language === 'en' ? 'Collaboration' : 'Współpraca') : (language === 'en' ? 'Code' : 'Kod')}
${language === 'en' ? 'Phone' : 'Telefon'}: ${order.phone}

${language === 'en' ? 'Contact Information' : 'Informacje kontaktowe'}:
${language === 'en' ? 'Email' : 'Email'}: ${process.env.EMAIL_USER}
${language === 'en' ? 'Phone' : 'Telefon'}: +48 502 600 739
${language === 'en' ? 'Website' : 'Strona internetowa'}: https://feliztradeltd.com

${thankYou}

---
FelizTrade Team`

                await transporter.sendMail({
                  from: `FelizTrade <${process.env.EMAIL_USER}>`,
                  to: order.email,
                  subject: paymentSubject,
                  text: paymentEmailText
                })

                console.log(`Payment confirmation email sent to customer: ${order.email}`)
              } catch (emailErr) {
                console.error('Error sending payment confirmation email to customer:', emailErr)
              }
            }
            
            // Jeśli to collaboration lub code i mamy productId, zwiększ licznik sprzedaży
            if ((orderType === 'collaboration' || orderType === 'code') && productId) {
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
        }
        break

      case 'checkout.session.expired':
        const expiredSession = event.data.object as Stripe.Checkout.Session
        const expiredOrderId = expiredSession.metadata?.orderId

        if (expiredOrderId) {
          // Pobierz szczegóły zamówienia przed aktualizacją
          const expiredOrder = await prisma.order.findUnique({
            where: { id: parseInt(expiredOrderId) }
          })

          if (expiredOrder) {
            await prisma.order.update({
              where: { id: parseInt(expiredOrderId) },
              data: { status: 'expired' }
            })
            console.log(getTranslation('pl', 'api.orderExpired').replace('{orderId}', expiredOrderId))

            // Wyślij mail informujący o wygaśnięciu sesji płatności
            if (expiredOrder.email) {
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

                const language = expiredOrder.language || 'pl'
                const greeting = getTranslation(language as 'pl' | 'en', 'email.customerGreeting')
                
                const expiredSubject = language === 'en' 
                  ? 'Payment Session Expired - Action Required' 
                  : 'Sesja płatności wygasła - Wymagane działanie'
                
                const expiredBody = language === 'en'
                  ? 'Your payment session has expired. To complete your order, please visit our website and place a new order.'
                  : 'Twoja sesja płatności wygasła. Aby dokończyć zamówienie, odwiedź naszą stronę internetową i złóż nowe zamówienie.'

                const expiredEmailText = `${greeting}!

${expiredBody}

${language === 'en' ? 'Order Details' : 'Szczegóły zamówienia'}:
${language === 'en' ? 'Order ID' : 'ID zamówienia'}: ${expiredOrder.id}
${language === 'en' ? 'Order Type' : 'Typ zamówienia'}: ${expiredOrder.orderType === 'consultation' ? (language === 'en' ? 'Consultation/Quote' : 'Konsultacja/Wycena') : expiredOrder.orderType === 'collaboration' ? (language === 'en' ? 'Collaboration' : 'Współpraca') : (language === 'en' ? 'Code' : 'Kod')}

${language === 'en' ? 'To complete your order, please visit' : 'Aby dokończyć zamówienie, odwiedź'}: https://feliztradeltd.com

${language === 'en' ? 'Contact Information' : 'Informacje kontaktowe'}:
${language === 'en' ? 'Email' : 'Email'}: ${process.env.EMAIL_USER}
${language === 'en' ? 'Phone' : 'Telefon'}: +48 502 600 739

---
FelizTrade Team`

                await transporter.sendMail({
                  from: `FelizTrade <${process.env.EMAIL_USER}>`,
                  to: expiredOrder.email,
                  subject: expiredSubject,
                  text: expiredEmailText
                })

                console.log(`Expired session notification email sent to customer: ${expiredOrder.email}`)
              } catch (emailErr) {
                console.error('Error sending expired session notification email to customer:', emailErr)
              }
            }
          }
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