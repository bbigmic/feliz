'use client'

import { CheckCircle, ArrowLeft, Mail, Phone } from 'lucide-react'
import Link from 'next/link'
import { motion } from 'framer-motion'

export default function LeadSuccessPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-darkbg via-darkpanel to-darkbg flex flex-col items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="max-w-2xl w-full"
      >
        {/* Główna karta sukcesu */}
        <div className="bg-darkpanel rounded-2xl shadow-2xl p-8 md:p-12 border border-gray-800 text-center">
          {/* Ikona sukcesu */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="mb-6"
          >
            <div className="w-24 h-24 mx-auto bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center">
              <CheckCircle className="w-14 h-14 text-white" />
            </div>
          </motion.div>

          {/* Tytuł */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-3xl md:text-4xl font-bold text-darktext mb-4"
          >
            Zapytanie zostało wysłane!
          </motion.h1>

          {/* Opis */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-lg text-darksubtle mb-8 max-w-lg mx-auto"
          >
            Dziękujemy za zainteresowanie naszymi usługami. Nasz zespół skontaktuje się z Tobą w przeciągu <span className="text-primary-500 font-semibold">3 dni roboczych</span>, aby omówić szczegóły Twojego projektu.
          </motion.p>

          {/* Informacje o dalszych krokach */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-darkbg rounded-xl p-6 mb-8 border border-gray-700"
          >
            <h2 className="text-xl font-semibold text-darktext mb-4">Co dalej?</h2>
            <div className="space-y-4 text-left">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                  1
                </div>
                <p className="text-darksubtle text-sm pt-1">
                  Nasz konsultant sprawdzi Twoje zapytanie i przygotuje wstępną ofertę
                </p>
              </div>
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                  2
                </div>
                <p className="text-darksubtle text-sm pt-1">
                  Skontaktujemy się z Tobą telefonicznie lub emailem w przeciągu 3 dni roboczych
                </p>
              </div>
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                  3
                </div>
                <p className="text-darksubtle text-sm pt-1">
                  Umówimy się na spotkanie, aby szczegółowo omówić Twój projekt
                </p>
              </div>
            </div>
          </motion.div>

          {/* Dodatkowe informacje kontaktowe */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 border border-blue-500/30 rounded-xl p-6 mb-8"
          >
            <p className="text-sm text-darksubtle mb-3">
              Masz pilne pytanie? Skontaktuj się z nami:
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="mailto:contact@feliztradeltd.com"
                className="inline-flex items-center gap-2 text-blue-400 hover:text-blue-300 transition-colors"
              >
                <Mail className="w-4 h-4" />
                <span className="text-sm">contact@feliztradeltd.com</span>
              </a>
              <a
                href="tel:+48502600739"
                className="inline-flex items-center gap-2 text-blue-400 hover:text-blue-300 transition-colors"
              >
                <Phone className="w-4 h-4" />
                <span className="text-sm">+48 502 600 739</span>
              </a>
            </div>
          </motion.div>

          {/* Przyciski akcji */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link
              href="/"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-semibold transition-all"
            >
              <ArrowLeft className="w-4 h-4" />
              Powrót do strony głównej
            </Link>
          </motion.div>
        </div>

        {/* Logo na dole */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-8 text-center"
        >
          <div className="flex items-center justify-center gap-3 text-darksubtle">
            <img src="/logo-wsp-edu.png" alt="Logo" className="w-8 h-8 object-contain" />
            <span className="font-semibold">FelizTrade</span>
          </div>
        </motion.div>
      </motion.div>
    </div>
  )
}
