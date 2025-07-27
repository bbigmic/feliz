import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()
 
export async function GET() {
  try {
    console.log('Admin orders API called')
    
    const orders = await prisma.order.findMany({ 
      orderBy: { createdAt: 'desc' },
      include: { user: true }
    })
    
    console.log(`Found ${orders.length} orders`)
    
    return NextResponse.json({ orders })
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