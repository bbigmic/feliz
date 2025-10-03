'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { 
  BarChart3, 
  Users, 
  Package, 
  TrendingUp,
  Mail,
  Phone,
  Calendar,
  DollarSign,
  Eye,
  Filter,
  Search,
  Plus,
  Edit
} from 'lucide-react'
import toast from 'react-hot-toast'
import AuthModal from '@/components/AuthModal'
import Link from 'next/link'

// Funkcja generująca reflink dla leadów
const generateReflink = (sellerId: number) => {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'
  return `${baseUrl}/lead?ref=${sellerId}`
}

// Funkcja generująca reflink dla rejestracji nowych sprzedawców
const generateSellerReflink = (sellerId: number) => {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'
  return `${baseUrl}/register?ref=${sellerId}`
}

// Funkcja kopiująca reflink do schowka
const copyReflinkToClipboard = (reflink: string, type: 'lead' | 'seller' = 'lead') => {
  navigator.clipboard.writeText(reflink)
  const message = type === 'seller' 
    ? 'Reflink rejestracji sprzedawców skopiowany do schowka!' 
    : 'Reflink skopiowany do schowka!'
  toast.success(message)
}

export default function SellerPanel() {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'orders' | 'leads' | 'statistics' | 'network'>('dashboard')
  const [orders, setOrders] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [expandedOrderId, setExpandedOrderId] = useState<number | null>(null)
  const [authChecked, setAuthChecked] = useState(false)
  const [showLogin, setShowLogin] = useState(false)
  const [user, setUser] = useState<{ id: number; email: string; role: string; isAdmin: boolean } | null>(null)
  const [statistics, setStatistics] = useState<any>(null)
  const [loadingStatistics, setLoadingStatistics] = useState(false)
  const [orderFilter, setOrderFilter] = useState<'all' | 'pending' | 'paid'>('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [leads, setLeads] = useState<any[]>([])
  const [loadingLeads, setLoadingLeads] = useState(false)
  const [isAddLeadModalOpen, setIsAddLeadModalOpen] = useState(false)
  const [editLead, setEditLead] = useState<any>(null)
  const [isEditLeadModalOpen, setIsEditLeadModalOpen] = useState(false)
  const [leadSearchTerm, setLeadSearchTerm] = useState('')
  const [leadStatusFilter, setLeadStatusFilter] = useState<'all' | 'pending' | 'first_payment' | 'second_payment' | 'paid' | 'rejected'>('all')
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false)
  const [categories, setCategories] = useState<string[]>([])
  const [softwares, setSoftwares] = useState<any[]>([])
  const [showSoftwareTemplate, setShowSoftwareTemplate] = useState(false)
  const [showLevelAnimation, setShowLevelAnimation] = useState(true)
  const [referralStats, setReferralStats] = useState<{ totalReferrals: number, sellerReferrals: number }>({ totalReferrals: 0, sellerReferrals: 0 })
  const [referredUsers, setReferredUsers] = useState<any[]>([])
  const [loadingReferrals, setLoadingReferrals] = useState(false)
  const [expandedUserId, setExpandedUserId] = useState<number | null>(null)
  const [userOrders, setUserOrders] = useState<any[]>([])
  const [loadingUserOrders, setLoadingUserOrders] = useState(false)
  const [expandedLeadId, setExpandedLeadId] = useState<number | null>(null)

  // Funkcja pomocnicza do obliczania prowizji dla zamówienia
  const calculateOrderCommission = (order: any) => {
    if (order.status !== 'paid' || !order.commissionRate || !order.sellerId) {
      return 0
    }

    let price = 0
    if (order.orderType === 'consultation') {
      price = 200 // 200 PLN za konsultację
    } else if (order.orderType === 'collaboration' && order.software) {
      price = Math.round((order.software.price || 0) * 0.3) // 30% ceny za współpracę
    } else if (order.orderType === 'code' && order.software) {
      price = order.software.price || 0 // 100% ceny za kod
    }
    
    return Math.round(price * order.commissionRate)
  }

  // Sprawdzenie autoryzacji
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch('/api/auth/me')
        const data = await res.json()
        
        if (data.user && (data.user.role === 'seller' || data.user.role === 'management' || data.user.isAdmin)) {
          setUser(data.user)
          setShowLogin(false)
        } else {
          setUser(null)
          setShowLogin(true)
        }
      } catch (e) {
        setUser(null)
        setShowLogin(true)
      } finally {
        setAuthChecked(true)
      }
    }
    checkAuth()
  }, [])

  // Pobieranie zamówień
  const fetchOrders = async () => {
    setLoading(true)
    try {
      const res = await fetch(`/api/orders?sellerId=${user?.id}`)
      const data = await res.json()
      setOrders(data.orders || [])
    } catch (error) {
      console.error('Błąd pobierania zamówień:', error)
      toast.error('Błąd pobierania zamówień')
    } finally {
      setLoading(false)
    }
  }

  // Pobieranie statystyk
  const fetchStatistics = async () => {
    setLoadingStatistics(true)
    try {
      const res = await fetch('/api/seller/statistics')
      const data = await res.json()
      setStatistics(data)
      
      // Pobierz statystyki poleceń
      if (user) {
        const referralsRes = await fetch(`/api/seller/referrals`)
        const referralsData = await referralsRes.json()
        if (referralsData.success) {
          setReferralStats({
            totalReferrals: referralsData.totalReferrals || 0,
            sellerReferrals: referralsData.sellerReferrals || 0
          })
        }
      }
      
      // Animacja tylko dla dokładnie poziomów 15, 20 i 25
      if (data.sellerLevel && [15, 20, 25].includes(data.sellerLevel)) {
        setShowLevelAnimation(true)
        // Po 5 sekundach ukryj animację
        setTimeout(() => {
          setShowLevelAnimation(false)
        }, 5000)
      }
    } catch (error) {
      console.error('Błąd pobierania statystyk:', error)
      toast.error('Błąd pobierania statystyk')
    } finally {
      setLoadingStatistics(false)
    }
  }

  // Pobieranie leadów
  const fetchLeads = async () => {
    setLoadingLeads(true)
    try {
      const params = new URLSearchParams()
      if (leadStatusFilter !== 'all') params.append('status', leadStatusFilter)
      if (leadSearchTerm) params.append('search', leadSearchTerm)
      
      const res = await fetch(`/api/seller/leads?${params.toString()}`)
      const data = await res.json()
      setLeads(data.leads || [])
    } catch (error) {
      console.error('Błąd pobierania leadów:', error)
      toast.error('Błąd pobierania leadów')
    } finally {
      setLoadingLeads(false)
    }
  }

  // Pobieranie szczegółowych danych o poleceniach
  const fetchReferrals = async () => {
    setLoadingReferrals(true)
    try {
      const res = await fetch('/api/seller/referrals')
      const data = await res.json()
      if (data.success) {
        setReferralStats({
          totalReferrals: data.totalReferrals || 0,
          sellerReferrals: data.sellerReferrals || 0
        })
        setReferredUsers(data.referrals || [])
      }
    } catch (error) {
      console.error('Błąd pobierania poleceń:', error)
      toast.error('Błąd pobierania poleceń')
    } finally {
      setLoadingReferrals(false)
    }
  }

  // Pobieranie zamówień konkretnego użytkownika
  const fetchUserOrders = async (userId: number) => {
    setLoadingUserOrders(true)
    try {
      const res = await fetch(`/api/orders?sellerId=${userId}`)
      const data = await res.json()
      setUserOrders(data.orders || [])
    } catch (error) {
      console.error('Błąd pobierania zamówień użytkownika:', error)
      toast.error('Błąd pobierania zamówień')
    } finally {
      setLoadingUserOrders(false)
    }
  }

  // Funkcja do rozwijania/zwijania zamówień użytkownika
  const toggleUserOrders = (userId: number) => {
    if (expandedUserId === userId) {
      setExpandedUserId(null)
      setUserOrders([])
    } else {
      setExpandedUserId(userId)
      fetchUserOrders(userId)
    }
  }

  useEffect(() => {
    if (user) {
      if (activeTab === 'dashboard') {
        fetchOrders()
        fetchStatistics()
      }
      if (activeTab === 'orders') {
        fetchOrders()
      }
      if (activeTab === 'statistics') {
        fetchStatistics()
      }
      if (activeTab === 'leads') {
        fetchLeads()
      }
      if (activeTab === 'network') {
        fetchReferrals()
      }
    }
  }, [activeTab, user])

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch('/api/admin/softwares')
        const data = await res.json()
        if (data.softwares) {
          setSoftwares(data.softwares)
          const allCategories = data.softwares.flatMap((software: any) => JSON.parse(software.categories))
          setCategories(Array.from(new Set(allCategories))) // Usuwamy duplikaty
        }
      } catch (error) {
        console.error('Błąd pobierania kategorii:', error)
        toast.error('Błąd pobierania kategorii')
      }
    }
    fetchCategories()
  }, [])

  // Effect dla filtrowania leadów
  useEffect(() => {
    if (activeTab === 'leads') {
      fetchLeads()
    }
  }, [leadSearchTerm, leadStatusFilter])

  if (!authChecked) {
    return <div className="min-h-screen flex items-center justify-center text-darksubtle">Sprawdzanie uprawnień...</div>
  }

  if (showLogin) {
    return <div className="min-h-screen flex items-center justify-center bg-darkbg text-darktext">
      <div className="max-w-sm w-full">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold">Panel Sprzedawcy</h2>
          <p className="text-darksubtle mt-2">Dostęp dla sprzedawców i zarządzania</p>
        </div>
        <AuthModal isOpen={true} onClose={() => {}} onAuthSuccess={() => window.location.reload()} />
      </div>
    </div>
  }

  // Filtrowanie zamówień
  const filteredOrders = orders
    .filter(order => orderFilter === 'all' || order.status === orderFilter)
    .filter(order => 
      !searchTerm || 
      order.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.phone?.includes(searchTerm) ||
      order.id.toString().includes(searchTerm)
    )

  // Dashboard metryki są teraz pobierane z API statistics zamiast obliczane lokalnie

  return (
    <div className="min-h-screen bg-darkbg text-darktext">
      <header className="bg-darkpanel shadow-sm border-b border-gray-800">
        <div className="container mx-auto px-2 sm:px-4 py-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-3">
              <Link href="/" className="flex items-center gap-3">
                <img src="/logo-wsp-edu.png" alt="Logo" className="w-10 h-10 rounded-lg object-contain p-1" />
                <div>
                  <div className="flex items-center gap-2">
                    <h1 className="text-xl sm:text-2xl font-bold text-darktext">Panel Sprzedawcy</h1>
                    {statistics && (
                      <div className="relative">
                        {/* Funkcja pomocnicza do określenia koloru i emoji */}
                        {(() => {
                          const level = statistics.sellerLevel
                          let gradient = ''
                          let ringColor1 = ''
                          let ringColor2 = ''
                          let emoji = '🏆'
                          let commissionRate = 10
                          
                          if (level >= 25) {
                            gradient = 'from-purple-500 via-pink-500 to-red-500'
                            ringColor1 = 'bg-purple-400'
                            ringColor2 = 'bg-pink-400'
                            emoji = '👑'
                            commissionRate = 25
                          } else if (level >= 20) {
                            gradient = 'from-blue-500 via-cyan-500 to-teal-500'
                            ringColor1 = 'bg-blue-400'
                            ringColor2 = 'bg-cyan-400'
                            emoji = '💎'
                            commissionRate = 20
                          } else if (level >= 15) {
                            gradient = 'from-yellow-400 via-orange-500 to-red-500'
                            ringColor1 = 'bg-yellow-400'
                            ringColor2 = 'bg-orange-400'
                            emoji = '🏆'
                            commissionRate = 15
                          }
                          
                          return level >= 15 ? (
                            showLevelAnimation && [15, 20, 25].includes(level) ? (
                              <motion.div
                                className="relative"
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ 
                                  opacity: 1, 
                                  scale: [1, 1.05, 1],
                                }}
                                exit={{ opacity: 0 }}
                                transition={{
                                  opacity: { duration: 0.3 },
                                  scale: {
                                    duration: 2,
                                    repeat: 2,
                                    ease: "easeInOut"
                                  }
                                }}
                              >
                                {/* Pulsujące pierścienie */}
                                <motion.div
                                  className={`absolute inset-0 rounded-full ${ringColor1}`}
                                  initial={{ scale: 1, opacity: 0 }}
                                  animate={{
                                    scale: [1, 1.5, 1],
                                    opacity: [0.8, 0, 0.8],
                                  }}
                                  exit={{ opacity: 0 }}
                                  transition={{
                                    duration: 2,
                                    repeat: 2,
                                    ease: "easeOut"
                                  }}
                                />
                                <motion.div
                                  className={`absolute inset-0 rounded-full ${ringColor2}`}
                                  initial={{ scale: 1, opacity: 0 }}
                                  animate={{
                                    scale: [1, 1.8, 1],
                                    opacity: [0.6, 0, 0.6],
                                  }}
                                  exit={{ opacity: 0 }}
                                  transition={{
                                    duration: 2,
                                    repeat: 2,
                                    ease: "easeOut",
                                    delay: 0.3
                                  }}
                                />
                                
                                {/* Latające emoji wokół badge'a */}
                                {['✨', '💰', '🎉', '⭐'].map((emojiItem, index) => (
                                  <motion.span
                                    key={index}
                                    className="absolute text-lg pointer-events-none"
                                    style={{
                                      top: '50%',
                                      left: '50%',
                                    }}
                                    initial={{ opacity: 0, scale: 0 }}
                                    animate={{
                                      x: [
                                        0,
                                        Math.cos((index * Math.PI) / 2) * 40,
                                        0
                                      ],
                                      y: [
                                        0,
                                        Math.sin((index * Math.PI) / 2) * 40,
                                        0
                                      ],
                                      opacity: [0, 1, 0],
                                      scale: [0.5, 1, 0.5],
                                      rotate: [0, 360, 720]
                                    }}
                                    exit={{ opacity: 0 }}
                                    transition={{
                                      duration: 3,
                                      repeat: 1,
                                      delay: index * 0.2,
                                      ease: "easeInOut"
                                    }}
                                  >
                                    {emojiItem}
                                  </motion.span>
                                ))}
                                
                                {/* Badge z gradientem */}
                                <span className={`relative px-3 py-1 bg-gradient-to-r ${gradient} text-white rounded-full text-xs font-bold whitespace-nowrap shadow-lg`}>
                                  {emoji} Poziom {level}
                      </span>
                                
                                {/* Tooltip z informacją o prowizji */}
                                <motion.div
                                  initial={{ opacity: 0, x: -10 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  exit={{ opacity: 0, x: -10 }}
                                  transition={{ duration: 0.3 }}
                                  className="absolute right-full top-1/2 transform -translate-y-1/2 mr-2 sm:right-auto sm:top-full sm:left-1/2 sm:-translate-x-1/2 sm:translate-y-0 sm:mt-2 px-3 py-2 bg-green-600 text-white rounded-lg text-xs font-bold whitespace-nowrap shadow-xl z-10"
                                >
                                  💰 {commissionRate}% prowizji!
                                  {/* Strzałka po prawej na mobile, u góry na desktop */}
                                  <div className="absolute -right-1 top-1/2 transform -translate-y-1/2 w-2 h-2 bg-green-600 rotate-45 sm:-top-1 sm:left-1/2 sm:-translate-x-1/2 sm:translate-y-0 sm:right-auto"></div>
                                </motion.div>
                              </motion.div>
                            ) : (
                              <motion.span 
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ duration: 0.5 }}
                                className={`px-3 py-1 bg-gradient-to-r ${gradient} text-white rounded-full text-xs font-bold whitespace-nowrap shadow-lg inline-block`}
                              >
                                {emoji} Poziom {level}
                              </motion.span>
                            )
                          ) : (
                            <span className="px-2 py-1 bg-yellow-600 text-white rounded-full text-xs font-bold whitespace-nowrap">
                              Poziom {level}
                            </span>
                          )
                        })()}
                      </div>
                    )}
                  </div>
                  <p className="text-xs sm:text-sm text-darksubtle">
                    <span className="hidden sm:inline">Zalogowany jako: </span>
                    {user?.email} 
                    <span className="hidden sm:inline"> ({user?.role})</span>
                  </p>
                </div>
              </Link>
            </div>
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 w-full sm:w-auto">
              <button
                onClick={() => setIsProfileModalOpen(true)}
                className="btn-secondary text-sm px-4 py-2 w-full sm:w-auto flex items-center gap-2 justify-center"
              >
                <Users size={16} />
                Profil
              </button>
              {user?.role === 'admin' && (
                <Link href="/admin" className="btn-secondary text-sm px-4 py-2 w-full sm:w-auto text-center">
                  Panel Admin
                </Link>
              )}
              <button
                className="btn-secondary text-sm px-4 py-2 w-full sm:w-auto"
                onClick={async () => {
                  await fetch('/api/auth/logout', { method: 'POST' })
                  window.location.reload()
                }}
              >
                Wyloguj się
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-2 sm:px-4 py-4 sm:py-8">
        {/* Tabs */}
        <div className="relative mb-6">
          <div className="flex space-x-2 border-b border-gray-800 overflow-x-auto whitespace-nowrap scrollbar-thin scrollbar-thumb-darkbg scrollbar-track-transparent">
          <button
            className={`px-6 py-2 font-medium transition-colors duration-200 border-b-2 ${activeTab === 'dashboard' ? 'border-primary-500 text-primary-500' : 'border-transparent text-darksubtle hover:text-primary-400'}`}
            onClick={() => setActiveTab('dashboard')}
          >
            Dashboard
          </button>
          <button
            className={`px-6 py-2 font-medium transition-colors duration-200 border-b-2 ${activeTab === 'orders' ? 'border-primary-500 text-primary-500' : 'border-transparent text-darksubtle hover:text-primary-400'}`}
            onClick={() => setActiveTab('orders')}
          >
            Zamówienia
          </button>
          <button
            className={`px-6 py-2 font-medium transition-colors duration-200 border-b-2 ${activeTab === 'leads' ? 'border-primary-500 text-primary-500' : 'border-transparent text-darksubtle hover:text-primary-400'}`}
            onClick={() => setActiveTab('leads')}
          >
            Kontakty
          </button>
          <button
            className={`px-6 py-2 font-medium transition-colors duration-200 border-b-2 ${activeTab === 'statistics' ? 'border-primary-500 text-primary-500' : 'border-transparent text-darksubtle hover:text-primary-400'}`}
            onClick={() => setActiveTab('statistics')}
          >
            Statystyki
          </button>
          <button
            className={`px-6 py-2 font-medium transition-colors duration-200 border-b-2 ${activeTab === 'network' ? 'border-primary-500 text-primary-500' : 'border-transparent text-darksubtle hover:text-primary-400'}`}
            onClick={() => setActiveTab('network')}
          >
            Mój network
          </button>
          </div>
          
          {/* Gradient wskazujący możliwość scrollowania */}
          <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-darkbg via-darkbg/80 to-transparent pointer-events-none flex items-center justify-end pr-2">
            <svg className="w-5 h-5 text-primary-400 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </div>

        {/* Dashboard Tab */}
        {activeTab === 'dashboard' && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="space-y-6"
          >
            {/* Karty z kluczowymi metrykami */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="card bg-gradient-to-br from-blue-600 to-blue-700 text-white"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-blue-100 text-sm">Wszystkie zamówienia</p>
                    <p className="text-3xl font-bold">{statistics?.totalOrders || 0}</p>
                  </div>
                  <Package className="w-8 h-8 text-blue-200" />
                </div>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="card bg-gradient-to-br from-green-600 to-green-700 text-white"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-green-100 text-sm">Opłacone zamówienia</p>
                    <p className="text-3xl font-bold">{statistics?.paidOrders || 0}</p>
                  </div>
                  <DollarSign className="w-8 h-8 text-green-200" />
                </div>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="card bg-gradient-to-br from-purple-600 to-purple-700 text-white"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-purple-100 text-sm">Dzisiejsze zamówienia</p>
                    <p className="text-3xl font-bold">{statistics?.todayOrders || 0}</p>
                  </div>
                  <Calendar className="w-8 h-8 text-purple-200" />
                </div>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="card bg-gradient-to-br from-orange-600 to-orange-700 text-white"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-orange-100 text-sm">Miesięczne zamówienia</p>
                    <p className="text-3xl font-bold">{statistics?.thisMonthOrders || 0}</p>
                  </div>
                  <TrendingUp className="w-8 h-8 text-orange-200" />
                </div>
              </motion.div>
            </div>

            {/* Najnowsze zamówienia */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="card"
            >
              <h3 className="text-lg font-semibold text-darktext mb-4">Najnowsze zamówienia</h3>
              {loading ? (
                <div className="text-center py-8 text-darksubtle">Ładowanie...</div>
              ) : orders.length > 0 ? (
                <div className="space-y-3">
                  {orders.slice(0, 8).map((order) => {
                    const commission = calculateOrderCommission(order)
                    return (
                    <div key={order.id} className="flex items-center justify-between p-3 bg-darkbg rounded-lg">
                      <div>
                        <p className="font-medium text-darktext">#{order.id} - {order.email || 'Brak email'}</p>
                        <div className="flex items-center gap-2">
                          <p className="text-sm text-darksubtle">
                            {order.orderType === 'consultation' ? 'Wycena' : 
                             order.orderType === 'collaboration' ? 'Współpraca' : 
                             order.orderType === 'code' ? 'Kod' : order.orderType}
                          </p>
                          {order.phone && (
                            <span className="text-xs text-darksubtle">📞 {order.phone}</span>
                          )}
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-darksubtle">
                          {new Date(order.createdAt).toLocaleString('pl-PL', {
                            year: 'numeric',
                            month: '2-digit',
                            day: '2-digit',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </p>
                        <div className="flex flex-col sm:flex-row items-end sm:items-center gap-1 sm:gap-2 justify-end">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            order.status === 'paid' 
                              ? 'bg-green-900 text-green-300' 
                              : order.status === 'pending'
                              ? 'bg-yellow-900 text-yellow-300'
                              : 'bg-red-900 text-red-300'
                          }`}>
                            {order.status === 'paid' ? 'Opłacone' : order.status === 'pending' ? 'Oczekujące' : 'Wygasłe'}
                          </span>
                          {order.status === 'paid' && commission > 0 && (
                            <span className="text-green-400 text-xs font-bold">
                              +{commission} PLN
                            </span>
                          )}
                        </div>
                      </div>
                      </div>
                    )
                  })}
                </div>
              ) : (
                <div className="text-center py-8 text-darksubtle">Brak zamówień</div>
              )}
            </motion.div>
          </motion.section>
        )}

        {/* Orders Tab */}
        {activeTab === 'orders' && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="card"
          >
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
              <h2 className="text-xl font-semibold text-darktext">Zamówienia</h2>
              
              <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 w-full sm:w-auto">
                {/* Wyszukiwarka */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-darksubtle" />
                  <input
                    type="text"
                    placeholder="Szukaj email, telefon, ID..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 border border-gray-700 rounded-lg bg-darkpanel text-darktext w-full sm:w-64"
                  />
                </div>
                
                {/* Filtr statusu */}
                <select 
                  value={orderFilter}
                  onChange={(e) => setOrderFilter(e.target.value as 'all' | 'pending' | 'paid')}
                  className="px-3 py-2 border border-gray-700 rounded-lg bg-darkpanel text-darktext w-full sm:w-auto"
                >
                  <option value="all">Wszystkie statusy</option>
                  <option value="pending">Oczekujące</option>
                  <option value="paid">Opłacone</option>
                </select>
              </div>
            </div>

            {loading ? (
              <div className="text-center py-12 text-lg text-darksubtle">Ładowanie danych...</div>
            ) : (
              <>
                {/* Mobile: karty */}
                <div className="flex flex-col gap-4 sm:hidden">
                  {filteredOrders.map(order => (
                    <div key={order.id} className="bg-darkbg rounded-xl shadow-lg p-4 border border-gray-800">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-primary-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                            #{order.id}
                          </div>
                          <div>
                            <p className="font-medium text-darktext">{order.email || 'Brak email'}</p>
                            <p className="text-xs text-darksubtle">{order.phone || 'Brak telefonu'}</p>
                          </div>
                        </div>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          order.status === 'paid' 
                            ? 'bg-green-900 text-green-300' 
                            : order.status === 'pending'
                            ? 'bg-yellow-900 text-yellow-300'
                            : 'bg-red-900 text-red-300'
                        }`}>
                          {order.status === 'paid' ? 'Opłacone' : order.status === 'pending' ? 'Oczekujące' : 'Wygasłe'}
                        </span>
                      </div>
                      
                      <div className="space-y-2 mb-3">
                        <div className="flex items-center gap-2">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            order.orderType === 'consultation' 
                              ? 'bg-blue-600 text-white' 
                              : order.orderType === 'collaboration'
                              ? 'bg-green-600 text-white'
                              : 'bg-purple-600 text-white'
                          }`}>
                            {order.orderType === 'consultation' ? 'Wycena' : 
                             order.orderType === 'collaboration' ? 'Współpraca' : 
                             order.orderType === 'code' ? 'Kod' : order.orderType}
                          </span>
                        </div>
                        
                        {order.software && (
                          <div className="text-sm">
                            <span className="text-darksubtle">Oprogramowanie: </span>
                            <span className="font-medium text-primary-400">{order.software.name}</span>
                          </div>
                        )}
                        
                        <div className="text-sm">
                          <span className="text-darksubtle">Data: </span>
                          <span className="font-medium">
                            {new Date(order.createdAt).toLocaleString('pl-PL')}
                          </span>
                        </div>
                      </div>
                      
                      <div className="flex gap-2">
                        <button
                          className="btn-secondary flex-1 py-2 text-xs"
                          onClick={() => setExpandedOrderId(expandedOrderId === order.id ? null : order.id)}
                        >
                          {expandedOrderId === order.id ? 'Ukryj szczegóły' : 'Pokaż szczegóły'}
                        </button>
                      </div>
                      
                      {/* Rozszerzone szczegóły */}
                      {expandedOrderId === order.id && (
                        <div className="mt-3 p-3 bg-darkpanel rounded-lg border border-gray-700">
                          <div className="space-y-2 text-sm">
                            {order.info && (
                              <div>
                                <span className="font-medium text-darksubtle">Dodatkowe informacje:</span>
                                <p className="mt-1">{order.info}</p>
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
                
                {/* Desktop: tabela */}
                <div className="hidden sm:block overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="border-b border-gray-700">
                        <th className="py-3 px-4 font-medium text-darksubtle">ID</th>
                        <th className="py-3 px-4 font-medium text-darksubtle">Email</th>
                        <th className="py-3 px-4 font-medium text-darksubtle">Telefon</th>
                        <th className="py-3 px-4 font-medium text-darksubtle">Oprogramowanie</th>
                        <th className="py-3 px-4 font-medium text-darksubtle">Typ</th>
                        <th className="py-3 px-4 font-medium text-darksubtle">Status</th>
                        <th className="py-3 px-4 font-medium text-darksubtle">Data</th>
                        <th className="py-3 px-4 font-medium text-darksubtle">Akcje</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredOrders.map(order => (
                        <>
                          <tr key={order.id} className="border-t border-gray-700 hover:bg-darkbg/60">
                            <td className="py-3 px-4 font-mono text-sm">#{order.id}</td>
                            <td className="py-3 px-4">
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center text-white font-bold text-xs">
                                  {order.email?.charAt(0).toUpperCase() || '?'}
                                </div>
                                <span className="font-medium">{order.email || 'Brak'}</span>
                              </div>
                            </td>
                            <td className="py-3 px-4 text-sm text-darksubtle">
                              {order.phone || '-'}
                            </td>
                            <td className="py-3 px-4 text-sm">
                              {order.software ? (
                                <span className="font-medium text-primary-400">{order.software.name}</span>
                              ) : (
                                <span className="text-darksubtle">-</span>
                              )}
                            </td>
                            <td className="py-3 px-4">
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                order.orderType === 'consultation' 
                                  ? 'bg-blue-600 text-white' 
                                  : order.orderType === 'collaboration'
                                  ? 'bg-green-600 text-white'
                                  : 'bg-purple-600 text-white'
                              }`}>
                                {order.orderType === 'consultation' ? 'Wycena' : 
                                 order.orderType === 'collaboration' ? 'Współpraca' : 
                                 order.orderType === 'code' ? 'Kod' : order.orderType}
                              </span>
                            </td>
                            <td className="py-3 px-4">
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                order.status === 'paid' 
                                  ? 'bg-green-900 text-green-300' 
                                  : order.status === 'pending'
                                  ? 'bg-yellow-900 text-yellow-300'
                                  : 'bg-red-900 text-red-300'
                              }`}>
                                {order.status === 'paid' ? 'Opłacone' : order.status === 'pending' ? 'Oczekujące' : 'Wygasłe'}
                              </span>
                            </td>
                            <td className="py-3 px-4 text-sm text-darksubtle">
                              {new Date(order.createdAt).toLocaleString('pl-PL', {
                                year: 'numeric',
                                month: '2-digit',
                                day: '2-digit',
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </td>
                            <td className="py-3 px-4">
                              <button
                                className="btn-secondary text-xs px-3 py-1"
                                onClick={() => setExpandedOrderId(expandedOrderId === order.id ? null : order.id)}
                              >
                                {expandedOrderId === order.id ? 'Ukryj' : 'Szczegóły'}
                              </button>
                            </td>
                          </tr>
                          {expandedOrderId === order.id && (
                            <tr>
                              <td colSpan={8} className="bg-darkbg/80 p-4 border-t border-b border-primary-700 text-sm">
                                <div className="space-y-4">
                                  <div>
                                    <b>Dodatkowe informacje od zamawiającego:</b><br />
                                    {order.info ? order.info : <span className="text-darksubtle">Brak dodatkowych informacji</span>}
                                  </div>
                                </div>
                              </td>
                            </tr>
                          )}
                        </>
                      ))}
                    </tbody>
                  </table>
                </div>
              </>
            )}
          </motion.section>
        )}

        {/* Leads Tab */}
        {activeTab === 'leads' && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="card"
          >
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
              <h2 className="text-xl font-semibold text-darktext">Kontakty i Leady</h2>
              <div className="flex gap-2">
                <button className="btn-primary flex items-center space-x-2" onClick={() => setIsAddLeadModalOpen(true)}>
                  <Plus className="w-4 h-4" />
                  <span>Dodaj lead</span>
                </button>
                <button className="btn-secondary flex items-center space-x-2" onClick={() => copyReflinkToClipboard(generateReflink(user?.id || 0))}>
                  <span>Kopiuj reflink</span>
                </button>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 w-full mb-6">
              {/* Wyszukiwarka */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-darksubtle" />
                <input
                  type="text"
                  placeholder="Szukaj email, telefon..."
                  value={leadSearchTerm}
                  onChange={(e) => setLeadSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-700 rounded-lg bg-darkpanel text-darktext w-full sm:w-64"
                />
              </div>
              
              {/* Filtr statusu */}
              <select 
                value={leadStatusFilter}
                onChange={(e) => setLeadStatusFilter(e.target.value as typeof leadStatusFilter)}
                className="px-3 py-2 border border-gray-700 rounded-lg bg-darkpanel text-darktext w-full sm:w-auto"
              >
                <option value="all">Wszystkie statusy</option>
                <option value="pending">Oczekujący</option>
                <option value="first_payment">Po pierwszej zaliczce</option>
                <option value="second_payment">Po drugiej zaliczce</option>
                <option value="paid">Opłacony</option>
                <option value="rejected">Odrzucony</option>
              </select>
            </div>

            {loadingLeads ? (
              <div className="text-center py-12 text-lg text-darksubtle">Ładowanie leadów...</div>
            ) : (
              <>
                {/* Mobile: karty */}
                <div className="flex flex-col gap-4 sm:hidden">
                  {leads.map(lead => (
                    <div key={lead.id} className="bg-darkbg rounded-xl shadow-lg p-4 border border-gray-800">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-primary-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                            #{lead.id}
                          </div>
                          <div>
                            <p className="font-medium text-darktext">{lead.email || 'Brak email'}</p>
                            <p className="text-xs text-darksubtle">
                              {new Date(lead.createdAt).toLocaleDateString('pl-PL')}
                            </p>
                          </div>
                        </div>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          lead.status === 'pending' ? 'bg-gray-900 text-gray-300' :
                          lead.status === 'first_payment' ? 'bg-yellow-900 text-yellow-300' :
                          lead.status === 'second_payment' ? 'bg-blue-900 text-blue-300' :
                          lead.status === 'paid' ? 'bg-green-900 text-green-300' :
                          'bg-red-900 text-red-300'
                        }`}>
                          {lead.status === 'pending' ? 'Oczekujący' :
                           lead.status === 'first_payment' ? 'Po 1. zaliczce' :
                           lead.status === 'second_payment' ? 'Po 2. zaliczce' :
                           lead.status === 'paid' ? 'Opłacony' : 'Odrzucony'}
                        </span>
                      </div>
                      
                      {/* Rozwinięte szczegóły */}
                      {expandedLeadId === lead.id && (
                        <div className="space-y-3 mb-3 p-3 bg-darkpanel rounded-lg border border-gray-700">
                          <div>
                            <p className="text-xs text-darksubtle mb-1">Telefon</p>
                            <p className="text-sm font-medium text-darktext">{lead.phone || '-'}</p>
                          </div>
                          <div>
                            <p className="text-xs text-darksubtle mb-1">Kategoria</p>
                            {lead.selectedCategory ? (
                              <span className="px-2 py-1 bg-blue-600 text-white rounded-full text-xs">{lead.selectedCategory}</span>
                            ) : (
                              <p className="text-sm text-darksubtle">-</p>
                            )}
                          </div>
                          {lead.softwareTemplate && (
                            <>
                              <div>
                                <p className="text-xs text-darksubtle mb-1">Szablon oprogramowania</p>
                                <p className="text-sm font-medium text-darktext">{lead.softwareTemplate.name}</p>
                              </div>
                              <div>
                                <p className="text-xs text-darksubtle mb-1">Cena szablonu</p>
                                <p className="text-sm font-medium text-green-400">{lead.softwareTemplate.price} PLN</p>
                              </div>
                            </>
                          )}
                          {lead.info && (
                            <div>
                              <p className="text-xs text-darksubtle mb-1">Informacje / Notatki</p>
                              <p className="text-sm text-darktext bg-darkbg rounded p-2 border border-gray-700">
                                {lead.info}
                              </p>
                            </div>
                          )}
                        </div>
                      )}
                      
                      <div className="flex gap-2">
                        <button
                          className="btn-secondary flex-1 py-2 text-xs"
                          onClick={() => setExpandedLeadId(expandedLeadId === lead.id ? null : lead.id)}
                        >
                          {expandedLeadId === lead.id ? 'Ukryj' : 'Szczegóły'}
                        </button>
                        <button
                          className="btn-primary flex-1 py-2 text-xs"
                          onClick={() => { setEditLead(lead); setIsEditLeadModalOpen(true) }}
                        >
                          Edytuj
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
                
                {/* Desktop: tabela */}
                <div className="hidden sm:block overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="border-b border-gray-700">
                        <th className="py-3 px-4 font-medium text-darksubtle">ID</th>
                        <th className="py-3 px-4 font-medium text-darksubtle">Email</th>
                        <th className="py-3 px-4 font-medium text-darksubtle">Status</th>
                        <th className="py-3 px-4 font-medium text-darksubtle">Data</th>
                        <th className="py-3 px-4 font-medium text-darksubtle">Akcje</th>
                      </tr>
                    </thead>
                    <tbody>
                      {leads.map(lead => (
                        <>
                        <tr key={lead.id} className="border-t border-gray-700 hover:bg-darkbg/60">
                          <td className="py-3 px-4 font-mono text-sm">#{lead.id}</td>
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center text-white font-bold text-xs">
                                {lead.email?.charAt(0).toUpperCase() || '?'}
                              </div>
                              <span className="font-medium">{lead.email || 'Brak'}</span>
                            </div>
                          </td>
                            <td className="py-3 px-4">
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                lead.status === 'pending' ? 'bg-gray-900 text-gray-300' :
                                lead.status === 'first_payment' ? 'bg-yellow-900 text-yellow-300' :
                                lead.status === 'second_payment' ? 'bg-blue-900 text-blue-300' :
                                lead.status === 'paid' ? 'bg-green-900 text-green-300' :
                                'bg-red-900 text-red-300'
                              }`}>
                                {lead.status === 'pending' ? 'Oczekujący' :
                                 lead.status === 'first_payment' ? 'Po pierwszej zaliczce' :
                                 lead.status === 'second_payment' ? 'Po drugiej zaliczce' :
                                 lead.status === 'paid' ? 'Opłacony' : 'Odrzucony'}
                              </span>
                            </td>
                          <td className="py-3 px-4 text-sm text-darksubtle">
                            {new Date(lead.createdAt).toLocaleString('pl-PL', {
                              year: 'numeric',
                              month: '2-digit',
                              day: '2-digit',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex gap-2">
                              <button
                                onClick={() => setExpandedLeadId(expandedLeadId === lead.id ? null : lead.id)}
                                className="btn-secondary text-xs px-3 py-1"
                              >
                                {expandedLeadId === lead.id ? 'Ukryj' : 'Szczegóły'}
                              </button>
                              <button 
                                className="btn-primary text-xs px-3 py-1"
                                onClick={() => { setEditLead(lead); setIsEditLeadModalOpen(true) }}
                              >
                                Edytuj
                              </button>
                            </div>
                          </td>
                        </tr>
                        
                        {/* Rozwinięte szczegóły */}
                        {expandedLeadId === lead.id && (
                          <tr>
                            <td colSpan={5} className="bg-darkbg/80 p-4 border-t border-b border-primary-700">
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                  <p className="text-xs text-darksubtle mb-1">Telefon</p>
                                  <p className="font-medium text-darktext">{lead.phone || '-'}</p>
                                </div>
                                <div>
                                  <p className="text-xs text-darksubtle mb-1">Kategoria</p>
                                  {lead.selectedCategory ? (
                                    <span className="px-2 py-1 bg-blue-600 text-white rounded-full text-xs">{lead.selectedCategory}</span>
                                  ) : (
                                    <p className="text-darksubtle">-</p>
                                  )}
                                </div>
                                <div>
                                  <p className="text-xs text-darksubtle mb-1">Szablon oprogramowania</p>
                                  {lead.softwareTemplate ? (
                                    <p className="font-medium text-darktext">{lead.softwareTemplate.name}</p>
                                  ) : (
                                    <p className="text-darksubtle">-</p>
                                  )}
                                </div>
                                <div>
                                  <p className="text-xs text-darksubtle mb-1">Cena szablonu</p>
                                  {lead.softwareTemplate ? (
                                    <p className="font-medium text-green-400">{lead.softwareTemplate.price} PLN</p>
                                  ) : (
                                    <p className="text-darksubtle">-</p>
                                  )}
                                </div>
                                {lead.info && (
                                  <div className="md:col-span-2">
                                    <p className="text-xs text-darksubtle mb-1">Informacje / Notatki</p>
                                    <p className="text-sm text-darktext bg-darkpanel rounded p-3 border border-gray-700">
                                      {lead.info}
                                    </p>
                                  </div>
                                )}
                              </div>
                            </td>
                          </tr>
                        )}
                      </>
                      ))}
                    </tbody>
                  </table>
                </div>

                {leads.length === 0 && !loadingLeads && (
                  <div className="text-center py-12">
                    <Users className="w-16 h-16 text-darksubtle mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-darktext mb-2">
                      {(leadSearchTerm && leadSearchTerm.trim() !== '') || leadStatusFilter !== 'all' ? 'Brak wyników' : 'Brak leadów'}
                    </h3>
                    <p className="text-darksubtle mb-4">
                      {(leadSearchTerm && leadSearchTerm.trim() !== '') || leadStatusFilter !== 'all' 
                        ? 'Nie znaleziono leadów pasujących do wybranych kryteriów.'
                        : 'Dodaj pierwszego leada, aby rozpocząć zarządzanie potencjalnymi klientami.'}
                    </p>
                    {(!leadSearchTerm || leadSearchTerm.trim() === '') && leadStatusFilter === 'all' && (
                      <button 
                        className="btn-primary"
                        onClick={() => setIsAddLeadModalOpen(true)}
                      >
                        Dodaj lead
                      </button>
                    )}
                  </div>
                )}
              </>
            )}
          </motion.section>
        )}

        {/* Statistics Tab */}
        {activeTab === 'statistics' && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-6"
          >
            <div className="card">
              <h2 className="text-xl font-semibold text-darktext mb-6">Statystyki sprzedaży</h2>
              {loadingStatistics ? (
                <div className="text-center py-12 text-lg text-darksubtle">Ładowanie statystyk...</div>
              ) : statistics ? (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg p-6 text-white">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-blue-100 text-sm">Wszystkie zamówienia</p>
                          <p className="text-3xl font-bold">{statistics.totalOrders}</p>
                        </div>
                        <Package className="w-8 h-8 text-blue-200" />
                      </div>
                    </div>
                    <div className="bg-gradient-to-br from-green-600 to-green-700 rounded-lg p-6 text-white">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-green-100 text-sm">Opłacone zamówienia</p>
                          <p className="text-3xl font-bold">{statistics.paidOrders}</p>
                        </div>
                        <DollarSign className="w-8 h-8 text-green-200" />
                      </div>
                    </div>
                    <div className="bg-gradient-to-br from-purple-600 to-purple-700 rounded-lg p-6 text-white">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-purple-100 text-sm">Obrót PLN</p>
                          <p className="text-3xl font-bold">{statistics.totalRevenuePLN?.toLocaleString('pl-PL')}</p>
                        </div>
                        <TrendingUp className="w-8 h-8 text-purple-200" />
                      </div>
                    </div>
                    <div className="bg-gradient-to-br from-orange-600 to-orange-700 rounded-lg p-6 text-white">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-orange-100 text-sm">Prowizja z mojej sprzedaży ({statistics.commissionRate}%)</p>
                          <p className="text-3xl font-bold">{statistics.totalCommission?.toLocaleString('pl-PL')} PLN</p>
                        </div>
                        <DollarSign className="w-8 h-8 text-orange-200" />
                      </div>
                    </div>
                  </div>

                  {/* Prowizje z zespołu */}
                  {statistics.totalTeamCommission > 0 && (
                    <div className="card bg-gradient-to-br from-indigo-600/20 to-purple-600/20 border border-indigo-500/30">
                      <h3 className="text-lg font-semibold text-darktext mb-4 flex items-center gap-2">
                        <Users className="w-5 h-5 text-indigo-400" />
                        Prowizje z zespołu (10% obrotu zaproszonych sprzedawców)
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="bg-darkpanel rounded-lg p-4">
                          <p className="text-sm text-darksubtle mb-1">Łącznie</p>
                          <p className="text-2xl font-bold text-indigo-400">{statistics.totalTeamCommission?.toLocaleString('pl-PL')} PLN</p>
                          <p className="text-xs text-darksubtle mt-1">{statistics.teamOrdersCount || 0} zamówień</p>
                        </div>
                        <div className="bg-darkpanel rounded-lg p-4">
                          <p className="text-sm text-darksubtle mb-1">Ten miesiąc</p>
                          <p className="text-2xl font-bold text-green-400">{statistics.thisMonthTeamCommission?.toLocaleString('pl-PL')} PLN</p>
                        </div>
                        <div className="bg-darkpanel rounded-lg p-4">
                          <p className="text-sm text-darksubtle mb-1">Poprzedni miesiąc</p>
                          <p className="text-2xl font-bold text-darksubtle">{statistics.lastMonthTeamCommission?.toLocaleString('pl-PL')} PLN</p>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="card">
                      <h3 className="text-lg font-semibold text-darktext mb-4">Bieżący miesiąc</h3>
                      <div className="flex flex-col gap-2">
                        <div className="flex justify-between">
                          <span>Zamówienia:</span>
                          <span className="font-bold">{statistics.thisMonthOrders}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Obrót:</span>
                          <span className="font-bold">{statistics.thisMonthRevenue?.toLocaleString('pl-PL')} PLN</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Prowizja z własnych:</span>
                          <span className="font-bold text-green-400">{statistics.thisMonthCommission?.toLocaleString('pl-PL')} PLN</span>
                        </div>
                        {statistics.thisMonthTeamCommission > 0 && (
                          <div className="flex justify-between border-t border-gray-700 pt-2 mt-2">
                            <span>Prowizja z zespołu:</span>
                            <span className="font-bold text-indigo-400">{statistics.thisMonthTeamCommission?.toLocaleString('pl-PL')} PLN</span>
                          </div>
                        )}
                        {statistics.thisMonthTeamCommission > 0 && (
                          <div className="flex justify-between font-bold text-lg border-t border-gray-700 pt-2 mt-2">
                            <span>Łącznie:</span>
                            <span className="text-green-400">{((statistics.thisMonthCommission || 0) + (statistics.thisMonthTeamCommission || 0)).toLocaleString('pl-PL')} PLN</span>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="card">
                      <h3 className="text-lg font-semibold text-darktext mb-4">Poprzedni miesiąc</h3>
                      <div className="flex flex-col gap-2">
                        <div className="flex justify-between">
                          <span>Zamówienia:</span>
                          <span className="font-bold">{statistics.lastMonthOrders}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Obrót:</span>
                          <span className="font-bold">{statistics.lastMonthRevenue?.toLocaleString('pl-PL')} PLN</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Prowizja z własnych:</span>
                          <span className="font-bold text-green-400">{statistics.lastMonthCommission?.toLocaleString('pl-PL')} PLN</span>
                        </div>
                        {statistics.lastMonthTeamCommission > 0 && (
                          <div className="flex justify-between border-t border-gray-700 pt-2 mt-2">
                            <span>Prowizja z zespołu:</span>
                            <span className="font-bold text-indigo-400">{statistics.lastMonthTeamCommission?.toLocaleString('pl-PL')} PLN</span>
                          </div>
                        )}
                        {statistics.lastMonthTeamCommission > 0 && (
                          <div className="flex justify-between font-bold text-lg border-t border-gray-700 pt-2 mt-2">
                            <span>Łącznie:</span>
                            <span className="text-green-400">{((statistics.lastMonthCommission || 0) + (statistics.lastMonthTeamCommission || 0)).toLocaleString('pl-PL')} PLN</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12 text-lg text-darksubtle">Brak danych statystycznych</div>
              )}
            </div>
          </motion.section>
        )}

        {/* Network Tab */}
        {activeTab === 'network' && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-6"
          >
            {/* Panel z reflinkami */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 }}
              className="card bg-gradient-to-br from-indigo-600 to-purple-700 text-white"
            >
              <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Users className="w-6 h-6" />
                Twoje Reflinki
              </h3>
              <p className="text-indigo-100 mb-6 text-sm">
                Udostępniaj swoje linki polecające, aby rozwijać swoją sieć i zarabiać prowizje
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Reflink dla rejestracji sprzedawców */}
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                  <p className="text-sm text-indigo-100 mb-2 font-medium">Rejestracja Sprzedawców</p>
                  <div className="flex items-center gap-2">
                    <input 
                      type="text" 
                      value={generateSellerReflink(user?.id || 0)}
                      readOnly
                      className="flex-1 px-3 py-2 bg-white/20 rounded text-sm text-white border border-white/30 focus:outline-none"
                    />
                    <button
                      onClick={() => copyReflinkToClipboard(generateSellerReflink(user?.id || 0), 'seller')}
                      className="px-4 py-2 bg-white text-indigo-600 rounded hover:bg-indigo-50 transition-colors font-medium text-sm whitespace-nowrap"
                    >
                      Kopiuj
                    </button>
                  </div>
                  <p className="text-xs text-indigo-100 mt-2">
                    Zaproszono: <span className="font-bold">{referralStats.sellerReferrals}</span> sprzedawców
                  </p>
                  <div className="mt-3 pt-3 border-t border-white/20">
                    <p className="text-xs text-yellow-200 font-medium flex items-start gap-1">
                      <span className="text-base">💰</span>
                      <span>Zarabiaj <span className="font-bold text-yellow-100">10%</span> z obrotu wszystkich zarejestrowanych przez Ciebie sprzedawców</span>
                    </p>
                  </div>
                </div>

                {/* Reflink dla leadów */}
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                  <p className="text-sm text-indigo-100 mb-2 font-medium">Leady / Kontakty</p>
                  <div className="flex items-center gap-2">
                    <input 
                      type="text" 
                      value={generateReflink(user?.id || 0)}
                      readOnly
                      className="flex-1 px-3 py-2 bg-white/20 rounded text-sm text-white border border-white/30 focus:outline-none"
                    />
                    <button
                      onClick={() => copyReflinkToClipboard(generateReflink(user?.id || 0), 'lead')}
                      className="px-4 py-2 bg-white text-purple-600 rounded hover:bg-purple-50 transition-colors font-medium text-sm whitespace-nowrap"
                    >
                      Kopiuj
                    </button>
                  </div>
                  <p className="text-xs text-indigo-100 mt-2">
                    Używaj tego linka do zbierania leadów
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Statystyki network */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="card bg-gradient-to-br from-purple-600 to-purple-700 text-white"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-purple-100 text-sm">Zaproszeni sprzedawcy</p>
                    <p className="text-3xl font-bold">{referralStats.sellerReferrals}</p>
                  </div>
                  <Users className="w-8 h-8 text-purple-200" />
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="card bg-gradient-to-br from-green-600 to-green-700 text-white"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-green-100 text-sm">Prowizja w tym miesiącu</p>
                    <p className="text-3xl font-bold">{statistics?.thisMonthTeamCommission?.toLocaleString('pl-PL') || 0} PLN</p>
                  </div>
                  <DollarSign className="w-8 h-8 text-green-200" />
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="card bg-gradient-to-br from-indigo-600 to-indigo-700 text-white"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-indigo-100 text-sm">Prowizja łącznie</p>
                    <p className="text-3xl font-bold">{statistics?.totalTeamCommission?.toLocaleString('pl-PL') || 0} PLN</p>
                  </div>
                  <TrendingUp className="w-8 h-8 text-indigo-200" />
                </div>
              </motion.div>
            </div>

            {/* Lista poleconych użytkowników */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="card"
            >
              <h3 className="text-lg font-semibold text-darktext mb-4">Poleceni użytkownicy</h3>
              {loadingReferrals ? (
                <div className="text-center py-8 text-darksubtle">Ładowanie...</div>
              ) : referredUsers.length > 0 ? (
                <>
                  {/* Mobile: karty */}
                  <div className="flex flex-col gap-4 sm:hidden mb-6">
                    {referredUsers.map(referredUser => (
                      <div key={referredUser.id} className="bg-darkbg rounded-xl shadow-lg p-4 border border-gray-800">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-primary-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                              {referredUser.email.charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <p className="font-medium text-darktext">{referredUser.email}</p>
                              <p className="text-xs text-darksubtle">
                                {new Date(referredUser.createdAt).toLocaleDateString('pl-PL')}
                              </p>
                            </div>
                          </div>
                        </div>
                        
                        <div className="space-y-2 mb-3">
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-darksubtle">Rola:</span>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              referredUser.role === 'seller' || referredUser.role === 'management' || referredUser.role === 'admin'
                                ? 'bg-purple-600 text-white' 
                                : 'bg-gray-600 text-white'
                            }`}>
                              {referredUser.role === 'seller' ? 'Sprzedawca' : 
                               referredUser.role === 'management' ? 'Zarząd' :
                               referredUser.role === 'admin' ? 'Administrator' : 'Użytkownik'}
                            </span>
                          </div>
                          
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-darksubtle">Obrót:</span>
                            <span className="text-sm font-bold text-green-400">
                              {referredUser.revenue?.toLocaleString('pl-PL') || 0} PLN
                            </span>
                          </div>
                          
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-darksubtle">Zamówienia:</span>
                            <span className="text-sm font-medium text-darktext">
                              {referredUser.ordersCount || 0}
                            </span>
                          </div>
                        </div>
                        
                        {/* Rozwinięte zamówienia mobile */}
                        {expandedUserId === referredUser.id && userOrders.length > 0 && (
                          <div className="space-y-3 mb-3 p-3 bg-darkpanel rounded-lg border border-gray-700">
                            <h5 className="text-sm font-semibold text-darktext mb-2">Zamówienia</h5>
                            {userOrders.map(order => (
                              <div key={order.id} className="bg-darkbg rounded p-2 text-xs space-y-1">
                                <div className="flex items-center gap-2">
                                  <span className="font-mono text-primary-400">#{order.id}</span>
                                  <span className={`px-1.5 py-0.5 rounded text-xs font-medium ${
                                    order.status === 'paid' ? 'bg-green-900 text-green-300' :
                                    order.status === 'pending' ? 'bg-yellow-900 text-yellow-300' :
                                    'bg-red-900 text-red-300'
                                  }`}>
                                    {order.status === 'paid' ? 'Opłacone' : order.status === 'pending' ? 'Oczekujące' : 'Wygasłe'}
                                  </span>
                                </div>
                                <p className="text-darksubtle">{order.email || 'Brak email'}</p>
                                <p className="text-darksubtle">{new Date(order.createdAt).toLocaleDateString('pl-PL')}</p>
                              </div>
                            ))}
                          </div>
                        )}
                        
                        {referredUser.ordersCount > 0 && (
                          <button
                            onClick={() => toggleUserOrders(referredUser.id)}
                            className="btn-secondary w-full py-2 text-xs"
                          >
                            {expandedUserId === referredUser.id ? 'Ukryj' : 'Zobacz'} zamówienia ({referredUser.ordersCount})
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                  
                  {/* Desktop: tabela */}
                  <div className="hidden sm:block overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="border-b border-gray-700">
                        <th className="py-3 px-4 font-medium text-darksubtle">Email</th>
                        <th className="py-3 px-4 font-medium text-darksubtle">Rola</th>
                        <th className="py-3 px-4 font-medium text-darksubtle">Obrót</th>
                        <th className="py-3 px-4 font-medium text-darksubtle">Zamówienia</th>
                        <th className="py-3 px-4 font-medium text-darksubtle">Data rejestracji</th>
                        <th className="py-3 px-4 font-medium text-darksubtle">Akcje</th>
                      </tr>
                    </thead>
                    <tbody>
                      {referredUsers.map(referredUser => (
                        <>
                          <tr key={referredUser.id} className="border-t border-gray-700 hover:bg-darkbg/60">
                            <td className="py-3 px-4">
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center text-white font-bold text-xs">
                                  {referredUser.email.charAt(0).toUpperCase()}
                                </div>
                                <span className="font-medium">{referredUser.email}</span>
                              </div>
                            </td>
                            <td className="py-3 px-4">
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                referredUser.role === 'seller' || referredUser.role === 'management' || referredUser.role === 'admin'
                                  ? 'bg-purple-600 text-white' 
                                  : 'bg-gray-600 text-white'
                              }`}>
                                {referredUser.role === 'seller' ? 'Sprzedawca' : 
                                 referredUser.role === 'management' ? 'Zarząd' :
                                 referredUser.role === 'admin' ? 'Administrator' : 'Użytkownik'}
                              </span>
                            </td>
                            <td className="py-3 px-4">
                              <span className="font-bold text-green-400">
                                {referredUser.revenue?.toLocaleString('pl-PL') || 0} PLN
                              </span>
                            </td>
                            <td className="py-3 px-4 text-sm text-darksubtle">
                              {referredUser.ordersCount || 0}
                            </td>
                            <td className="py-3 px-4 text-sm text-darksubtle">
                              {new Date(referredUser.createdAt).toLocaleString('pl-PL', {
                                year: 'numeric',
                                month: '2-digit',
                                day: '2-digit',
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </td>
                            <td className="py-3 px-4">
                              {referredUser.ordersCount > 0 && (
                                <button
                                  onClick={() => toggleUserOrders(referredUser.id)}
                                  className="btn-secondary text-xs px-3 py-1"
                                >
                                  {expandedUserId === referredUser.id ? 'Ukryj' : 'Zobacz'} zamówienia
                                </button>
                              )}
                            </td>
                          </tr>
                          
                          {/* Rozwinięte zamówienia */}
                          {expandedUserId === referredUser.id && (
                            <tr>
                              <td colSpan={6} className="bg-darkbg/80 p-4 border-t border-b border-primary-700">
                                {loadingUserOrders ? (
                                  <div className="text-center py-4 text-darksubtle">Ładowanie zamówień...</div>
                                ) : userOrders.length > 0 ? (
                                  <div className="space-y-3">
                                    <h4 className="font-semibold text-darktext mb-3">Zamówienia sprzedawcy</h4>
                                    {userOrders.map(order => (
                                      <div key={order.id} className="bg-darkpanel rounded-lg p-3 border border-gray-700">
                                        <div className="flex flex-wrap items-center justify-between gap-3">
                                          <div className="flex-1 min-w-[200px]">
                                            <div className="flex items-center gap-2 mb-1">
                                              <span className="font-mono text-sm text-primary-400">#{order.id}</span>
                                              <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                                                order.status === 'paid' 
                                                  ? 'bg-green-900 text-green-300' 
                                                  : order.status === 'pending'
                                                  ? 'bg-yellow-900 text-yellow-300'
                                                  : 'bg-red-900 text-red-300'
                                              }`}>
                                                {order.status === 'paid' ? 'Opłacone' : order.status === 'pending' ? 'Oczekujące' : 'Wygasłe'}
                                              </span>
                                            </div>
                                            <p className="text-sm text-darksubtle">
                                              {order.email || 'Brak email'} • {order.phone || 'Brak telefonu'}
                                            </p>
                                          </div>
                                          
                                          <div className="flex items-center gap-4">
                                            <div>
                                              <p className="text-xs text-darksubtle">Typ</p>
                                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                                order.orderType === 'consultation' 
                                                  ? 'bg-blue-600 text-white' 
                                                  : order.orderType === 'collaboration'
                                                  ? 'bg-green-600 text-white'
                                                  : 'bg-purple-600 text-white'
                                              }`}>
                                                {order.orderType === 'consultation' ? 'Wycena' : 
                                                 order.orderType === 'collaboration' ? 'Współpraca' : 'Kod'}
                                              </span>
                                            </div>
                                            
                                            {order.software && (
                                              <div>
                                                <p className="text-xs text-darksubtle">Oprogramowanie</p>
                                                <p className="text-sm font-medium text-primary-400">{order.software.name}</p>
                                              </div>
                                            )}
                                            
                                            <div>
                                              <p className="text-xs text-darksubtle">Data</p>
                                              <p className="text-sm">
                                                {new Date(order.createdAt).toLocaleDateString('pl-PL')}
                                              </p>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                ) : (
                                  <div className="text-center py-4 text-darksubtle">Brak zamówień</div>
                                )}
                              </td>
                            </tr>
                          )}
                        </>
                      ))}
                    </tbody>
                  </table>
                  </div>
                </>
              ) : (
                <div className="text-center py-12">
                  <Users className="w-16 h-16 text-darksubtle mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-darktext mb-2">Brak poleceń</h3>
                  <p className="text-darksubtle mb-4">
                    Udostępnij swój reflink, aby zaprosić nowych użytkowników i sprzedawców.
                  </p>
                </div>
              )}
            </motion.div>
          </motion.section>
        )}
      </div>

      {/* Modal dodawania leada */}
      {isAddLeadModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-darkpanel rounded-lg p-6 w-full max-w-xl mx-4 border border-gray-800"
          >
            <h3 className="text-lg font-semibold mb-4 text-darktext">Dodaj nowego leada</h3>
            <form className="space-y-4" onSubmit={async (e) => {
              e.preventDefault();
              const form = e.target as any;
              const newLead = {
                email: form.email.value,
                phone: form.phone.value,
                info: form.info.value,
                selectedCategory: form.selectedCategory.value,
                selectedSoftware: showSoftwareTemplate ? form.selectedSoftware.value : null,
                sellerId: user?.id // Dodajemy sellerId
              };

              try {
                const response = await fetch('/api/seller/leads', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify(newLead)
                });

                const data = await response.json();

                if (response.ok) {
                  toast.success('Lead został dodany pomyślnie');
                  setIsAddLeadModalOpen(false);
                  setShowSoftwareTemplate(false);
                  fetchLeads();
                } else {
                  toast.error(data.error || 'Błąd podczas dodawania leada');
                }
              } catch (error) {
                toast.error('Błąd podczas dodawania leada');
              }
            }}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-darksubtle mb-1">Email</label>
                  <input 
                    name="email" 
                    type="email" 
                    className="w-full px-3 py-2 border border-gray-700 rounded-lg bg-darkbg text-darktext" 
                    placeholder="email@example.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-darksubtle mb-1">Telefon</label>
                  <input 
                    name="phone" 
                    type="tel" 
                    className="w-full px-3 py-2 border border-gray-700 rounded-lg bg-darkbg text-darktext" 
                    placeholder="+48 123 456 789"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-darksubtle mb-1">Kategoria</label>
                <select 
                  name="selectedCategory" 
                  className="w-full px-3 py-2 border border-gray-700 rounded-lg bg-darkbg text-darktext"
                  required
                >
                  <option value="">Wybierz kategorię...</option>
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-darksubtle mb-1">Dodatkowe informacje</label>
                <textarea 
                  name="info" 
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-700 rounded-lg bg-darkbg text-darktext" 
                  placeholder="Opisz wymagania klienta..."
                />
              </div>
              
              {/* Checkbox dla szablonu oprogramowania */}
              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="showSoftwareTemplate"
                  id="showSoftwareTemplate"
                  checked={showSoftwareTemplate}
                  className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-700 rounded bg-darkbg"
                  onChange={(e) => setShowSoftwareTemplate(e.target.checked)}
                />
                <label htmlFor="showSoftwareTemplate" className="text-sm text-darktext">
                  Chcę wybrać szablon oprogramowania
                </label>
              </div>
              
              {/* Select dla szablonu oprogramowania - pokazuje się tylko gdy checkbox jest zaznaczony */}
              {showSoftwareTemplate && (
                <div>
                  <label className="block text-sm font-medium text-darksubtle mb-1">Wybierz szablon oprogramowania</label>
                  <select
                    name="selectedSoftware"
                    className="w-full px-3 py-2 border border-gray-700 rounded-lg bg-darkbg text-darktext"
                    required={showSoftwareTemplate}
                  >
                    <option value="">Wybierz szablon...</option>
                    {softwares.map(software => (
                      <option key={software.id} value={software.id}>
                        {software.name}
                      </option>
                    ))}
                  </select>
                </div>
              )}
              
              <div className="flex justify-end space-x-3 pt-4">
                <button 
                  type="button" 
                  onClick={() => {
                    setIsAddLeadModalOpen(false);
                    setShowSoftwareTemplate(false);
                  }} 
                  className="btn-secondary"
                >
                  Anuluj
                </button>
                <button type="submit" className="btn-primary">Dodaj leada</button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      {/* Modal edycji leada */}
      {isEditLeadModalOpen && editLead && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-darkpanel rounded-lg p-6 w-full max-w-md mx-4 border border-gray-800"
          >
            <h3 className="text-lg font-semibold mb-4 text-darktext">Edytuj leada #{editLead.id}</h3>
            <div className="mb-4 p-3 bg-darkbg rounded-lg border border-gray-700">
              <p className="text-sm text-darksubtle">Email:</p>
              <p className="font-medium text-darktext">{editLead.email || 'Brak'}</p>
              <p className="text-sm text-darksubtle mt-2">Telefon:</p>
              <p className="font-medium text-darktext">{editLead.phone || 'Brak'}</p>
            </div>
            <form className="space-y-4" onSubmit={async (e) => {
              e.preventDefault();
              const form = e.target as any;

              try {
                const response = await fetch(`/api/seller/leads?id=${editLead.id}`, {
                  method: 'PATCH',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({
                    status: form.status.value,
                    info: form.info.value
                  })
                });

                const data = await response.json();

                if (response.ok) {
                  toast.success('Lead został zaktualizowany');
                  setIsEditLeadModalOpen(false);
                  setEditLead(null);
                  fetchLeads();
                } else {
                  toast.error(data.error || 'Błąd podczas aktualizacji leada');
                }
              } catch (error) {
                toast.error('Błąd podczas aktualizacji leada');
              }
            }}>
              <div>
                <label className="block text-sm font-medium text-darksubtle mb-1">Status</label>
                <select 
                  name="status" 
                  defaultValue={editLead.status}
                  className="w-full px-3 py-2 border border-gray-700 rounded-lg bg-darkbg text-darktext"
                >
                  <option value="pending">Oczekujący</option>
                  <option value="first_payment">Po pierwszej zaliczce</option>
                  <option value="second_payment">Po drugiej zaliczce</option>
                  <option value="paid">Opłacony</option>
                  <option value="rejected">Odrzucony</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-darksubtle mb-1">Notatki</label>
                <textarea 
                  name="info" 
                  defaultValue={editLead.info || ''}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-700 rounded-lg bg-darkbg text-darktext" 
                  placeholder="Dodaj notatki o kliencie..."
                />
              </div>
              
              <div className="flex justify-end space-x-3 pt-4">
                <button 
                  type="button" 
                  onClick={() => { setIsEditLeadModalOpen(false); setEditLead(null) }} 
                  className="btn-secondary"
                >
                  Anuluj
                </button>
                <button type="submit" className="btn-primary">Zapisz zmiany</button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      {/* Modal Profilu */}
      {isProfileModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-darkpanel p-6 rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto"
          >
            <ProfileModal 
              user={user}
              onClose={() => setIsProfileModalOpen(false)}
              onUpdate={(updatedUser) => {
                setUser(prev => prev ? { ...prev, ...updatedUser } : null)
              }}
            />
          </motion.div>
        </div>
      )}
    </div>
  )
}

// Komponent Modal Profilu
function ProfileModal({ 
  user, 
  onClose, 
  onUpdate 
}: { 
  user: any, 
  onClose: () => void, 
  onUpdate: (user: any) => void 
}) {
  const [activeProfileTab, setActiveProfileTab] = useState<'info' | 'avatar' | 'password'>('info')
  const [userProfile, setUserProfile] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [bio, setBio] = useState('')
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [uploading, setUploading] = useState(false)

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        console.log('Fetching profile...')
        const res = await fetch('/api/user/profile', {
          method: 'GET',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
        })
        console.log('Profile fetch response status:', res.status)
        const data = await res.json()
        console.log('Profile fetch data:', data)
        
        if (data.user) {
          // Dodaj rolę z głównego stanu użytkownika jeśli nie ma w profilu
          const profileWithRole = {
            ...data.user,
            role: data.user.role || user?.role || 'user'
          }
          setUserProfile(profileWithRole)
          setFirstName(data.user.firstName || '')
          setLastName(data.user.lastName || '')
          setBio(data.user.bio || '')
        } else if (data.error) {
          toast.error(`Błąd pobierania profilu: ${data.error}`)
        }
      } catch (error) {
        console.error('Profile fetch error:', error)
        toast.error('Błąd pobierania profilu')
      } finally {
        setLoading(false)
      }
    }
    fetchProfile()
  }, [])

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    
    try {
      console.log('Updating profile with data:', { firstName, lastName, bio })
      const res = await fetch('/api/user/profile', {
        method: 'PATCH',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ firstName, lastName, bio })
      })
      
      console.log('Profile update response status:', res.status)
      const data = await res.json()
      console.log('Profile update response data:', data)
      
      if (data.success) {
        setUserProfile(data.user)
        onUpdate(data.user)
        toast.success('Profil zaktualizowany pomyślnie')
      } else {
        toast.error(data.error || 'Błąd aktualizacji profilu')
      }
    } catch (error) {
      console.error('Profile update error:', error)
      toast.error('Błąd aktualizacji profilu')
    } finally {
      setLoading(false)
    }
  }

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (newPassword !== confirmPassword) {
      toast.error('Nowe hasła nie są zgodne')
      return
    }
    
    if (newPassword.length < 6) {
      toast.error('Nowe hasło musi mieć co najmniej 6 znaków')
      return
    }
    
    setLoading(true)
    
    try {
      const res = await fetch('/api/user/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentPassword, newPassword })
      })
      
      const data = await res.json()
      if (data.success) {
        toast.success('Hasło zostało zmienione pomyślnie')
        setCurrentPassword('')
        setNewPassword('')
        setConfirmPassword('')
      } else {
        toast.error(data.error || 'Błąd zmiany hasła')
      }
    } catch (error) {
      toast.error('Błąd zmiany hasła')
    } finally {
      setLoading(false)
    }
  }

  const handleAvatarUpload = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      toast.error('Plik musi być obrazem')
      return
    }
    
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Plik jest za duży (max 5MB)')
      return
    }
    
    setUploading(true)
    
    try {
      const formData = new FormData()
      formData.append('file', file)
      
      const res = await fetch('/api/user/upload-avatar', {
        method: 'POST',
        body: formData
      })
      
      const data = await res.json()
      console.log('Upload response:', data)
      
      if (data.success) {
        setUserProfile((prev: any) => ({ ...prev, profileImageUrl: data.imageUrl }))
        onUpdate({ profileImageUrl: data.imageUrl })
        toast.success('Zdjęcie profilowe zostało zaktualizowane')
      } else {
        console.error('Upload error details:', data)
        toast.error(data.error || 'Błąd uploadu zdjęcia')
      }
    } catch (error) {
      console.error('Upload catch error:', error)
      toast.error('Błąd uploadu zdjęcia')
    } finally {
      setUploading(false)
    }
  }

  if (loading && !userProfile) {
    return <div className="text-center py-8">Ładowanie profilu...</div>
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-darktext">Mój Profil</h2>
        <button 
          onClick={onClose}
          className="text-darksubtle hover:text-darktext transition-colors"
        >
          ✕
        </button>
      </div>

      {/* Tabs profilu */}
      <div className="flex space-x-2 mb-6 border-b border-gray-700">
        <button
          onClick={() => setActiveProfileTab('info')}
          className={`px-4 py-2 rounded-t-lg transition-colors ${
            activeProfileTab === 'info' 
              ? 'bg-darkbg text-white border-b-2 border-blue-500' 
              : 'text-darksubtle hover:text-darktext'
          }`}
        >
          Informacje
        </button>
        <button
          onClick={() => setActiveProfileTab('avatar')}
          className={`px-4 py-2 rounded-t-lg transition-colors ${
            activeProfileTab === 'avatar' 
              ? 'bg-darkbg text-white border-b-2 border-blue-500' 
              : 'text-darksubtle hover:text-darktext'
          }`}
        >
          Zdjęcie
        </button>
        <button
          onClick={() => setActiveProfileTab('password')}
          className={`px-4 py-2 rounded-t-lg transition-colors ${
            activeProfileTab === 'password' 
              ? 'bg-darkbg text-white border-b-2 border-blue-500' 
              : 'text-darksubtle hover:text-darktext'
          }`}
        >
          Hasło
        </button>
      </div>

      {/* Zawartość profilu */}
      {activeProfileTab === 'info' && (
        <form onSubmit={handleUpdateProfile}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-darktext mb-2">Email</label>
              <input
                type="email"
                value={userProfile?.email || ''}
                disabled
                className="w-full px-3 py-2 border border-gray-700 rounded-lg bg-gray-800 text-darksubtle cursor-not-allowed"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-darktext mb-2">Imię</label>
              <input
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="w-full px-3 py-2 border border-gray-700 rounded-lg bg-darkbg text-darktext"
                placeholder="Wpisz swoje imię"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-darktext mb-2">Nazwisko</label>
              <input
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="w-full px-3 py-2 border border-gray-700 rounded-lg bg-darkbg text-darktext"
                placeholder="Wpisz swoje nazwisko"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-darktext mb-2">Opis/Bio</label>
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-gray-700 rounded-lg bg-darkbg text-darktext"
                placeholder="Opowiedz o sobie..."
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-darktext mb-2">Rola</label>
              <input
                type="text"
                value={(() => {
                  const role = userProfile?.role || user?.role || ''
                  const roleNames = {
                    'admin': 'Administrator',
                    'seller': 'Sprzedawca',
                    'management': 'Zarząd',
                    'user': 'Użytkownik'
                  }
                  return roleNames[role as keyof typeof roleNames] || role
                })()}
                disabled
                className="w-full px-3 py-2 border border-gray-700 rounded-lg bg-gray-800 text-darksubtle cursor-not-allowed"
              />
            </div>
          </div>
          
          <div className="flex justify-end space-x-3 pt-6">
            <button type="button" onClick={onClose} className="btn-secondary">
              Anuluj
            </button>
            <button type="submit" disabled={loading} className="btn-primary">
              {loading ? 'Zapisywanie...' : 'Zapisz zmiany'}
            </button>
          </div>
        </form>
      )}

      {activeProfileTab === 'avatar' && (
        <div>
          <div className="text-center mb-6">
            <div className="w-32 h-32 mx-auto mb-4 rounded-full overflow-hidden bg-gray-700 flex items-center justify-center">
              {userProfile?.profileImageUrl ? (
                <img 
                  src={`${userProfile.profileImageUrl.replace('/upload/', '/upload/w_400,h_400,c_fill,g_face,q_auto,f_auto/')}?t=${Date.now()}`} 
                  alt="Profil" 
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    console.error('Image load error:', e);
                    (e.target as HTMLImageElement).style.display = 'none';
                  }}
                />
              ) : (
                <Users size={48} className="text-darksubtle" />
              )}
            </div>
            
            <p className="text-darksubtle mb-4">
              Wybierz nowe zdjęcie profilowe (max 5MB)
            </p>
            
            <label className="btn-primary cursor-pointer inline-block">
              {uploading ? 'Uploading...' : 'Wybierz zdjęcie'}
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0]
                  if (file) handleAvatarUpload(file)
                }}
                className="hidden"
                disabled={uploading}
              />
            </label>
          </div>
        </div>
      )}

      {activeProfileTab === 'password' && (
        <form onSubmit={handleChangePassword}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-darktext mb-2">Aktualne hasło</label>
              <input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="w-full px-3 py-2 border border-gray-700 rounded-lg bg-darkbg text-darktext"
                placeholder="Wpisz aktualne hasło"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-darktext mb-2">Nowe hasło</label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full px-3 py-2 border border-gray-700 rounded-lg bg-darkbg text-darktext"
                placeholder="Wpisz nowe hasło (min. 6 znaków)"
                required
                minLength={6}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-darktext mb-2">Potwierdź nowe hasło</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-3 py-2 border border-gray-700 rounded-lg bg-darkbg text-darktext"
                placeholder="Potwierdź nowe hasło"
                required
                minLength={6}
              />
            </div>
          </div>
          
          <div className="flex justify-end space-x-3 pt-6">
            <button type="button" onClick={onClose} className="btn-secondary">
              Anuluj
            </button>
            <button type="submit" disabled={loading} className="btn-primary">
              {loading ? 'Zmienianie...' : 'Zmień hasło'}
            </button>
          </div>
        </form>
      )}
    </div>
  )
} 