import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const prisma = new PrismaClient()

function getStartOfDay(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate())
}

function getStartOfMonth(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), 1)
}

function getEndOfMonth(date: Date) {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0, 23, 59, 59, 999)
}

// Funkcje konwersji walut
function getCurrency(lang: string): string {
  return lang === 'en' ? 'gbp' : 'pln'
}

function convertPrice(price: number, lang: string): number {
  if (lang === 'en') {
    return Math.round(price / 4) // Konwersja PLN na GBP (przybliżony kurs)
  }
  return price
}

export async function GET() {
  try {
    // Pobierz podstawowe statystyki
    const [
      totalSoftware,
      activeSoftware,
      totalUsers,
      totalOrders,
      paidOrders,
      topSoftware,
      recentOrders
    ] = await Promise.all([
      prisma.software.count(),
      prisma.software.count({ where: { status: 'active' } }),
      prisma.user.count(),
      prisma.order.count(),
      prisma.order.count({ where: { status: 'paid' } }),
      prisma.software.findMany({
        orderBy: { sales: 'desc' },
        take: 5,
        select: { id: true, name: true, price: true, sales: true, rating: true }
      }),
      prisma.order.findMany({
        orderBy: { createdAt: 'desc' },
        take: 5,
        select: { id: true, email: true, orderType: true, status: true, createdAt: true }
      })
    ])

    // Pobierz wszystkie oprogramowania do obliczenia przychodu
    const allSoftware = await prisma.software.findMany({ select: { id: true, price: true } })
    const softwarePriceMap = new Map(allSoftware.map(s => [s.id, s.price]))

    // Pobierz wszystkie opłacone zamówienia z informacją o języku
    // @ts-ignore - language field exists in database but TypeScript doesn't recognize it yet
    const paidOrdersData = await prisma.order.findMany({
      where: { status: 'paid' },
      select: { id: true, productId: true, createdAt: true, orderType: true, language: true, customAmount: true }
    }) as any[]

    // Rozdziel przychody według walut
    let totalRevenuePLN = 0
    let totalRevenueGBP = 0
    let totalRevenuePLNCount = 0
    let totalRevenueGBPCount = 0

    paidOrdersData.forEach(order => {
      let price = 0
      if (order.orderType === 'consultation') {
        price = 200 // 200 PLN za konsultację (cena z API)
      } else if (order.orderType === 'collaboration' && order.productId) {
        price = Math.round((softwarePriceMap.get(order.productId) || 0) * 0.3) // 30% ceny za współpracę
      } else if (order.orderType === 'code' && order.productId) {
        price = softwarePriceMap.get(order.productId) || 0 // 100% ceny za kod
      } else if (order.orderType === 'custom_payment') {
        price = (order as any).customAmount || 0
      }

      if (order.language === 'en') {
        totalRevenueGBP += convertPrice(price, 'en')
        totalRevenueGBPCount++
      } else {
        totalRevenuePLN += price
        totalRevenuePLNCount++
      }
    })

    const totalRevenue = totalRevenuePLN + (totalRevenueGBP * 4) // Konwertuj GBP z powrotem na PLN dla porównania
    const averageOrderValue = paidOrdersData.length > 0 ? totalRevenue / paidOrdersData.length : 0

    // Statystyki dzienne (ostatnie 7 i 30 dni)
    const now = new Date()
    const start7 = new Date(now)
    start7.setDate(now.getDate() - 6)
    const start30 = new Date(now)
    start30.setDate(now.getDate() - 29)

    // Przygotuj mapy na sumy dzienne
    const dailyStats7: { date: string, orders: number, revenue: number }[] = []
    const dailyStats30: { date: string, orders: number, revenue: number }[] = []
    for (let i = 0; i < 30; i++) {
      const d = new Date(now)
      d.setDate(now.getDate() - (29 - i))
      const dateStr = d.toISOString().slice(0, 10)
      if (i >= 23) dailyStats7.push({ date: dateStr, orders: 0, revenue: 0 })
      dailyStats30.push({ date: dateStr, orders: 0, revenue: 0 })
    }
    // Zlicz zamówienia i revenue dziennie
    paidOrdersData.forEach(order => {
      const dateStr = order.createdAt.toISOString().slice(0, 10)
      let price = 0
      if (order.orderType === 'consultation') {
        price = 200 // 200 PLN za konsultację
      } else if (order.orderType === 'collaboration' && order.productId) {
        price = Math.round((softwarePriceMap.get(order.productId) || 0) * 0.3) // 30% ceny za współpracę
      } else if (order.orderType === 'code' && order.productId) {
        price = softwarePriceMap.get(order.productId) || 0 // 100% ceny za kod
      } else if (order.orderType === 'custom_payment') {
        price = (order as any).customAmount || 0
      }
      // 30 dni
      const stat30 = dailyStats30.find(d => d.date === dateStr)
      if (stat30) {
        stat30.orders++
        stat30.revenue += price
      }
      // 7 dni
      const stat7 = dailyStats7.find(d => d.date === dateStr)
      if (stat7) {
        stat7.orders++
        stat7.revenue += price
      }
    })

    // Statystyki miesięczne
    const startOfThisMonth = getStartOfMonth(now)
    const startOfLastMonth = getStartOfMonth(new Date(now.getFullYear(), now.getMonth() - 1, 1))
    const endOfLastMonth = getEndOfMonth(new Date(now.getFullYear(), now.getMonth() - 1, 1))

    let thisMonthOrders = 0, thisMonthRevenue = 0
    let lastMonthOrders = 0, lastMonthRevenue = 0
    paidOrdersData.forEach(order => {
      if (order.createdAt >= startOfThisMonth) {
        thisMonthOrders++
        if (order.orderType === 'consultation') {
          thisMonthRevenue += 200 // 200 PLN za konsultację
        } else if (order.orderType === 'collaboration' && order.productId) {
          thisMonthRevenue += Math.round((softwarePriceMap.get(order.productId) || 0) * 0.3) // 30% ceny za współpracę
        } else if (order.orderType === 'code' && order.productId) {
          thisMonthRevenue += softwarePriceMap.get(order.productId) || 0 // 100% ceny za kod
        } else if (order.orderType === 'custom_payment') {
          thisMonthRevenue += (order as any).customAmount || 0
        }
      } else if (order.createdAt >= startOfLastMonth && order.createdAt <= endOfLastMonth) {
        lastMonthOrders++
        if (order.orderType === 'consultation') {
          lastMonthRevenue += 200 // 200 PLN za konsultację
        } else if (order.orderType === 'collaboration' && order.productId) {
          lastMonthRevenue += Math.round((softwarePriceMap.get(order.productId) || 0) * 0.3) // 30% ceny za współpracę
        } else if (order.orderType === 'code' && order.productId) {
          lastMonthRevenue += softwarePriceMap.get(order.productId) || 0 // 100% ceny za kod
        } else if (order.orderType === 'custom_payment') {
          lastMonthRevenue += (order as any).customAmount || 0
        }
      }
    })

    const statistics = {
      totalSoftware,
      activeSoftware,
      totalUsers,
      totalOrders,
      paidOrders,
      totalRevenue,
      totalRevenuePLN,
      totalRevenueGBP,
      totalRevenuePLNCount,
      totalRevenueGBPCount,
      averageOrderValue,
      topSoftware,
      recentOrders,
      dailyStats7,
      dailyStats30,
      thisMonthOrders,
      thisMonthRevenue,
      lastMonthOrders,
      lastMonthRevenue
    }

    const response = NextResponse.json(statistics)
    response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate')
    response.headers.set('Pragma', 'no-cache')
    response.headers.set('Expires', '0')
    response.headers.set('Surrogate-Control', 'no-store')
    return response
  } catch (error) {
    console.error('Error fetching statistics:', error)
    return NextResponse.json({ error: 'Błąd pobierania statystyk', details: String(error) }, { status: 500 })
  } finally {
    await prisma.$disconnect()
  }
} 