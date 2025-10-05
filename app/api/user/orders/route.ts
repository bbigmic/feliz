import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'tajny_klucz'
const prisma = new PrismaClient()

// Middleware do sprawdzania autoryzacji użytkownika
async function checkAuth(request: NextRequest) {
  const token = request.cookies.get('token')?.value
  
  if (!token) {
    return null
  }
  
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { id: number; email: string }
    const user = await prisma.user.findUnique({ 
      where: { id: decoded.id },
      select: { id: true, email: true, role: true, isAdmin: true }
    })
    
    return user
  } catch (error) {
    return null
  }
}

// GET - Pobieranie zamówień użytkownika
export async function GET(request: NextRequest) {
  try {
    const user = await checkAuth(request)
    
    if (!user) {
      return NextResponse.json({ error: 'Brak autoryzacji' }, { status: 401 })
    }

    // Pobierz zamówienia użytkownika
    // Szukamy po userId lub po emailu (dla zamówień złożonych przed logowaniem)
    const orders = await prisma.order.findMany({
      where: {
        OR: [
          { userId: user.id },
          { email: user.email }
        ]
      },
      include: {
        files: {
          select: {
            id: true,
            filename: true,
            originalName: true,
            mimeType: true,
            size: true,
            url: true,
            createdAt: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    await prisma.$disconnect()

    return NextResponse.json({ 
      success: true,
      orders 
    }, { status: 200 })
    
  } catch (error) {
    console.error('Error fetching user orders:', error)
    await prisma.$disconnect()
    return NextResponse.json({ 
      error: 'Błąd pobierania zamówień',
      details: String(error)
    }, { status: 500 })
  }
}


