import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

export async function GET() {
  try {
    const prisma = new PrismaClient()
    
    // Sprawdź szczegóły połączenia
    const connectionInfo = await prisma.$queryRaw`
      SELECT 
        current_database() as database_name,
        current_user as current_user,
        version() as postgres_version,
        NOW() as current_time
    `
    
    // Sprawdź czy tabela Order istnieje i ma dane
    const tableInfo = await prisma.$queryRaw`
      SELECT 
        schemaname,
        tablename,
        n_tup_ins as inserts,
        n_tup_upd as updates,
        n_tup_del as deletes
      FROM pg_stat_user_tables 
      WHERE tablename = 'Order'
    `
    
    // Sprawdź ostatnie operacje na tabeli
    const recentActivity = await prisma.$queryRaw`
      SELECT 
        schemaname,
        tablename,
        last_vacuum,
        last_autovacuum,
        last_analyze,
        last_autoanalyze
      FROM pg_stat_user_tables 
      WHERE tablename = 'Order'
    `
    
    await prisma.$disconnect()
    
    return NextResponse.json({
      success: true,
      connectionInfo,
      tableInfo,
      recentActivity,
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.error('Debug connection error:', error)
    return NextResponse.json({ 
      error: String(error),
      message: 'Błąd sprawdzania połączenia'
    }, { status: 500 })
  }
} 