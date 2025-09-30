'use client'

import { useState, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  Globe, 
  ShoppingCart, 
  Star, 
  Eye, 
  Play,
  Search,
  Filter
} from 'lucide-react'
import SoftwareCard from '@/components/SoftwareCard'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import OrderModal from '@/components/OrderModal'
import SoftwareGalleryModal from '@/components/SoftwareGalleryModal'
import Preloader from '@/components/Preloader'
import { useLanguage } from '@/contexts/LanguageContext'
import { formatPrice } from '@/lib/i18n'
import DynamicTitle from '@/components/DynamicTitle'


const VIDEO_FADE_DURATION = 0 // sekundy

export default function Home() {
  const { t, language } = useLanguage()
  const [activeVideo, setActiveVideo] = useState(0)
  const videoRefs = [useRef<HTMLVideoElement>(null), useRef<HTMLVideoElement>(null)]
  const [isFading, setIsFading] = useState(false)
  const [orderModalOpen, setOrderModalOpen] = useState(false)
  const [orderProduct, setOrderProduct] = useState<any>(null)
  const [user, setUser] = useState<{ email: string, id?: number } | null>(null)
  const [galleryOpen, setGalleryOpen] = useState(false)
  const [galleryImages, setGalleryImages] = useState<{ url: string }[]>([])
  const [isVideoLoaded, setIsVideoLoaded] = useState(false)
  const [isPageReady, setIsPageReady] = useState(false)

  // Stan na komponenty funkcjonalne
  type ComponentType = { id: number; name: string; nameEn?: string; priceFrom: number; priceTo: number; notes: string; notesEn?: string };
  const [components, setComponents] = useState<ComponentType[]>([])
  useEffect(() => {
    fetch('/api/admin/components')
      .then(res => res.json())
      .then(data => setComponents(data.components || []))
  }, [])

  // Pobierz dane użytkownika (jeśli zalogowany) z /api/auth/me
  const fetchUser = async () => {
    try {
      const res = await fetch('/api/auth/me')
      const data = await res.json()
      if (data.user && data.user.email) {
        setUser({ email: data.user.email, id: data.user.id })
      } else {
        setUser(null)
      }
    } catch {
      setUser(null)
    }
  }
  useEffect(() => { fetchUser() }, [])

  // Synchronizacja crossfade
  useEffect(() => {
    const video = videoRefs[activeVideo].current
    if (!video) return
    const handleTimeUpdate = () => {
      if (video.duration && video.currentTime > video.duration - VIDEO_FADE_DURATION) {
        setIsFading(true)
      } else {
        setIsFading(false)
      }
    }
    video.addEventListener('timeupdate', handleTimeUpdate)
    return () => video.removeEventListener('timeupdate', handleTimeUpdate)
  }, [activeVideo])

  // Po zakończeniu crossfade przełącz aktywne wideo
  const handleFadeEnd = () => {
    const next = (activeVideo + 1) % 2
    setActiveVideo(next)
    // Restartuj drugie wideo
    const nextVideo = videoRefs[next].current
    if (nextVideo) {
      nextVideo.currentTime = 0
      nextVideo.play()
    }
  }

  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [sortBy, setSortBy] = useState('name')

  // Kategorie wyliczane dynamicznie na podstawie danych z API
  const [softwares, setSoftwares] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetch('/api/admin/softwares')
      .then(res => res.json())
      .then(data => {
        setSoftwares(data.softwares || [])
        setLoading(false)
      })
      .catch(() => {
        setError('Błąd ładowania oprogramowań')
        setLoading(false)
      })
  }, [])

  // Sprawdź czy wideo jest gotowe do odtwarzania
  useEffect(() => {
    const handleVideoCanPlay = () => {
      setIsVideoLoaded(true)
    }

    const video = videoRefs[0].current
    if (video) {
      // Sprawdź czy wideo jest już gotowe
      if (video.readyState >= 3) { // HAVE_FUTURE_DATA
        setIsVideoLoaded(true)
      } else {
        video.addEventListener('canplay', handleVideoCanPlay)
        return () => video.removeEventListener('canplay', handleVideoCanPlay)
      }
    }
  }, [])

  // Sprawdź czy strona jest gotowa do wyświetlenia
  useEffect(() => {
    // Limit 3 sekund dla preloadera
    const maxLoadingTime = 3000 // 3 sekundy
    
    const checkIfReady = () => {
      if (isVideoLoaded && !loading) {
        // Dodaj małe opóźnienie dla płynnego przejścia
        const timer = setTimeout(() => {
          setIsPageReady(true)
        }, 500)
        return () => clearTimeout(timer)
      }
    }
    
    // Sprawdź czy już gotowe
    const readyCheck = checkIfReady()
    if (readyCheck) return readyCheck
    
    // Ustaw limit czasowy - preloader zniknie po 3 sekundach maksymalnie
    const maxTimer = setTimeout(() => {
      setIsPageReady(true)
    }, maxLoadingTime)
    
    return () => {
      clearTimeout(maxTimer)
    }
  }, [isVideoLoaded, loading])

  // Uruchom wideo gdy strona jest gotowa
  useEffect(() => {
    if (isPageReady) {
      const video = videoRefs[0].current
      if (video && video.paused) {
        video.play().catch(err => {
          console.error('Błąd odtwarzania wideo:', err)
        })
      }
    }
  }, [isPageReady])

  // Kategorie wyliczane dynamicznie na podstawie danych z API
  const allCategories = softwares.flatMap(item => {
    try {
      // Użyj angielskich kategorii gdy język jest angielski
      const categories = language === 'en' && item.categoriesEn 
        ? JSON.parse(item.categoriesEn || '[]')
        : JSON.parse(item.categories || '[]')
      return categories
    } catch {
      return []
    }
  })
  const categories = ['all', ...Array.from(new Set(allCategories))]

  const filteredSoftware = softwares
    .filter(item => {
      // Pokazuj tylko aktywne oprogramowania na stronie głównej
      if (item.status !== 'active') return false
      
      const nameMatch = item.name.toLowerCase().includes(searchTerm.toLowerCase())
      const categoryMatch = selectedCategory === 'all' || 
        (() => {
          try {
            // Użyj angielskich kategorii gdy język jest angielski
            const itemCategories = language === 'en' && item.categoriesEn 
              ? JSON.parse(item.categoriesEn || '[]')
              : JSON.parse(item.categories || '[]')
            return itemCategories.includes(selectedCategory)
          } catch {
            return false
          }
        })()
      return nameMatch && categoryMatch
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'price':
          const getPrice = (item: { price: number | string }) => typeof item.price === 'number' ? item.price : parseInt(String(item.price).replace(/[^\d]/g, ''));
          return getPrice(a) - getPrice(b);
        case 'rating':
          return b.rating - a.rating
        case 'sales':
          return b.sales - a.sales
        default:
          return a.name.localeCompare(b.name)
      }
    })

  useEffect(() => {
    if (typeof window !== 'undefined' && window.location.hash) {
      const sectionId = window.location.hash.replace('#', '');
      setTimeout(() => {
        const el = document.getElementById(sectionId);
        const header = document.querySelector('header');
        let offset = 0;
        if (header) offset = header.getBoundingClientRect().height;
        if (el) {
          const top = el.getBoundingClientRect().top + window.scrollY - offset;
          window.scrollTo({ top, behavior: 'smooth' });
        }
      }, 200);
    }
  }, []);

  return (
    <>
      <DynamicTitle titleKey="home" fallbackTitle="FelizTrade - Platforma Sprzedaży Oprogramowań" />
      <Preloader isLoading={!isPageReady} />
      <div className="min-h-screen relative">
        <Header />
      {/* WIDEO W TLE + HERO */}
      <div className="relative w-full h-[100vh] overflow-hidden">
        {/* Crossfade video */}
        {[0, 1].map((idx) => (
          <video
            key={idx}
            ref={videoRefs[idx]}
            autoPlay={isPageReady}
            loop={false}
            muted
            playsInline
            preload="auto"
            poster="/bg-poster.jpg"
            className={`absolute top-0 left-0 w-full h-full object-cover z-0 transition-opacity duration-1000 ${
              activeVideo === idx
                ? isFading
                  ? 'opacity-0' // fade out
                  : 'opacity-100' // widoczne
                : isFading
                ? 'opacity-100' // fade in
                : 'opacity-0' // ukryte
            }`}
            style={{ pointerEvents: 'none' }}
            id={`bg-video-${idx}`}
            onEnded={handleFadeEnd}
          >
            <source src="/bg.mp4" type="video/mp4" />
            <span translate="yes">Twoja przeglądarka nie obsługuje wideo HTML5.</span>
          </video>
        ))}
        {/* Warstwa przyciemniająca */}
        <div className="absolute top-0 left-0 w-full h-full z-10 bg-black bg-opacity-40 pointer-events-none" />
        {/* Hero content */}
        <div className="pb-8 relative z-20 flex flex-col justify-center items-center h-full px-4 pt-24 sm:px-8 sm:pt-0">
          {/* Hero Section */}
          <motion.section 
            initial="hidden"
            animate="visible"
            variants={{}}
            className="text-center mb-12 min-h-[60vh] flex flex-col justify-center items-center w-full max-w-3xl mx-auto"
          >
            <motion.h1
              className="text-4xl md:text-6xl font-bold text-white mb-6 drop-shadow-lg"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.2, delay: 0 }}
            >
              {language === 'en' ? 'Professional ' : 'Profesjonalne '}
              <span className="text-primary-300">{t('hero.titleHighlight')}</span>
            </motion.h1>
            <motion.p
              className="text-xl text-gray-100 mb-8 max-w-3xl mx-auto drop-shadow"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.2, delay: 0.3 }}
            >
              {t('hero.subtitle')}
            </motion.p>
            <motion.div
              className="flex flex-wrap justify-center gap-4"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.2, delay: 0.6 }}
            >
              <div className="flex items-center gap-2 text-gray-200">
                <Globe className="w-5 h-5" />
                <span>{t('hero.softwareCount')}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-200">
                <Star className="w-5 h-5 text-yellow-400" />
                <span>{t('hero.rating')}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-200">
                <ShoppingCart className="w-5 h-5" />
                <span>{t('hero.salesCount')}</span>
              </div>
            </motion.div>
            <motion.div>
              <button
                className="btn-primary text-lg mt-4 px-8 py-4 rounded-full shadow-lg hover:scale-105 transition-transform"
                onClick={() => { setOrderProduct(null); setOrderModalOpen(true) }}
              >
                {t('cta.button')}
              </button>
            </motion.div>
          </motion.section>
        </div>
        {/* Animowana strzałka przewijająca */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-30 flex flex-col items-center cursor-pointer" onClick={() => {
          const mainSection = document.getElementById('main-content');
          const header = document.querySelector('header');
          let offset = 0;
          if (header) offset = header.getBoundingClientRect().height;
          if (mainSection) {
            const top = mainSection.getBoundingClientRect().top + window.scrollY - offset;
            window.scrollTo({ top, behavior: 'smooth' });
          }
        }}>
          <motion.div
            animate={{ y: [0, 16, 0] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
            className="rounded-full bg-darkbg bg-opacity-60 p-2 shadow-lg"
          >
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#FFDD00" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="feather feather-arrow-down">
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <polyline points="19 12 12 19 5 12"></polyline>
            </svg>
          </motion.div>
          <span className="mb-12 mt-4 text-primary-500 text-sm font-medium animate-pulse">{t('hero.scrollDown')}</span>
        </div>
      </div>
      <div className="relative z-20" id="main-content">
        <main className="container mx-auto px-4 py-8">
          {/* Filters */}
          <motion.section 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-8"
          >
            <div className="card">
              <div className="flex flex-col md:flex-row gap-4 items-center">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder={t('filters.searchPlaceholder')}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-700 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-darkpanel text-darktext placeholder-darksubtle"
                  />
                </div>
                
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="px-4 py-2 border border-gray-700 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-darkpanel text-darktext"
                >
                  {categories.map(category => (
                    <option key={category} value={category} className="bg-darkpanel text-darktext">
                      {category === 'all' ? t('filters.allCategories') : category}
                    </option>
                  ))}
                </select>
                
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-4 py-2 border border-gray-700 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-darkpanel text-darktext"
                >
                  <option value="name" className="bg-darkpanel text-darktext">{t('filters.sortByName')}</option>
                  <option value="price" className="bg-darkpanel text-darktext">{t('filters.sortByPrice')}</option>
                  <option value="rating" className="bg-darkpanel text-darktext">{t('filters.sortByRating')}</option>
                  <option value="sales" className="bg-darkpanel text-darktext">{t('filters.sortBySales')}</option>
                </select>
              </div>
            </div>
          </motion.section>

          {/* Software Grid */}
          {loading ? (
            <div className="text-center py-12 text-lg text-darksubtle">{t('common.loading')}</div>
          ) : error ? (
            <div className="text-center py-12 text-lg text-red-400">{t('common.error')}</div>
          ) : (
            <motion.section 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredSoftware.map((software, index) => (
                  <motion.div
                    key={software.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <SoftwareCard
                      software={software}
                      onOrderClick={(sw) => { setOrderProduct(sw); setOrderModalOpen(true) }}
                      onGalleryClick={(images) => { setGalleryImages(images); setGalleryOpen(true) }}
                    />
                  </motion.div>
                ))}
              </div>
              
              {filteredSoftware.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-gray-300 text-lg">{t('common.noResults')}</p>
                </div>
              )}
            </motion.section>
          )}
        </main>
        {/* Sekcja cennika komponentów funkcjonalnych */}
        <section id="pricing" className="container mx-auto px-4 py-16">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-primary-400 to-primary-600 bg-clip-text text-transparent">
              {t('pricing.title')}
            </h2>
            <p className="text-lg text-darksubtle max-w-2xl mx-auto">
              {language === 'en' 
                ? 'Transparent pricing for functional components. Choose what you need and get a custom quote.'
                : 'Przejrzyste ceny komponentów funkcjonalnych. Wybierz to, czego potrzebujesz i otrzymaj indywidualną wycenę.'
              }
            </p>
          </div>
          
          {/* Desktop table */}
          <div className="hidden md:block">
            <div className="bg-darkpanel rounded-2xl shadow-2xl border border-gray-800 overflow-hidden">
              <div className="bg-gradient-to-r from-primary-600/20 to-primary-800/20 px-6 py-4 border-b border-gray-800">
                <h3 className="text-xl font-semibold text-white">
                  {language === 'en' ? 'Component Pricing' : 'Cennik komponentów'}
                </h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-800 bg-darkbg/50">
                      <th className="py-4 px-6 text-left font-semibold text-darksubtle">
                        {t('pricing.component')}
                      </th>
                      <th className="py-4 px-6 text-left font-semibold text-darksubtle">
                        {t('pricing.cost')}
                      </th>
                      <th className="py-4 px-6 text-left font-semibold text-darksubtle">
                        {t('pricing.notes')}
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {components.map((item, index) => (
                      <tr key={item.id} className={`border-b border-gray-900/50 hover:bg-primary-600/10 transition-colors duration-200 ${
                        index % 2 === 0 ? 'bg-darkbg/30' : 'bg-darkbg/10'
                      }`}>
                        <td className="py-4 px-6">
                          <div className="font-semibold text-white">
                            {language === 'en' && item.nameEn ? item.nameEn : item.name}
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          <div className="text-primary-400 text-sm" translate="no">
                            {formatPrice(item.priceFrom, language)} – {formatPrice(item.priceTo, language)}
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          <div className="text-white text-sm leading-relaxed font-medium">
                            {language === 'en' && item.notesEn ? item.notesEn : item.notes}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          
          {/* Mobile cards */}
          <div className="grid grid-cols-1 gap-4 md:hidden">
            {components.map((item) => (
              <div
                key={item.id}
                className="bg-darkpanel rounded-lg shadow-lg border border-gray-800 p-4"
              >
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-white text-base">
                    {language === 'en' && item.nameEn ? item.nameEn : item.name}
                  </h3>
                  <span className="text-primary-400 font-medium text-sm" translate="no">
                    {formatPrice(item.priceFrom, language)} – {formatPrice(item.priceTo, language)}
                  </span>
                </div>
                {item.notes && (
                  <div className="text-gray-300 text-sm leading-relaxed">
                    {language === 'en' && item.notesEn ? item.notesEn : item.notes}
                  </div>
                )}
              </div>
            ))}
          </div>
          

        </section>
        {/* Sekcja CTA Zamów własną aplikację */}
        <section id="cta-section" className="container mx-auto px-4 py-12 mb-12 flex flex-col items-center">
          <div className="bg-gradient-to-r from-primary-600/10 to-primary-800/10 rounded-2xl p-8 border border-primary-600/20 w-full max-w-4xl">
            <h2 className="text-3xl font-bold mb-4 text-center">{t('cta.title')}</h2>
            <p className="text-lg text-darksubtle mb-6 text-center max-w-2xl mx-auto">{t('cta.description')}</p>
            <div className="text-center">
              <button
                className="btn-primary text-lg px-8 py-4 rounded-full shadow-lg hover:scale-105 transition-transform"
                onClick={() => { setOrderProduct(null); setOrderModalOpen(true) }}
              >
                {t('cta.button')}
              </button>
            </div>
          </div>
        </section>
        <Footer />
      </div>
      <OrderModal
        key={user?.email ? user.email : 'guest'}
        isOpen={orderModalOpen}
        onClose={() => setOrderModalOpen(false)}
        productId={orderProduct?.id}
        userEmail={user?.email}
        userId={user?.id}
      />
      <SoftwareGalleryModal
        isOpen={galleryOpen}
        onClose={() => setGalleryOpen(false)}
        images={galleryImages}
      />
    </div>
    </>
  )
} 