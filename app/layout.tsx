import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Toaster } from 'react-hot-toast'
import { LanguageProvider } from '@/contexts/LanguageContext'
import DynamicHtmlLang from '@/components/DynamicHtmlLang'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'FelizTrade - Platforma Sprzedaży Oprogramowań WWW',
  description: 'Profesjonalna platforma do sprzedaży oprogramowań WWW z automatycznym systemem demo',
  keywords: 'oprogramowanie, aplikacje web, sprzedaż, demo, sklep internetowy, cpm, monetyzacja, budowanie aplikacji',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html className="dark" translate="yes">
      <head>
        <meta name="description" content="Profesjonalna platforma do zakupu oprogramowań" />
        <meta name="keywords" content="oprogramowanie, aplikacje web, sprzedaż, demo, sklep internetowy, cpm, monetyzacja, budowanie aplikacji" />
        <meta property="og:title" content="FelizTrade - Platforma Sprzedaży Oprogramowań" />
        <meta property="og:description" content="Profesjonalna platforma do zakupu oprogramowań" />
        <meta property="og:type" content="website" />
        <meta property="og:locale" content="pl_PL" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" type="image/x-icon" />
      </head>
      <body className={inter.className} translate="yes">
        <Toaster position="top-right" />
        <LanguageProvider>
          <DynamicHtmlLang />
          {children}
        </LanguageProvider>
      </body>
    </html>
  )
} 