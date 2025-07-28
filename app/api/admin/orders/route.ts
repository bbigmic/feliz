import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    console.log('Admin orders API called')
    
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
    
    const response = NextResponse.json({ 
      orders,
      debug: {
        totalCount,
        foundCount: orders.length,
        latestOrder,
        firstThree,
        timestamp: new Date().toISOString()
      }
    })
    
    // Wyłącz cachowanie dla tego endpointu
    response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate')
    response.headers.set('Pragma', 'no-cache')
    response.headers.set('Expires', '0')
    response.headers.set('Surrogate-Control', 'no-store')
    
    return response
  } catch (error) {
    console.error('Error fetching orders:', error)
    return NextResponse.json({ 
      error: 'Błąd pobierania zamówień',
      details: String(error)
    }, { status: 500 })
  } finally {
    await prisma.$disconnect()
  }
} 