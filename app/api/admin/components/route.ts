import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET() {
  const components = await prisma.component.findMany()
  return NextResponse.json({ components })
}

export async function POST(req: NextRequest) {
  const data = await req.json()
  const { name, priceFrom, priceTo, notes } = data
  const component = await prisma.component.create({
    data: { name, priceFrom, priceTo, notes }
  })
  return NextResponse.json({ component })
}

export async function PATCH(req: NextRequest) {
  const url = new URL(req.url!)
  const id = Number(url.searchParams.get('id'))
  const data = await req.json()
  const { name, priceFrom, priceTo, notes } = data
  const component = await prisma.component.update({
    where: { id },
    data: { name, priceFrom, priceTo, notes }
  })
  return NextResponse.json({ component })
}

export async function DELETE(req: NextRequest) {
  const url = new URL(req.url!)
  const id = Number(url.searchParams.get('id'))
  await prisma.component.delete({ where: { id } })
  return NextResponse.json({ success: true })
} 