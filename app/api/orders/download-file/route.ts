import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { readFile } from 'fs/promises'
import { join } from 'path'
import { existsSync } from 'fs'

const prisma = new PrismaClient()

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const fileId = searchParams.get('id')

    if (!fileId) {
      return NextResponse.json({ error: 'Brak ID pliku' }, { status: 400 })
    }

    // Pobierz informacje o pliku z bazy danych
    const orderFile = await prisma.orderFile.findUnique({
      where: { id: parseInt(fileId) },
      include: { order: true }
    })

    if (!orderFile) {
      return NextResponse.json({ error: 'Plik nie istnieje' }, { status: 404 })
    }

    // Ścieżka do pliku
    const filePath = join(process.cwd(), 'public', 'uploads', 'orders', orderFile.filename)

    // Sprawdź czy plik istnieje
    if (!existsSync(filePath)) {
      return NextResponse.json({ error: 'Plik nie został znaleziony na serwerze' }, { status: 404 })
    }

    // Przeczytaj plik
    const fileBuffer = await readFile(filePath)

    // Zwróć plik jako odpowiedź
    return new NextResponse(fileBuffer, {
      headers: {
        'Content-Type': orderFile.mimeType,
        'Content-Disposition': `attachment; filename="${orderFile.originalName}"`,
        'Content-Length': orderFile.size.toString()
      }
    })

  } catch (error) {
    console.error('Błąd pobierania pliku:', error)
    return NextResponse.json({ error: 'Błąd serwera podczas pobierania pliku' }, { status: 500 })
  } finally {
    await prisma.$disconnect()
  }
} 