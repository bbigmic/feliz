"use client"

import { useState, useEffect } from "react"
import { createPortal } from "react-dom"
import toast from "react-hot-toast"

interface AuthModalProps {
  isOpen: boolean
  onClose: () => void
  onAuthSuccess?: () => void
  referrerId?: number // ID sprzedawcy, który zaprosił użytkownika
}

export default function AuthModal({ isOpen, onClose, onAuthSuccess, referrerId }: AuthModalProps) {
  const [mode, setMode] = useState<'login' | 'register'>('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [termsAccepted, setTermsAccepted] = useState(false)
  const [marketingAccepted, setMarketingAccepted] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    return () => setMounted(false)
  }, [])

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen || !mounted) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (mode === 'register' && !termsAccepted) {
      toast.error('Musisz zaakceptować regulamin!')
      return
    }
    setLoading(true)
    try {
      const body = mode === 'register'
        ? { email, password, termsAccepted, marketingAccepted, referrerId }
        : { email, password }
      const res = await fetch(`/api/auth/${mode}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      })
      const data = await res.json()
      if (res.ok) {
        toast.success(mode === 'login' ? 'Zalogowano pomyślnie!' : 'Rejestracja udana!')
        onClose()
        if (onAuthSuccess) onAuthSuccess()
        setEmail('')
        setPassword('')
      } else {
        toast.error(data.error || 'Błąd!')
      }
    } catch (err) {
      toast.error('Błąd sieci!')
    } finally {
      setLoading(false)
    }
  }

  const modalContent = (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black bg-opacity-60 p-4" style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0 }}>
      <div className="bg-darkpanel rounded-xl shadow-lg p-8 w-full max-w-sm relative max-h-[90vh] overflow-y-auto">
        <button
          className="absolute top-3 right-3 text-gray-400 hover:text-white"
          onClick={onClose}
          disabled={loading}
        >
          ✕
        </button>
        <h2 className="text-2xl font-bold mb-4 text-center text-darktext">
          {mode === 'login' ? 'Logowanie' : 'Rejestracja'}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            className="w-full p-2 rounded bg-darkbg border border-gray-700 text-darktext"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            disabled={loading}
          />
          <input
            type="password"
            placeholder="Hasło"
            className="w-full p-2 rounded bg-darkbg border border-gray-700 text-darktext"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            disabled={loading}
          />
          {mode === 'register' && (
            <>
              <label className="flex items-center gap-2 text-sm text-darksubtle">
                <input type="checkbox" checked={termsAccepted} onChange={e => setTermsAccepted(e.target.checked)} required disabled={loading} />
                Akceptuję <a href="/regulamin" target="_blank" className="underline text-primary-400">regulamin</a> (wymagane)
              </label>
              <label className="flex items-center gap-2 text-sm text-darksubtle">
                <input type="checkbox" checked={marketingAccepted} onChange={e => setMarketingAccepted(e.target.checked)} disabled={loading} />
                Chcę otrzymywać informacje marketingowe (opcjonalnie)
              </label>
            </>
          )}
          <button
            type="submit"
            className="btn-primary w-full"
            disabled={loading}
          >
            {loading ? '...' : (mode === 'login' ? 'Zaloguj się' : 'Zarejestruj się')}
          </button>
        </form>
        <div className="text-center mt-4">
          {mode === 'login' ? (
            <span className="text-sm text-gray-400">
              Nie masz konta?{' '}
              <button
                className="text-primary-400 hover:underline"
                onClick={() => setMode('register')}
                disabled={loading}
              >
                Zarejestruj się
              </button>
            </span>
          ) : (
            <span className="text-sm text-gray-400">
              Masz już konto?{' '}
              <button
                className="text-primary-400 hover:underline"
                onClick={() => setMode('login')}
                disabled={loading}
              >
                Zaloguj się
              </button>
            </span>
          )}
        </div>
      </div>
    </div>
  )

  return createPortal(modalContent, document.body)
} 