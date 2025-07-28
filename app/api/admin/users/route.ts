import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET() {
  try {
    console.log('Admin users API called')
    
    const users = await prisma.user.findMany({
      orderBy: { createdAt: 'desc' }
    })
    
    console.log(`Found ${users.length} users:`, users.map(u => ({ id: u.id, email: u.email, isAdmin: u.isAdmin })))
    
    const response = NextResponse.json({ users })
    
    // Wyłącz cachowanie dla tego endpointu
    response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate')
    response.headers.set('Pragma', 'no-cache')
    response.headers.set('Expires', '0')
    response.headers.set('Surrogate-Control', 'no-store')
    
    return response
  } catch (error) {
    console.error('Error fetching users:', error)
    return NextResponse.json({ 
      error: 'Błąd pobierania użytkowników',
      details: String(error)
    }, { status: 500 })
  } finally {
    await prisma.$disconnect()
  }
} 