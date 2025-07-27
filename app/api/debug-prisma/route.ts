import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

export async function GET() {
  try {
    console.log('Debug Prisma Client instances')
    
    // Utwórz kilka instancji Prisma Client
    const prisma1 = new PrismaClient()
    const prisma2 = new PrismaClient()
    const prisma3 = new PrismaClient()
    
    // Sprawdź połączenia
    await prisma1.$connect()
    await prisma2.$connect()
    await prisma3.$connect()
    
    // Sprawdź liczbę zamówień w każdej instancji
    const count1 = await prisma1.order.count()
    const count2 = await prisma2.order.count()
    const count3 = await prisma3.order.count()
    
    // Sprawdź najnowsze zamówienie w każdej instancji
    const latest1 = await prisma1.order.findFirst({
      orderBy: { createdAt: 'desc' },
      select: { id: true, email: true, createdAt: true }
    })
    
    const latest2 = await prisma2.order.findFirst({
      orderBy: { createdAt: 'desc' },
      select: { id: true, email: true, createdAt: true }
    })
    
    const latest3 = await prisma3.order.findFirst({
      orderBy: { createdAt: 'desc' },
      select: { id: true, email: true, createdAt: true }
    })
    
    // Sprawdź szczegóły połączenia
    const connectionInfo = await prisma1.$queryRaw`
      SELECT 
        current_database() as database_name,
        current_user as current_user,
        NOW() as current_time,
        pg_backend_pid() as process_id
    `
    
    // Zamknij połączenia
    await prisma1.$disconnect()
    await prisma2.$disconnect()
    await prisma3.$disconnect()
    
    return NextResponse.json({
      success: true,
      message: 'Sprawdzono różne instancje Prisma Client',
      instances: {
        prisma1: { count: count1, latest: latest1 },
        prisma2: { count: count2, latest: latest2 },
        prisma3: { count: count3, latest: latest3 }
      },
      connectionInfo,
      allSame: count1 === count2 && count2 === count3,
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.error('Debug Prisma error:', error)
    return NextResponse.json({ 
      error: String(error),
      message: 'Błąd debugowania Prisma Client'
    }, { status: 500 })
  }
} 