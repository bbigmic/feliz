'use client'

import { useState, useEffect, Suspense } from 'react'
import { motion } from 'framer-motion'
import { Menu, X, ShoppingCart, User, ChevronDown, Settings, Package } from 'lucide-react'
import AuthModal from './AuthModal'
import Link from 'next/link'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import LanguageSwitcher from './LanguageSwitcher'
import { useLanguage } from '@/contexts/LanguageContext'

function HeaderContent() {
  const { t } = useLanguage()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [isAuthOpen, setIsAuthOpen] = useState(false)
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)
  const [user, setUser] = useState<{ email: string; role: string; isAdmin: boolean; profileImageUrl?: string | null } | null>(null)
  const searchParams = useSearchParams()
  const [referrerId, setReferrerId] = useState<number | undefined>(undefined)

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 10)
    }
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Zamknij dropdown przy kliknięciu poza nim
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement
      if (isUserMenuOpen && !target.closest('.user-menu-container')) {
        setIsUserMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [isUserMenuOpen])

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch('/api/auth/me')
        const data = await res.json()
        if (data.user && data.user.email) {
          setUser({ 
            email: data.user.email, 
            role: data.user.role || 'user', 
            isAdmin: data.user.isAdmin || false,
            profileImageUrl: data.user.profileImageUrl || null
          })
        } else {
          setUser(null)
        }
      } catch {
        setUser(null)
      }
    }
    fetchUser()
  }, [isAuthOpen]) // odśwież po zamknięciu modala

  // Sprawdź parametr ref z URL
  useEffect(() => {
    const ref = searchParams.get('ref')
    if (ref) {
      const refId = parseInt(ref)
      if (!isNaN(refId)) {
        setReferrerId(refId)
      }
    }
  }, [searchParams])

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
            <div className="flex flex-col">
              {user && (user.role === 'seller' || user.role === 'management' || user.isAdmin) && (
                <Link href="/seller-panel" className="text-darktext hover:text-primary-300 transition-colors">
                  Panel Sprzedawcy
                </Link>
              )}
              {user && user.isAdmin && (
                <Link href="/admin" className="text-darktext hover:text-primary-300 transition-colors">
                  Panel Admin
                </Link>
              )}
            </div>
            {user ? (
              <div className="relative user-menu-container">
                <button 
                  className="flex items-center gap-3 hover:opacity-80 transition-opacity"
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                >
                  {user.profileImageUrl ? (
                    <img 
                      src={user.profileImageUrl} 
                      alt="Avatar" 
                      className="w-8 h-8 rounded-full object-cover border-2 border-primary-600"
                    />
                  ) : (
                    <span className="flex items-center justify-center w-8 h-8 rounded-full bg-primary-700 text-white font-bold text-sm">
                      <User className="w-4 h-4" />
                    </span>
                  )}
                  <span className="text-darktext font-medium text-sm max-w-[120px] truncate">{user.email}</span>
                  <ChevronDown className={`w-4 h-4 text-darktext transition-transform ${isUserMenuOpen ? 'rotate-180' : ''}`} />
                </button>
                
                {/* Dropdown Menu */}
                {isUserMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="absolute right-0 mt-2 w-48 bg-darkpanel border border-gray-700 rounded-lg shadow-xl py-2 z-50"
                  >
                    <Link 
                      href="/profile" 
                      className="flex items-center gap-2 px-4 py-2 text-darktext hover:bg-primary-600/20 transition-colors"
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      <Settings className="w-4 h-4" />
                      <span>Profil</span>
                    </Link>
                    <Link 
                      href="/my-orders" 
                      className="flex items-center gap-2 px-4 py-2 text-darktext hover:bg-primary-600/20 transition-colors"
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      <Package className="w-4 h-4" />
                      <span>Zamówienia</span>
                    </Link>
                    <div className="border-t border-gray-700 my-2"></div>
                    <button
                      className="flex items-center gap-2 px-4 py-2 text-red-400 hover:bg-red-600/20 transition-colors w-full text-left"
                      onClick={() => {
                        document.cookie = 'token=; Max-Age=0; path=/;'
                        setUser(null)
                        setIsUserMenuOpen(false)
                      }}
                    >
                      <X className="w-4 h-4" />
                      <span>{t('header.logout')}</span>
                    </button>
                  </motion.div>
                )}
              </div>
            ) : (
              <button className="btn-primary" onClick={() => setIsAuthOpen(true)}>
                {t('header.login')}
              </button>
            )}
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
              
              {/* Panel links for authorized users */}
              {user && (user.role === 'seller' || user.role === 'management' || user.isAdmin) && (
                <Link 
                  href="/seller-panel" 
                  className="text-lg font-semibold text-darktext rounded-xl px-4 py-3 hover:bg-primary-600/20 hover:text-primary-300 transition-all duration-150 active:bg-primary-700/30"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Panel Sprzedawcy
                </Link>
              )}
              {user && user.isAdmin && (
                <Link 
                  href="/admin" 
                  className="text-lg font-semibold text-darktext rounded-xl px-4 py-3 hover:bg-primary-600/20 hover:text-primary-300 transition-all duration-150 active:bg-primary-700/30"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Panel Admin
                </Link>
              )}
              
              {/* User menu for all logged in users */}
              {user && (
                <>
                  <div className="border-t border-gray-800 my-2"></div>
                  <Link 
                    href="/profile" 
                    className="flex items-center gap-2 text-lg font-semibold text-darktext rounded-xl px-4 py-3 hover:bg-primary-600/20 hover:text-primary-300 transition-all duration-150 active:bg-primary-700/30"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <Settings className="w-5 h-5" />
                    <span>Profil</span>
                  </Link>
                  <Link 
                    href="/my-orders" 
                    className="flex items-center gap-2 text-lg font-semibold text-darktext rounded-xl px-4 py-3 hover:bg-primary-600/20 hover:text-primary-300 transition-all duration-150 active:bg-primary-700/30"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <Package className="w-5 h-5" />
                    <span>Zamówienia</span>
                  </Link>
                </>
              )}
              
              <div className="pt-2 border-t border-gray-800">
                  {/* <button className="flex items-center space-x-2 text-darktext hover:text-primary-300 transition-colors mb-2">
                    <ShoppingCart className="w-5 h-5" />
                    <span>Koszyk</span>
                  </button> */}
                  {user ? (
                    <div className="flex items-center gap-3 mt-2">
                      {user.profileImageUrl ? (
                        <img 
                          src={user.profileImageUrl} 
                          alt="Avatar" 
                          className="w-10 h-10 rounded-full object-cover border-2 border-primary-600"
                        />
                      ) : (
                        <span className="flex items-center justify-center w-10 h-10 rounded-full bg-primary-700/80 text-white font-bold text-lg">
                          <User className="w-6 h-6" />
                        </span>
                      )}
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
      <AuthModal 
        isOpen={isAuthOpen} 
        onClose={() => setIsAuthOpen(false)} 
        onAuthSuccess={() => { setIsAuthOpen(false); window.location.reload(); }} 
        referrerId={referrerId}
      />
    </header>
  )
}

export default function Header() {
  return (
    <Suspense fallback={
      <header className="shadow-sm border-b border-transparent fixed top-0 left-0 w-full z-50 backdrop-blur-md bg-darkbg/70">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-2">
              <img src="/logo-wsp-edu.png" alt="Logo" className="w-10 h-10 object-contain" />
              <span className="text-xl font-bold text-darktext">FelizTrade</span>
            </div>
          </div>
        </div>
      </header>
    }>
      <HeaderContent />
    </Suspense>
  )
} 