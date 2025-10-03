import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import jwt from 'jsonwebtoken'

const prisma = new PrismaClient()
const JWT_SECRET = process.env.JWT_SECRET || 'tajny_klucz'

// Funkcja pomocnicza do weryfikacji tokenu
function verifyToken(request: NextRequest) {
  const token = request.cookies.get('token')?.value
  if (!token) return null
  
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { id: number; email: string }
    return decoded
  } catch (error) {
    return null
  }
}

export async function GET(request: NextRequest) {
  try {
    const user = verifyToken(request)
    
    if (!user) {
      return NextResponse.json({ error: 'Nieautoryzowany' }, { status: 401 })
    }

    // Pobierz użytkownika z bazy danych
    const dbUser = await prisma.user.findUnique({
      where: { id: user.id },
      select: { role: true }
    })

    if (!dbUser || (dbUser.role !== 'seller' && dbUser.role !== 'management' && dbUser.role !== 'admin')) {
      return NextResponse.json({ error: 'Brak uprawnień' }, { status: 403 })
    }

    // Pobierz statystyki poleceń
    const referrals = await prisma.user.findMany({
      where: {
        referrerId: user.id
      },
      select: {
        id: true,
        email: true,
        role: true,
        createdAt: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    const totalReferrals = referrals.length
    const sellerReferrals = referrals.filter(r => 
      r.role === 'seller' || r.role === 'management' || r.role === 'admin'
    ).length

    // Pobierz oprogramowania do obliczenia cen
    const allSoftware = await prisma.software.findMany({ 
      select: { id: true, price: true } 
    })
    const softwarePriceMap = new Map(allSoftware.map(s => [s.id, s.price]))

    // Oblicz obrót dla każdego zaproszonego sprzedawcy
    const referralsWithRevenue = await Promise.all(
      referrals.map(async (referral) => {
        // Pobierz opłacone zamówienia sprzedawcy
        const orders = await prisma.order.findMany({
          where: {
            sellerId: referral.id,
            status: 'paid'
          },
          select: {
            orderType: true,
            productId: true
          }
        })

        // Oblicz obrót
        let revenue = 0
        orders.forEach(order => {
          let price = 0
          if (order.orderType === 'consultation') {
            price = 200 // 200 PLN za konsultację
          } else if (order.orderType === 'collaboration' && order.productId) {
            price = Math.round((softwarePriceMap.get(order.productId) || 0) * 0.3) // 30% ceny za współpracę
          } else if (order.orderType === 'code' && order.productId) {
            price = softwarePriceMap.get(order.productId) || 0 // 100% ceny za kod
          }
          revenue += price
        })

        return {
          id: referral.id,
          email: referral.email,
          role: referral.role,
          createdAt: referral.createdAt,
          revenue: revenue,
          ordersCount: orders.length
        }
      })
    )

    return NextResponse.json({
      success: true,
      totalReferrals,
      sellerReferrals,
      referrals: referralsWithRevenue
    })
  } catch (error) {
    console.error('Błąd pobierania statystyk poleceń:', error)
    return NextResponse.json({ 
      error: 'Błąd pobierania statystyk',
      details: String(error)
    }, { status: 500 })
  } finally {
    await prisma.$disconnect()
  }
}

