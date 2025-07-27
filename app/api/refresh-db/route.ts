import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

export async function GET() {
  try {
    console.log('Refresh DB called - forcing complete refresh')
    
    // Wymuś odświeżenie połączenia
    const prisma = new PrismaClient()
    await prisma.$connect()
    await prisma.$disconnect()
    
    // Utwórz nowe połączenie
    const newPrisma = new PrismaClient()
    await newPrisma.$connect()
    
    // Sprawdź liczbę zamówień po odświeżeniu
    const orderCount = await newPrisma.order.count()
    const latestOrder = await newPrisma.order.findFirst({
      orderBy: { createdAt: 'desc' },
      select: { id: true, email: true, createdAt: true }
    })
    
    // Sprawdź wszystkie zamówienia z ostatnich 24h
    const recentOrders = await newPrisma.order.findMany({
      where: {
        createdAt: {
          gte: new Date(Date.now() - 24 * 60 * 60 * 1000) // ostatnie 24h
        }
      },
      orderBy: { createdAt: 'desc' },
      select: { id: true, email: true, createdAt: true }
    })
    
    // Sprawdź szczegóły połączenia
    const connectionInfo = await newPrisma.$queryRaw`
      SELECT 
        current_database() as database_name,
        current_user as current_user,
        NOW() as current_time
    `
    
    await newPrisma.$disconnect()
    
    return NextResponse.json({
      success: true,
      message: 'Połączenie z bazą odświeżone',
      orderCount,
      latestOrder,
      recentOrders,
      connectionInfo,
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.error('Refresh DB error:', error)
    return NextResponse.json({ 
      error: String(error),
      message: 'Błąd odświeżania połączenia'
    }, { status: 500 })
  }
} 