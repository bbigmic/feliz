import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import jwt from 'jsonwebtoken'
import crypto from 'crypto'

const JWT_SECRET = process.env.JWT_SECRET || 'tajny_klucz'
const prisma = new PrismaClient()

const CLOUDINARY_CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME!
const CLOUDINARY_API_KEY = process.env.CLOUDINARY_API_KEY!
const CLOUDINARY_API_SECRET = process.env.CLOUDINARY_API_SECRET!

console.log('Cloudinary config check:', {
  cloud_name: CLOUDINARY_CLOUD_NAME ? 'OK' : 'MISSING',
  api_key: CLOUDINARY_API_KEY ? 'OK' : 'MISSING',
  api_secret: CLOUDINARY_API_SECRET ? 'OK' : 'MISSING'
})

// Middleware do sprawdzania autoryzacji
async function checkAuth(request: NextRequest) {
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
    
    return user
  } catch (error) {
    return null
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await checkAuth(request)
    if (!user) {
      return NextResponse.json({ error: 'Brak autoryzacji' }, { status: 401 })
    }

    const formData = await request.formData()
    const file = formData.get('file') as File
    
    if (!file) {
      return NextResponse.json({ error: 'Brak pliku' }, { status: 400 })
    }

    // Sprawdź typ pliku
    if (!file.type.startsWith('image/')) {
      return NextResponse.json({ error: 'Plik musi być obrazem' }, { status: 400 })
    }

    // Sprawdź rozmiar pliku (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ error: 'Plik jest za duży (max 5MB)' }, { status: 400 })
    }

    // Konwertuj plik na buffer
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Użyj unsigned preset dla uproszczenia
    const folder = 'feliztrade/avatars'
    const publicId = `user_${user.id}_${Date.now()}`
    
    // Przygotuj formData do Cloudinary (unsigned upload)
    const cloudForm = new FormData()
    cloudForm.append('file', new Blob([buffer], { type: file.type }))
    cloudForm.append('upload_preset', process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET!)
    cloudForm.append('folder', folder)
    cloudForm.append('public_id', publicId)

    console.log('Using upload preset:', process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET)

    // Upload do Cloudinary (unsigned)
    const cloudResponse = await fetch(`https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`, {
      method: 'POST',
      body: cloudForm
    })

    const result = await cloudResponse.json()

    if (!cloudResponse.ok) {
      console.error('Cloudinary upload error:', result)
      return NextResponse.json({ 
        error: 'Błąd uploadu do Cloudinary', 
        details: result,
        status: cloudResponse.status 
      }, { status: 500 })
    }

    console.log('Cloudinary upload success:', result.secure_url)

    // Zaktualizuj profil użytkownika
    await prisma.user.update({
      where: { id: user.id },
      data: { profileImageUrl: result.secure_url }
    })

    const response = NextResponse.json({ 
      success: true, 
      imageUrl: result.secure_url 
    })
    
    // Wyłącz cachowanie
    response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate')
    response.headers.set('Pragma', 'no-cache')
    response.headers.set('Expires', '0')
    
    return response
  } catch (error) {
    console.error('Error uploading avatar:', error)
    return NextResponse.json({ 
      error: 'Błąd podczas uploadowania zdjęcia',
      details: String(error)
    }, { status: 500 })
  } finally {
    await prisma.$disconnect()
  }
} 