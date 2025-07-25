import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'tajny_klucz' // W produkcji ustaw w env!
const JWT_EXPIRES_IN = '7d'
const prisma = new PrismaClient()

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()
    if (!email || !password) {
      return NextResponse.json({ error: 'Email i hasło są wymagane.' }, { status: 400 })
    }

    // Pobierz użytkownika
    const user = await prisma.user.findUnique({ where: { email } })
    if (!user) {
      return NextResponse.json({ error: 'Nieprawidłowy email lub hasło.' }, { status: 401 })
    }

    // Sprawdź hasło
    const valid = await bcrypt.compare(password, user.passwordHash)
    if (!valid) {
      return NextResponse.json({ error: 'Nieprawidłowy email lub hasło.' }, { status: 401 })
    }

    // Wygeneruj JWT
    const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN })

    // Ustaw cookie
    const response = NextResponse.json({ success: true })
    response.cookies.set('token', token, {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24 * 7, // 7 dni
      path: '/',
    })
    return response
  } catch (err) {
    return NextResponse.json({ error: 'Błąd serwera.' }, { status: 500 })
  } finally {
    await prisma.$disconnect()
  }
} 