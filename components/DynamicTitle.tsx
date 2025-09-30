"use client"

import { useEffect } from 'react'
import { useLanguage } from '@/contexts/LanguageContext'

interface DynamicTitleProps {
  titleKey: string
  fallbackTitle?: string
}

export default function DynamicTitle({ titleKey, fallbackTitle }: DynamicTitleProps) {
  const { t, language } = useLanguage()
  
  useEffect(() => {
    const title = t(`pageTitles.${titleKey}`) || fallbackTitle || 'FelizTrade'
    document.title = title
  }, [titleKey, fallbackTitle, t, language])
  
  return null // Ten komponent nie renderuje nic wizualnie
} 