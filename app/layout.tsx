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
    <html lang="pl" className="dark">
      <body className={inter.className}>
        <Toaster position="top-right" />
        {children}
      </body>
    </html>
  )
} 