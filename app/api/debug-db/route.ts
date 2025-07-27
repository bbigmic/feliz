import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

export async function GET() {
  try {
    const prisma = new PrismaClient()
    
    // Sprawdź połączenie z bazą
    await prisma.$connect()
    
    // Sprawdź liczbę rekordów w każdej tabeli
    const userCount = await prisma.user.count()
    const orderCount = await prisma.order.count()
    const softwareCount = await prisma.software.count()
    const componentCount = await prisma.component.count()
    
    // Sprawdź użytkowników admin
    const adminUsers = await prisma.user.findMany({
      where: { isAdmin: true },
      select: { id: true, email: true, isAdmin: true }
    })
    
    await prisma.$disconnect()
    
    return NextResponse.json({
      success: true,
      connection: 'OK',
      counts: {
        users: userCount,
        orders: orderCount,
        software: softwareCount,
        components: componentCount
      },
      adminUsers
    })
  } catch (error) {
    return NextResponse.json({ 
      error: String(error),
      message: 'Błąd połączenia z bazą danych'
    }, { status: 500 })
  }
} 