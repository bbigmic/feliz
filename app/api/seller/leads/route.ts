import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'tajny_klucz'
const prisma = new PrismaClient()

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
    
    if (!user || !['seller', 'management', 'admin'].includes(user.role)) {
      return null
    }
    
    return user
  } catch (error) {
    return null
  }
}

export async function GET(request: NextRequest) {
  try {
    const user = await checkSellerAuth(request)
    if (!user) {
      return NextResponse.json({ error: 'Brak uprawnień' }, { status: 403 })
    }

    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status') || 'all'
    const search = searchParams.get('search') || ''

    // Pobieramy zamówienia jako potencjalne leady
    let whereClause: any = {}
    
    if (status !== 'all') {
      whereClause.status = status
    }
    
    if (search) {
      whereClause.OR = [
        { email: { contains: search, mode: 'insensitive' } },
        { phone: { contains: search } },
        { info: { contains: search, mode: 'insensitive' } }
      ]
    }

    const leads = await prisma.order.findMany({
      where: whereClause,
      orderBy: { createdAt: 'desc' },
      include: {
        user: {
          select: { email: true }
        }
      }
    })

    const response = NextResponse.json({ leads })
    
    // Wyłącz cachowanie
    response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate')
    response.headers.set('Pragma', 'no-cache')
    response.headers.set('Expires', '0')
    response.headers.set('Surrogate-Control', 'no-store')
    
    return response
  } catch (error) {
    console.error('Error fetching leads:', error)
    return NextResponse.json({ 
      error: 'Błąd pobierania leadów',
      details: String(error)
    }, { status: 500 })
  } finally {
    await prisma.$disconnect()
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await checkSellerAuth(request)
    if (!user) {
      return NextResponse.json({ error: 'Brak uprawnień' }, { status: 403 })
    }

    const { email, phone, orderType, info, selectedCategory } = await request.json()
    
    if (!email && !phone) {
      return NextResponse.json({ error: 'Email lub telefon jest wymagany' }, { status: 400 })
    }

    // Tworzymy nowy lead jako zamówienie
    const lead = await prisma.order.create({
      data: {
        email,
        phone: phone || '',
        orderType: orderType || 'consultation',
        info,
        selectedCategory,
        status: 'pending',
        termsAccepted: true, // Zakładamy zgodę dla leadów dodanych przez sprzedawców
        marketingAccepted: false,
        collaborationConsentAccepted: false,
        codeConsentAccepted: false,
        language: 'pl'
      }
    })

    const response = NextResponse.json({ success: true, lead })
    
    // Wyłącz cachowanie
    response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate')
    response.headers.set('Pragma', 'no-cache')
    response.headers.set('Expires', '0')
    response.headers.set('Surrogate-Control', 'no-store')
    
    return response
  } catch (error) {
    console.error('Error creating lead:', error)
    return NextResponse.json({ 
      error: 'Błąd tworzenia leada',
      details: String(error)
    }, { status: 500 })
  } finally {
    await prisma.$disconnect()
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const user = await checkSellerAuth(request)
    if (!user) {
      return NextResponse.json({ error: 'Brak uprawnień' }, { status: 403 })
    }

    const { searchParams } = new URL(request.url)
    const leadId = searchParams.get('id')
    
    if (!leadId) {
      return NextResponse.json({ error: 'ID leada jest wymagane' }, { status: 400 })
    }

    const { status, info } = await request.json()
    
    const lead = await prisma.order.update({
      where: { id: parseInt(leadId) },
      data: {
        ...(status && { status }),
        ...(info !== undefined && { info })
      }
    })

    const response = NextResponse.json({ success: true, lead })
    
    // Wyłącz cachowanie
    response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate')
    response.headers.set('Pragma', 'no-cache')
    response.headers.set('Expires', '0')
    response.headers.set('Surrogate-Control', 'no-store')
    
    return response
  } catch (error) {
    console.error('Error updating lead:', error)
    return NextResponse.json({ 
      error: 'Błąd aktualizacji leada',
      details: String(error)
    }, { status: 500 })
  } finally {
    await prisma.$disconnect()
  }
} 