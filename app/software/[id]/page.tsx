'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { 
  ArrowLeft, 
  Star, 
  Eye, 
  ExternalLink, 
  ShoppingCart, 
  Share2, 
  Download,
  Check,
  X,
  ChevronLeft,
  ChevronRight
} from 'lucide-react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import OrderModal from '@/components/OrderModal'
import { useLanguage } from '@/contexts/LanguageContext'
import { formatPrice } from '@/lib/i18n'
import toast from 'react-hot-toast'
import Link from 'next/link'
import Image from 'next/image'

// Komponenty strukturalnych danych JSON-LD
const StructuredData = ({ software }: { software: Software }) => {
  const { language } = useLanguage()
  
  const displayName = language === 'en' && software.nameEn ? software.nameEn : software.name
  const displayDescription = language === 'en' && software.descriptionEn ? software.descriptionEn : software.description
  
  const structuredData = {
    "@context": "https://schema.org/",
    "@type": "SoftwareApplication",
    "name": displayName,
    "description": displayDescription,
    "applicationCategory": "BusinessApplication",
    "operatingSystem": "Web",
    "price": software.price,
    "priceCurrency": "PLN",
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": software.rating,
      "ratingCount": software.sales || 1
    },
    "offers": {
      "@type": "Offer",
      "price": software.price,
      "priceCurrency": "PLN",
      "availability": "https://schema.org/InStock"
    }
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  )
}

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
  features: string[]
  featuresEn?: string[]
  rating: number
  sales: number
  status: string
  images?: { url: string; isThumbnail: boolean }[]
  thumbnailUrl?: string
  createdAt: string
}

export default function SoftwarePage() {
  const { t, language } = useLanguage()
  const params = useParams()
  const router = useRouter()
  const [software, setSoftware] = useState<Software | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [orderModalOpen, setOrderModalOpen] = useState(false)
  const [user, setUser] = useState<{ email: string, id?: number } | null>(null)
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)
  const [showFullGallery, setShowFullGallery] = useState(false)

  // Pobierz dane użytkownika
  const fetchUser = async () => {
    try {
      const res = await fetch('/api/auth/me')
      const data = await res.json()
      if (data.user && data.user.email) {
        setUser({ email: data.user.email, id: data.user.id })
      }
    } catch {
      setUser(null)
    }
  }

  // Pobierz dane oprogramowania
  const fetchSoftware = async () => {
    try {
      setLoading(true)
      const res = await fetch(`/api/software/${params.id}`)
      const data = await res.json()
      
      if (data.success) {
        setSoftware(data.software)
      } else {
        setError(data.message || 'Nie znaleziono oprogramowania')
      }
    } catch (err) {
      setError('Błąd podczas ładowania oprogramowania')
      console.error('Error fetching software:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchUser()
    fetchSoftware()
  }, [params.id])

  // Funkcja udostępniania
  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: language === 'en' && software?.nameEn ? software.nameEn : software?.name,
          text: language === 'en' && software?.descriptionEn ? software.descriptionEn : software?.description,
          url: window.location.href,
        })
      } catch (err) {
        // Fallback do clipboard
        copyToClipboard()
      }
    } else {
      copyToClipboard()
    }
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(window.location.href)
    toast.success(language === 'en' ? 'Link copied to clipboard!' : 'Link skopiowany do schowka!')
  }

  if (loading) {
    return (
      <div>
        <div className="min-h-screen flex flex-col items-center justify-center bg-darkbg">
          <Header />
          <div className="container mx-auto px-4 py-24">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto mb-4"></div>
              <p className="text-darksubtle">{t('common.loading')}</p>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  if (error || !software) {
    return (
      <div className="min-h-screen bg-darkbg">
        <Header />
        <div className="container mx-auto px-4 py-24">
          <div className="text-center">
            <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-8 max-w-md mx-auto">
              <X className="w-12 h-12 text-red-400 mx-auto mb-4" />
              <h1 className="text-xl font-semibold text-white mb-2">
                {language === 'en' ? 'Software Not Found' : 'Nie znaleziono oprogramowania'}
              </h1>
              <p className="text-darksubtle mb-6">{error}</p>
              <Link 
                href="/"
                className="inline-flex items-center gap-2 btn-primary"
              >
                <ArrowLeft className="w-4 h-4" />
                {language === 'en' ? 'Back to Home' : 'Powrót do strony głównej'}
              </Link>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  const displayName = language === 'en' && software.nameEn ? software.nameEn : software.name
  const displayDescription = language === 'en' && software.descriptionEn ? software.descriptionEn : software.description
  const displayFeatures = language === 'en' && software.featuresEn ? software.featuresEn : software.features
  const displayCategories = (() => {
    try {
      const categories = language === 'en' && software.categoriesEn 
        ? JSON.parse(software.categoriesEn as string || '[]')
        : JSON.parse(software.categories as string || '[]')
      return categories
    } catch {
      return []
    }
  })()

  const allImages = software.images || []
  const mainImage = allImages.find(img => img.isThumbnail) || allImages[0] || { url: software.thumbnailUrl || '/default-software.jpg', isThumbnail: true }

  return (
    <div className="min-h-screen bg-darkbg">
      <StructuredData software={software} />
      <Header />
      
      {/* Breadcrumbs */}
      <div className="bg-darkpanel border-b border-gray-800 pt-16">
        <div className="container mx-auto px-4 py-4">
          <nav className="flex items-center space-x-2 text-sm text-darksubtle">
            <Link href="/" className="hover:text-primary-400 transition-colors">
              {language === 'en' ? 'Home' : 'Strona główna'}
            </Link>
            <span>/</span>
            <Link href="/#main-content" className="hover:text-primary-400 transition-colors">
              {language === 'en' ? 'Software' : 'Oprogramowania'}
            </Link>
            <span>/</span>
            <span className="text-darktext">{displayName}</span>
          </nav>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="mb-6"
        >
          <button
            onClick={() => router.back()}
            className="inline-flex items-center gap-2 text-darksubtle hover:text-primary-400 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            {language === 'en' ? 'Back' : 'Powrót'}
          </button>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Galeria zdjęć */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <div className="space-y-4">
              {/* Główne zdjęcie */}
              <div className="relative aspect-video bg-darkpanel rounded-xl overflow-hidden border border-gray-800">
                <Image
                  src={allImages[selectedImageIndex]?.url || mainImage.url}
                  alt={displayName}
                  fill
                  className="object-cover cursor-pointer hover:scale-105 transition-transform duration-300"
                  onClick={() => setShowFullGallery(true)}
                />
                {allImages.length > 1 && (
                  <>
                    <button
                      onClick={() => setSelectedImageIndex(prev => prev === 0 ? allImages.length - 1 : prev - 1)}
                      className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 rounded-full p-2 transition-colors"
                    >
                      <ChevronLeft className="w-5 h-5 text-white" />
                    </button>
                    <button
                      onClick={() => setSelectedImageIndex(prev => prev === allImages.length - 1 ? 0 : prev + 1)}
                      className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 rounded-full p-2 transition-colors"
                    >
                      <ChevronRight className="w-5 h-5 text-white" />
                    </button>
                  </>
                )}
              </div>

              {/* Miniaturki */}
              {allImages.length > 1 && (
                <div className="flex gap-2 overflow-x-auto pb-2">
                  {allImages.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImageIndex(index)}
                      className={`relative flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                        selectedImageIndex === index
                          ? 'border-primary-500 ring-2 ring-primary-500/20'
                          : 'border-gray-700 hover:border-gray-600'
                      }`}
                    >
                      <Image
                        src={image.url}
                        alt={`${displayName} - ${index + 1}`}
                        fill
                        className="object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>
          </motion.div>

          {/* Szczegóły produktu */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-6"
          >
            {/* Header */}
            <div>
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h1 className="text-3xl font-bold text-darktext mb-2">{displayName}</h1>
                  <div className="flex items-center gap-4 mb-4">
                    <div className="flex items-center gap-1">
                      <Star className="w-5 h-5 text-yellow-400 fill-current" />
                      <span className="text-darktext font-medium">{software.rating}</span>
                    </div>
                    <div className="flex items-center gap-1 text-darksubtle">
                      <ShoppingCart className="w-4 h-4" />
                      <span>{software.sales} {language === 'en' ? 'sales' : 'sprzedaży'}</span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={handleShare}
                  className="p-2 text-darksubtle hover:text-primary-400 transition-colors"
                  title={language === 'en' ? 'Share' : 'Udostępnij'}
                >
                  <Share2 className="w-5 h-5" />
                </button>
              </div>

              {/* Kategorie */}
              {displayCategories.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-4">
                  {displayCategories.map((category: string, index: number) => (
                    <span
                      key={index}
                      className="bg-primary-600/20 text-primary-300 px-3 py-1 rounded-full text-sm font-medium"
                    >
                      {category}
                    </span>
                  ))}
                </div>
              )}

              {/* Cena */}
              <div className="bg-gradient-to-r from-primary-600/10 to-primary-800/10 rounded-xl p-6 border border-primary-600/20 mb-6">
                <div className="text-center">
                  <div className="text-lg text-darksubtle mb-1">
                    {language === 'en' ? 'from' : 'od'}
                  </div>
                  <div className="text-3xl font-bold text-primary-400 mb-2" translate="no">
                    {formatPrice(software.price, language)}
                  </div>
                  <div className="text-sm text-darksubtle">{t('pricing.maintenanceFee')}</div>
                </div>
              </div>
            </div>

            {/* Opis */}
            <div>
              <h2 className="text-xl font-semibold text-darktext mb-3">
                {language === 'en' ? 'Description' : 'Opis'}
              </h2>
              <p className="text-darksubtle leading-relaxed">{displayDescription}</p>
            </div>

            {/* Funkcje */}
            {displayFeatures && displayFeatures.length > 0 && (
              <div>
                <h2 className="text-xl font-semibold text-darktext mb-3">
                  {language === 'en' ? 'Features' : 'Funkcje'}
                </h2>
                <div className="space-y-2">
                  {displayFeatures.map((feature, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                      <span className="text-darksubtle">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Przyciski akcji */}
            <div className="space-y-3 pt-4">
              <button
                onClick={() => setOrderModalOpen(true)}
                className="w-full btn-primary text-lg py-3 rounded-xl flex items-center justify-center"
              >
                <ShoppingCart className="w-5 h-5 mr-2" />
                {language === 'en' ? 'Order' : 'Zamów'}
              </button>
              
              {software.demoUrl && (
                <a
                  href={software.demoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full inline-flex items-center justify-center gap-2 bg-darkpanel hover:bg-gray-700 text-darktext border border-gray-700 py-3 px-6 rounded-xl transition-colors"
                >
                  <Eye className="w-5 h-5" />
                  {language === 'en' ? 'View Demo' : 'Zobacz demo'}
                  <ExternalLink className="w-4 h-4" />
                </a>
              )}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Modal galerii pełnoekranowej */}
      {showFullGallery && (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center">
          <button
            onClick={() => setShowFullGallery(false)}
            className="absolute top-4 right-4 bg-black/50 hover:bg-black/70 rounded-full p-2 transition-colors z-10"
          >
            <X className="w-6 h-6 text-white" />
          </button>
          
          <div className="relative w-full h-full flex items-center justify-center p-4">
            <Image
              src={allImages[selectedImageIndex]?.url || mainImage.url}
              alt={displayName}
              fill
              className="object-contain"
            />
            
            {allImages.length > 1 && (
              <>
                <button
                  onClick={() => setSelectedImageIndex(prev => prev === 0 ? allImages.length - 1 : prev - 1)}
                  className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 rounded-full p-3 transition-colors"
                >
                  <ChevronLeft className="w-6 h-6 text-white" />
                </button>
                <button
                  onClick={() => setSelectedImageIndex(prev => prev === allImages.length - 1 ? 0 : prev + 1)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 rounded-full p-3 transition-colors"
                >
                  <ChevronRight className="w-6 h-6 text-white" />
                </button>
              </>
            )}

            {/* Wskaźniki */}
            {allImages.length > 1 && (
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                {allImages.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImageIndex(index)}
                    className={`w-3 h-3 rounded-full transition-colors ${
                      selectedImageIndex === index ? 'bg-white' : 'bg-white/50'
                    }`}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      <Footer />

      <OrderModal
        key={user?.email ? user.email : 'guest'}
        isOpen={orderModalOpen}
        onClose={() => setOrderModalOpen(false)}
        productId={software.id}
        userEmail={user?.email}
        userId={user?.id}
      />
    </div>
  )
} 