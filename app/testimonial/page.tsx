'use client'

import { useState, useEffect } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Star, Send, CheckCircle, Sparkles, Loader2 } from 'lucide-react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { useLanguage } from '@/contexts/LanguageContext'
import DynamicTitle from '@/components/DynamicTitle'

export default function TestimonialPage() {
  const { t, language } = useLanguage()
  const searchParams = useSearchParams()
  const router = useRouter()
  const softwareId = searchParams.get('software')

  const [software, setSoftware] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    position: '',
    rating: 5,
    comment: ''
  })

  const [hoveredRating, setHoveredRating] = useState(0)
  const [suggestions, setSuggestions] = useState<string[]>([])
  const [loadingSuggestions, setLoadingSuggestions] = useState(false)
  const [showSuggestions, setShowSuggestions] = useState(false)

  // Pobierz dane oprogramowania
  useEffect(() => {
    if (!softwareId) {
      setLoading(false)
      return
    }

    fetch(`/api/software/${softwareId}`)
      .then(res => res.json())
      .then(data => {
        if (data.software) {
          setSoftware(data.software)
        }
        setLoading(false)
      })
      .catch(() => {
        setLoading(false)
      })
  }, [softwareId])

  const handleGenerateSuggestions = async () => {
    if (!software) return
    
    setLoadingSuggestions(true)
    setShowSuggestions(true)
    
    try {
      const response = await fetch('/api/testimonials/generate-suggestions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          softwareName: language === 'en' && software.nameEn ? software.nameEn : software.name,
          softwareDescription: language === 'en' && software.descriptionEn ? software.descriptionEn : software.description,
          rating: formData.rating,
          language: language,
          position: formData.position || null
        })
      })

      const data = await response.json()

      if (response.ok && data.suggestions) {
        setSuggestions(data.suggestions)
      } else {
        alert(data.error || (language === 'en' ? 'Failed to generate suggestions' : 'Nie udało się wygenerować sugestii'))
        setShowSuggestions(false)
      }
    } catch (error) {
      console.error('Błąd generowania sugestii:', error)
      alert(language === 'en' ? 'An error occurred' : 'Wystąpił błąd')
      setShowSuggestions(false)
    } finally {
      setLoadingSuggestions(false)
    }
  }

  const handleSelectSuggestion = (suggestion: string) => {
    setFormData({ ...formData, comment: suggestion })
    setShowSuggestions(false)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)

    try {
      const response = await fetch('/api/testimonials', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          softwareId: softwareId,
          ...formData
        })
      })

      const data = await response.json()

      if (response.ok) {
        setSuccess(true)
        // Reset form
        setFormData({
          name: '',
          email: '',
          position: '',
          rating: 5,
          comment: ''
        })
        setSuggestions([])
        setShowSuggestions(false)
      } else {
        alert(data.error || (language === 'en' ? 'An error occurred' : 'Wystąpił błąd'))
      }
    } catch (error) {
      console.error('Błąd wysyłania opinii:', error)
      alert(language === 'en' ? 'An error occurred' : 'Wystąpił błąd')
    } finally {
      setSubmitting(false)
    }
  }

  if (!softwareId) {
    return (
      <>
        <DynamicTitle titleKey="home" fallbackTitle="FelizTrade - Opinie" />
        <div className="min-h-screen relative bg-darkbg">
          <Header />
          <main className="container mx-auto px-4 py-24">
            <div className="text-center">
              <h1 className="text-3xl font-bold mb-4 text-darktext">
                {t('testimonials.softwareIdRequired')}
              </h1>
              <button
                onClick={() => router.push('/')}
                className="btn-primary"
              >
                {t('testimonials.backToHome')}
              </button>
            </div>
          </main>
          <Footer />
        </div>
      </>
    )
  }

  return (
    <>
      <DynamicTitle 
        titleKey="home" 
        fallbackTitle={`${t('testimonials.pageTitle')} - FelizTrade`} 
      />
      <div className="min-h-screen relative bg-darkbg">
        <Header />
        <main className="container mx-auto px-4 py-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-2xl mx-auto"
          >
            {loading ? (
              <div className="text-center py-12">
                <div className="text-darksubtle">{t('common.loading')}</div>
              </div>
            ) : success ? (
              <div className="card text-center">
                <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                <h2 className="text-2xl font-bold mb-4 text-darktext">
                  {t('testimonials.successTitle')}
                </h2>
                <p className="text-darksubtle mb-6">
                  {t('testimonials.successMessage')}
                </p>
                <button
                  onClick={() => router.push('/')}
                  className="btn-primary"
                >
                  {t('testimonials.backToHome')}
                </button>
              </div>
            ) : (
              <div className="card">
                <h1 className="text-3xl font-bold mb-2 text-darktext">
                  {t('testimonials.pageTitle')}
                </h1>
                {software && (
                  <p className="text-darksubtle mb-6">
                    {t('testimonials.aboutSoftware')} {' '}
                    <span className="text-primary-400 font-semibold">
                      {language === 'en' && software.nameEn ? software.nameEn : software.name}
                    </span>
                  </p>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Imię */}
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-darktext mb-2">
                      {t('testimonials.formName')} <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="name"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-700 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-darkpanel text-darktext"
                      placeholder={language === 'en' ? 'John Doe' : 'Jan Kowalski'}
                    />
                  </div>

                  {/* Email (opcjonalnie) */}
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-darktext mb-2">
                      {t('testimonials.formEmail')}
                    </label>
                    <input
                      type="email"
                      id="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-700 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-darkpanel text-darktext"
                      placeholder={language === 'en' ? 'john@example.com' : 'jan@example.com'}
                    />
                  </div>

                  {/* Stanowisko (opcjonalnie) */}
                  <div>
                    <label htmlFor="position" className="block text-sm font-medium text-darktext mb-2">
                      {t('testimonials.formPosition')}
                    </label>
                    <input
                      type="text"
                      id="position"
                      value={formData.position}
                      onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-700 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-darkpanel text-darktext"
                      placeholder={language === 'en' ? 'CEO, Developer, etc.' : 'CEO, Programista, itp.'}
                    />
                  </div>

                  {/* Ocena gwiazdkami */}
                  <div>
                    <label className="block text-sm font-medium text-darktext mb-2">
                      {t('testimonials.formRating')} <span className="text-red-500">*</span>
                    </label>
                    <div className="flex gap-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setFormData({ ...formData, rating: star })}
                          onMouseEnter={() => setHoveredRating(star)}
                          onMouseLeave={() => setHoveredRating(0)}
                          className="focus:outline-none transition-transform hover:scale-110"
                        >
                          <Star
                            className={`w-10 h-10 ${
                              star <= (hoveredRating || formData.rating)
                                ? 'fill-yellow-400 text-yellow-400'
                                : 'text-gray-600'
                            }`}
                          />
                        </button>
                      ))}
                    </div>
                    <p className="text-sm text-darksubtle mt-2">
                      {t('testimonials.selectedRating')}: {formData.rating} {t('testimonials.ratingStars')}
                    </p>
                  </div>

                  {/* Komentarz */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label htmlFor="comment" className="block text-sm font-medium text-darktext">
                        {t('testimonials.formComment')} <span className="text-red-500">*</span>
                      </label>
                      <button
                        type="button"
                        onClick={handleGenerateSuggestions}
                        disabled={loadingSuggestions}
                        className="flex items-center gap-2 px-3 py-1 text-sm bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {loadingSuggestions ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            {language === 'en' ? 'Generating...' : 'Generuję...'}
                          </>
                        ) : (
                          <>
                            <Sparkles className="w-4 h-4" />
                            {language === 'en' ? 'AI Suggestions' : 'Sugestie AI'}
                          </>
                        )}
                      </button>
                    </div>

                    {/* Sugestie AI */}
                    <AnimatePresence>
                      {showSuggestions && suggestions.length > 0 && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="mb-4 space-y-2"
                        >
                          <p className="text-sm text-primary-400 font-medium">
                            {language === 'en' ? 'Click on a suggestion to use it:' : 'Kliknij na sugestię, aby jej użyć:'}
                          </p>
                          {suggestions.map((suggestion, index) => (
                            <motion.button
                              key={index}
                              type="button"
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: index * 0.1 }}
                              onClick={() => handleSelectSuggestion(suggestion)}
                              className="w-full text-left p-3 bg-darkbg border border-gray-700 rounded-lg hover:border-primary-500 hover:bg-darkpanel transition-all duration-200 group"
                            >
                              <div className="flex items-start gap-2">
                                <Sparkles className="w-4 h-4 text-purple-400 flex-shrink-0 mt-1 group-hover:text-primary-400 transition-colors" />
                                <p className="text-sm text-darktext group-hover:text-white transition-colors">{suggestion}</p>
                              </div>
                            </motion.button>
                          ))}
                          <button
                            type="button"
                            onClick={() => setShowSuggestions(false)}
                            className="text-xs text-darksubtle hover:text-primary-400 transition-colors"
                          >
                            {language === 'en' ? 'Hide suggestions' : 'Ukryj sugestie'}
                          </button>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    <textarea
                      id="comment"
                      required
                      rows={6}
                      value={formData.comment}
                      onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-700 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-darkpanel text-darktext resize-none"
                      placeholder={language === 'en' 
                        ? 'Share your experience with this software...'
                        : 'Podziel się swoim doświadczeniem z tym oprogramowaniem...'
                      }
                    />
                    <p className="text-xs text-darksubtle mt-1">
                      {t('testimonials.autoTranslateNote')}
                    </p>
                  </div>

                  {/* Przycisk wysyłania */}
                  <div className="flex justify-end gap-4">
                    <button
                      type="button"
                      onClick={() => router.push('/')}
                      className="px-6 py-3 border border-gray-700 rounded-lg text-darktext hover:bg-darkpanel transition-colors"
                    >
                      {t('testimonials.formCancel')}
                    </button>
                    <button
                      type="submit"
                      disabled={submitting}
                      className="btn-primary px-6 py-3 rounded-lg flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {submitting ? (
                        <>
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                          {t('testimonials.formSubmitting')}
                        </>
                      ) : (
                        <>
                          <Send className="w-5 h-5" />
                          {t('testimonials.formSubmit')}
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            )}
          </motion.div>
        </main>
        <Footer />
      </div>
    </>
  )
}
