'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Star, Eye, Play, ShoppingCart, ExternalLink } from 'lucide-react'
import toast from 'react-hot-toast'
import OrderModal from './OrderModal'
import SoftwareGalleryModal from './SoftwareGalleryModal'
import { useLanguage } from '@/contexts/LanguageContext'
import { formatPrice } from '@/lib/i18n'

interface Software {
  id: number
  name: string
  nameEn?: string
  description: string
  descriptionEn?: string
  price: number
  categories?: string[] | string
  categoriesEn?: string[] | string
  demoUrl: string
  image: string
  features: string[]
  featuresEn?: string[]
  rating: number
  sales: number
  images?: { url: string; isThumbnail: boolean }[]
  thumbnailUrl?: string
}

interface SoftwareCardProps {
  software: Software
  onOrderClick?: (software: Software) => void
  onGalleryClick?: (images: { url: string }[]) => void
}

export default function SoftwareCard({ software, onOrderClick, onGalleryClick }: SoftwareCardProps) {
  const { t, language } = useLanguage()
  const [isHovered, setIsHovered] = useState(false)
  const [isGalleryOpen, setIsGalleryOpen] = useState(false)

  const handleDemoClick = () => {
    window.open(software.demoUrl, '_blank')
    toast.success('Otwieranie demo...')
  }

  const handleBuyClick = (e: React.MouseEvent) => {
    e.stopPropagation() // Zatrzymaj propagację, żeby nie otworzyć galerii
    if (onOrderClick) {
      onOrderClick(software)
    } else {
      toast.success(`${software.name} dodane do koszyka!`)
    }
  }

  // Nowa ścieżka do obrazka
  let imageSrc = ''
  if (software.images && Array.isArray(software.images) && software.images.length > 0) {
    const thumb = software.images.find((img: any) => img.isThumbnail)
    imageSrc = thumb ? thumb.url : software.images[0].url
  } else if (software.thumbnailUrl) {
    imageSrc = software.thumbnailUrl
  } else if (software.image) {
    imageSrc = `/screeny/${software.image}`
  }

  const openGallery = () => {
    if (onGalleryClick && software.images && software.images.length > 0) {
      onGalleryClick(software.images)
    }
  }

  return (
    <motion.div
      className="card hover:shadow-xl transition-all duration-300 cursor-pointer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      whileHover={{ y: -5 }}
      // Usunięto onClick={openGallery} - galeria nie otwiera się po kliknięciu w całą kartę
    >
      {/* Image */}
      <div className="relative mb-4" onClick={openGallery}>
        <img
          src={imageSrc}
          alt={software.name}
          className="w-full h-48 object-cover rounded-lg cursor-pointer"
        />
        <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-20 transition-all duration-300 rounded-lg flex items-center justify-center">
          {isHovered && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex space-x-2"
            >
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  openGallery()
                }}
                className="bg-white text-gray-900 p-2 rounded-full hover:bg-gray-100 transition-colors"
                title="Zobacz galerię"
              >
                <Play className="w-5 h-5" />
              </button>
              <button
                onClick={handleBuyClick}
                className="bg-primary-600 text-white p-2 rounded-full hover:bg-primary-700 transition-colors"
                title="Dodaj do koszyka"
              >
                <ShoppingCart className="w-5 h-5" />
              </button>
            </motion.div>
          )}
        </div>
        <div className="absolute top-2 right-2 flex flex-wrap gap-1">
          {(language === 'en' && software.categoriesEn 
            ? (Array.isArray(software.categoriesEn) ? software.categoriesEn : JSON.parse(software.categoriesEn || '[]'))
            : (Array.isArray(software.categories) ? software.categories : JSON.parse(software.categories || '[]')))
            .map((cat: string, idx: number) => (
            <span key={cat} className="bg-primary-600 text-white px-2 py-1 rounded-full text-xs font-medium mr-1" translate="yes">
              {cat}
            </span>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="space-y-3">
        <div className="flex items-start justify-between">
          <h3 className="text-lg font-semibold text-darktext">{language === 'en' && software.nameEn ? software.nameEn : software.name}</h3>
          <div className="flex items-center space-x-1">
            <Star className="w-4 h-4 text-yellow-400 fill-current" />
            <span className="text-sm text-gray-200">{software.rating}</span>
          </div>
        </div>

        <p className="text-gray-100 text-sm">{language === 'en' && software.descriptionEn ? software.descriptionEn : software.description}</p>

        {/* Features */}
        <div className="flex flex-wrap gap-1">
          {(language === 'en' && software.featuresEn 
            ? (Array.isArray(software.featuresEn) ? software.featuresEn : JSON.parse(software.featuresEn || '[]'))
            : (Array.isArray(software.features) ? software.features : JSON.parse(software.features || '[]')))
            .map((feature: string, index: number) => (
              <span
                key={index}
                className="bg-gray-700 text-gray-100 px-2 py-1 rounded-full text-xs"
              >
                {feature}
              </span>
            ))}
        </div>

        {/* Stats */}
        <div className="flex items-center justify-between text-sm text-gray-400">
          {/* <span>{software.sales} sprzedaży</span> */}
          <span translate="no">{t('softwareCard.id')}: {software.id}</span>
        </div>

        {/* Price and Actions */}
        <div className="flex items-center justify-between pt-3 border-t border-gray-700">
          <div>
            <span className="text-base text-darksubtle block leading-tight">{t('softwareCard.from')}</span>
            <span className="text-xl font-bold text-white block leading-tight" translate="no">
              {formatPrice(software.price, language)}
            </span>
          </div>
          <div className="flex space-x-2">
            <button
              onClick={handleDemoClick}
              className="btn-secondary flex items-center space-x-1"
            >
              <Eye className="w-4 h-4" />
              <span>{t('softwareCard.view')}</span>
            </button>
            <button
              onClick={handleBuyClick}
              className="btn-primary flex items-center space-x-1"
            >
              <ShoppingCart className="w-4 h-4" />
              <span>{t('softwareCard.order')}</span>
            </button>
          </div>
        </div>
      </div>
      <SoftwareGalleryModal
        isOpen={isGalleryOpen}
        onClose={() => setIsGalleryOpen(false)}
        images={software.images || []}
      />
    </motion.div>
  )
} 