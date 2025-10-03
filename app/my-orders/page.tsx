'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { motion } from 'framer-motion'
import { Package, Calendar, Mail, Phone, FileText, ExternalLink } from 'lucide-react'
import toast from 'react-hot-toast'
import { formatPrice } from '@/lib/i18n'

export default function MyOrdersPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [orders, setOrders] = useState<any[]>([])
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    fetchUserAndOrders()
  }, [])

  const fetchUserAndOrders = async () => {
    try {
      // Sprawdź czy użytkownik jest zalogowany
      const userRes = await fetch('/api/auth/me')
      const userData = await userRes.json()
      
      if (!userData.user) {
        router.push('/')
        return
      }
      
      setUser(userData.user)

      // Pobierz zamówienia użytkownika
      const ordersRes = await fetch('/api/user/orders')
      const ordersData = await ordersRes.json()
      
      if (ordersRes.ok) {
        setOrders(ordersData.orders || [])
      } else {
        toast.error('Nie udało się pobrać zamówień')
      }
      
      setLoading(false)
    } catch (error) {
      console.error('Błąd pobierania zamówień:', error)
      toast.error('Nie udało się pobrać zamówień')
      setLoading(false)
    }
  }

  const getStatusBadge = (status: string) => {
    const statusConfig: Record<string, { label: string; color: string }> = {
      pending: { label: 'Oczekujące', color: 'bg-yellow-600' },
      paid: { label: 'Opłacone', color: 'bg-green-600' },
      processing: { label: 'W realizacji', color: 'bg-blue-600' },
      completed: { label: 'Zakończone', color: 'bg-green-700' },
      cancelled: { label: 'Anulowane', color: 'bg-red-600' },
    }
    
    const config = statusConfig[status] || { label: status, color: 'bg-gray-600' }
    
    return (
      <span className={`${config.color} text-white px-3 py-1 rounded-full text-xs font-semibold`}>
        {config.label}
      </span>
    )
  }

  const getOrderTypeLabel = (type: string) => {
    const types: Record<string, string> = {
      collaboration: 'Współpraca',
      code: 'Kod źródłowy',
      consultation: 'Konsultacja',
      custom_payment: 'Płatność niestandardowa'
    }
    return types[type] || type
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl text-darktext">Ładowanie...</div>
      </div>
    )
  }

  return (
    <>
      <Header />
      <div className="min-h-screen pt-24 pb-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-3xl font-bold mb-8 text-darktext flex items-center gap-3">
              <Package className="w-8 h-8" />
              Moje Zamówienia
            </h1>

            {orders.length === 0 ? (
              <div className="card text-center py-16">
                <Package className="w-16 h-16 mx-auto mb-4 text-darksubtle" />
                <p className="text-xl text-darksubtle mb-2">Brak zamówień</p>
                <p className="text-darksubtle">Nie masz jeszcze żadnych zamówień.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {orders.map((order) => (
                  <motion.div
                    key={order.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="card hover:shadow-xl transition-shadow"
                  >
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
                      <div>
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-xl font-semibold text-darktext">
                            Zamówienie #{order.id}
                          </h3>
                          {getStatusBadge(order.status)}
                        </div>
                        <div className="flex items-center gap-2 text-sm text-darksubtle">
                          <Calendar className="w-4 h-4" />
                          <span>{new Date(order.createdAt).toLocaleDateString('pl-PL', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}</span>
                        </div>
                      </div>
                      
                      <div className="text-left md:text-right">
                        <div className="text-sm text-darksubtle mb-1">Typ zamówienia</div>
                        <div className="text-lg font-semibold text-primary-400">
                          {getOrderTypeLabel(order.orderType)}
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-gray-700">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm">
                          <Mail className="w-4 h-4 text-darksubtle" />
                          <span className="text-darktext">{order.email}</span>
                        </div>
                        {order.phone && (
                          <div className="flex items-center gap-2 text-sm">
                            <Phone className="w-4 h-4 text-darksubtle" />
                            <span className="text-darktext">{order.phone}</span>
                          </div>
                        )}
                        {order.selectedCategory && (
                          <div className="flex items-center gap-2 text-sm">
                            <FileText className="w-4 h-4 text-darksubtle" />
                            <span className="text-darktext">Kategoria: {order.selectedCategory}</span>
                          </div>
                        )}
                      </div>

                      {order.info && (
                        <div className="md:col-span-2">
                          <div className="text-sm text-darksubtle mb-1">Dodatkowe informacje:</div>
                          <div className="text-sm text-darktext bg-darkbg p-3 rounded-lg">
                            {order.info}
                          </div>
                        </div>
                      )}

                      {order.files && order.files.length > 0 && (
                        <div className="md:col-span-2">
                          <div className="text-sm text-darksubtle mb-2">Załączone pliki:</div>
                          <div className="flex flex-wrap gap-2">
                            {order.files.map((file: any) => (
                              <a
                                key={file.id}
                                href={file.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-2 px-3 py-2 bg-darkbg hover:bg-primary-600/20 rounded-lg text-sm text-darktext transition-colors"
                              >
                                <FileText className="w-4 h-4" />
                                <span className="truncate max-w-[200px]">{file.originalName}</span>
                                <ExternalLink className="w-3 h-3" />
                              </a>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        </div>
      </div>
      <Footer />
    </>
  )
}

