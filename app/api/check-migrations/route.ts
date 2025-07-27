import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

export async function GET() {
  try {
    const prisma = new PrismaClient()
    
    // Sprawdź czy kolumna demoConsentAccepted istnieje
    const result = await prisma.$queryRaw`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'Order' 
      AND column_name = 'demoConsentAccepted'
    `
    
    // Sprawdź wszystkie kolumny tabeli Order
    const allColumns = await prisma.$queryRaw`
      SELECT column_name, data_type, is_nullable
      FROM information_schema.columns 
      WHERE table_name = 'Order'
      ORDER BY ordinal_position
    `
    
    await prisma.$disconnect()
    
    return NextResponse.json({ 
      success: true, 
      hasDemoConsentColumn: result.length > 0,
      allColumns: allColumns,
      demoConsentResult: result
    })
  } catch (err) {
    return NextResponse.json({ 
      error: String(err),
      message: 'Błąd sprawdzania migracji'
    }, { status: 500 })
  }
} 