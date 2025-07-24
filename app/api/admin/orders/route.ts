import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()
 
export async function GET() {
  const orders = await prisma.order.findMany({ 
    orderBy: { createdAt: 'desc' },
    include: { user: true }
  })
  return NextResponse.json({ orders })
} 