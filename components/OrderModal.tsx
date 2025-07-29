"use client"

import { useState, useEffect } from "react"
import toast from "react-hot-toast"
import { useLanguage } from "@/contexts/LanguageContext"
import { formatPrice } from "@/lib/i18n"

interface OrderModalProps {
  isOpen: boolean
  onClose: () => void
  productId?: number | null
  userEmail?: string | null
  userId?: number | null
}

export default function OrderModal({ isOpen, onClose, productId, userEmail, userId }: OrderModalProps) {
  const { t, language } = useLanguage()
  const [email, setEmail] = useState(userEmail || "")
  const [phone, setPhone] = useState("")
  const [info, setInfo] = useState("")
  const [loading, setLoading] = useState(false)
  const [termsAccepted, setTermsAccepted] = useState(false)
  const [marketingAccepted, setMarketingAccepted] = useState(false)
  const [demoConsentAccepted, setDemoConsentAccepted] = useState(false)
  const [software, setSoftware] = useState<any>(null)
  const [selectedCategory, setSelectedCategory] = useState("")
  const [availableCategories, setAvailableCategories] = useState<string[]>([])
  
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

  // Pobierz wszystkie kategorie z oprogramowań
  useEffect(() => {
    if (isConsultation) {
      fetch('/api/admin/softwares')
        .then(res => res.json())
        .then(data => {
          // Wyciągnij wszystkie kategorie z oprogramowań
          const allCategories = data.softwares?.flatMap((software: any) => {
            try {
              const categories = JSON.parse(software.categories || '[]')
              return Array.isArray(categories) ? categories : []
            } catch {
              return []
            }
          }) || []
          
          // Usuń duplikaty i posortuj
          const uniqueCategories = Array.from(new Set(allCategories)).sort() as string[]
          setAvailableCategories(uniqueCategories)
        })
        .catch(err => {
          console.error('Błąd pobierania kategorii:', err)
        })
    }
  }, [isConsultation])



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
          demoConsentAccepted: !isConsultation ? demoConsentAccepted : true,
          selectedCategory: isConsultation ? selectedCategory : null,
          language
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
          {isConsultation ? t('orderModal.consultationTitle') : t('orderModal.demoTitle')}
        </h2>
        
        {!isConsultation && software && (
          <div className="mb-4 p-4 bg-darkbg rounded-lg border border-gray-700">
            <h3 className="font-semibold text-white mb-2">
              {language === 'en' && software.nameEn ? software.nameEn : software.name}
            </h3>
            <div className="text-sm text-gray-300 mb-2">
              {language === 'en' && software.descriptionEn ? software.descriptionEn : software.description}
            </div>
            <div className="flex justify-between items-center">
              <span className="text-darksubtle text-sm">{t('orderModal.demoPrice')}</span>
              <span className="text-xl font-bold text-primary-400">{formatPrice(demoPrice, language)}</span>
            </div>
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {userEmail ? (
            <div className="text-darktext text-sm">{t('orderModal.orderAs')}: <b>{userEmail}</b></div>
          ) : (
            <input
              type="email"
              placeholder={t('orderModal.email')}
              className="w-full p-2 rounded bg-darkbg border border-gray-700 text-darktext"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              disabled={loading}
            />
          )}
          <input
            type="tel"
            placeholder={t('orderModal.phone')}
            className="w-full p-2 rounded bg-darkbg border border-gray-700 text-darktext"
            value={phone}
            onChange={e => setPhone(e.target.value)}
            required
            disabled={loading}
          />
          {isConsultation && (
            <select
              value={selectedCategory}
              onChange={e => setSelectedCategory(e.target.value)}
              className="w-full p-2 rounded bg-darkbg border border-gray-700 text-darktext"
              required
              disabled={loading}
            >
              <option value="">{t('orderModal.selectCategory')}</option>
              {availableCategories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          )}
          <textarea
            placeholder={isConsultation 
              ? t('orderModal.consultationDescription')
              : t('orderModal.demoDescription')
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
                  {t('orderModal.demoConsent')} <span className="text-red-400">*</span>
                </span>
              </label>
            </div>
          )}
          
          {!userEmail && (
            <>
              <label className="flex items-center gap-2 text-sm text-darksubtle">
                <input type="checkbox" checked={termsAccepted} onChange={e => setTermsAccepted(e.target.checked)} required disabled={loading} />
                <span>{t('orderModal.termsAccept')}</span> <a href="/regulamin" target="_blank" className="underline text-primary-400">{t('orderModal.termsLink')}</a> <span className="text-red-400">*</span>
              </label>
              <label className="flex items-center gap-2 text-sm text-darksubtle">
                <input type="checkbox" checked={marketingAccepted} onChange={e => setMarketingAccepted(e.target.checked)} disabled={loading} />
                <span>{t('orderModal.marketingAccept')}</span>
              </label>
            </>
          )}
          <button
            type="submit"
            className="btn-primary w-full"
            disabled={loading}
          >
            {loading ? t('orderModal.submitButtonLoading') : t('orderModal.submitButton').replace('{type}', isConsultation ? 'wycenę' : 'demo')}
          </button>
          <div className="text-center text-darksubtle text-sm mt-4">
            <span>{t('orderModal.or')}</span><br />
            <span className="font-semibold">{t('orderModal.callUs')}</span> <br /><a href="tel:+48 502 600 739" className="underline hover:text-primary-400">{t('orderModal.phoneNumber')}</a>
          </div>
        </form>
      </div>
    </div>
  )
} 