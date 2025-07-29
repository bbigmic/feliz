'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Menu, X, ShoppingCart, User } from 'lucide-react'
import AuthModal from './AuthModal'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import LanguageSwitcher from './LanguageSwitcher'
import { useLanguage } from '@/contexts/LanguageContext'

export default function Header() {
  const { t } = useLanguage()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [isAuthOpen, setIsAuthOpen] = useState(false)
  const [user, setUser] = useState<{ email: string } | null>(null)

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 10)
    }
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch('/api/auth/me')
        const data = await res.json()
        if (data.user && data.user.email) {
          setUser({ email: data.user.email })
        } else {
          setUser(null)
        }
      } catch {
        setUser(null)
      }
    }
    fetchUser()
  }, [isAuthOpen]) // odśwież po zamknięciu modala

  const pathname = usePathname();
  const router = useRouter();

  // Funkcja do obsługi przewijania lub przekierowania
  const handleNavScroll = (sectionId: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    if (pathname === '/') {
      const el = document.getElementById(sectionId);
      const header = document.querySelector('header');
      let offset = 0;
      if (header) offset = header.getBoundingClientRect().height;
      if (el) {
        const top = el.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    } else {
      router.push('/#' + sectionId);
    }
  };

  return (
    <header className={`shadow-sm border-b border-transparent fixed top-0 left-0 w-full z-50 transition-all duration-300 ${scrolled ? 'backdrop-blur-md bg-darkbg/70' : ''}`}>
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center space-x-2 cursor-pointer"
          >
            <Link href="/" className="flex items-center space-x-2">
              <img src="/logo-wsp-edu.png" alt="Logo" className="w-10 h-10 object-contain" />
              <span className="text-xl font-bold text-darktext" translate="no">FelizTrade</span>
            </Link>
          </motion.div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link href="/" className="text-darktext hover:text-primary-300 transition-colors">
              {t('header.home')}
            </Link>
            <a href="#main-content" className="text-darktext hover:text-primary-300 transition-colors" onClick={handleNavScroll('main-content')}>
              {t('header.software')}
            </a>
            <a href="#pricing" className="text-darktext hover:text-primary-300 transition-colors" onClick={handleNavScroll('pricing')}>
              {t('header.pricing')}
            </a>
            <a href="#cta-section" className="text-darktext hover:text-primary-300 transition-colors" onClick={handleNavScroll('cta-section')}>
              {t('header.contact')}
            </a>
          </nav>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center space-x-4">
            <LanguageSwitcher />
          </div>

          {/* Mobile Actions */}
          <div className="md:hidden flex items-center space-x-2">
            <LanguageSwitcher />
          <button
              className="p-2 text-darktext"
              aria-label={isMenuOpen ? t('header.closeMenu') : t('header.openMenu')}
            aria-expanded={isMenuOpen}
            aria-controls="mobile-menu"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20, height: 0 }}
            animate={{ opacity: 1, y: 0, height: 'auto' }}
            exit={{ opacity: 0, y: -20, height: 0 }}
            transition={{ duration: 0.25 }}
            id="mobile-menu"
            className="md:hidden overflow-hidden border-t border-gray-800 bg-darkpanel/95 rounded-b-2xl shadow-2xl px-4 py-6 mt-2 mx-[-1rem] sm:mx-0"
          >
            <nav className="flex flex-col gap-5">
              <a href="#" className="text-lg font-semibold text-darktext rounded-xl px-4 py-3 hover:bg-primary-600/20 hover:text-primary-300 transition-all duration-150 active:bg-primary-700/30" onClick={() => setIsMenuOpen(false)}>
                {t('header.home')}
              </a>
              <a href="#main-content" className="text-lg font-semibold text-darktext rounded-xl px-4 py-3 hover:bg-primary-600/20 hover:text-primary-300 transition-all duration-150 active:bg-primary-700/30" onClick={e => { setIsMenuOpen(false); setTimeout(() => handleNavScroll('main-content')(e), 200); }}>
                {t('header.software')}
              </a>
              <a href="#pricing" className="text-lg font-semibold text-darktext rounded-xl px-4 py-3 hover:bg-primary-600/20 hover:text-primary-300 transition-all duration-150 active:bg-primary-700/30" onClick={e => { setIsMenuOpen(false); setTimeout(() => handleNavScroll('pricing')(e), 200); }}>
                {t('header.pricing')}
              </a>
              <a href="#cta-section" className="text-lg font-semibold text-darktext rounded-xl px-4 py-3 hover:bg-primary-600/20 hover:text-primary-300 transition-all duration-150 active:bg-primary-700/30" onClick={e => { setIsMenuOpen(false); setTimeout(() => handleNavScroll('cta-section')(e), 200); }}>
                {t('header.contact')}
              </a>
              <div className="pt-2 border-t border-gray-800">
                  {/* <button className="flex items-center space-x-2 text-darktext hover:text-primary-300 transition-colors mb-2">
                    <ShoppingCart className="w-5 h-5" />
                    <span>Koszyk</span>
                  </button> */}
                  {user ? (
                    <div className="flex items-center gap-3 mt-2">
                      <span className="flex items-center justify-center w-10 h-10 rounded-full bg-primary-700/80 text-white font-bold text-lg"><User className="w-6 h-6" /></span>
                      <span className="text-darktext font-medium text-base truncate max-w-[120px]">{user.email}</span>
                      <button
                        className="ml-auto btn-primary px-4 py-2 rounded-lg text-sm font-semibold"
                        onClick={() => {
                          document.cookie = 'token=; Max-Age=0; path=/;'
                          setUser(null)
                          setIsMenuOpen(false)
                        }}
                      >{t('header.logout')}</button>
                    </div>
                  ) : (
                    <button className="btn-primary w-full py-3 text-lg rounded-xl mt-2" onClick={() => { setIsAuthOpen(true); setIsMenuOpen(false); }}>
                      {t('header.login')}
                    </button>
                  )}
                </div>
              </nav>
          </motion.div>
        )}
      </div>
      {/* <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} onAuthSuccess={fetchUser} /> */}
    </header>
  )
} 