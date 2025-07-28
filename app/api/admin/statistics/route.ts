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

    // Pobierz wszystkie opłacone zamówienia
    const paidOrdersData = await prisma.order.findMany({
      where: { status: 'paid' },
      select: { id: true, productId: true, createdAt: true, orderType: true }
    })

    // Całkowity przychód
    const totalRevenue = paidOrdersData.reduce((sum, order) => {
      if (order.orderType === 'consultation') {
        return sum + 500 // 500 zł za konsultację
      } else if (order.orderType === 'demo' && order.productId) {
        const price = softwarePriceMap.get(order.productId) || 0
        return sum + Math.round(price * 0.2) // 20% ceny za demo
      }
      return sum
    }, 0)
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
        price = 500 // 500 zł za konsultację
      } else if (order.orderType === 'demo' && order.productId) {
        price = Math.round((softwarePriceMap.get(order.productId) || 0) * 0.2) // 20% ceny za demo
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
          thisMonthRevenue += 500 // 500 zł za konsultację
        } else if (order.orderType === 'demo' && order.productId) {
          thisMonthRevenue += Math.round((softwarePriceMap.get(order.productId) || 0) * 0.2) // 20% ceny za demo
        }
      } else if (order.createdAt >= startOfLastMonth && order.createdAt <= endOfLastMonth) {
        lastMonthOrders++
        if (order.orderType === 'consultation') {
          lastMonthRevenue += 500 // 500 zł za konsultację
        } else if (order.orderType === 'demo' && order.productId) {
          lastMonthRevenue += Math.round((softwarePriceMap.get(order.productId) || 0) * 0.2) // 20% ceny za demo
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