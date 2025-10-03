import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

const prisma = new PrismaClient()

const JWT_SECRET = process.env.JWT_SECRET || 'tajny_klucz'
const JWT_EXPIRES_IN = '7d'

export async function POST(request: NextRequest) {
  try {
    const { email, password, termsAccepted, marketingAccepted, referrerId } = await request.json()
    if (!email || !password) {
      return NextResponse.json({ error: 'Email i hasło są wymagane.' }, { status: 400 })
    }

    // Sprawdź, czy użytkownik już istnieje
    const userExists = await prisma.user.findUnique({ where: { email } })
    if (userExists) {
      return NextResponse.json({ error: 'Użytkownik o tym adresie email już istnieje.' }, { status: 409 })
    }

    // Jeśli podano referrerId, sprawdź czy sprzedawca istnieje
    let isValidReferrer = false
    if (referrerId) {
      const referrer = await prisma.user.findUnique({ 
        where: { id: parseInt(referrerId) },
        select: { id: true, role: true }
      })
      
      // Weryfikuj, czy referrer jest sprzedawcą
      if (referrer && (referrer.role === 'seller' || referrer.role === 'management' || referrer.role === 'admin')) {
        isValidReferrer = true
      } else {
        console.log('Nieprawidłowy referrer:', referrerId)
      }
    }

    // Hashuj hasło
    const passwordHash = await bcrypt.hash(password, 10)

    // Zapisz użytkownika
    const userData: any = { 
      email, 
      passwordHash, 
      termsAccepted: !!termsAccepted, 
      marketingAccepted: !!marketingAccepted,
      role: isValidReferrer ? 'seller' : 'user' // Użytkownicy zaproszeni przez reflink dostają rolę seller
    }
    
    // Dodaj referrerId tylko jeśli jest poprawny
    if (isValidReferrer && referrerId) {
      userData.referrerId = parseInt(referrerId)
    }
    
    const user = await prisma.user.create({ data: userData })

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