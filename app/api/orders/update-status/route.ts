import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function POST(request: NextRequest) {
  try {
    const { orderId, status } = await request.json()
    
    if (!orderId) {
      return NextResponse.json({ error: 'Brak orderId' }, { status: 400 })
    }
    
    if (!status) {
      return NextResponse.json({ error: 'Brak statusu' }, { status: 400 })
    }
    
    // Sprawdź czy zamówienie istnieje
    const existingOrder = await prisma.order.findUnique({
      where: { id: parseInt(orderId) }
    })
    
    if (!existingOrder) {
      return NextResponse.json({ error: 'Zamówienie nie istnieje' }, { status: 404 })
    }
    
    // Sprawdź czy status jest dozwolony
    const allowedStatuses = ['pending', 'paid', 'expired']
    if (!allowedStatuses.includes(status)) {
      return NextResponse.json({ error: 'Nieprawidłowy status' }, { status: 400 })
    }
    
    // Aktualizuj status zamówienia
    const updatedOrder = await prisma.order.update({
      where: { id: parseInt(orderId) },
      data: { status },
      select: {
        id: true,
        email: true,
        status: true,
        orderType: true,
        createdAt: true
      }
    })
    
    console.log(`✅ Status zamówienia ${orderId} zaktualizowany na: ${status}`)
    
    return NextResponse.json({
      success: true,
      message: `Status zamówienia zaktualizowany na: ${status}`,
      order: updatedOrder
    })
  } catch (error) {
    console.error('Błąd aktualizacji statusu zamówienia:', error)
    return NextResponse.json({ 
      error: String(error),
      message: 'Błąd aktualizacji statusu zamówienia'
    }, { status: 500 })
  } finally {
    await prisma.$disconnect()
  }
} 