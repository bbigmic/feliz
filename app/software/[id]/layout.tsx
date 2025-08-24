import { Metadata } from 'next'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

interface Props {
  params: { id: string }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  try {
    const id = parseInt(params.id)
    
    if (isNaN(id)) {
      return {
        title: 'Oprogramowanie nie znalezione - FelizTrade',
        description: 'Nie znaleziono oprogramowania o podanym identyfikatorze.'
      }
    }

    const software = await prisma.software.findUnique({
      where: { id },
      include: {
        images: {
          where: { isThumbnail: true },
          take: 1
        }
      }
    })

    if (!software) {
      return {
        title: 'Oprogramowanie nie znalezione - FelizTrade',
        description: 'Nie znaleziono oprogramowania o podanym identyfikatorze.'
      }
    }

    const categories = (() => {
      try {
        return JSON.parse(software.categories || '[]')
      } catch {
        return []
      }
    })()

    const thumbnailUrl = software.images[0]?.url

    return {
      title: `${software.name} - FelizTrade`,
      description: software.description.substring(0, 160) + (software.description.length > 160 ? '...' : ''),
      keywords: [software.name, ...categories, 'oprogramowanie', 'software', 'FelizTrade'].join(', '),
      authors: [{ name: 'FelizTrade' }],
      openGraph: {
        title: `${software.name} - FelizTrade`,
        description: software.description,
        images: thumbnailUrl ? [
          {
            url: thumbnailUrl,
            width: 1200,
            height: 630,
            alt: software.name
          }
        ] : [],
        type: 'website',
        siteName: 'FelizTrade'
      },
      twitter: {
        card: 'summary_large_image',
        title: `${software.name} - FelizTrade`,
        description: software.description,
        images: thumbnailUrl ? [thumbnailUrl] : []
      },
      alternates: {
        canonical: `/software/${software.id}`
      }
    }
  } catch (error) {
    console.error('Error generating metadata:', error)
    return {
      title: 'Błąd - FelizTrade',
      description: 'Wystąpił błąd podczas ładowania oprogramowania.'
    }
  }
}

export default function SoftwareLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
} 