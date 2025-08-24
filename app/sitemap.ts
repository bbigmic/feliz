import { MetadataRoute } from 'next'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://feliztrade.com'

  // Pobierz wszystkie aktywne oprogramowania
  const softwares = await prisma.software.findMany({
    where: { status: 'active' },
    select: { id: true, createdAt: true }
  })

  // Statyczne strony
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/regulamin`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
  ]

  // Dynamiczne strony oprogramowania
  const softwareRoutes: MetadataRoute.Sitemap = softwares.map((software) => ({
    url: `${baseUrl}/software/${software.id}`,
    lastModified: software.createdAt,
    changeFrequency: 'weekly' as const,
    priority: 0.9,
  }))

  return [...staticRoutes, ...softwareRoutes]
} 