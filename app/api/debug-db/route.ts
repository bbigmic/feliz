import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

export async function GET() {
  try {
    const prisma = new PrismaClient()
    
    // Sprawdź połączenie z bazą
    await prisma.$connect()
    
    // Sprawdź DATABASE_URL (bez hasła)
    const dbUrl = process.env.DATABASE_URL || 'NOT SET'
    const maskedDbUrl = dbUrl.replace(/\/\/[^:]+:[^@]+@/, '//***:***@')
    
    // Sprawdź liczbę rekordów w każdej tabeli
    const userCount = await prisma.user.count()
    const orderCount = await prisma.order.count()
    const softwareCount = await prisma.software.count()
    const componentCount = await prisma.component.count()
    const softwareImageCount = await prisma.softwareImage.count()
    
    // Sprawdź użytkowników admin
    const adminUsers = await prisma.user.findMany({
      where: { isAdmin: true },
      select: { id: true, email: true, isAdmin: true, createdAt: true }
    })
    
    // Sprawdź ostatnie zamówienia (ostatnie 10)
    const recentOrders = await prisma.order.findMany({
      take: 10,
      orderBy: { createdAt: 'desc' },
      select: { 
        id: true, 
        email: true, 
        orderType: true, 
        status: true, 
        createdAt: true,
        demoConsentAccepted: true
      }
    })
    
    // Sprawdź najnowsze zamówienie
    const latestOrder = await prisma.order.findFirst({
      orderBy: { createdAt: 'desc' },
      select: { 
        id: true, 
        email: true, 
        orderType: true, 
        status: true, 
        createdAt: true
      }
    })
    
    // Sprawdź strukturę tabeli Order
    const orderColumns = await prisma.$queryRaw`
      SELECT column_name, data_type, is_nullable, column_default
      FROM information_schema.columns 
      WHERE table_name = 'Order'
      ORDER BY ordinal_position
    `
    
    // Sprawdź czy migracje zostały zastosowane
    const migrationStatus = await prisma.$queryRaw`
      SELECT * FROM _prisma_migrations ORDER BY finished_at DESC LIMIT 5
    `
    
    // Sprawdź timestamp bazy danych
    const dbTimestamp = await prisma.$queryRaw`SELECT NOW() as current_time`
    
    // Sprawdź szczegóły połączenia
    const connectionInfo = await prisma.$queryRaw`
      SELECT 
        current_database() as database_name,
        current_user as current_user,
        version() as postgres_version
    `
    
    await prisma.$disconnect()
    
    return NextResponse.json({
      success: true,
      connection: 'OK',
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV,
      databaseUrl: maskedDbUrl,
      connectionInfo,
      counts: {
        users: userCount,
        orders: orderCount,
        software: softwareCount,
        components: componentCount,
        softwareImages: softwareImageCount
      },
      adminUsers,
      recentOrders,
      latestOrder,
      orderColumns,
      migrationStatus,
      dbTimestamp,
      env: {
        DATABASE_URL: process.env.DATABASE_URL ? 'SET' : 'NOT SET',
        JWT_SECRET: process.env.JWT_SECRET ? 'SET' : 'NOT SET',
        NODE_ENV: process.env.NODE_ENV
      }
    })
  } catch (error) {
    console.error('Debug DB error:', error)
    return NextResponse.json({ 
      error: String(error),
      message: 'Błąd połączenia z bazą danych',
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV
    }, { status: 500 })
  }
} 