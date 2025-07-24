import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

const prisma = new PrismaClient()

const JWT_SECRET = process.env.JWT_SECRET || 'tajny_klucz'
const JWT_EXPIRES_IN = '7d'

export async function POST(request: NextRequest) {
  try {
    const { email, password, termsAccepted, marketingAccepted } = await request.json()
    if (!email || !password) {
      return NextResponse.json({ error: 'Email i hasło są wymagane.' }, { status: 400 })
    }

    // Sprawdź, czy użytkownik już istnieje
    const userExists = await prisma.user.findUnique({ where: { email } })
    if (userExists) {
      return NextResponse.json({ error: 'Użytkownik o tym adresie email już istnieje.' }, { status: 409 })
    }

    // Hashuj hasło
    const passwordHash = await bcrypt.hash(password, 10)

    // Zapisz użytkownika
    const user = await prisma.user.create({ data: { email, passwordHash, termsAccepted: !!termsAccepted, marketingAccepted: !!marketingAccepted } })

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