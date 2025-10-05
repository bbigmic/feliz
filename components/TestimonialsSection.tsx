'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Star, Quote } from 'lucide-react'
import { useLanguage } from '@/contexts/LanguageContext'

interface Testimonial {
  id: number
  name: string
  position: string | null
  positionEn: string | null
  rating: number
  comment: string
  commentEn: string | null
  createdAt: string
  software: {
    id: number
    name: string
    nameEn: string | null
  }
}

export default function TestimonialsSection() {
  const { t, language } = useLanguage()
  const [testimonials, setTestimonials] = useState<Testimonial[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/testimonials?limit=3')
      .then(res => res.json())
      .then(data => {
        if (data.testimonials) {
          setTestimonials(data.testimonials)
        }
        setLoading(false)
      })
      .catch(() => {
        setLoading(false)
      })
  }, [])

  if (loading) {
    return (
      <section className="container mx-auto px-4 py-16">
        <div className="text-center text-darksubtle">
          {t('testimonials.loadingReviews')}
        </div>
      </section>
    )
  }

  if (testimonials.length === 0) {
    return null // Nie pokazuj sekcji jeśli nie ma opinii
  }

  return (
    <section className="container mx-auto px-4 py-16 mb-12">
      <div className="text-center mb-12">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-4xl font-bold mb-4 bg-gradient-to-r from-primary-400 to-primary-600 bg-clip-text text-transparent"
        >
          {t('testimonials.sectionTitle')}
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="text-lg text-darksubtle max-w-2xl mx-auto"
        >
          {t('testimonials.sectionSubtitle')}
        </motion.p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {testimonials.map((testimonial, index) => (
          <motion.div
            key={testimonial.id}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
            className="bg-darkpanel rounded-2xl p-6 border border-gray-800 shadow-xl hover:shadow-2xl hover:border-primary-600/50 transition-all duration-300"
          >
            {/* Ikona cytatu */}
            <div className="flex justify-between items-start mb-4">
              <Quote className="w-8 h-8 text-primary-500/30" />
              <div className="flex gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${
                      i < testimonial.rating
                        ? 'fill-yellow-400 text-yellow-400'
                        : 'text-gray-600'
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Komentarz */}
            <p className="text-darktext mb-4 leading-relaxed italic">
              "{language === 'en' && testimonial.commentEn 
                ? testimonial.commentEn 
                : testimonial.comment}"
            </p>

            {/* Separator */}
            <div className="border-t border-gray-800 my-4"></div>

            {/* Autor i oprogramowanie */}
            <div>
              <p className="text-white font-semibold">{testimonial.name}</p>
              {(testimonial.position || testimonial.positionEn) && (
                <p className="text-sm text-darksubtle italic">
                  {language === 'en' && testimonial.positionEn 
                    ? testimonial.positionEn 
                    : testimonial.position}
                </p>
              )}
              <p className="text-sm text-darksubtle">
                {language === 'en' && testimonial.software.nameEn
                  ? testimonial.software.nameEn
                  : testimonial.software.name}
              </p>
            </div>
          </motion.div>
        ))}
      </div>

    </section>
  )
}
