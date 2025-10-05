import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { translateToEnglish } from '@/lib/translate'

const prisma = new PrismaClient()

// GET - Pobierz top 3 zatwierdzone opinie
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const softwareId = searchParams.get('softwareId')
    const limit = searchParams.get('limit') || '3'

    const where: any = { isApproved: true }
    if (softwareId) {
      where.softwareId = parseInt(softwareId)
    }

    const testimonials = await prisma.testimonial.findMany({
      where,
      orderBy: [
        { rating: 'desc' },
        { createdAt: 'desc' }
      ],
      take: parseInt(limit),
      include: {
        software: {
          select: {
            id: true,
            name: true,
            nameEn: true
          }
        }
      }
    })

    return NextResponse.json({ testimonials })
  } catch (error) {
    console.error('Błąd pobierania opinii:', error)
    return NextResponse.json(
      { error: 'Błąd serwera' },
      { status: 500 }
    )
  }
}

// POST - Dodaj nową opinię
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { softwareId, name, email, position, rating, comment } = body

    // Walidacja
    if (!softwareId || !name || !rating || !comment) {
      return NextResponse.json(
        { error: 'Brak wymaganych danych' },
        { status: 400 }
      )
    }

    if (rating < 1 || rating > 5) {
      return NextResponse.json(
        { error: 'Ocena musi być od 1 do 5' },
        { status: 400 }
      )
    }

    // Sprawdź czy oprogramowanie istnieje
    const software = await prisma.software.findUnique({
      where: { id: parseInt(softwareId) }
    })

    if (!software) {
      return NextResponse.json(
        { error: 'Nie znaleziono oprogramowania' },
        { status: 404 }
      )
    }

    // Automatyczne tłumaczenie na angielski
    const commentEn = await translateToEnglish(comment)
    const positionEn = position ? await translateToEnglish(position) : null

    // Utwórz opinię (domyślnie niezatwierdzona)
    const testimonial = await prisma.testimonial.create({
      data: {
        softwareId: parseInt(softwareId),
        name,
        email: email || null,
        position: position || null,
        positionEn,
        rating: parseInt(rating),
        comment,
        commentEn,
        isApproved: false // Wymaga moderacji
      }
    })

    return NextResponse.json({ 
      success: true, 
      testimonial,
      message: 'Opinia została przesłana i oczekuje na moderację'
    })
  } catch (error) {
    console.error('Błąd dodawania opinii:', error)
    return NextResponse.json(
      { error: 'Błąd serwera' },
      { status: 500 }
    )
  }
}
