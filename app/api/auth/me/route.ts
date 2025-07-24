import { NextRequest, NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'
import { PrismaClient } from '@prisma/client'

const JWT_SECRET = process.env.JWT_SECRET || 'tajny_klucz'

export async function GET(request: NextRequest) {
  const token = request.cookies.get('token')?.value
  if (!token) {
    return NextResponse.json({ user: null }, { status: 200 })
  }
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { id: number; email: string }
    const prisma = new PrismaClient()
    const user = await prisma.user.findUnique({ where: { id: decoded.id } })
    await prisma.$disconnect()
    if (!user) return NextResponse.json({ user: null }, { status: 200 })
    return NextResponse.json({ user: { id: user.id, email: user.email, isAdmin: user.isAdmin } }, { status: 200 })
  } catch {
    return NextResponse.json({ user: null }, { status: 200 })
  }
} 