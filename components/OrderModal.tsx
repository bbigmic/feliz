"use client"

import { useState, useEffect } from "react"
import toast from "react-hot-toast"

interface OrderModalProps {
  isOpen: boolean
  onClose: () => void
  productId?: number | null
  userEmail?: string | null
  userId?: number | null
}

export default function OrderModal({ isOpen, onClose, productId, userEmail, userId }: OrderModalProps) {
  const [email, setEmail] = useState(userEmail || "")
  const [phone, setPhone] = useState("")
  const [info, setInfo] = useState("")
  const [loading, setLoading] = useState(false)
  const [termsAccepted, setTermsAccepted] = useState(false)
  const [marketingAccepted, setMarketingAccepted] = useState(false)
  
  const isConsultation = !productId
  const orderType = isConsultation ? 'consultation' : 'demo'
  // const [stripeUrl, setStripeUrl] = useState<string | null>(null)

  useEffect(() => {
    if (userEmail) setEmail(userEmail)
    else setEmail("")
    if (isOpen) {
      setTermsAccepted(false)
      setMarketingAccepted(false)
    }
  }, [userEmail, isOpen])

  if (!isOpen) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!userEmail && !termsAccepted) {
      toast.error('Musisz zaakceptować regulamin!')
      return
    }
    setLoading(true)
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          productId,
          email: userEmail || email,
          phone,
          info,
          orderType,
          termsAccepted: userEmail ? true : termsAccepted,
          marketingAccepted: userEmail ? false : marketingAccepted
        })
      })
      const data = await res.json()
      if (res.ok && data.url) {
        toast.success("Przekierowuję do płatności...")
        window.location.href = data.url
        return
      }
      if (res.ok) {
        toast.success("Zamówienie utworzone! Przekierowuję do płatności...")
        // TODO: Integracja ze Stripe Checkout
        // setStripeUrl(...)
        onClose()
      } else {
        toast.error(data.error || "Błąd!")
      }
    } catch (err) {
      toast.error("Błąd sieci!")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
      <div className="bg-darkpanel rounded-xl shadow-lg p-8 w-full max-w-sm relative">
        <button
          className="absolute top-3 right-3 text-gray-400 hover:text-white"
          onClick={onClose}
          disabled={loading}
        >
          ✕
        </button>
        <h2 className="text-2xl font-bold mb-4 text-center text-darktext">
          {isConsultation ? 'Zamów konsultację i wycenę' : 'Zamów demo'}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {userEmail ? (
            <div className="text-darktext text-sm">Zamawiasz jako: <b>{userEmail}</b></div>
          ) : (
            <input
              type="email"
              placeholder="Twój email"
              className="w-full p-2 rounded bg-darkbg border border-gray-700 text-darktext"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              disabled={loading}
            />
          )}
          <input
            type="tel"
            placeholder="Numer telefonu"
            className="w-full p-2 rounded bg-darkbg border border-gray-700 text-darktext"
            value={phone}
            onChange={e => setPhone(e.target.value)}
            required
            disabled={loading}
          />
          <textarea
            placeholder={isConsultation 
              ? "Opisz swój projekt, wymagania i oczekiwania (opcjonalnie)"
              : "Dodatkowe informacje o stronie/aplikacji (opcjonalnie)"
            }
            className="w-full p-2 rounded bg-darkbg border border-gray-700 text-darktext"
            value={info}
            onChange={e => setInfo(e.target.value)}
            rows={3}
            disabled={loading}
          />
          {!userEmail && (
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
            {loading ? "..." : `Zamów ${isConsultation ? 'wycenę' : 'demo'} i przejdź do płatności`}
          </button>
          <div className="text-center text-darksubtle text-sm mt-4">
            lub<br />
            <span className="font-semibold">Zadzwoń na <br /><a href="tel:+48 502 600 739" className="underline hover:text-primary-400">+48 502 600 739</a></span>
          </div>
        </form>
      </div>
    </div>
  )
} 