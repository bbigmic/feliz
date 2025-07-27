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
        relname as tablename,
        n_tup_ins::text as inserts,
        n_tup_upd::text as updates,
        n_tup_del::text as deletes
      FROM pg_stat_user_tables 
      WHERE relname = 'Order'
    `
    
    // Sprawdź ostatnie operacje na tabeli
    const recentActivity = await prisma.$queryRaw`
      SELECT 
        schemaname,
        relname as tablename,
        last_vacuum,
        last_autovacuum,
        last_analyze,
        last_autoanalyze
      FROM pg_stat_user_tables 
      WHERE relname = 'Order'
    `
    
    // Sprawdź wszystkie tabele
    const allTables = await prisma.$queryRaw`
      SELECT 
        schemaname,
        relname as tablename,
        n_tup_ins::text as inserts,
        n_tup_upd::text as updates,
        n_tup_del::text as deletes
      FROM pg_stat_user_tables 
      ORDER BY relname
    `
    
    await prisma.$disconnect()
    
    return NextResponse.json({
      success: true,
      connectionInfo,
      tableInfo,
      recentActivity,
      allTables,
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