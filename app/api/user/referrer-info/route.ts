import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    
    if (!id) {
      return NextResponse.json({ error: 'Brak ID sprzedawcy' }, { status: 400 })
    }

    const referrer = await prisma.user.findUnique({
      where: { id: parseInt(id) },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true
      }
    })

    if (!referrer) {
      return NextResponse.json({ error: 'Sprzedawca nie znaleziony' }, { status: 404 })
    }

    // Sprawdź, czy to rzeczywiście sprzedawca
    if (referrer.role !== 'seller' && referrer.role !== 'management' && referrer.role !== 'admin') {
      return NextResponse.json({ error: 'Nieprawidłowy sprzedawca' }, { status: 403 })
    }

    return NextResponse.json({
      success: true,
      referrer: {
        email: referrer.email,
        firstName: referrer.firstName,
        lastName: referrer.lastName
      }
    })
  } catch (error) {
    console.error('Błąd pobierania informacji o sprzedawcy:', error)
    return NextResponse.json({ 
      error: 'Błąd serwera',
      details: String(error)
    }, { status: 500 })
  } finally {
    await prisma.$disconnect()
  }
}

