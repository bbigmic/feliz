import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import jwt from 'jsonwebtoken'

const prisma = new PrismaClient()
const JWT_SECRET = process.env.JWT_SECRET || 'tajny_klucz'

// Funkcja do weryfikacji admina
async function checkAdminAuth(request: NextRequest) {
  const token = request.cookies.get('token')?.value
  if (!token) return null

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { id: number; email: string }
    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      select: { id: true, email: true, isAdmin: true, role: true }
    })
    
    if (!user || (!user.isAdmin && user.role !== 'admin' && user.role !== 'management')) {
      return null
    }
    return user
  } catch (error) {
    return null
  }
}

export async function GET(request: NextRequest) {
  try {
    const admin = await checkAdminAuth(request)
    if (!admin) {
      return NextResponse.json({ error: 'Brak uprawnień' }, { status: 403 })
    }

    // Pobierz wszystkich użytkowników z informacjami o referrerze i referralach
    const allUsers = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        level: true,
        createdAt: true,
        referrerId: true,
        referrer: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true
          }
        },
        referrals: {
          select: {
            id: true,
            email: true,
            role: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    // Pobierz oprogramowania do obliczania cen
    const allSoftware = await prisma.software.findMany({
      select: { id: true, price: true }
    })
    const softwarePriceMap = new Map(allSoftware.map(s => [s.id, s.price]))

    // Oblicz statystyki dla każdego użytkownika
    const usersWithStats = await Promise.all(
      allUsers.map(async (user) => {
        // Pobierz zamówienia użytkownika jako sprzedawcy
        const orders = await prisma.order.findMany({
          where: {
            sellerId: user.id,
            status: 'paid'
          },
          select: {
            id: true,
            orderType: true,
            productId: true,
            commissionRate: true,
            createdAt: true
          }
        })

        // Oblicz obrót i prowizję
        let revenue = 0
        let commission = 0

        orders.forEach(order => {
          let price = 0
          if (order.orderType === 'consultation') {
            price = 200
          } else if (order.orderType === 'collaboration' && order.productId) {
            price = Math.round((softwarePriceMap.get(order.productId) || 0) * 0.3)
          } else if (order.orderType === 'code' && order.productId) {
            price = softwarePriceMap.get(order.productId) || 0
          }
          revenue += price
          
          if (order.commissionRate) {
            commission += Math.round(price * order.commissionRate)
          }
        })

        // Pobierz prowizje z zespołu (jako referrer)
        const teamCommissions = await prisma.order.findMany({
          where: {
            status: 'paid',
            referrerCommission: { not: null },
            seller: {
              referrerId: user.id
            }
          },
          select: {
            referrerCommission: true
          }
        })

        const totalTeamCommission = teamCommissions.reduce(
          (sum, order) => sum + (order.referrerCommission || 0), 
          0
        )

        return {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role,
          level: user.level,
          createdAt: user.createdAt,
          referrerId: user.referrerId,
          referrer: user.referrer,
          referralsCount: user.referrals.length,
          sellerReferralsCount: user.referrals.filter(r => 
            r.role === 'seller' || r.role === 'management' || r.role === 'admin'
          ).length,
          ordersCount: orders.length,
          revenue: revenue,
          commission: commission,
          teamCommission: totalTeamCommission,
          totalEarnings: commission + totalTeamCommission
        }
      })
    )

    // Zbuduj strukturę drzewa
    const buildTree = (userId: number | null): any[] => {
      return usersWithStats
        .filter(user => user.referrerId === userId)
        .map(user => ({
          ...user,
          children: buildTree(user.id)
        }))
    }

    const networkTree = buildTree(null)

    // Oblicz globalne statystyki
    const totalUsers = allUsers.length
    const totalSellers = allUsers.filter(u => 
      u.role === 'seller' || u.role === 'management' || u.role === 'admin'
    ).length
    const totalRevenue = usersWithStats.reduce((sum, u) => sum + u.revenue, 0)
    const totalCommissions = usersWithStats.reduce((sum, u) => sum + u.commission, 0)
    const totalTeamCommissions = usersWithStats.reduce((sum, u) => sum + u.teamCommission, 0)

    return NextResponse.json({
      success: true,
      users: usersWithStats,
      networkTree,
      statistics: {
        totalUsers,
        totalSellers,
        totalRevenue,
        totalCommissions,
        totalTeamCommissions,
        totalEarnings: totalCommissions + totalTeamCommissions
      }
    })
  } catch (error) {
    console.error('Error fetching network data:', error)
    return NextResponse.json({
      error: 'Błąd pobierania danych networku',
      details: String(error)
    }, { status: 500 })
  } finally {
    await prisma.$disconnect()
  }
}

