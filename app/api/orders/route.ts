import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import Stripe from 'stripe'
import nodemailer from 'nodemailer'
import { getTranslation } from '@/lib/i18n'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'tajny_klucz'

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
      select: { id: true, email: true, role: true, isAdmin: true }
    })
    
    if (!user || (user.role !== 'seller' && user.role !== 'management' && !user.isAdmin)) {
      return null
    }
    
    return user
  } catch (error) {
    return null
  }
}

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
    const { userId, productId, email, phone, info, orderType, termsAccepted, marketingAccepted, collaborationConsentAccepted, codeConsentAccepted, selectedCategory, language = 'pl' } = await request.json()
    if (!phone) {
      return NextResponse.json({ error: getTranslation(language as 'pl' | 'en', 'api.missingData') }, { status: 400 })
    }
    
    // Pobierz dane oprogramowania jeśli to collaboration lub code
    let software = null
    if (productId && (orderType === 'collaboration' || orderType === 'code')) {
      software = await prisma.software.findUnique({
        where: { id: productId }
      })
      if (!software) {
        return NextResponse.json({ error: getTranslation(language as 'pl' | 'en', 'api.softwareNotFound') }, { status: 404 })
      }
    }
    
    // Sprawdź czy zamówienie pochodzi od leada (po emailu) i przypisz sellerId
    let sellerId = null
    if (email) {
      const lead = await prisma.lead.findFirst({
        where: { email: email },
        select: { sellerId: true }
      })
      if (lead) {
        sellerId = lead.sellerId
        console.log(`Znaleziono lead dla emaila ${email}, przypisywanie sellerId: ${sellerId}`)
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
        orderType: orderType || 'collaboration',
        status: 'pending',
        termsAccepted: !!termsAccepted,
        marketingAccepted: !!marketingAccepted,
        collaborationConsentAccepted: !!collaborationConsentAccepted,
        codeConsentAccepted: !!codeConsentAccepted,
        selectedCategory: selectedCategory || null,
        language: language || 'pl',
        sellerId: sellerId, // Przypisz sellerId jeśli znaleziono lead
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
      
      let emailSubject, emailBody
      if (order.orderType === 'consultation') {
        emailSubject = getTranslation(language as 'pl' | 'en', 'email.consultationSubject')
        emailBody = getTranslation(language as 'pl' | 'en', 'email.consultationBody')
      } else if (order.orderType === 'collaboration') {
        emailSubject = getTranslation(language as 'pl' | 'en', 'email.collaborationSubject')
        emailBody = getTranslation(language as 'pl' | 'en', 'email.collaborationBody')
      } else if (order.orderType === 'code') {
        emailSubject = getTranslation(language as 'pl' | 'en', 'email.codeSubject')
        emailBody = getTranslation(language as 'pl' | 'en', 'email.codeBody')
      }
      
      const loggedInUserText = getTranslation(language as 'pl' | 'en', 'email.loggedInUser')
      const orderIdText = getTranslation(language as 'pl' | 'en', 'email.orderId')
      const softwareText = getTranslation(language as 'pl' | 'en', 'email.software')
      const collaborationPriceText = getTranslation(language as 'pl' | 'en', 'email.collaborationPrice')
      const codePriceText = getTranslation(language as 'pl' | 'en', 'email.codePrice')
      
      const softwareName = language === 'en' && software?.nameEn ? software.nameEn : software?.name || softwareText
      
      let priceInfo = ''
      if (order.orderType === 'collaboration' && software) {
        priceInfo = `\n${softwareText}: ${softwareName}\n${collaborationPriceText}: ${Math.round(software.price * 0.3)} PLN`
      } else if (order.orderType === 'code' && software) {
        priceInfo = `\n${softwareText}: ${softwareName}\n${codePriceText}: ${software.price} PLN`
      }
      
      // Mail do właściciela platformy
      await transporter.sendMail({
        from: `FelizTrade <${process.env.EMAIL_USER}>`,
        to: process.env.EMAIL_USER,
        subject: emailSubject,
        text: `${emailBody}\nEmail: ${order.email || loggedInUserText}\nTelefon: ${order.phone}\nInfo: ${order.info || '-'}\n${orderIdText}: ${order.id}${priceInfo}`
      })

      // Email potwierdzający do klienta zostanie wysłany dopiero po potwierdzeniu płatności przez webhook Stripe
      // Nie wysyłamy go tutaj, żeby nie spamować klienta przed płatnością
      console.log('Email potwierdzający do klienta zostanie wysłany po potwierdzeniu płatności')
    } catch (err) {
      console.error('Błąd wysyłki maila:', err)
    }
    
    // 2. Utwórz sesję Stripe Checkout
    const isConsultation = orderType === 'consultation'
    let productName, productDescription, unitAmount
    
    if (isConsultation) {
      productName = getTranslation(language as 'pl' | 'en', 'stripe.consultationTitle')
      productDescription = getTranslation(language as 'pl' | 'en', 'stripe.consultationDescription')
      unitAmount = convertPrice(20000, language) // 200 PLN w groszach
    } else if (orderType === 'collaboration' && software) {
      productName = getTranslation(language as 'pl' | 'en', 'stripe.collaborationTitle')
      const softwareName = language === 'en' && software?.nameEn ? software.nameEn : software?.name || 'Oprogramowanie'
      productDescription = getTranslation(language as 'pl' | 'en', 'stripe.collaborationDescription').replace('{softwareName}', softwareName)
      // Zaliczka za współpracę to 30% ceny oprogramowania
      const collaborationPrice = Math.round((software?.price || 0) * 0.3)
      unitAmount = convertPrice(collaborationPrice, language) * 100
    } else if (orderType === 'code' && software) {
      productName = getTranslation(language as 'pl' | 'en', 'stripe.codeTitle')
      const softwareName = language === 'en' && software?.nameEn ? software.nameEn : software?.name || 'Oprogramowanie'
      productDescription = getTranslation(language as 'pl' | 'en', 'stripe.codeDescription').replace('{softwareName}', softwareName)
      // Pełna cena za kod to 100% ceny oprogramowania
      const codePrice = software?.price || 0
      unitAmount = convertPrice(codePrice, language) * 100
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


      line_items: [
        {
          price_data: {
            currency: getCurrency(language),
            product_data: {
              name: productName || '',
              description: productDescription || '',
            },
            unit_amount: unitAmount || 0,
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
        orderType: orderType || 'collaboration',
      },
      customer_email: userId ? (await prisma.user.findUnique({ where: { id: userId } }))?.email : email,
    })
    
    // 3. Zaktualizuj zamówienie o stripeSessionId
    await prisma.order.update({ where: { id: order.id }, data: { stripeSessionId: session.id } })
    
    // 4. Zwróć url do przekierowania i ID zamówienia
    return NextResponse.json({ 
      url: session.url, 
      orderId: order.id 
    }, { status: 201 })
  } catch (err) {
    console.error('ORDER error:', err)
    return NextResponse.json({ error: getTranslation('pl', 'api.serverError'), details: String(err) }, { status: 500 })
  } finally {
    await prisma.$disconnect()
  }
} 

export async function GET(request: NextRequest) {
  try {
    const user = await checkSellerAuth(request)
    if (!user) {
      return NextResponse.json({ error: 'Brak uprawnień' }, { status: 403 })
    }

    // Pobierz leady sprzedawcy
    const leads = await prisma.lead.findMany({
      where: { sellerId: user.id },
      select: { email: true }
    })
    const leadEmails = leads.map(lead => lead.email).filter((email): email is string => email !== null)

    // Pobierz zamówienia sprzedawcy oraz zamówienia użytkowników z takim samym emailem jak leady
    const orders = await prisma.order.findMany({
      where: {
        OR: [
          { sellerId: user.id },
          { email: { in: [...leadEmails, ...(user.email ? [user.email] : [])] } } // Dodajemy email sprzedawcy
        ]
      },
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json({ orders })
  } catch (error) {
    console.error('Error fetching orders:', error)
    return NextResponse.json({ error: 'Błąd pobierania zamówień', details: String(error) }, { status: 500 })
  } finally {
    await prisma.$disconnect()
  }
} 