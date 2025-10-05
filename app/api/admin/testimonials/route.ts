import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { cookies } from 'next/headers'
import jwt from 'jsonwebtoken'

const prisma = new PrismaClient()
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'

// Middleware do sprawdzania czy użytkownik jest adminem
async function checkAdmin(req: NextRequest) {
  const token = req.cookies.get('token')?.value

  if (!token) {
    return null
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { id: number; email: string }
    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      select: { id: true, email: true, role: true, isAdmin: true }
    })

    if (!user || (!user.isAdmin && user.role !== 'admin')) {
      return null
    }

    return user
  } catch (error) {
    console.error('JWT verification error:', error)
    return null
  }
}

// GET - Pobierz wszystkie opinie (admin)
export async function GET(req: NextRequest) {
  const admin = await checkAdmin(req)
  if (!admin) {
    return NextResponse.json({ error: 'Brak autoryzacji' }, { status: 401 })
  }

  try {
    const testimonials = await prisma.testimonial.findMany({
      orderBy: { createdAt: 'desc' },
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

// PATCH - Zatwierdź/odrzuć opinię (admin)
export async function PATCH(req: NextRequest) {
  const admin = await checkAdmin(req)
  if (!admin) {
    return NextResponse.json({ error: 'Brak autoryzacji' }, { status: 401 })
  }

  try {
    const body = await req.json()
    const { id, isApproved } = body

    if (!id || isApproved === undefined) {
      return NextResponse.json(
        { error: 'Brak wymaganych danych' },
        { status: 400 }
      )
    }

    const testimonial = await prisma.testimonial.update({
      where: { id: parseInt(id) },
      data: { isApproved }
    })

    return NextResponse.json({ success: true, testimonial })
  } catch (error) {
    console.error('Błąd aktualizacji opinii:', error)
    return NextResponse.json(
      { error: 'Błąd serwera' },
      { status: 500 }
    )
  }
}

// DELETE - Usuń opinię (admin)
export async function DELETE(req: NextRequest) {
  const admin = await checkAdmin(req)
  if (!admin) {
    return NextResponse.json({ error: 'Brak autoryzacji' }, { status: 401 })
  }

  try {
    const { searchParams } = new URL(req.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json(
        { error: 'Brak ID opinii' },
        { status: 400 }
      )
    }

    await prisma.testimonial.delete({
      where: { id: parseInt(id) }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Błąd usuwania opinii:', error)
    return NextResponse.json(
      { error: 'Błąd serwera' },
      { status: 500 }
    )
  }
}
