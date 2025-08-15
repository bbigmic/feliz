import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { writeFile, mkdir } from 'fs/promises'
import { join } from 'path'
import { existsSync } from 'fs'

const prisma = new PrismaClient()

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const orderId = formData.get('orderId') as string
    const files = formData.getAll('files') as File[]

    if (!orderId || !files || files.length === 0) {
      return NextResponse.json({ error: 'Brak wymaganych danych' }, { status: 400 })
    }

    // Sprawdź czy zamówienie istnieje
    const order = await prisma.order.findUnique({
      where: { id: parseInt(orderId) }
    })

    if (!order) {
      return NextResponse.json({ error: 'Zamówienie nie istnieje' }, { status: 404 })
    }

    const uploadedFiles = []

    for (const file of files) {
      // Sprawdź rozmiar pliku (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        return NextResponse.json({ error: `Plik ${file.name} jest za duży. Maksymalny rozmiar to 10MB.` }, { status: 400 })
      }

      // Sprawdź typ pliku (dozwolone: pdf, doc, docx, txt, jpg, jpeg, png, gif)
      const allowedTypes = [
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'text/plain',
        'image/jpeg',
        'image/jpg',
        'image/png',
        'image/gif'
      ]

      if (!allowedTypes.includes(file.type)) {
        return NextResponse.json({ error: `Typ pliku ${file.name} nie jest dozwolony.` }, { status: 400 })
      }

      // Generuj unikalną nazwę pliku
      const timestamp = Date.now()
      const randomString = Math.random().toString(36).substring(2, 15)
      const fileExtension = file.name.split('.').pop()
      const filename = `${timestamp}_${randomString}.${fileExtension}`

      // Utwórz katalog jeśli nie istnieje
      const uploadDir = join(process.cwd(), 'public', 'uploads', 'orders')
      if (!existsSync(uploadDir)) {
        await mkdir(uploadDir, { recursive: true })
      }

      // Zapisz plik
      const filePath = join(uploadDir, filename)
      const bytes = await file.arrayBuffer()
      const buffer = Buffer.from(bytes)
      await writeFile(filePath, buffer)

      // Zapisz informacje o pliku w bazie danych
      const orderFile = await prisma.orderFile.create({
        data: {
          filename,
          originalName: file.name,
          mimeType: file.type,
          size: file.size,
          orderId: parseInt(orderId)
        }
      })

      uploadedFiles.push({
        id: orderFile.id,
        filename: orderFile.filename,
        originalName: orderFile.originalName,
        size: orderFile.size,
        mimeType: orderFile.mimeType
      })
    }

    return NextResponse.json({ 
      success: true, 
      files: uploadedFiles,
      message: `Pomyślnie załączono ${uploadedFiles.length} plików`
    })

  } catch (error) {
    console.error('Błąd uploadu plików:', error)
    return NextResponse.json({ error: 'Błąd serwera podczas uploadu plików' }, { status: 500 })
  } finally {
    await prisma.$disconnect()
  }
} 