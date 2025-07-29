'use client'

import { motion } from 'framer-motion'
import { Mail, Phone, MapPin, Globe, Github, Linkedin } from 'lucide-react'
import { usePathname, useRouter } from 'next/navigation'
import { useLanguage } from '@/contexts/LanguageContext'

export default function Footer() {
  const { t } = useLanguage()
  const pathname = usePathname();
  const router = useRouter();

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
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="md:col-span-2"
          >
            <div className="flex items-center space-x-2 mb-4">
              <img 
                src="/logo-wsp-edu.png" 
                alt="FelizTrade Logo" 
                className="w-8 h-8 object-contain"
              />
              <span className="text-xl font-bold" translate="no">FelizTrade</span>
            </div>
            <p className="text-gray-300 mb-4 max-w-md">
              {t('footer.description')}
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Globe className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Github className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Linkedin className="w-5 h-5" />
              </a>
            </div>
          </motion.div>

          {/* Quick Links */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <h3 className="text-lg font-semibold mb-4">{t('footer.quickLinks')}</h3>
            <ul className="space-y-2">
              <li>
                <a href="/" className="text-gray-300 hover:text-white transition-colors">
                  {t('header.home')}
                </a>
              </li>
              <li>
                <a href="#main-content" className="text-gray-300 hover:text-white transition-colors" onClick={handleNavScroll('main-content')}>
                  {t('header.software')}
                </a>
              </li>
              <li>
                <a href="#pricing" className="text-gray-300 hover:text-white transition-colors" onClick={handleNavScroll('pricing')}>
                  {t('header.pricing')}
                </a>
              </li>
              <li>
                <a href="#cta-section" className="text-gray-300 hover:text-white transition-colors" onClick={handleNavScroll('cta-section')}>
                  {t('header.contact')}
                </a>
              </li>
            </ul>
          </motion.div>

          {/* Contact Info */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h3 className="text-lg font-semibold mb-4">{t('footer.contact')}</h3>
            <ul className="space-y-3">
              <li className="flex items-center space-x-2">
                <Mail className="w-4 h-4 text-gray-400" />
                <span className="text-gray-300" translate="no">FelizTradeLTD@proton.me</span>
              </li>
              <li className="flex items-center space-x-2">
                <Phone className="w-4 h-4 text-gray-400" />
                <span className="text-gray-300" translate="no">+48 502 600 739</span>
              </li>
              <li className="flex items-center space-x-2">
                <MapPin className="w-4 h-4 text-gray-400" />
                <span className="text-gray-300" translate="yes">Preston Lancashire, United Kingdom</span>
              </li>
            </ul>
          </motion.div>
        </div>

        {/* Bottom Bar */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="border-t border-gray-800 mt-8 pt-8 text-center"
        >
          <p className="text-gray-400">
            © 2025 <span translate="no">FelizTrade</span>. <span>{t('footer.allRightsReserved')}</span>
          </p>
        </motion.div>
      </div>
    </footer>
  )
} 