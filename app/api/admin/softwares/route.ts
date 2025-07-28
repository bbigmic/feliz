import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, description, price, categories, demoUrl, features, rating, sales, status, images, thumbnailIdx } = body
    if (!name || !description || !categories || !demoUrl) {
      return NextResponse.json({ error: 'Brak wymaganych danych.' }, { status: 400 })
    }
    // 1. Dodaj oprogramowanie
    const software = await prisma.software.create({
      data: {
        name,
        description,
        price: Number(price),
        categories,
        demoUrl,
        features,
        rating: Number(rating),
        sales: Number(sales),
        status,
      }
    })
    // 2. Dodaj zdjęcia
    for (let i = 0; i < images.length; i++) {
      await prisma.softwareImage.create({
        data: {
          url: images[i],
          isThumbnail: i === Number(thumbnailIdx),
          softwareId: software.id
        }
      })
    }
    return NextResponse.json({ success: true })
  } catch (err) {
    return NextResponse.json({ error: 'Błąd serwera.' }, { status: 500 })
  } finally {
    await prisma.$disconnect()
  }
}

export async function GET() {
  try {
    const softwares = await prisma.software.findMany({
      orderBy: { createdAt: 'desc' },
      include: { images: true }
    })
    // Dodaj pole thumbnailUrl do każdego software
    const result = softwares.map(s => ({
      ...s,
      thumbnailUrl: s.images.find(img => img.isThumbnail)?.url || s.images[0]?.url || null
    }))
    
    const response = NextResponse.json({ softwares: result })
    
    // Wyłącz cachowanie dla tego endpointu
    response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate')
    response.headers.set('Pragma', 'no-cache')
    response.headers.set('Expires', '0')
    response.headers.set('Surrogate-Control', 'no-store')
    
    return response
  } catch (err) {
    return NextResponse.json({ error: 'Błąd serwera.' }, { status: 500 })
  } finally {
    await prisma.$disconnect()
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const id = Number(new URL(request.url).searchParams.get('id'))
    const body = await request.json()
    console.log('PATCH body:', body)
    
    // Sprawdź czy to aktualizacja tylko statusu
    if (body.status && Object.keys(body).length === 1) {
      // Aktualizacja tylko statusu
      if (!id || !body.status) {
        return NextResponse.json({ error: 'Brak wymaganych danych.' }, { status: 400 })
      }
      
      await prisma.software.update({
        where: { id },
        data: { status: body.status }
      })
      
      return NextResponse.json({ success: true })
    }
    
    // Pełna aktualizacja (dla formularza edycji)
    const { name, description, price, categories, demoUrl, features, rating, sales, status, images, thumbnailIdx } = body
    if (!id || !name || !description || !categories || !demoUrl || !features || rating === undefined || sales === undefined || !status || images === undefined || thumbnailIdx === undefined) {
      return NextResponse.json({ error: 'Brak wymaganych danych.', details: { id, name, description, price, categories, demoUrl, features, rating, sales, status, images, thumbnailIdx } }, { status: 400 })
    }
    
    // Usuń stare zdjęcia
    await prisma.softwareImage.deleteMany({ where: { softwareId: id } })
    // Zaktualizuj software
    await prisma.software.update({
      where: { id },
      data: {
        name,
        description,
        price: Number(price),
        categories,
        demoUrl,
        features,
        rating: Number(rating),
        sales: Number(sales),
        status,
      }
    })
    // Dodaj nowe zdjęcia
    for (let i = 0; i < images.length; i++) {
      await prisma.softwareImage.create({
        data: {
          url: images[i],
          isThumbnail: i === Number(thumbnailIdx),
          softwareId: id
        }
      })
    }
    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('PATCH error:', err)
    return NextResponse.json({ error: 'Błąd serwera.', details: String(err) }, { status: 500 })
  } finally {
    await prisma.$disconnect()
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const id = Number(new URL(request.url).searchParams.get('id'))
    if (!id) return NextResponse.json({ error: 'Brak ID.' }, { status: 400 })
    // Usuń zdjęcia
    await prisma.softwareImage.deleteMany({ where: { softwareId: id } })
    // Usuń software
    await prisma.software.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch (err) {
    return NextResponse.json({ error: 'Błąd serwera.' }, { status: 500 })
  } finally {
    await prisma.$disconnect()
  }
} 