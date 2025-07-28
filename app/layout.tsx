import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Toaster } from 'react-hot-toast'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'FelizTrade - Platforma Sprzedaży Oprogramowań WWW',
  description: 'Profesjonalna platforma do sprzedaży oprogramowań WWW z automatycznym systemem demo',
  keywords: 'oprogramowanie, aplikacje web, sprzedaż, demo, proxy',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pl" className="dark" translate="yes">
      <head>
        <title>Budowanie aplikacji | FelizTrade - Platforma Sprzedaży Oprogramowań WWW</title>
        <meta name="description" content="Budowanie aplikacji - Profesjonalna platforma do sprzedaży oprogramowań WWW z automatycznym systemem demo" />
        <meta name="keywords" content="budowanie aplikacji, oprogramowanie, aplikacje web, sprzedaż, demo, proxy" />
        <meta property="og:title" content="Budowanie aplikacji | FelizTrade" />
        <meta property="og:description" content="Budowanie aplikacji - Profesjonalna platforma do sprzedaży oprogramowań WWW z automatycznym systemem demo" />
        <meta property="og:type" content="website" />
        <meta property="og:locale" content="pl_PL" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" type="image/x-icon" />
      </head>
      <body className={inter.className} translate="yes">
        <Toaster position="top-right" />
        {children}
      </body>
    </html>
  )
} 