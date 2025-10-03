import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import jwt from 'jsonwebtoken'

const prisma = new PrismaClient()
const JWT_SECRET = process.env.JWT_SECRET || 'tajny_klucz'

// Funkcja pomocnicza do weryfikacji tokenu
function verifyToken(request: NextRequest) {
  const token = request.cookies.get('token')?.value
  if (!token) return null
  
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { id: number; email: string }
    return decoded
  } catch (error) {
    return null
  }
}

export async function GET(request: NextRequest) {
  try {
    const user = verifyToken(request)
    
    if (!user) {
      return NextResponse.json({ error: 'Nieautoryzowany' }, { status: 401 })
    }

    // Pobierz użytkownika z bazy danych
    const dbUser = await prisma.user.findUnique({
      where: { id: user.id },
      select: { role: true }
    })

    if (!dbUser || (dbUser.role !== 'seller' && dbUser.role !== 'management' && dbUser.role !== 'admin')) {
      return NextResponse.json({ error: 'Brak uprawnień' }, { status: 403 })
    }

    // Pobierz statystyki poleceń
    const referrals = await prisma.user.findMany({
      where: {
        referrerId: user.id
      },
      select: {
        id: true,
        email: true,
        role: true,
        createdAt: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    const totalReferrals = referrals.length
    const sellerReferrals = referrals.filter(r => 
      r.role === 'seller' || r.role === 'management' || r.role === 'admin'
    ).length

    return NextResponse.json({
      success: true,
      totalReferrals,
      sellerReferrals,
      referrals: referrals.map(r => ({
        id: r.id,
        email: r.email,
        role: r.role,
        createdAt: r.createdAt
      }))
    })
  } catch (error) {
    console.error('Błąd pobierania statystyk poleceń:', error)
    return NextResponse.json({ 
      error: 'Błąd pobierania statystyk',
      details: String(error)
    }, { status: 500 })
  } finally {
    await prisma.$disconnect()
  }
}

