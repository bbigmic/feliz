'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'
import Link from 'next/link'
import { ArrowLeft, Send, CheckCircle, Users, Smartphone, Sparkles, LayoutDashboard } from 'lucide-react'

function LeadPageContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const ref = searchParams.get('ref')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [info, setInfo] = useState('')
  const [loading, setLoading] = useState(false)
  const [categories, setCategories] = useState<string[]>([])
  const [softwares, setSoftwares] = useState<any[]>([])
  const [showSoftwareTemplate, setShowSoftwareTemplate] = useState(false)
  const [selectedSoftware, setSelectedSoftware] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')
  const [referrerInfo, setReferrerInfo] = useState<{ email: string; firstName?: string; lastName?: string } | null>(null)
  const [loadingReferrer, setLoadingReferrer] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch('/api/admin/softwares')
        const data = await res.json()
        if (data.softwares) {
          setSoftwares(data.softwares)
          const allCategories = data.softwares.flatMap((software: any) => JSON.parse(software.categories))
          setCategories(Array.from(new Set(allCategories))) // Usuwamy duplikaty
        }
      } catch (error) {
        console.error('Błąd pobierania danych:', error)
        toast.error('Błąd pobierania danych')
      }
    }
    fetchData()
    
    // Pobierz informacje o sprzedawcy, jeśli ref istnieje
    if (ref) {
      fetchReferrerInfo(parseInt(ref))
    }
  }, [ref])

  const fetchReferrerInfo = async (refId: number) => {
    setLoadingReferrer(true)
    try {
      const res = await fetch(`/api/user/referrer-info?id=${refId}`)
      const data = await res.json()
      if (data.success && data.referrer) {
        setReferrerInfo(data.referrer)
      }
    } catch (error) {
      console.error('Błąd pobierania informacji o sprzedawcy:', error)
    } finally {
      setLoadingReferrer(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const response = await fetch('/api/seller/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          phone,
          info,
          selectedCategory,
          sellerId: ref,
          selectedSoftware: showSoftwareTemplate ? selectedSoftware : null
        })
      })

      const data = await response.json()

      if (response.ok) {
        toast.success('Zapytanie zostało wysłane pomyślnie!')
        // Przekierowanie do strony sukcesu po krótkiej przerwie
        setTimeout(() => {
          router.push('/lead-success')
        }, 1000)
      } else {
        // Wyświetl szczegółowy komunikat błędu z API
        if (data.error) {
          toast.error(data.error)
        } else {
          toast.error('Błąd podczas wysyłania zapytania')
        }
      }
    } catch (error) {
      toast.error('Błąd podczas dodawania leada')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-darkbg via-darkpanel to-darkbg py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Powrót do strony głównej */}
        <Link 
          href="/" 
          className="inline-flex items-center gap-2 text-darksubtle hover:text-darktext mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Powrót do strony głównej
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          {/* Lewa kolumna - Formularz */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-darkpanel rounded-2xl shadow-2xl p-8 border border-gray-800"
          >
            {/* Logo i nagłówek */}
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-4">
                <img src="/logo-wsp-edu.png" alt="Logo" className="w-12 h-12 object-contain" />
                <h1 className="text-2xl font-bold text-darktext">FelizTrade</h1>
              </div>
              <h2 className="text-2xl font-bold text-darktext mb-2">
                Stwórz aplikację z nami
              </h2>
              <p className="text-darksubtle text-sm">
                Zostaw swoje dane kontaktowe, a nasz zespół skontaktuje się z Tobą w sprawie najlepszych rozwiązań dla Twojego biznesu.
              </p>
            </div>

            {/* Informacja o poleceniu */}
            {ref && referrerInfo && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 border border-blue-500/30 rounded-lg p-4 mb-6"
              >
                <div className="flex items-center gap-3 mb-2">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                      <Users className="w-5 h-5 text-white" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-blue-300 font-medium">Polecił Cię:</p>
                    <p className="text-white font-semibold">
                      {referrerInfo.firstName && referrerInfo.lastName 
                        ? `${referrerInfo.firstName} ${referrerInfo.lastName}`
                        : referrerInfo.email}
                    </p>
                  </div>
                  <CheckCircle className="w-6 h-6 text-green-400" />
                </div>
              </motion.div>
            )}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-darktext mb-2">
                Adres email *
              </label>
              <input
                type="email"
                placeholder="twoj@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-lg bg-darkbg border border-gray-700 text-darktext focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all"
                required
                disabled={loading}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-darktext mb-2">
                Numer telefonu *
              </label>
              <input
                type="tel"
                placeholder="+48 123 456 789"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-4 py-3 rounded-lg bg-darkbg border border-gray-700 text-darktext focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all"
                required
                disabled={loading}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-darktext mb-2">
                Kategoria aplikacji *
              </label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-4 py-3 rounded-lg bg-darkbg border border-gray-700 text-darktext focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all"
                required
                disabled={loading}
              >
                <option value="">Wybierz kategorię...</option>
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>
            
            {/* Checkbox dla szablonu oprogramowania */}
            <div className="flex items-start gap-3 pt-2">
              <input
                type="checkbox"
                id="softwareTemplate"
                checked={showSoftwareTemplate}
                onChange={(e) => setShowSoftwareTemplate(e.target.checked)}
                disabled={loading}
                className="mt-1 h-4 w-4 rounded border-gray-700 bg-darkbg text-primary-600 focus:ring-primary-500 focus:ring-offset-darkbg"
              />
              <label htmlFor="softwareTemplate" className="text-sm text-darksubtle cursor-pointer">
                Chcę wybrać gotowy szablon oprogramowania
              </label>
            </div>
            
            {/* Select dla szablonu oprogramowania */}
            {showSoftwareTemplate && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                transition={{ duration: 0.3 }}
              >
                <label className="block text-sm font-medium text-darktext mb-2">
                  Wybierz szablon oprogramowania
                </label>
                <select
                  value={selectedSoftware}
                  onChange={(e) => setSelectedSoftware(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg bg-darkbg border border-gray-700 text-darktext focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all"
                  required={showSoftwareTemplate}
                  disabled={loading}
                >
                  <option value="">Wybierz szablon...</option>
                  {softwares.map(software => (
                    <option key={software.id} value={software.id}>
                      {software.name}
                    </option>
                  ))}
                </select>
              </motion.div>
            )}

            <div>
              <label className="block text-sm font-medium text-darktext mb-2">
                Dodatkowe informacje
              </label>
              <textarea
                placeholder="Opisz swój projekt, wymagania, funkcjonalności..."
                value={info}
                onChange={(e) => setInfo(e.target.value)}
                rows={4}
                className="w-full px-4 py-3 rounded-lg bg-darkbg border border-gray-700 text-darktext focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all resize-none"
                disabled={loading}
              />
            </div>
            
            {/* Przycisk wysłania */}
            <button
              type="submit"
              className="w-full btn-primary py-3 rounded-lg font-semibold text-base mt-6 flex items-center justify-center gap-2"
              disabled={loading}
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  Wysyłanie...
                </>
              ) : (
                <>
                  <Send className="w-5 h-5" />
                  Wyślij zapytanie
                </>
              )}
            </button>
          </form>
        </motion.div>

        {/* Prawa kolumna - Korzyści */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="space-y-6"
        >
          {/* Nagłówek sekcji korzyści */}
          <div className="bg-gradient-to-r from-primary-600 to-purple-600 rounded-2xl p-8 text-white">
            <h3 className="text-2xl font-bold mb-3">Dlaczego FelizTrade?</h3>
            <p className="text-white/90 text-sm">
              Twój projekt zasługuje na najlepsze rozwiązania. Specjalizujemy się w tworzeniu zaawansowanych aplikacji dopasowanych do potrzeb Twojego biznesu.
            </p>
          </div>

          {/* Kafelki z korzyściami */}
          <div className="space-y-4">
            <motion.div 
              whileHover={{ scale: 1.02 }}
              className="bg-darkpanel p-6 rounded-xl border border-gray-800 hover:border-blue-600/50 transition-all"
            >
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg flex items-center justify-center">
                  <LayoutDashboard className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-darktext mb-2">Custom Admin Panel</h3>
                  <p className="text-darksubtle text-sm">
                    Spersonalizowany panel administracyjny dostosowany do specyfiki Twojego biznesu z pełną kontrolą nad danymi.
                  </p>
                </div>
              </div>
            </motion.div>
            
            <motion.div 
              whileHover={{ scale: 1.02 }}
              className="bg-darkpanel p-6 rounded-xl border border-gray-800 hover:border-green-600/50 transition-all"
            >
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-green-600 to-green-700 rounded-lg flex items-center justify-center">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-darktext mb-2">Integracje AI</h3>
                  <p className="text-darksubtle text-sm">
                    Zaawansowane rozwiązania sztucznej inteligencji, które automatyzują procesy i zwiększają efektywność biznesu.
                  </p>
                </div>
              </div>
            </motion.div>
            
            <motion.div 
              whileHover={{ scale: 1.02 }}
              className="bg-darkpanel p-6 rounded-xl border border-gray-800 hover:border-purple-600/50 transition-all"
            >
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-purple-600 to-purple-700 rounded-lg flex items-center justify-center">
                  <Smartphone className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-darktext mb-2">Mobilne Aplikacje</h3>
                  <p className="text-darksubtle text-sm">
                    Natywne aplikacje mobilne na iOS i Android zapewniające doskonałe doświadczenie na każdym urządzeniu.
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
      </div>
    </div>
  )
}

export default function LeadPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-darkbg via-darkpanel to-darkbg flex items-center justify-center p-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto mb-4"></div>
          <p className="text-darksubtle">Ładowanie...</p>
        </div>
      </div>
    }>
      <LeadPageContent />
    </Suspense>
  )
}
