'use client'

import { motion } from 'framer-motion'
import { useLanguage } from '@/contexts/LanguageContext'

interface PreloaderProps {
  isLoading: boolean
}

export default function Preloader({ isLoading }: PreloaderProps) {
  const { t, language } = useLanguage()
  
  return (
    <motion.div
      initial={{ opacity: 1 }}
      animate={{ 
        opacity: isLoading ? 1 : 0,
        scale: isLoading ? 1 : 0.95
      }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8, ease: "easeInOut" }}
      className={`fixed inset-0 z-[9999] bg-darkbg flex flex-col items-center justify-center ${
        isLoading ? 'pointer-events-auto' : 'pointer-events-none'
      }`}
    >
      {/* Logo */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ 
          opacity: isLoading ? 1 : 0, 
          y: isLoading ? 0 : -20 
        }}
        transition={{ duration: 0.8, delay: isLoading ? 0.2 : 0 }}
        className="flex items-center space-x-3 mb-8"
      >
        <img 
          src="/logo-wsp-edu.png" 
          alt="FelizTrade Logo" 
          className="w-12 h-12 object-contain"
        />
        <span className="text-2xl font-bold text-white">FelizTrade</span>
      </motion.div>

      {/* Spinner */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ 
          opacity: isLoading ? 1 : 0, 
          scale: isLoading ? 1 : 0.8 
        }}
        transition={{ duration: 0.5, delay: isLoading ? 0.5 : 0 }}
        className="relative"
      >
        <div className="w-16 h-16 border-4 border-primary-600 border-t-transparent rounded-full animate-spin"></div>
      </motion.div>

      {/* Loading text */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: isLoading ? 1 : 0 }}
        transition={{ duration: 0.5, delay: isLoading ? 0.8 : 0 }}
        className="mt-6 text-gray-300 text-lg"
      >
        {t('preloader.loading')}
      </motion.p>

      {/* Progress bar */}
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: isLoading ? "60%" : "0%" }}
        transition={{ duration: isLoading ? 2 : 0.3, delay: isLoading ? 1 : 0 }}
        className="mt-4 w-64 h-1 bg-gray-700 rounded-full overflow-hidden"
      >
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: isLoading ? "100%" : "0%" }}
          transition={{ duration: isLoading ? 2 : 0.3, delay: isLoading ? 1 : 0 }}
          className="h-full bg-gradient-to-r from-primary-500 to-primary-600"
        />
      </motion.div>
    </motion.div>
  )
} 