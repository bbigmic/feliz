import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import Stripe from 'stripe'
import nodemailer from 'nodemailer'
import { getTranslation } from '@/lib/i18n'
import { createEmailTemplate, formatEmailContent } from '@/lib/emailTemplate'

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
            select: { 
              id: true, 
              email: true, 
              phone: true,
              orderType: true, 
              language: true, 
              sellerId: true,
              user: true,
              customAmount: true // Dla custom_payment
            }
          })

          if (order) {
            // Aktualizuj status zamówienia
            await prisma.order.update({
              where: { id: parseInt(orderId) },
              data: { status: 'paid' }
            })
            console.log(getTranslation('pl', 'api.orderPaid').replace('{orderId}', orderId))
            

            // Zapisz prowizję dla wszystkich zamówień ze sprzedawcą
            // Zwiększ poziom tylko za collaboration/code
            if (order.sellerId) {
              // Pobierz aktualny poziom sprzedawcy i jego referrerId
              const seller = await prisma.user.findUnique({
                where: { id: order.sellerId },
                select: { level: true, referrerId: true }
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
                
                // Oblicz prowizję dla referrera (dynamiczna na podstawie sieci)
                let referrerCommission = 0
                let referrerCommissionRate = 0.05 // Domyślnie 5%
                
                if (seller.referrerId) {
                  // Sprawdź poziomy sprzedawców w sieci referrera
                  const referredSellers = await prisma.user.findMany({
                    where: {
                      referrerId: seller.referrerId,
                      role: 'seller'
                    },
                    select: { level: true }
                  })
                  
                  // Zlicz sprzedawców na poziomach 15+ i 25+
                  const sellersLevel15Plus = referredSellers.filter(s => s.level >= 15).length
                  const sellersLevel25Plus = referredSellers.filter(s => s.level >= 25).length
                  
                  // Określ procent prowizji na podstawie osiągnięć sieci
                  if (sellersLevel25Plus >= 5) {
                    referrerCommissionRate = 0.10 // 10% jeśli 5+ sprzedawców ma poziom 25+
                  } else if (sellersLevel15Plus >= 3) {
                    referrerCommissionRate = 0.075 // 7.5% jeśli 3+ sprzedawców ma poziom 15+
                  }
                  
                  // Oblicz cenę zamówienia
                  let orderPrice = 0
                  if (orderType === 'consultation') {
                    orderPrice = 200 // 200 PLN za konsultację
                  } else if (orderType === 'collaboration' || orderType === 'code') {
                    // Pobierz cenę software
                    if (productId) {
                      const software = await prisma.software.findUnique({
                        where: { id: parseInt(productId) },
                        select: { price: true }
                      })
                      if (software) {
                        if (orderType === 'collaboration') {
                          orderPrice = Math.round(software.price * 0.3) // 30% ceny za współpracę
                        } else {
                          orderPrice = software.price // 100% ceny za kod
                        }
                      }
                    }
                  } else if (orderType === 'custom_payment') {
                    // Dla niestandardowych płatności, pobierz kwotę z zamówienia
                    orderPrice = (order as any).customAmount || 0
                  }
                  
                  // Oblicz prowizję referrera
                  referrerCommission = Math.round(orderPrice * referrerCommissionRate)
                  console.log(`Referrer ID ${seller.referrerId} otrzyma ${referrerCommission} PLN (${referrerCommissionRate * 100}% z ${orderPrice} PLN) za zamówienie sprzedawcy ID: ${order.sellerId}. Sieć: ${sellersLevel15Plus} sprzedawców 15+, ${sellersLevel25Plus} sprzedawców 25+`)
                }
                
                // Zapisz procent prowizji i prowizję referrera w zamówieniu
                await prisma.order.update({
                  where: { id: parseInt(orderId) },
                  data: { 
                    commissionRate,
                    referrerCommission: referrerCommission > 0 ? referrerCommission : null
                  }
                })
                
                // Zwiększ poziom sprzedawcy TYLKO za collaboration/code
                if (orderType === 'collaboration' || orderType === 'code') {
                  await prisma.user.update({
                    where: { id: order.sellerId },
                    data: { level: { increment: 1 } }
                  })
                  console.log(`Zapisano prowizję ${commissionRate * 100}%, zwiększono poziom sprzedawcy ID: ${order.sellerId} za zamówienie ${orderType}`)
                } else if (orderType === 'custom_payment') {
                  // Dla niestandardowych płatności również zwiększamy poziom
                  await prisma.user.update({
                    where: { id: order.sellerId },
                    data: { level: { increment: 1 } }
                  })
                  console.log(`Zapisano prowizję ${commissionRate * 100}%, zwiększono poziom sprzedawcy ID: ${order.sellerId} za zamówienie ${orderType}`)
                } else {
                  console.log(`Zapisano prowizję ${commissionRate * 100}% dla sprzedawcy ID: ${order.sellerId} za zamówienie ${orderType} (bez zwiększenia poziomu)`)
                }
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
                } else if (order.orderType === 'custom_payment') {
                  paymentSubject = language === 'en' 
                    ? 'Payment Confirmed - Installment Payment' 
                    : 'Płatność potwierdzona - Kolejna rata'
                  paymentBody = language === 'en'
                    ? 'Your installment payment has been confirmed. Thank you for your payment.'
                    : 'Płatność kolejnej raty została potwierdzona. Dziękujemy za wpłatę.'
                }

                const orderTypeText = order.orderType === 'consultation' 
                  ? (language === 'en' ? 'Consultation/Quote' : 'Konsultacja/Wycena') 
                  : order.orderType === 'collaboration' 
                  ? (language === 'en' ? 'Collaboration' : 'Współpraca') 
                  : order.orderType === 'code' 
                  ? (language === 'en' ? 'Code' : 'Kod') 
                  : order.orderType === 'custom_payment' 
                  ? (language === 'en' ? 'Installment Payment' : 'Kolejna rata') 
                  : order.orderType

                const emailDetails = `
                  <p style="margin: 0 0 10px 0;"><strong style="color: #667eea;">${language === 'en' ? 'Order Details' : 'Szczegóły zamówienia'}:</strong></p>
                  <p style="margin: 5px 0;"><strong>${language === 'en' ? 'Order ID' : 'ID zamówienia'}:</strong> #${order.id}</p>
                  <p style="margin: 5px 0;"><strong>${language === 'en' ? 'Order Type' : 'Typ zamówienia'}:</strong> ${orderTypeText}</p>
                  <p style="margin: 5px 0;"><strong>${language === 'en' ? 'Phone' : 'Telefon'}:</strong> ${order.phone}</p>
                  <p style="margin: 20px 0 0 0; padding-top: 15px; border-top: 1px solid #e0e0e0;"><em>${thankYou}</em></p>
                `

                const emailHtml = createEmailTemplate(
                  formatEmailContent(greeting, paymentBody || '', emailDetails),
                  language as 'pl' | 'en'
                )

                await transporter.sendMail({
                  from: `FelizTrade <${process.env.EMAIL_USER}>`,
                  to: order.email,
                  subject: paymentSubject,
                  html: emailHtml
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

                const expiredOrderTypeText = expiredOrder.orderType === 'consultation' 
                  ? (language === 'en' ? 'Consultation/Quote' : 'Konsultacja/Wycena') 
                  : expiredOrder.orderType === 'collaboration' 
                  ? (language === 'en' ? 'Collaboration' : 'Współpraca') 
                  : expiredOrder.orderType === 'code' 
                  ? (language === 'en' ? 'Code' : 'Kod') 
                  : expiredOrder.orderType === 'custom_payment' 
                  ? (language === 'en' ? 'Installment Payment' : 'Kolejna rata') 
                  : expiredOrder.orderType

                const expiredEmailDetails = `
                  <p style="margin: 0 0 10px 0;"><strong style="color: #667eea;">${language === 'en' ? 'Order Details' : 'Szczegóły zamówienia'}:</strong></p>
                  <p style="margin: 5px 0;"><strong>${language === 'en' ? 'Order ID' : 'ID zamówienia'}:</strong> #${expiredOrder.id}</p>
                  <p style="margin: 5px 0;"><strong>${language === 'en' ? 'Order Type' : 'Typ zamówienia'}:</strong> ${expiredOrderTypeText}</p>
                  <p style="margin: 20px 0; padding: 15px; background-color: #fff3cd; border-left: 4px solid #ffc107; border-radius: 4px;">
                    <strong>⚠️ ${language === 'en' ? 'Action Required' : 'Wymagane działanie'}:</strong><br>
                    ${language === 'en' ? 'To complete your order, please visit' : 'Aby dokończyć zamówienie, odwiedź'}: 
                    <a href="https://feliztradeltd.com" style="color: #667eea; font-weight: 600;">feliztradeltd.com</a>
                  </p>
                `

                const expiredEmailHtml = createEmailTemplate(
                  formatEmailContent(greeting, expiredBody, expiredEmailDetails),
                  language as 'pl' | 'en'
                )

                await transporter.sendMail({
                  from: `FelizTrade <${process.env.EMAIL_USER}>`,
                  to: expiredOrder.email,
                  subject: expiredSubject,
                  html: expiredEmailHtml
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