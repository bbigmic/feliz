import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET() {
  try {
    console.log('Debug all endpoints')
    
    // Sprawdź wszystkie tabele jednocześnie
    const [orderCount, softwareCount, componentCount, userCount] = await Promise.all([
      prisma.order.count(),
      prisma.software.count(),
      prisma.component.count(),
      prisma.user.count()
    ])
    
    // Sprawdź najnowsze rekordy
    const [latestOrder, latestSoftware, latestComponent] = await Promise.all([
      prisma.order.findFirst({
        orderBy: { createdAt: 'desc' },
        select: { id: true, email: true, createdAt: true }
      }),
      prisma.software.findFirst({
        orderBy: { createdAt: 'desc' },
        select: { id: true, name: true, createdAt: true }
      }),
      prisma.component.findFirst({
        select: { id: true, name: true }
      })
    ])
    
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
      message: 'Sprawdzono wszystkie endpointy',
      counts: {
        orders: orderCount,
        software: softwareCount,
        components: componentCount,
        users: userCount
      },
      latest: {
        order: latestOrder,
        software: latestSoftware,
        component: latestComponent
      },
      connectionInfo,
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.error('Debug all endpoints error:', error)
    return NextResponse.json({ 
      error: String(error),
      message: 'Błąd debugowania wszystkich endpointów'
    }, { status: 500 })
  } finally {
    await prisma.$disconnect()
  }
} 