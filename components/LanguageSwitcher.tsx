'use client'

import { useLanguage } from '@/contexts/LanguageContext'
import { Language } from '@/lib/i18n'

export default function LanguageSwitcher() {
  const { language, changeLanguage } = useLanguage()

  const languages: { code: Language; name: string; flag: string }[] = [
    { code: 'pl', name: 'Polski', flag: '🇵🇱' },
    { code: 'en', name: 'English', flag: '🇬🇧' }
  ]

  return (
    <div className="flex items-center space-x-2">
      {languages.map((lang) => (
        <button
          key={lang.code}
          onClick={() => changeLanguage(lang.code)}
          className={`flex items-center space-x-1 px-2 py-1 rounded-md transition-colors ${
            language === lang.code
              ? 'bg-primary-600 text-white'
              : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
          }`}
          title={lang.name}
        >
          <span className="text-sm">{lang.flag}</span>
          <span className="text-xs font-medium">{lang.code.toUpperCase()}</span>
        </button>
      ))}
    </div>
  )
} 