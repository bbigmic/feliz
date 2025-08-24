import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'

const JWT_SECRET = process.env.JWT_SECRET || 'tajny_klucz'
const prisma = new PrismaClient()

// Handle CORS preflight requests
export async function OPTIONS(request: NextRequest) {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PATCH, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Access-Control-Allow-Credentials': 'true',
    },
  })
}

// Middleware do sprawdzania autoryzacji
async function checkAuth(request: NextRequest) {
  const token = request.cookies.get('token')?.value
  
  console.log('Profile API - Token exists:', !!token)
  
  if (!token) {
    console.log('Profile API - No token found')
    return null
  }
  
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { id: number; email: string }
    console.log('Profile API - Token decoded for user ID:', decoded.id)
    
    const user = await prisma.user.findUnique({ 
      where: { id: decoded.id },
      select: { 
        id: true, 
        email: true, 
        role: true, 
        isAdmin: true,
        firstName: true,
        lastName: true,
        bio: true,
        profileImageUrl: true,
        createdAt: true
      }
    })
    
    if (!user) {
      console.log('Profile API - User not found in database')
      return null
    }
    
    console.log('Profile API - User found:', { id: user.id, email: user.email, role: user.role })
    return user
  } catch (error) {
    console.error('Profile API - Auth error:', error)
    return null
  }
}

// GET - Pobieranie danych profilu
export async function GET(request: NextRequest) {
  const token = request.cookies.get('token')?.value
  
  console.log('Profile API GET - Token exists:', !!token)
  
  if (!token) {
    console.log('Profile API GET - No token found')
    return NextResponse.json({ user: null }, { status: 200 })
  }
  
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { id: number; email: string }
    console.log('Profile API GET - Token decoded for user ID:', decoded.id)
    
    const user = await prisma.user.findUnique({ 
      where: { id: decoded.id },
      select: { 
        id: true, 
        email: true, 
        isAdmin: true,
        role: true,
        firstName: true,
        lastName: true,
        bio: true,
        profileImageUrl: true,
        createdAt: true
      }
    })
    await prisma.$disconnect()
    
    if (!user) {
      console.log('Profile API GET - User not found in database')
      return NextResponse.json({ user: null }, { status: 200 })
    }
    
    console.log('Profile API GET - User found:', { id: user.id, email: user.email })
    return NextResponse.json({ user }, { status: 200 })
  } catch (error) {
    console.error('Profile API GET - Auth error:', error)
    return NextResponse.json({ user: null }, { status: 200 })
  }
}

// PATCH - Aktualizacja profilu
export async function PATCH(request: NextRequest) {
  const token = request.cookies.get('token')?.value
  
  console.log('Profile API PATCH - Token exists:', !!token)
  
  if (!token) {
    console.log('Profile API PATCH - No token found')
    return NextResponse.json({ error: 'Brak autoryzacji' }, { status: 401 })
  }
  
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { id: number; email: string }
    console.log('Profile API PATCH - Token decoded for user ID:', decoded.id)
    
    const user = await prisma.user.findUnique({ 
      where: { id: decoded.id },
      select: { id: true, email: true }
    })
    
    if (!user) {
      console.log('Profile API PATCH - User not found in database')
      return NextResponse.json({ error: 'Użytkownik nie istnieje' }, { status: 404 })
    }

    const { firstName, lastName, bio } = await request.json()
    console.log('Profile API PATCH - Updating user:', user.email, { firstName, lastName, bio })

    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: {
        ...(firstName !== undefined && { firstName }),
        ...(lastName !== undefined && { lastName }),
        ...(bio !== undefined && { bio })
      },
      select: { 
        id: true, 
        email: true, 
        isAdmin: true,
        role: true,
        firstName: true,
        lastName: true,
        bio: true,
        profileImageUrl: true,
        createdAt: true
      }
    })
    await prisma.$disconnect()

    console.log('Profile API PATCH - Update successful')
    const response = NextResponse.json({ 
      success: true, 
      user: updatedUser 
    })
    
    // Wyłącz cachowanie
    response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate')
    response.headers.set('Pragma', 'no-cache')
    response.headers.set('Expires', '0')
    
    return response
  } catch (error) {
    console.error('Error updating user profile:', error)
    await prisma.$disconnect()
    return NextResponse.json({ 
      error: 'Błąd aktualizacji profilu',
      details: String(error)
    }, { status: 500 })
  }
}

// POST - Zmiana hasła
export async function POST(request: NextRequest) {
  try {
    const user = await checkAuth(request)
    if (!user) {
      return NextResponse.json({ error: 'Brak autoryzacji' }, { status: 401 })
    }

    const { currentPassword, newPassword } = await request.json()

    if (!currentPassword || !newPassword) {
      return NextResponse.json({ 
        error: 'Aktualne hasło i nowe hasło są wymagane' 
      }, { status: 400 })
    }

    if (newPassword.length < 6) {
      return NextResponse.json({ 
        error: 'Nowe hasło musi mieć co najmniej 6 znaków' 
      }, { status: 400 })
    }

    // Pobierz użytkownika z hasłem
    const userWithPassword = await prisma.user.findUnique({
      where: { id: user.id },
      select: { id: true, passwordHash: true }
    })

    if (!userWithPassword) {
      return NextResponse.json({ error: 'Użytkownik nie istnieje' }, { status: 404 })
    }

    // Sprawdź aktualne hasło
    const isCurrentPasswordValid = await bcrypt.compare(currentPassword, userWithPassword.passwordHash)
    if (!isCurrentPasswordValid) {
      return NextResponse.json({ error: 'Aktualne hasło jest nieprawidłowe' }, { status: 400 })
    }

    // Hashuj nowe hasło
    const newPasswordHash = await bcrypt.hash(newPassword, 10)

    // Zaktualizuj hasło
    await prisma.user.update({
      where: { id: user.id },
      data: { passwordHash: newPasswordHash }
    })

    const response = NextResponse.json({ 
      success: true,
      message: 'Hasło zostało zmienione pomyślnie'
    })
    
    // Wyłącz cachowanie
    response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate')
    response.headers.set('Pragma', 'no-cache')
    response.headers.set('Expires', '0')
    
    return response
  } catch (error) {
    console.error('Error changing password:', error)
    return NextResponse.json({ 
      error: 'Błąd zmiany hasła',
      details: String(error)
    }, { status: 500 })
  } finally {
    await prisma.$disconnect()
  }
} 