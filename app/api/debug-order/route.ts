import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const orderId = searchParams.get('id')
    
    if (!orderId) {
      return NextResponse.json({ error: 'Brak ID zamówienia' }, { status: 400 })
    }
    
    const prisma = new PrismaClient()
    
    // Sprawdź konkretne zamówienie
    const order = await prisma.order.findUnique({
      where: { id: parseInt(orderId) },
      include: { user: true }
    })
    
    // Sprawdź wszystkie zamówienia z tym samym ID
    const allOrdersWithId = await prisma.order.findMany({
      where: { id: parseInt(orderId) }
    })
    
    // Sprawdź najnowsze zamówienia
    const latestOrders = await prisma.order.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      select: { id: true, email: true, createdAt: true }
    })
    
    await prisma.$disconnect()
    
    return NextResponse.json({
      success: true,
      requestedOrderId: orderId,
      order,
      allOrdersWithId,
      latestOrders,
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.error('Debug order error:', error)
    return NextResponse.json({ 
      error: String(error),
      message: 'Błąd sprawdzania zamówienia'
    }, { status: 500 })
  }
} 