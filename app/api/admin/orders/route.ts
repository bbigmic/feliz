import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

export async function GET() {
  try {
    console.log('Admin orders API called')
    
    const prisma = new PrismaClient()
    
    // Sprawdź połączenie
    await prisma.$connect()
    console.log('Connected to database')
    
    // Sprawdź liczbę zamówień przed pobraniem
    const totalCount = await prisma.order.count()
    console.log(`Total orders in database: ${totalCount}`)
    
    // Sprawdź najnowsze zamówienie
    const latestOrder = await prisma.order.findFirst({
      orderBy: { createdAt: 'desc' },
      select: { id: true, email: true, createdAt: true }
    })
    console.log('Latest order:', latestOrder)
    
    // Pobierz wszystkie zamówienia
    const orders = await prisma.order.findMany({ 
      orderBy: { createdAt: 'desc' },
      include: { user: true }
    })
    
    console.log(`Found ${orders.length} orders in query`)
    
    // Sprawdź pierwsze 3 zamówienia
    const firstThree = orders.slice(0, 3).map(o => ({ 
      id: o.id, 
      email: o.email, 
      createdAt: o.createdAt 
    }))
    console.log('First 3 orders:', firstThree)
    
    await prisma.$disconnect()
    
    return NextResponse.json({ 
      orders,
      debug: {
        totalCount,
        foundCount: orders.length,
        latestOrder,
        firstThree,
        timestamp: new Date().toISOString()
      }
    })
  } catch (error) {
    console.error('Error fetching orders:', error)
    return NextResponse.json({ 
      error: 'Błąd pobierania zamówień',
      details: String(error)
    }, { status: 500 })
  }
} 