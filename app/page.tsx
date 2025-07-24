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

// Przykładowe dane oprogramowań
// const softwareData = [
//     {
//         id: 1,
//         name: 'Platforma E-commerce',
//         description: 'Kompletna platforma e-commerce z systemem płatności i panelem zarządzania użytkownikami i analizą',
//         price: 8999,
//         category: 'E-commerce',
//         demoUrl: 'https://youngcoco.pl/',
//         image: 'ecom.png',
//         features: ['Responsywny design', 'System płatności', 'Panel admin', 'SEO friendly'],
//         rating: 4.8,
//         sales: 45
//       },
//     //   {
//     //     id: 2,
//     //     name: 'CRM System',
//     //     description: 'System zarządzania relacjami z klientami z zaawansowanymi funkcjami',
//     //     price: 1999,
//     //     category: 'Business',
//     //     demoUrl: 'https://example-crm.com',
//     //     image: 'crm.png',
//     //     features: ['Zarządzanie klientami', 'Analytics', 'Integracje', 'Mobile app'],
//     //     rating: 4.9,
//     //     sales: 32
//     //   },
//     //   {
//     //     id: 3,
//     //     name: 'Blog Platform',
//     //     description: 'Nowoczesna platforma blogowa z systemem CMS i SEO',
//     //     price: 899,
//     //     category: 'Content',
//     //     demoUrl: 'https://example-blog.com',
//     //     image: 'blog.png',
//     //     features: ['CMS', 'SEO tools', 'Social sharing', 'Analytics'],
//     //     rating: 4.7,
//     //     sales: 67
//     //   },
//       {
//         id: 2,
//         name: 'Zarządzanie restauracją',
//         description: 'System zarządzania restauracją z zamówieniami online',
//         price: 8999,
//         category: 'Jedzenie',
//         demoUrl: 'https://piecyk.vercel.app',
//         image: 'restaurant.png',
//         features: ['Zamawianie online', 'Zarządzanie menu', 'Śledzenie postepu zamówienia', 'Zamawianie online'],
//         rating: 4.6,
//         sales: 28
//       },
//       {
//         id: 3,
//         name: 'Portal Nieruchomości',
//         description: 'Profesjonalna strona internetowa dla biura nieruchomości',
//         price: 2499,
//         category: 'Nieruchomości',
//         demoUrl: 'https://grupaborys.com',
//         image: 'realestate.png',
//         features: ['Lista nieruchomości', 'Formularz kontaktowy', 'O firmie'],
//         rating: 4.8,
//         sales: 19
//       },
//       {
//         id: 4,
//         name: 'Platforma Learningowa',
//         description: 'Platforma e-learningowa z kursami online i zarządzaniem ofertą edukacyjną',
//         price: 11999,
//         category: 'Edukacja',
//         demoUrl: 'https://trawersadr.pl/',
//         image: 'education.png',
//         features: ['Kursy i szkolenia', 'Testy dla studentów', 'Transfer dokumentów', 'Certyfikaty'],
//         rating: 4.9,
//         sales: 41
//       },
//       {
//         id: 5,
//         name: 'Landing page usług Twojej firmy',
//         description: 'Strona lądowania z ofertą usług',
//         price: 7999,
//         category: 'Usługi', 
//         demoUrl: 'https://www.grupaautospectrum.com/',
//         image: 'services.png',
//         features: ['Responsywny design', 'Oferta z cennikiem', 'Kontakt', 'Integracja social media'],
//         rating: 4.9,
//         sales: 41
//       },
//       {
//         id: 6,
//         name: 'Aplikacja SaaS (Software as a Service)',
//         description: 'Apliakcja do generowanie QR kodów do wystawiania opinii w Google Twojej firmie',
//         price: 9999,
//         category: 'SaaS', 
//         demoUrl: 'https://www.qropinie.pl/',
//         image: 'SaaS.png',
//         features: ['Generowanie QR kodu', 'API Google', 'Panel analityczny', 'Program afiliacyjny'],
//         rating: 4.9,
//         sales: 41
//       }
// ]

const VIDEO_FADE_DURATION = 0 // sekundy

export default function Home() {
  const [activeVideo, setActiveVideo] = useState(0)
  const videoRefs = [useRef<HTMLVideoElement>(null), useRef<HTMLVideoElement>(null)]
  const [isFading, setIsFading] = useState(false)
  const [orderModalOpen, setOrderModalOpen] = useState(false)
  const [orderProduct, setOrderProduct] = useState<any>(null)
  const [user, setUser] = useState<{ email: string, id?: number } | null>(null)
  const [galleryOpen, setGalleryOpen] = useState(false)
  const [galleryImages, setGalleryImages] = useState<{ url: string }[]>([])

  // Stan na komponenty funkcjonalne
  type ComponentType = { id: number; name: string; priceFrom: number; priceTo: number; notes: string };
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

  // Kategorie wyliczane dynamicznie na podstawie danych z API
  const allCategories = softwares.flatMap(item => {
    try {
      return JSON.parse(item.categories || '[]')
    } catch {
      return []
    }
  })
  const categories = ['all', ...Array.from(new Set(allCategories))]

  const filteredSoftware = softwares
    .filter(item => {
      const nameMatch = item.name.toLowerCase().includes(searchTerm.toLowerCase())
      const categoryMatch = selectedCategory === 'all' || 
        (() => {
          try {
            const itemCategories = JSON.parse(item.categories || '[]')
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
    <div className="min-h-screen relative">
      <Header />
      {/* WIDEO W TLE + HERO */}
      <div className="relative w-full h-[100vh] overflow-hidden">
        {/* Crossfade video */}
        {[0, 1].map((idx) => (
          <video
            key={idx}
            ref={videoRefs[idx]}
            autoPlay
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
            Twoja przeglądarka nie obsługuje wideo HTML5.
          </video>
        ))}
        {/* Warstwa przyciemniająca */}
        <div className="absolute top-0 left-0 w-full h-full z-10 bg-black bg-opacity-40 pointer-events-none" />
        {/* Hero content */}
        <div className="relative z-20 flex flex-col justify-center items-center h-full px-4 pt-24 sm:px-8 sm:pt-0">
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
              Profesjonalne <span className="text-primary-300">Oprogramowania WWW i Aplikacje Mobilne</span>
            </motion.h1>
            <motion.p
              className="text-xl text-gray-100 mb-8 max-w-3xl mx-auto drop-shadow"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.2, delay: 0.3 }}
            >
              Odkryj naszą kolekcję gotowych rozwiązań webowych. Zamów nowoczesne 
              oprogramowanie i automatyzacje dopasowane do potrzeb Twojej firmy.
            </motion.p>
            <motion.div
              className="flex flex-wrap justify-center gap-4"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.2, delay: 0.6 }}
            >
              <div className="flex items-center gap-2 text-gray-200">
                <Globe className="w-5 h-5" />
                <span>30+ Oprogramowań</span>
              </div>
              <div className="flex items-center gap-2 text-gray-200">
                <Star className="w-5 h-5 text-yellow-400" />
                <span>4.9/5 Ocena</span>
              </div>
              <div className="flex items-center gap-2 text-gray-200">
                <ShoppingCart className="w-5 h-5" />
                <span>500+ Sprzedaży</span>
              </div>
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
          <span className="mt-2 text-primary-500 text-sm font-medium animate-pulse">Przewiń w dół</span>
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
                    placeholder="Szukaj oprogramowań..."
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
                      {category === 'all' ? 'Wszystkie kategorie' : category}
                    </option>
                  ))}
                </select>
                
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-4 py-2 border border-gray-700 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-darkpanel text-darktext"
                >
                  <option value="name" className="bg-darkpanel text-darktext">Sortuj po nazwie</option>
                  <option value="price" className="bg-darkpanel text-darktext">Sortuj po cenie</option>
                  <option value="rating" className="bg-darkpanel text-darktext">Sortuj po ocenie</option>
                  <option value="sales" className="bg-darkpanel text-darktext">Sortuj po sprzedaży</option>
                </select>
              </div>
            </div>
          </motion.section>

          {/* Software Grid */}
          {loading ? (
            <div className="text-center py-12 text-lg text-darksubtle">Ładowanie oprogramowań...</div>
          ) : error ? (
            <div className="text-center py-12 text-lg text-red-400">{error}</div>
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
                  <p className="text-gray-300 text-lg">Nie znaleziono oprogramowań spełniających kryteria.</p>
                </div>
              )}
            </motion.section>
          )}
        </main>
        {/* Sekcja cennika komponentów funkcjonalnych */}
        <section className="container mx-auto px-4 py-12">
          <h2 className="text-3xl font-bold mb-6 text-center">Cennik komponentów funkcjonalnych</h2>
          {/* Desktop table */}
          <div className="overflow-x-auto hidden md:block">
            <table className="w-full bg-darkpanel rounded-lg shadow-lg">
              <thead>
                <tr className="border-b border-gray-800">
                  <th className="py-3 px-4 text-left font-semibold text-darksubtle">Komponent</th>
                  <th className="py-3 px-4 text-left font-semibold text-darksubtle">Koszt (PLN)</th>
                  <th className="py-3 px-4 text-left font-semibold text-darksubtle">Uwagi</th>
                </tr>
              </thead>
              <tbody>
                {components.map((item) => (
                  <tr key={item.id} className="border-b border-gray-900 hover:bg-darkbg/60">
                    <td className="py-3 px-4">{item.name}</td>
                    <td className="py-3 px-4">{item.priceFrom.toLocaleString('pl-PL')} – {item.priceTo.toLocaleString('pl-PL')} PLN</td>
                    <td className="py-3 px-4">{item.notes}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {/* Mobile cards */}
          <div className="flex flex-col gap-4 md:hidden">
            {components.map((item) => (
              <div key={item.id} className="bg-darkpanel rounded-xl shadow-lg p-4 border border-gray-800">
                <div className="flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-lg text-white">{item.name}</span>
                    <span className="text-primary-400 font-bold text-base text-right block min-w-[110px]">{item.priceFrom.toLocaleString('pl-PL')} – {item.priceTo.toLocaleString('pl-PL')} PLN</span>
                  </div>
                  {item.notes && (
                    <div className="text-darksubtle text-sm mt-1">{item.notes}</div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
        {/* Sekcja CTA Zamów własną aplikację */}
        <section id="cta-section" className="container mx-auto px-4 py-12 mb-12 flex flex-col items-center">
          <h2 className="text-3xl font-bold mb-4 text-center">Zamów wycenę własnej aplikacji</h2>
          <p className="text-lg text-darksubtle mb-6 text-center max-w-2xl">Masz pomysł na własny system, aplikację lub automatyzację? Zrealizujemy Twój projekt kompleksowo – od analizy po wdrożenie i wsparcie.</p>
          <button
            className="btn-primary text-lg px-8 py-4 rounded-full shadow-lg hover:scale-105 transition-transform"
            onClick={() => { setOrderProduct(null); setOrderModalOpen(true) }}
          >
            Zamów konsultację i wycenę
          </button>
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
  )
} 