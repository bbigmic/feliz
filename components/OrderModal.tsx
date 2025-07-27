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
  const [demoConsentAccepted, setDemoConsentAccepted] = useState(false)
  const [software, setSoftware] = useState<any>(null)
  
  const isConsultation = !productId
  const orderType = isConsultation ? 'consultation' : 'demo'

  // Pobierz dane oprogramowania jeśli to demo
  useEffect(() => {
    if (productId) {
      // Resetuj software gdy zmienia się productId
      setSoftware(null)
      
      fetch(`/api/admin/softwares`)
        .then(res => res.json())
        .then(data => {
          const foundSoftware = data.softwares?.find((s: any) => s.id === productId)
          if (foundSoftware) {
            setSoftware(foundSoftware)
          }
        })
        .catch(err => {
          console.error('Błąd pobierania danych oprogramowania:', err)
        })
    } else {
      // Resetuj software gdy nie ma productId (konsultacja)
      setSoftware(null)
    }
  }, [productId])

  useEffect(() => {
    if (userEmail) setEmail(userEmail)
    else setEmail("")
    if (isOpen) {
      setTermsAccepted(false)
      setMarketingAccepted(false)
      setDemoConsentAccepted(false)
    }
  }, [userEmail, isOpen])

  if (!isOpen) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Sprawdź wymagane zgody
    if (!userEmail && !termsAccepted) {
      toast.error('Musisz zaakceptować regulamin!')
      return
    }
    
    if (!isConsultation && !demoConsentAccepted) {
      toast.error('Musisz zaakceptować warunki demo!')
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
          marketingAccepted: userEmail ? false : marketingAccepted,
          demoConsentAccepted: !isConsultation ? demoConsentAccepted : true
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

  // Oblicz cenę demo (20% ceny oprogramowania)
  const demoPrice = software ? Math.round(software.price * 0.2) : 0

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
      <div className="bg-darkpanel rounded-xl shadow-lg p-8 w-full max-w-md relative">
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
        
        {!isConsultation && software && (
          <div className="mb-4 p-4 bg-darkbg rounded-lg border border-gray-700">
            <h3 className="font-semibold text-white mb-2">{software.name}</h3>
            <div className="text-sm text-gray-300 mb-2">{software.description}</div>
            <div className="flex justify-between items-center">
              <span className="text-darksubtle text-sm">Cena demo (20%):</span>
              <span className="text-xl font-bold text-primary-400">{demoPrice.toLocaleString('pl-PL')} zł</span>
            </div>
          </div>
        )}
        
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
          
          {!isConsultation && (
            <div className="space-y-3">
              <label className="flex items-start gap-2 text-sm text-darksubtle">
                <input 
                  type="checkbox" 
                  checked={demoConsentAccepted} 
                  onChange={e => setDemoConsentAccepted(e.target.checked)} 
                  required 
                  disabled={loading}
                  className="mt-1"
                />
                <span>
                  Oświadczam, że opłata zaliczkowa dotyczy wyłącznie przygotowania wersji demonstracyjnej aplikacji, 
                  która zostanie udostępniona online pod linkiem przesłanym na podany adres e-mail w ciągu 7 dni roboczych 
                  od zaksięgowania płatności. Wersja demo może zawierać błędy i ma charakter poglądowy. 
                  Pełny dostęp do kodu źródłowego i jego przekazanie możliwe będzie po uiszczeniu pełnej kwoty za oprogramowanie. 
                  Dostosowanie oprogramowania do potrzeb zamawiającego odbywa się na podstawie odrębnej wyceny komponentów 
                  funkcjonalnych i wizualnych. <span className="text-red-400">*</span>
                </span>
              </label>
            </div>
          )}
          
          {!userEmail && (
            <>
              <label className="flex items-center gap-2 text-sm text-darksubtle">
                <input type="checkbox" checked={termsAccepted} onChange={e => setTermsAccepted(e.target.checked)} required disabled={loading} />
                Akceptuję <a href="/regulamin" target="_blank" className="underline text-primary-400">regulamin.</a> <span className="text-red-400">*</span>
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