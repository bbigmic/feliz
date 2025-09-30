import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

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
        return NextResponse.json({ error: `Plik ${file.name} jest za duży. Maksymalny rozmiar to 10MB.` }, { status: 400 });
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
      ];

      if (!allowedTypes.includes(file.type)) {
        return NextResponse.json({ error: `Typ pliku ${file.name} nie jest dozwolony.` }, { status: 400 });
      }

      const buffer = Buffer.from(await file.arrayBuffer());

      const result = await new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          { resource_type: 'auto' },
          (error, result) => {
            if (error) {
              reject(new Error('Błąd podczas przesyłania do Cloudinary'));
            } else {
              resolve(result);
            }
          }
        );
        uploadStream.end(buffer);
      });

      const orderFile = await prisma.orderFile.create({
        data: {
          filename: result.public_id,
          originalName: file.name,
          mimeType: file.type,
          size: file.size,
          orderId: parseInt(orderId),
          url: result.secure_url
        }
      });

      uploadedFiles.push({
        id: orderFile.id,
        filename: orderFile.filename,
        originalName: orderFile.originalName,
        size: orderFile.size,
        mimeType: orderFile.mimeType,
        url: orderFile.url
      });
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