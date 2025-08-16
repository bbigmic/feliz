"use client"

import { useEffect } from 'react'
import { useLanguage } from '@/contexts/LanguageContext'

export default function DynamicHtmlLang() {
  const { language } = useLanguage()
  
  useEffect(() => {
    const htmlElement = document.documentElement
    if (htmlElement) {
      htmlElement.lang = language === 'en' ? 'en' : 'pl'
    }
  }, [language])
  
  return null // Ten komponent nie renderuje nic wizualnie
} 