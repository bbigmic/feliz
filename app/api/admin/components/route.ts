import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { translateToEnglish } from '@/lib/translate'

const prisma = new PrismaClient()

export async function GET() {
  try {
    const components = await prisma.component.findMany()
    return NextResponse.json({ components })
  } catch (error) {
    return NextResponse.json({ error: 'Błąd pobierania komponentów.' }, { status: 500 })
  } finally {
    await prisma.$disconnect()
  }
}

export async function POST(req: NextRequest) {
  try {
    const data = await req.json()
    const { name, priceFrom, priceTo, notes } = data
    
    // Automatyczne tłumaczenie pól na angielski
    const [nameEn, notesEn] = await Promise.all([
      translateToEnglish(name),
      translateToEnglish(notes)
    ])
    
    const component = await prisma.component.create({
      data: { 
        name, 
        priceFrom, 
        priceTo, 
        notes,
        // Dodaj tłumaczenia angielskie
        nameEn,
        notesEn
      }
    })
    return NextResponse.json({ component })
  } catch (error) {
    return NextResponse.json({ error: 'Błąd tworzenia komponentu.' }, { status: 500 })
  } finally {
    await prisma.$disconnect()
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const url = new URL(req.url!)
    const id = Number(url.searchParams.get('id'))
    const data = await req.json()
    const { name, priceFrom, priceTo, notes } = data
    
    // Automatyczne tłumaczenie pól na angielski
    const [nameEn, notesEn] = await Promise.all([
      translateToEnglish(name),
      translateToEnglish(notes)
    ])
    
    const component = await prisma.component.update({
      where: { id },
      data: { 
        name, 
        priceFrom, 
        priceTo, 
        notes,
        // Dodaj tłumaczenia angielskie
        nameEn,
        notesEn
      }
    })
    return NextResponse.json({ component })
  } catch (error) {
    return NextResponse.json({ error: 'Błąd aktualizacji komponentu.' }, { status: 500 })
  } finally {
    await prisma.$disconnect()
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const url = new URL(req.url!)
    const id = Number(url.searchParams.get('id'))
    await prisma.component.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: 'Błąd usuwania komponentu.' }, { status: 500 })
  } finally {
    await prisma.$disconnect()
  }
} 