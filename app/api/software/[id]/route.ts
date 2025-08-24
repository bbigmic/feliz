import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id)
    
    if (isNaN(id)) {
      return NextResponse.json(
        { success: false, message: 'Invalid software ID' },
        { status: 400 }
      )
    }

    const software = await prisma.software.findUnique({
      where: { id },
      include: {
        images: {
          orderBy: {
            isThumbnail: 'desc' // Miniaturki najpierw
          }
        }
      }
    })

    if (!software) {
      return NextResponse.json(
        { success: false, message: 'Software not found' },
        { status: 404 }
      )
    }

    // Sprawdź czy oprogramowanie jest aktywne (opcjonalnie można usunąć tę kontrolę jeśli chcemy pokazywać wszystkie)
    if (software.status !== 'active') {
      return NextResponse.json(
        { success: false, message: 'Software not available' },
        { status: 404 }
      )
    }

    // Przygotuj dane do zwrócenia
    const softwareData = {
      ...software,
      features: JSON.parse(software.features || '[]'),
      featuresEn: software.featuresEn ? JSON.parse(software.featuresEn) : undefined,
      // Dodaj URL miniaturki dla kompatybilności
      thumbnailUrl: software.images.find(img => img.isThumbnail)?.url || software.images[0]?.url
    }

    return NextResponse.json({
      success: true,
      software: softwareData
    })

  } catch (error) {
    console.error('Error fetching software:', error)
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    )
  }
} 