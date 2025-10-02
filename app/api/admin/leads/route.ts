import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'tajny_klucz'
const prisma = new PrismaClient()

// Middleware do sprawdzania autoryzacji admina
async function checkAdminAuth(request: NextRequest) {
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
    
    if (!user || (!user.isAdmin && user.role !== 'admin')) {
      return null
    }
    
    return user
  } catch (error) {
    return null
  }
}

export async function GET(request: NextRequest) {
  try {
    const user = await checkAdminAuth(request)
    if (!user) {
      return NextResponse.json({ error: 'Brak uprawnień' }, { status: 403 })
    }

    // Pobieramy wszystkie leady z informacjami o sprzedawcy i szablonie
    const leads = await prisma.lead.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        seller: {
          select: { 
            id: true, 
            email: true, 
            firstName: true, 
            lastName: true,
            role: true
          }
        },
        softwareTemplate: {
          select: { 
            id: true, 
            name: true, 
            price: true 
          }
        }
      }
    })

    const response = NextResponse.json({ leads })
    
    // Wyłącz cachowanie
    response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate')
    response.headers.set('Pragma', 'no-cache')
    response.headers.set('Expires', '0')
    response.headers.set('Surrogate-Control', 'no-store')
    
    return response
  } catch (error) {
    console.error('Error fetching leads:', error)
    return NextResponse.json({ 
      error: 'Błąd pobierania leadów',
      details: String(error)
    }, { status: 500 })
  } finally {
    await prisma.$disconnect()
  }
}
