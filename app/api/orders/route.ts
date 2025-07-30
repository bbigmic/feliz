import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import Stripe from 'stripe'
import nodemailer from 'nodemailer'
import { getTranslation } from '@/lib/i18n'

const prisma = new PrismaClient()
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: '2023-10-16' })

// Funkcje walutowe
function getCurrency(lang: string): string {
  return lang === 'en' ? 'gbp' : 'pln'
}

function convertPrice(price: number, lang: string): number {
  if (lang === 'en') {
    return Math.round(price / 4) // Konwersja PLN na GBP (przybliżony kurs)
  }
  return price
}

export async function POST(request: NextRequest) {
  try {
    const { userId, productId, email, phone, info, orderType, termsAccepted, marketingAccepted, demoConsentAccepted, selectedCategory, language = 'pl' } = await request.json()
    if (!phone) {
      return NextResponse.json({ error: getTranslation(language as 'pl' | 'en', 'api.missingData') }, { status: 400 })
    }
    
    // Pobierz dane oprogramowania jeśli to demo
    let software = null
    if (productId && orderType === 'demo') {
      software = await prisma.software.findUnique({
        where: { id: productId }
      })
      if (!software) {
        return NextResponse.json({ error: getTranslation(language as 'pl' | 'en', 'api.softwareNotFound') }, { status: 404 })
      }
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
        demoConsentAccepted: !!demoConsentAccepted,
        selectedCategory: selectedCategory || null,
        language: language || 'pl',
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
      const emailSubject = order.orderType === 'consultation' 
        ? getTranslation(language as 'pl' | 'en', 'email.consultationSubject')
        : getTranslation(language as 'pl' | 'en', 'email.demoSubject')
      
      const emailBody = order.orderType === 'consultation'
        ? getTranslation(language as 'pl' | 'en', 'email.consultationBody')
        : getTranslation(language as 'pl' | 'en', 'email.demoBody')
      
      const loggedInUserText = getTranslation(language as 'pl' | 'en', 'email.loggedInUser')
      const orderIdText = getTranslation(language as 'pl' | 'en', 'email.orderId')
      const softwareText = getTranslation(language as 'pl' | 'en', 'email.software')
      const demoPriceText = getTranslation(language as 'pl' | 'en', 'email.demoPrice')
      
      const softwareName = language === 'en' && software?.nameEn ? software.nameEn : software?.name || softwareText
      
      await transporter.sendMail({
        from: `FelizTrade <${process.env.EMAIL_USER}>`,
        to: process.env.EMAIL_USER,
        subject: emailSubject,
        text: `${emailBody}\nEmail: ${order.email || loggedInUserText}\nTelefon: ${order.phone}\nInfo: ${order.info || '-'}\n${orderIdText}: ${order.id}${software ? `\n${softwareText}: ${softwareName}\n${demoPriceText}: ${Math.round(software.price * 0.2)} PLN` : ''}`
      })
    } catch (err) {
      console.error('Błąd wysyłki maila:', err)
    }
    
    // 2. Utwórz sesję Stripe Checkout
    const isConsultation = orderType === 'consultation' || !productId
    let productName, productDescription, unitAmount
    
    if (isConsultation) {
      productName = getTranslation(language as 'pl' | 'en', 'stripe.consultationTitle')
      productDescription = getTranslation(language as 'pl' | 'en', 'stripe.consultationDescription')
      unitAmount = convertPrice(20000, language) // 200 PLN w groszach
    } else {
      productName = getTranslation(language as 'pl' | 'en', 'stripe.demoTitle')
      const softwareName = language === 'en' && software?.nameEn ? software.nameEn : software?.name || 'Oprogramowanie'
      productDescription = getTranslation(language as 'pl' | 'en', 'stripe.demoDescription').replace('{softwareName}', softwareName)
      // Zaliczka za demo to 20% ceny oprogramowania, konwertujemy tylko raz
      const demoPrice = Math.round((software?.price || 0) * 0.2)
      unitAmount = convertPrice(demoPrice, language) * 100 // Konwertujemy PLN na GBP jeśli EN, potem na grosze
    }
    
    // Debug URL-i
    const baseUrl = process.env.NODE_ENV === 'production' 
      ? process.env.NEXT_PUBLIC_BASE_URL 
      : (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000')
    
    const successUrl = `${baseUrl}/order-success?orderId=${order.id}`
    const cancelUrl = `${baseUrl}/`
    
    console.log('Stripe URLs:', {
      NODE_ENV: process.env.NODE_ENV,
      VERCEL_URL: process.env.VERCEL_URL,
      NEXT_PUBLIC_BASE_URL: process.env.NEXT_PUBLIC_BASE_URL,
      baseUrl,
      successUrl,
      cancelUrl
    })
    
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: getCurrency(language),
            product_data: {
              name: productName,
              description: productDescription,
            },
            unit_amount: unitAmount,
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: successUrl,
      cancel_url: cancelUrl,
      metadata: {
        orderId: order.id.toString(),
        productId: productId?.toString() || '',
        orderType: orderType || 'demo',
      },
      customer_email: userId ? (await prisma.user.findUnique({ where: { id: userId } }))?.email : email,
    })
    
    // 3. Zaktualizuj zamówienie o stripeSessionId
    await prisma.order.update({ where: { id: order.id }, data: { stripeSessionId: session.id } })
    
    // 4. Zwróć url do przekierowania
    return NextResponse.json({ url: session.url }, { status: 201 })
  } catch (err) {
    console.error('ORDER error:', err)
    return NextResponse.json({ error: getTranslation('pl', 'api.serverError'), details: String(err) }, { status: 500 })
  } finally {
    await prisma.$disconnect()
  }
} 