import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'

const CLOUDINARY_CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME!
const CLOUDINARY_API_KEY = process.env.CLOUDINARY_API_KEY!
const CLOUDINARY_API_SECRET = process.env.CLOUDINARY_API_SECRET!

export async function POST(request: NextRequest) {
  const formData = await request.formData()
  const file = formData.get('file') as File | null
  if (!file) {
    return NextResponse.json({ error: 'Brak pliku.' }, { status: 400 })
  }
  // Odczytaj plik jako buffer
  const arrayBuffer = await file.arrayBuffer()
  const buffer = Buffer.from(arrayBuffer)

  // Przygotuj parametry do podpisu
  const timestamp = Math.floor(Date.now() / 1000)
  const paramsToSign = `timestamp=${timestamp}${CLOUDINARY_API_SECRET}`
  const signature = crypto.createHash('sha1').update(paramsToSign).digest('hex')

  // Przygotuj formData do Cloudinary
  const cloudForm = new FormData()
  cloudForm.append('file', new Blob([buffer]), file.name)
  cloudForm.append('api_key', CLOUDINARY_API_KEY)
  cloudForm.append('timestamp', timestamp.toString())
  cloudForm.append('signature', signature)

  // Upload do Cloudinary
  const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`, {
    method: 'POST',
    body: cloudForm
  })
  const data = await res.json()
  if (data.secure_url) {
    return NextResponse.json({ url: data.secure_url })
  } else {
    return NextResponse.json({ error: 'Błąd uploadu do Cloudinary', details: data }, { status: 500 })
  }
} 