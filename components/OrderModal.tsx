"use client"

import { useState, useEffect, useRef } from "react"
import { motion } from "framer-motion"
import toast from "react-hot-toast"
import { useLanguage } from "@/contexts/LanguageContext"
import { formatPrice } from "@/lib/i18n"
import { Upload, X, File, Download } from "lucide-react"

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
  const [softwareLoading, setSoftwareLoading] = useState(false)
  const [termsAccepted, setTermsAccepted] = useState(false)
  const [marketingAccepted, setMarketingAccepted] = useState(false)
  const [collaborationConsentAccepted, setCollaborationConsentAccepted] = useState(false)
  const [codeConsentAccepted, setCodeConsentAccepted] = useState(false)
  const [software, setSoftware] = useState<any>(null)
  const [selectedCategory, setSelectedCategory] = useState("")
  const [availableCategories, setAvailableCategories] = useState<string[]>([])
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])
  const [uploadedFiles, setUploadedFiles] = useState<any[]>([])
  const [uploadingFiles, setUploadingFiles] = useState(false)
  const [orderType, setOrderType] = useState<'collaboration' | 'code' | 'consultation'>('collaboration')
  const fileInputRef = useRef<HTMLInputElement>(null)
  
  const isConsultation = !productId
  const showOrderTypeSelection = !isConsultation && productId

  // Pobierz dane oprogramowania jeśli to collaboration lub code
  useEffect(() => {
    if (productId) {
      // Resetuj software gdy zmienia się productId
      setSoftware(null)
      setSoftwareLoading(true)
      
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
        .finally(() => {
          setSoftwareLoading(false)
        })
    } else {
      // Resetuj software gdy nie ma productId (konsultacja)
      setSoftware(null)
      setSoftwareLoading(false)
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
      setCollaborationConsentAccepted(false)
      setCodeConsentAccepted(false)
      setSelectedFiles([])
      setUploadedFiles([])
      setOrderType('collaboration')
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
    
    if (!isConsultation && orderType === 'collaboration' && !collaborationConsentAccepted) {
      toast.error('Musisz zaakceptować warunki współpracy!')
      return
    }
    
    if (!isConsultation && orderType === 'code' && !codeConsentAccepted) {
      toast.error('Musisz zaakceptować warunki dostarczenia kodu!')
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
          orderType: isConsultation ? 'consultation' : orderType,
          termsAccepted: userEmail ? true : termsAccepted,
          marketingAccepted: userEmail ? false : marketingAccepted,
          collaborationConsentAccepted: orderType === 'collaboration' ? collaborationConsentAccepted : false,
          codeConsentAccepted: orderType === 'code' ? codeConsentAccepted : false,
          selectedCategory: isConsultation ? selectedCategory : null,
          language
        })
      })
      const data = await res.json()
      
      if (res.ok && data.orderId) {
        // Upload plików jeśli zostały wybrane
        if (selectedFiles.length > 0) {
          await uploadFiles(data.orderId)
        }
        
        if (data.url) {
          toast.success("Przekierowuję do płatności...")
          window.location.href = data.url
          return
        } else {
          toast.success("Zamówienie utworzone!")
          onClose()
        }
      } else {
        toast.error(data.error || "Błąd!")
      }
    } catch (err) {
      toast.error("Błąd sieci!")
    } finally {
      setLoading(false)
    }
  }

  // Oblicz cenę collaboration (30% ceny oprogramowania) i code (100% ceny)
  const collaborationPrice = software ? Math.round(software.price * 0.3) : 0
  const codePrice = software ? software.price : 0

  // Funkcje do obsługi plików
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    setSelectedFiles(prev => [...prev, ...files])
  }

  const removeFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index))
  }

  const uploadFiles = async (orderId: number) => {
    if (selectedFiles.length === 0) return

    setUploadingFiles(true)
    try {
      const formData = new FormData()
      formData.append('orderId', orderId.toString())
      selectedFiles.forEach(file => {
        formData.append('files', file)
      })

      const response = await fetch('/api/orders/upload-files', {
        method: 'POST',
        body: formData
      })

      const data = await response.json()
      
      if (response.ok) {
        setUploadedFiles(prev => [...prev, ...data.files])
        setSelectedFiles([])
        toast.success(data.message)
      } else {
        toast.error(data.error || 'Błąd podczas uploadu plików')
      }
    } catch (error) {
      toast.error('Błąd podczas uploadu plików')
    } finally {
      setUploadingFiles(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 p-4">
      <div className="bg-darkpanel rounded-xl shadow-lg p-8 w-full max-w-md relative max-h-[90vh] overflow-y-auto">
        <button
          className="absolute top-3 right-3 text-gray-400 hover:text-white"
          onClick={onClose}
          disabled={loading}
        >
          ✕
        </button>
        <h2 className="text-2xl font-bold mb-4 text-center text-darktext">
          {isConsultation ? t('orderModal.consultationTitle') : t('orderModal.collaborationTitle')}
        </h2>
        
        {!isConsultation && (
          <div className="mb-4 p-4 bg-darkbg rounded-lg border border-gray-700">
            {softwareLoading ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center justify-center py-8"
              >
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full mb-4"
                />
                <p className="text-gray-400 text-sm">{t('orderModal.loadingSoftware')}</p>
              </motion.div>
            ) : software ? (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <h3 className="font-semibold text-white mb-2">
                  {language === 'en' && software.nameEn ? software.nameEn : software.name}
                </h3>
                <div className="text-sm text-gray-300 mb-2">
                  {language === 'en' && software.descriptionEn ? software.descriptionEn : software.description}
                </div>
                
                {/* Wybór typu zamówienia */}
                {showOrderTypeSelection && (
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-darksubtle mb-2">
                      {language === 'en' ? 'Choose order type:' : 'Wybierz typ zamówienia:'}
                    </label>
                    <div className="space-y-2">
                      <label className="flex items-center space-x-3 cursor-pointer">
                        <input
                          type="radio"
                          name="orderType"
                          value="collaboration"
                          checked={orderType === 'collaboration'}
                          onChange={(e) => setOrderType(e.target.value as 'collaboration' | 'code')}
                          className="text-primary-600 focus:ring-primary-500"
                        />
                        <div className="flex-1">
                          <div className="text-white font-medium">
                            {language === 'en' ? 'Collaboration (30% advance)' : 'Współpraca (30% zaliczka)'}
                          </div>
                          <div className="text-sm text-gray-400">
                            {language === 'en' ? 'We will contact you within 24h to arrange project implementation schedule' : 'Skontaktujemy się w ciągu 24h aby ustalić harmonogram realizacji projektu'}
                          </div>
                        </div>
                      </label>
                      <label className="flex items-center space-x-3 cursor-pointer">
                        <input
                          type="radio"
                          name="orderType"
                          value="code"
                          checked={orderType === 'code'}
                          onChange={(e) => setOrderType(e.target.value as 'collaboration' | 'code')}
                          className="text-primary-600 focus:ring-primary-500"
                        />
                        <div className="flex-1">
                          <div className="text-white font-medium">
                            {language === 'en' ? 'Code with instructions (100%)' : 'Kod z instrukcjami (100%)'}
                          </div>
                          <div className="text-sm text-gray-400">
                            {language === 'en' ? 'Delivered within 7 working days' : 'Dostarczone w ciągu 7 dni roboczych'}
                          </div>
                        </div>
                      </label>
                    </div>
                  </div>
                )}
                
                {/* Wyświetl cenę na podstawie wybranego typu */}
                <div className="flex justify-between items-center">
                  <span className="text-darksubtle text-sm">
                    {orderType === 'collaboration' ? t('orderModal.collaborationPrice') : t('orderModal.codePrice')}
                  </span>
                  <span className="text-xl font-bold text-primary-400">
                    {formatPrice(orderType === 'collaboration' ? collaborationPrice : codePrice, language)}
                  </span>
                </div>
              </motion.div>
            ) : (
              <div className="text-red-400 text-sm text-center py-4">
                {t('orderModal.softwareNotFound')}
              </div>
            )}
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
              : (orderType === 'collaboration' ? t('orderModal.collaborationDescription') : t('orderModal.codeDescription'))
            }
            className="w-full p-2 rounded bg-darkbg border border-gray-700 text-darktext"
            value={info}
            onChange={e => setInfo(e.target.value)}
            rows={3}
            disabled={loading}
          />
          
          {/* Sekcja załączania plików */}
          <div className="space-y-3">
            <div className="space-y-2">
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png,.gif"
                onChange={handleFileSelect}
                className="hidden"
                disabled={loading}
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={loading}
                className="flex items-center gap-2 px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors disabled:opacity-50"
              >
                <Upload className="w-4 h-4" />
                <span>{t('orderModal.attachFiles')}</span>
              </button>
              <div className="text-sm text-darksubtle">
                (PDF, DOC, DOCX, TXT, JPG, PNG, GIF - max 10MB każdy)
              </div>
            </div>
            
            {/* Wybrane pliki */}
            {selectedFiles.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-sm font-medium text-darktext">{t('orderModal.selectedFiles')}</h4>
                {selectedFiles.map((file, index) => (
                  <div key={index} className="flex items-center justify-between p-2 bg-darkbg rounded-lg">
                    <div className="flex items-center gap-2">
                      <File className="w-4 h-4 text-primary-400" />
                      <span className="text-sm text-darktext">{file.name}</span>
                      <span className="text-xs text-darksubtle">
                        ({(file.size / 1024 / 1024).toFixed(2)} MB)
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeFile(index)}
                      className="text-red-400 hover:text-red-300 p-1"
                      disabled={loading}
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
            
            {/* Załączone pliki */}
            {uploadedFiles.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-sm font-medium text-darktext">{t('orderModal.attachedFiles')}</h4>
                {uploadedFiles.map((file, index) => (
                  <div key={index} className="flex items-center justify-between p-2 bg-green-900/20 border border-green-700 rounded-lg">
                    <div className="flex items-center gap-2">
                      <File className="w-4 h-4 text-green-400" />
                      <span className="text-sm text-darktext">{file.originalName}</span>
                      <span className="text-xs text-darksubtle">
                        ({(file.size / 1024 / 1024).toFixed(2)} MB)
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="text-xs text-green-400">✓ Załączony</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          {/* Zgody na podstawie typu zamówienia */}
          {!isConsultation && orderType === 'collaboration' && (
            <div className="space-y-3">
              <label className="flex items-start gap-2 text-sm text-darksubtle">
                <input 
                  type="checkbox" 
                  checked={collaborationConsentAccepted} 
                  onChange={e => setCollaborationConsentAccepted(e.target.checked)} 
                  required 
                  disabled={loading}
                  className="mt-1"
                />
                <span>
                  {t('orderModal.collaborationConsent')} <span className="text-red-400">*</span>
                </span>
              </label>
            </div>
          )}
          
          {!isConsultation && orderType === 'code' && (
            <div className="space-y-3">
              <label className="flex items-start gap-2 text-sm text-darksubtle">
                <input 
                  type="checkbox" 
                  checked={codeConsentAccepted} 
                  onChange={e => setCodeConsentAccepted(e.target.checked)} 
                  required 
                  disabled={loading}
                  className="mt-1"
                />
                <span>
                  {t('orderModal.codeConsent')} <span className="text-red-400">*</span>
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
            {loading ? t('orderModal.submitButtonLoading') : t('orderModal.submitButton').replace('{type}', isConsultation ? t('orderModal.orderTypeConsultation') : (orderType === 'collaboration' ? t('orderModal.orderTypeCollaboration') : t('orderModal.orderTypeCode')))}
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