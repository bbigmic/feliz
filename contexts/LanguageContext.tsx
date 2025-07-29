'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { Language, getTranslation } from '@/lib/i18n'

interface LanguageContextType {
  language: Language
  changeLanguage: (newLanguage: Language) => void
  t: (key: string) => string
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>('pl')

  useEffect(() => {
    // 1. Sprawdź localStorage (priorytet dla użytkownika)
    const savedLanguage = localStorage.getItem('language') as Language
    if (savedLanguage && (savedLanguage === 'pl' || savedLanguage === 'en')) {
      setLanguage(savedLanguage)
      return
    }

    // 2. Wykryj język systemu/przeglądarki
    const detectSystemLanguage = (): Language => {
      // Sprawdź navigator.language (język przeglądarki)
      if (typeof window !== 'undefined' && window.navigator) {
        const browserLang = window.navigator.language.toLowerCase()
        
        // Sprawdź czy język przeglądarki to angielski
        if (browserLang.startsWith('en')) {
          return 'en'
        }
        
        // Sprawdź czy język przeglądarki to polski
        if (browserLang.startsWith('pl')) {
          return 'pl'
        }
      }

      // Sprawdź navigator.languages (lista preferowanych języków)
      if (typeof window !== 'undefined' && window.navigator && window.navigator.languages) {
        for (const lang of window.navigator.languages) {
          const langLower = lang.toLowerCase()
          if (langLower.startsWith('en')) {
            return 'en'
          }
          if (langLower.startsWith('pl')) {
            return 'pl'
          }
        }
      }

      // Domyślnie polski
      return 'pl'
    }

    const detectedLanguage = detectSystemLanguage()
    setLanguage(detectedLanguage)
    
    // Zapisz wykryty język do localStorage (tylko jeśli nie ma zapisanego)
    if (!savedLanguage) {
      localStorage.setItem('language', detectedLanguage)
    }
  }, [])

  const changeLanguage = (newLanguage: Language) => {
    setLanguage(newLanguage)
    localStorage.setItem('language', newLanguage)
  }

  const t = (key: string): string => {
    return getTranslation(language, key)
  }

  return (
    <LanguageContext.Provider value={{ language, changeLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider')
  }
  return context
} 