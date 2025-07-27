import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

export async function GET() {
  try {
    const prisma = new PrismaClient()
    
    // Wymuś odświeżenie połączenia
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
    
    await newPrisma.$disconnect()
    
    return NextResponse.json({
      success: true,
      message: 'Połączenie z bazą odświeżone',
      orderCount,
      latestOrder,
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