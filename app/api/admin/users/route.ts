import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

export async function GET() {
  try {
    console.log('Admin users API called')
    
    const users = await prisma.user.findMany({
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        email: true,
        createdAt: true,
        termsAccepted: true,
        marketingAccepted: true,
        isAdmin: true,
        role: true
      }
    })
    
    console.log(`Found ${users.length} users:`, users.map(u => ({ id: u.id, email: u.email, isAdmin: u.isAdmin, role: u.role })))
    
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

export async function POST(request: NextRequest) {
  try {
    const { email, password, role, termsAccepted, marketingAccepted } = await request.json()
    
    if (!email || !password || !role) {
      return NextResponse.json({ error: 'Email, hasło i rola są wymagane.' }, { status: 400 })
    }

    // Sprawdź dozwolone role
    const allowedRoles = ['user', 'admin', 'seller', 'management']
    if (!allowedRoles.includes(role)) {
      return NextResponse.json({ error: 'Nieprawidłowa rola.' }, { status: 400 })
    }

    // Sprawdź, czy użytkownik już istnieje
    const userExists = await prisma.user.findUnique({ where: { email } })
    if (userExists) {
      return NextResponse.json({ error: 'Użytkownik o tym adresie email już istnieje.' }, { status: 409 })
    }

    // Hashuj hasło
    const passwordHash = await bcrypt.hash(password, 10)

    // Utwórz użytkownika
    const user = await prisma.user.create({
      data: {
        email,
        passwordHash,
        role,
        isAdmin: role === 'admin', // Zachowaj kompatybilność wsteczną
        termsAccepted: !!termsAccepted,
        marketingAccepted: !!marketingAccepted
      },
      select: {
        id: true,
        email: true,
        createdAt: true,
        termsAccepted: true,
        marketingAccepted: true,
        isAdmin: true,
        role: true
      }
    })

    const response = NextResponse.json({ success: true, user })
    
    // Wyłącz cachowanie
    response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate')
    response.headers.set('Pragma', 'no-cache')
    response.headers.set('Expires', '0')
    response.headers.set('Surrogate-Control', 'no-store')
    
    return response
  } catch (error) {
    console.error('Error creating user:', error)
    return NextResponse.json({ 
      error: 'Błąd tworzenia użytkownika',
      details: String(error)
    }, { status: 500 })
  } finally {
    await prisma.$disconnect()
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('id')
    
    if (!userId) {
      return NextResponse.json({ error: 'ID użytkownika jest wymagane.' }, { status: 400 })
    }

    const { role } = await request.json()
    
    if (!role) {
      return NextResponse.json({ error: 'Rola jest wymagana.' }, { status: 400 })
    }

    // Sprawdź dozwolone role
    const allowedRoles = ['user', 'admin', 'seller', 'management']
    if (!allowedRoles.includes(role)) {
      return NextResponse.json({ error: 'Nieprawidłowa rola.' }, { status: 400 })
    }

    // Zaktualizuj użytkownika
    const user = await prisma.user.update({
      where: { id: parseInt(userId) },
      data: {
        role,
        isAdmin: role === 'admin' // Zachowaj kompatybilność wsteczną
      },
      select: {
        id: true,
        email: true,
        createdAt: true,
        termsAccepted: true,
        marketingAccepted: true,
        isAdmin: true,
        role: true
      }
    })

    const response = NextResponse.json({ success: true, user })
    
    // Wyłącz cachowanie
    response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate')
    response.headers.set('Pragma', 'no-cache')
    response.headers.set('Expires', '0')
    response.headers.set('Surrogate-Control', 'no-store')
    
    return response
  } catch (error) {
    console.error('Error updating user:', error)
    return NextResponse.json({ 
      error: 'Błąd aktualizacji użytkownika',
      details: String(error)
    }, { status: 500 })
  } finally {
    await prisma.$disconnect()
  }
} 