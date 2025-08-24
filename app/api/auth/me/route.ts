import { NextRequest, NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'
import { PrismaClient } from '@prisma/client'

const JWT_SECRET = process.env.JWT_SECRET || 'tajny_klucz'

export async function GET(request: NextRequest) {
  const token = request.cookies.get('token')?.value
  
  console.log('Auth me called, token exists:', !!token)
  
  if (!token) {
    console.log('No token found')
    return NextResponse.json({ user: null }, { status: 200 })
  }
  
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { id: number; email: string }
    console.log('Token decoded for user ID:', decoded.id)
    
    const prisma = new PrismaClient()
    const user = await prisma.user.findUnique({ 
      where: { id: decoded.id },
      select: { id: true, email: true, isAdmin: true, role: true }
    })
    await prisma.$disconnect()
    
    if (!user) {
      console.log('User not found in database')
      return NextResponse.json({ user: null }, { status: 200 })
    }
    
    console.log('User found:', { id: user.id, email: user.email, isAdmin: user.isAdmin, role: user.role })
    return NextResponse.json({ user: { id: user.id, email: user.email, isAdmin: user.isAdmin, role: user.role } }, { status: 200 })
  } catch (error) {
    console.error('Auth error:', error)
    return NextResponse.json({ user: null }, { status: 200 })
  }
} 