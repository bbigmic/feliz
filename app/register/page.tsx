'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'
import Link from 'next/link'
import { UserPlus, ArrowLeft, CheckCircle, Users } from 'lucide-react'

function RegisterForm() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [termsAccepted, setTermsAccepted] = useState(false)
  const [marketingAccepted, setMarketingAccepted] = useState(false)
  const [referrerId, setReferrerId] = useState<number | undefined>(undefined)
  const [referrerInfo, setReferrerInfo] = useState<{ email: string; firstName?: string; lastName?: string } | null>(null)
  const [loadingReferrer, setLoadingReferrer] = useState(false)

  // Pobierz referrerId z URL
  useEffect(() => {
    const ref = searchParams.get('ref')
    if (ref) {
      const refId = parseInt(ref)
      if (!isNaN(refId)) {
        setReferrerId(refId)
        fetchReferrerInfo(refId)
      }
    }
  }, [searchParams])

  // Pobierz informacje o sprzedawcy polecającym
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
    
    if (password !== confirmPassword) {
      toast.error('Hasła nie są zgodne!')
      return
    }
    
    if (password.length < 6) {
      toast.error('Hasło musi mieć co najmniej 6 znaków!')
      return
    }
    
    if (!termsAccepted) {
      toast.error('Musisz zaakceptować regulamin!')
      return
    }
    
    setLoading(true)
    try {
      const body = { 
        email, 
        password, 
        termsAccepted, 
        marketingAccepted,
        referrerId 
      }
      
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      })
      
      const data = await res.json()
      
      if (res.ok) {
        toast.success('Rejestracja udana! Przekierowuję...')
        setTimeout(() => {
          window.location.href = '/'
        }, 1500)
      } else {
        toast.error(data.error || 'Błąd rejestracji!')
      }
    } catch (err) {
      toast.error('Błąd sieci!')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-darkbg via-darkpanel to-darkbg flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Powrót do strony głównej */}
        <Link 
          href="/" 
          className="inline-flex items-center gap-2 text-darksubtle hover:text-darktext mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Powrót do strony głównej
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-darkpanel rounded-2xl shadow-2xl p-8 border border-gray-800"
        >
          {/* Logo i nagłówek */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-3 mb-4">
              <img src="/logo-wsp-edu.png" alt="Logo" className="w-12 h-12 object-contain" />
              <h1 className="text-2xl font-bold text-darktext">FelizTrade</h1>
            </div>
            <h2 className="text-xl font-semibold text-darktext mb-2">
              {referrerId ? 'Rejestracja Sprzedawcy' : 'Rejestracja'}
            </h2>
            <p className="text-darksubtle text-sm">
              {referrerId 
                ? 'Dołącz do zespołu sprzedawców i zarabiaj nawet 25% prowizji od sprzedaży' 
                : 'Utwórz konto, aby rozpocząć współpracę'}
            </p>
          </div>

          {/* Informacja o poleceniu */}
          {referrerId && referrerInfo && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 border border-blue-500/30 rounded-lg p-4 mb-6"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                    <Users className="w-5 h-5 text-white" />
                  </div>
                </div>
                <div className="flex-1">
                  <p className="text-sm text-blue-300 font-medium">Zaproszenie od:</p>
                  <p className="text-white font-semibold">
                    {referrerInfo.firstName && referrerInfo.lastName 
                      ? `${referrerInfo.firstName} ${referrerInfo.lastName}`
                      : referrerInfo.email}
                  </p>
                </div>
                <CheckCircle className="w-6 h-6 text-green-400" />
              </div>
              <div className="bg-green-600/20 border border-green-500/30 rounded px-3 py-2">
                <p className="text-xs text-green-300">
                  🎉 Zostaniesz automatycznie sprzedawcą i będziesz mógł zarabiać prowizje!
                </p>
              </div>
            </motion.div>
          )}

          {/* Formularz rejestracji */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-darktext mb-2">
                Adres email
              </label>
              <input
                type="email"
                placeholder="twoj@email.com"
                className="w-full px-4 py-3 rounded-lg bg-darkbg border border-gray-700 text-darktext focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                disabled={loading}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-darktext mb-2">
                Hasło
              </label>
              <input
                type="password"
                placeholder="Min. 6 znaków"
                className="w-full px-4 py-3 rounded-lg bg-darkbg border border-gray-700 text-darktext focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                disabled={loading}
                minLength={6}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-darktext mb-2">
                Potwierdź hasło
              </label>
              <input
                type="password"
                placeholder="Powtórz hasło"
                className="w-full px-4 py-3 rounded-lg bg-darkbg border border-gray-700 text-darktext focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all"
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
                required
                disabled={loading}
                minLength={6}
              />
            </div>

            {/* Zgody */}
            <div className="space-y-3 pt-2">
              <label className="flex items-start gap-3 text-sm text-darksubtle cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={termsAccepted} 
                  onChange={e => setTermsAccepted(e.target.checked)} 
                  required 
                  disabled={loading}
                  className="mt-1 h-4 w-4 rounded border-gray-700 bg-darkbg text-primary-600 focus:ring-primary-500 focus:ring-offset-darkbg"
                />
                <span>
                  Akceptuję <a href="/regulamin" target="_blank" className="underline text-primary-400 hover:text-primary-300">regulamin</a> (wymagane)
                </span>
              </label>
              
              <label className="flex items-start gap-3 text-sm text-darksubtle cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={marketingAccepted} 
                  onChange={e => setMarketingAccepted(e.target.checked)} 
                  disabled={loading}
                  className="mt-1 h-4 w-4 rounded border-gray-700 bg-darkbg text-primary-600 focus:ring-primary-500 focus:ring-offset-darkbg"
                />
                <span>
                  Chcę otrzymywać informacje marketingowe (opcjonalnie)
                </span>
              </label>
            </div>

            {/* Przycisk rejestracji */}
            <button
              type="submit"
              className="w-full btn-primary py-3 rounded-lg font-semibold text-base mt-6 flex items-center justify-center gap-2"
              disabled={loading}
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  Rejestracja...
                </>
              ) : (
                <>
                  <UserPlus className="w-5 h-5" />
                  Zarejestruj się
                </>
              )}
            </button>
          </form>

          {/* Link do logowania */}
          <div className="text-center mt-6 pt-6 border-t border-gray-800">
            <span className="text-sm text-darksubtle">
              Masz już konto?{' '}
              <Link href="/" className="text-primary-400 hover:text-primary-300 font-medium">
                Zaloguj się
              </Link>
            </span>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default function RegisterPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-darkbg via-darkpanel to-darkbg flex items-center justify-center p-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto mb-4"></div>
          <p className="text-darksubtle">Ładowanie...</p>
        </div>
      </div>
    }>
      <RegisterForm />
    </Suspense>
  )
}

