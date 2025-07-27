import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET() {
  try {
    console.log('Debug Prisma Client instances')
    
    // Sprawdź liczbę zamówień
    const count = await prisma.order.count()
    
    // Sprawdź najnowsze zamówienie
    const latest = await prisma.order.findFirst({
      orderBy: { createdAt: 'desc' },
      select: { id: true, email: true, createdAt: true }
    })
    
    // Sprawdź szczegóły połączenia
    const connectionInfo = await prisma.$queryRaw`
      SELECT 
        current_database() as database_name,
        current_user as current_user,
        NOW() as current_time,
        pg_backend_pid() as process_id
    `
    
    return NextResponse.json({
      success: true,
      message: 'Sprawdzono Prisma Client (singleton pattern)',
      data: {
        count,
        latest
      },
      connectionInfo,
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.error('Debug Prisma error:', error)
    return NextResponse.json({ 
      error: String(error),
      message: 'Błąd debugowania Prisma Client'
    }, { status: 500 })
  } finally {
    await prisma.$disconnect()
  }
} 