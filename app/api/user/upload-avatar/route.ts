import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import jwt from 'jsonwebtoken'
import crypto from 'crypto'

const JWT_SECRET = process.env.JWT_SECRET || 'tajny_klucz'
const prisma = new PrismaClient()

const CLOUDINARY_CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME!
const CLOUDINARY_API_KEY = process.env.CLOUDINARY_API_KEY!
const CLOUDINARY_API_SECRET = process.env.CLOUDINARY_API_SECRET!

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

    // Przygotuj parametry do podpisu Cloudinary
    const timestamp = Math.round(new Date().getTime() / 1000)
    const folder = 'feliztrade/avatars'
    const publicId = `user_${user.id}_${Date.now()}`
    
    // Przygotuj parametry do podpisu
    const paramsToSign = `folder=${folder}&public_id=${publicId}&timestamp=${timestamp}${CLOUDINARY_API_SECRET}`
    const signature = crypto.createHash('sha1').update(paramsToSign).digest('hex')
    
    // Przygotuj formData do Cloudinary
    const cloudForm = new FormData()
    cloudForm.append('file', new Blob([buffer], { type: file.type }))
    cloudForm.append('api_key', CLOUDINARY_API_KEY)
    cloudForm.append('timestamp', timestamp.toString())
    cloudForm.append('signature', signature)
    cloudForm.append('folder', folder)
    cloudForm.append('public_id', publicId)
    cloudForm.append('transformation', 'w_400,h_400,c_fill,g_face,q_auto,f_auto')

    // Upload do Cloudinary
    const cloudResponse = await fetch(`https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`, {
      method: 'POST',
      body: cloudForm
    })

    const result = await cloudResponse.json()

    if (!cloudResponse.ok) {
      return NextResponse.json({ error: 'Błąd uploadu do Cloudinary', details: result }, { status: 500 })
    }

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