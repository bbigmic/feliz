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
      select: { id: true, email: true, role: true, isAdmin: true, level: true }
    })
    
    if (!user || !['seller', 'management', 'admin'].includes(user.role)) {
      return null
    }
    
    return user
  } catch (error) {
    return null
  }
}

function getStartOfMonth(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), 1)
}

function getEndOfMonth(date: Date) {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0, 23, 59, 59, 999)
}

export async function GET(request: NextRequest) {
  try {
    const user = await checkSellerAuth(request)
    if (!user) {
      return NextResponse.json({ error: 'Brak uprawnień' }, { status: 403 })
    }

    const now = new Date()
    
    // Pobierz zamówienia sprzedawcy oraz zamówienia użytkowników z emailami jak leady sprzedawcy
    const leads = await prisma.lead.findMany({
      where: { sellerId: user.id },
      select: { email: true }
    })
    const leadEmails = leads.map(lead => lead.email).filter((email): email is string => email !== null)

    // Filtr dla zamówień sprzedawcy
    const orderFilter = {
      OR: [
        { sellerId: user.id },
        { email: { in: [...leadEmails, ...(user.email ? [user.email] : [])] } }
      ]
    }

    // Pobierz podstawowe statystyki dla sprzedawcy
    const [
      totalOrders,
      paidOrders,
      recentOrders
    ] = await Promise.all([
      prisma.order.count({ where: orderFilter }),
      prisma.order.count({ where: { ...orderFilter, status: 'paid' } }),
      prisma.order.findMany({
        where: orderFilter,
        orderBy: { createdAt: 'desc' },
        take: 5,
        select: { id: true, email: true, orderType: true, status: true, createdAt: true }
      })
    ])

    // Pobierz wszystkie oprogramowania do obliczenia przychodu
    const allSoftware = await prisma.software.findMany({ select: { id: true, price: true } })
    const softwarePriceMap = new Map(allSoftware.map(s => [s.id, s.price]))

    // Pobierz opłacone zamówienia sprzedawcy z historycznymi prowizjami
    const paidOrdersData = await prisma.order.findMany({
      where: { ...orderFilter, status: 'paid' },
      select: { id: true, productId: true, createdAt: true, orderType: true, language: true, commissionRate: true }
    }) as any[]

    // Oblicz przychód i prowizje na podstawie historycznych danych
    let totalRevenue = 0
    let totalCommission = 0
    
    paidOrdersData.forEach(order => {
      let price = 0
      if (order.orderType === 'consultation') {
        price = 200 // 200 PLN za konsultację
      } else if (order.orderType === 'collaboration' && order.productId) {
        price = Math.round((softwarePriceMap.get(order.productId) || 0) * 0.3) // 30% ceny za współpracę
      } else if (order.orderType === 'code' && order.productId) {
        price = softwarePriceMap.get(order.productId) || 0 // 100% ceny za kod
      }
      
      totalRevenue += price
      
      // Użyj historycznej prowizji z zamówienia, jeśli dostępna
      if (order.commissionRate && order.sellerId) {
        totalCommission += Math.round(price * order.commissionRate)
      }
    })

    const averageOrderValue = paidOrders > 0 ? totalRevenue / paidOrders : 0

    // Statystyki miesięczne i dzienne z historycznymi prowizjami
    const startOfThisMonth = getStartOfMonth(now)
    const startOfLastMonth = getStartOfMonth(new Date(now.getFullYear(), now.getMonth() - 1, 1))
    const endOfLastMonth = getEndOfMonth(new Date(now.getFullYear(), now.getMonth() - 1, 1))
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    const endOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999)

    let thisMonthOrders = 0, thisMonthRevenue = 0, thisMonthCommission = 0
    let lastMonthOrders = 0, lastMonthRevenue = 0, lastMonthCommission = 0
    let todayOrders = 0
    
    paidOrdersData.forEach(order => {
      let price = 0
      if (order.orderType === 'consultation') {
        price = 200
      } else if (order.orderType === 'collaboration' && order.productId) {
        price = Math.round((softwarePriceMap.get(order.productId) || 0) * 0.3)
      } else if (order.orderType === 'code' && order.productId) {
        price = softwarePriceMap.get(order.productId) || 0
      }

      const commission = order.commissionRate && order.sellerId ? Math.round(price * order.commissionRate) : 0

      if (order.createdAt >= startOfThisMonth) {
        thisMonthOrders++
        thisMonthRevenue += price
        thisMonthCommission += commission
      } else if (order.createdAt >= startOfLastMonth && order.createdAt <= endOfLastMonth) {
        lastMonthOrders++
        lastMonthRevenue += price
        lastMonthCommission += commission
      }

      // Statystyki dzienne
      if (order.createdAt >= startOfToday && order.createdAt <= endOfToday) {
        todayOrders++
      }
    })

    // Aktualny procent prowizji (dla nowych zamówień)
    const getCommissionRate = (level: number) => {
      if (level >= 25) return 0.25 // 25% max
      if (level >= 20) return 0.20 // 20%
      if (level >= 15) return 0.15 // 15%
      return 0.10 // 10% domyślnie
    }
    
    const currentCommissionRate = getCommissionRate(user.level)

    const statistics = {
      totalOrders,
      paidOrders,
      totalRevenuePLN: totalRevenue,
      totalCommission,
      averageOrderValue,
      recentOrders,
      todayOrders, // Statystyki dzienne
      thisMonthOrders,
      thisMonthRevenue,
      thisMonthCommission,
      lastMonthOrders,
      lastMonthRevenue,
      lastMonthCommission,
      sellerLevel: user.level, // Dodajemy poziom sprzedawcy
      commissionRate: Math.round(currentCommissionRate * 100) // Aktualny procent prowizji dla nowych zamówień
    }

    const response = NextResponse.json(statistics)
    
    // Wyłącz cachowanie
    response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate')
    response.headers.set('Pragma', 'no-cache')
    response.headers.set('Expires', '0')
    response.headers.set('Surrogate-Control', 'no-store')
    
    return response
  } catch (error) {
    console.error('Error fetching seller statistics:', error)
    return NextResponse.json({ 
      error: 'Błąd pobierania statystyk sprzedawcy',
      details: String(error)
    }, { status: 500 })
  } finally {
    await prisma.$disconnect()
  }
}
