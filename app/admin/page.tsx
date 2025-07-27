'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  Settings,
  BarChart3,
  Users,
  Package
} from 'lucide-react'
import toast from 'react-hot-toast'
import SoftwareFormModal from '@/components/SoftwareFormModal'
import AuthModal from '@/components/AuthModal'

interface Software {
  id: number
  name: string
  description: string
  price: number
  categories?: string[] | string
  demoUrl: string
  image: string
  features: string[]
  rating: number
  sales: number
  status: 'active' | 'inactive'
  thumbnailUrl?: string // dodane pole dla miniaturki
}

interface Component {
  id: number
  name: string
  priceFrom: number
  priceTo: number
  notes: string
}

export default function AdminPanel() {
  const [activeTab, setActiveTab] = useState<'software' | 'users' | 'orders' | 'components'>('software')
  const [software, setSoftware] = useState<Software[]>([])
  const [loading, setLoading] = useState(false)

  const [selectedSoftware, setSelectedSoftware] = useState<Software | null>(null)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [tab, setTab] = useState<'software' | 'orders'>('software')
  const [orders, setOrders] = useState<any[]>([])
  const [loadingOrders, setLoadingOrders] = useState(false)
  const [expandedOrderId, setExpandedOrderId] = useState<number | null>(null)
  const [users, setUsers] = useState<any[]>([])
  const [loadingUsers, setLoadingUsers] = useState(false)
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [components, setComponents] = useState<Component[]>([])
  const [loadingComponents, setLoadingComponents] = useState(false)
  const [isAddComponentModalOpen, setIsAddComponentModalOpen] = useState(false)
  // Dodaj stan do edycji komponentu
  const [editComponent, setEditComponent] = useState<Component | null>(null)
  const [isEditComponentModalOpen, setIsEditComponentModalOpen] = useState(false)
  const [softwareToEdit, setSoftwareToEdit] = useState<Software | null>(null)
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all')

  const [authChecked, setAuthChecked] = useState(false)
  const [showLogin, setShowLogin] = useState(false)
  const [user, setUser] = useState<{ email: string; isAdmin: boolean } | null>(null)

  // Dodaję fetchSoftwares do pobierania oprogramowań z bazy
  const fetchSoftwares = async () => {
    setLoading(true)
    const res = await fetch('/api/admin/softwares')
    const data = await res.json()
    setSoftware(data.softwares || [])
    setLoading(false)
  }

  // 3. Funkcja pobierająca komponenty
  const fetchComponents = async () => {
    setLoadingComponents(true)
    const res = await fetch('/api/admin/components')
    const data = await res.json()
    setComponents(data.components || [])
    setLoadingComponents(false)
  }

  // 4. Funkcja pobierająca zamówienia
  const fetchOrders = async () => {
    setLoadingOrders(true)
    try {
      const res = await fetch('/api/admin/orders')
      const data = await res.json()
      setOrders(data.orders || [])
    } catch (error) {
      console.error('Błąd pobierania zamówień:', error)
      toast.error('Błąd pobierania zamówień')
    } finally {
      setLoadingOrders(false)
    }
  }

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch('/api/auth/me')
        const data = await res.json()
        console.log('API /api/auth/me response:', data)
        if (data.user && data.user.isAdmin) {
          console.log('user is admin:', data.user)
          setUser(data.user)
          setShowLogin(false)
        } else {
          console.log('user is not admin or not logged in:', data.user)
          setUser(null)
          setShowLogin(true)
        }
      } catch (e) {
        console.log('error in checkAuth:', e)
        setUser(null)
        setShowLogin(true)
      } finally {
        setAuthChecked(true)
      }
    }
    checkAuth()
  }, [])

  useEffect(() => {
    if (activeTab === 'software') {
      fetchSoftwares()
    }
    if (activeTab === 'orders') {
      fetchOrders()
    }
    if (activeTab === 'users') {
      setLoadingUsers(true)
      fetch('/api/admin/users')
        .then(res => res.json())
        .then(data => setUsers(data.users || []))
        .finally(() => setLoadingUsers(false))
    }
    if (activeTab === 'components') {
      fetchComponents()
    }
  }, [activeTab])

  if (!authChecked) {
    return <div className="min-h-screen flex items-center justify-center text-darksubtle">Sprawdzanie uprawnień...</div>
  }
  if (showLogin) {
    return <div className="min-h-screen flex items-center justify-center bg-darkbg text-darktext">
      <div className="max-w-sm w-full">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold">Panel Administracyjny</h2>
          <p className="text-darksubtle mt-2">Dostęp tylko dla administratora</p>
        </div>
        <AuthModal isOpen={true} onClose={() => {}} onAuthSuccess={() => window.location.reload()} />
      </div>
    </div>
  }

  const filteredSoftware = software.filter(item => statusFilter === 'all' || item.status === statusFilter)
  
  const stats = [
    { title: 'Wszystkie oprogramowanie', value: software.length, icon: Package, color: 'text-primary-500' },
    { title: 'Aktywne', value: software.filter(s => s.status === 'active').length, icon: Eye, color: 'text-green-600' },
    { title: 'Wyświetlane', value: filteredSoftware.length, icon: BarChart3, color: 'text-purple-600' },
    { title: 'Średnia ocena', value: software.length > 0 ? (software.reduce((sum, s) => sum + s.rating, 0) / software.length).toFixed(1) : '0.0', icon: Users, color: 'text-orange-600' }
  ]

  const handleEdit = (software: Software) => {
    setSelectedSoftware(software)
    setIsEditModalOpen(true)
  }

  const handleDelete = (id: number) => {
    if (confirm('Czy na pewno chcesz usunąć to oprogramowanie?')) {
      setSoftware(software.filter(s => s.id !== id))
    }
  }

  const handleSave = (updatedSoftware: Software) => {
    setSoftware(software.map(s => s.id === updatedSoftware.id ? updatedSoftware : s))
    setIsEditModalOpen(false)
    setSelectedSoftware(null)
  }

  // Funkcja do zmiany statusu oprogramowania
  const handleStatusToggle = async (softwareId: number, currentStatus: string) => {
    const newStatus = currentStatus === 'active' ? 'inactive' : 'active'
    
    try {
      const response = await fetch(`/api/admin/softwares?id=${softwareId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          status: newStatus
        })
      })

      if (response.ok) {
        // Aktualizuj lokalny stan
        setSoftware(software.map(s => 
          s.id === softwareId ? { ...s, status: newStatus as 'active' | 'inactive' } : s
        ))
        toast.success(`Status zmieniony na ${newStatus === 'active' ? 'aktywny' : 'nieaktywny'}`)
      } else {
        toast.error('Błąd podczas zmiany statusu')
      }
    } catch (error) {
      console.error('Error toggling status:', error)
      toast.error('Błąd podczas zmiany statusu')
    }
  }

  return (
    <div className="min-h-screen bg-darkbg text-darktext">
      <header className="bg-darkpanel shadow-sm border-b border-gray-800">
        <div className="container mx-auto px-2 sm:px-4 py-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-3">
              <img src="/logo-wsp-edu.png" alt="Logo" className="w-10 h-10 rounded-lg object-contain p-1" />
              <h1 className="text-2xl font-bold text-darktext">Panel Administracyjny</h1>
            </div>
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 w-full sm:w-auto">
              <button className="btn-primary flex items-center justify-center space-x-2 w-full sm:w-auto" onClick={() => setIsAddModalOpen(true)}>
                <Plus className="w-4 h-4" />
                <span>Dodaj oprogramowanie</span>
              </button>
              <button
                className="btn-secondary text-sm px-4 py-2 w-full sm:w-auto"
                onClick={async () => {
                  await fetch('/api/auth/logout', { method: 'POST' })
                  window.location.reload()
                }}
              >Wyloguj się</button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-2 sm:px-4 py-4 sm:py-8">
        {/* Tabs */}
        <div className="flex space-x-2 mb-6 border-b border-gray-800 overflow-x-auto whitespace-nowrap scrollbar-thin scrollbar-thumb-darkbg scrollbar-track-transparent">
          <button
            className={`px-6 py-2 font-medium transition-colors duration-200 border-b-2 ${activeTab === 'software' ? 'border-primary-500 text-primary-500' : 'border-transparent text-darksubtle hover:text-primary-400'}`}
            onClick={() => setActiveTab('software')}
          >
            Oprogramowania
          </button>
          <button
            className={`px-6 py-2 font-medium transition-colors duration-200 border-b-2 ${activeTab === 'users' ? 'border-primary-500 text-primary-500' : 'border-transparent text-darksubtle hover:text-primary-400'}`}
            onClick={() => setActiveTab('users')}
          >
            Użytkownicy
          </button>
          <button
            className={`px-6 py-2 font-medium transition-colors duration-200 border-b-2 ${activeTab === 'orders' ? 'border-primary-500 text-primary-500' : 'border-transparent text-darksubtle hover:text-primary-400'}`}
            onClick={() => setActiveTab('orders')}
          >
            Zamówienia
          </button>
          <button
            className={`px-6 py-2 font-medium transition-colors duration-200 border-b-2 ${activeTab === 'components' ? 'border-primary-500 text-primary-500' : 'border-transparent text-darksubtle hover:text-primary-400'}`}
            onClick={() => setActiveTab('components')}
          >
            Komponenty
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === 'software' && (
          <>
            {/* Stats */}
            <motion.section 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="grid grid-cols-1 md:grid-cols-4 gap-4 md:gap-6 mb-6"
            >
              {stats.map((stat, index) => (
                <motion.div
                  key={stat.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="card min-w-[180px]"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-darksubtle">{stat.title}</p>
                      <p className="text-2xl font-bold text-darktext">{stat.value}</p>
                    </div>
                    <div className={`w-12 h-12 rounded-lg bg-darkbg flex items-center justify-center ${stat.color}`}>
                      <stat.icon className="w-6 h-6" />
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.section>

            {/* Software List */}
            <motion.section 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="card"
            >
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
                <h2 className="text-xl font-semibold text-darktext">Zarządzanie oprogramowaniami</h2>
                <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 w-full sm:w-auto">
                  <select className="px-3 py-2 border border-gray-700 rounded-lg text-sm bg-darkpanel text-darktext w-full sm:w-auto">
                    <option className="bg-darkpanel text-darktext">Wszystkie kategorie</option>
                    <option className="bg-darkpanel text-darktext">E-commerce</option>
                    <option className="bg-darkpanel text-darktext">Business</option>
                    <option className="bg-darkpanel text-darktext">Content</option>
                  </select>
                  <select 
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value as 'all' | 'active' | 'inactive')}
                    className="px-3 py-2 border border-gray-700 rounded-lg text-sm bg-darkpanel text-darktext w-full sm:w-auto"
                  >
                    <option value="all" className="bg-darkpanel text-darktext">Wszystkie statusy</option>
                    <option value="active" className="bg-darkpanel text-darktext">Aktywne</option>
                    <option value="inactive" className="bg-darkpanel text-darktext">Nieaktywne</option>
                  </select>
                </div>
              </div>

              {loading ? (
                <div className="text-center py-12 text-lg text-darksubtle">Ładowanie danych...</div>
              ) : (
                <>
                  {/* Mobile: karty */}
                  <div className="flex flex-col gap-4 sm:hidden">
                    {filteredSoftware.map((item) => (
                      <div key={item.id} className="bg-darkpanel rounded-xl shadow-lg p-4 border border-gray-800">
                        <div className="flex items-center gap-3 mb-2">
                          {item.thumbnailUrl && (
                            <img src={item.thumbnailUrl} alt={item.name} className="w-14 h-14 rounded-lg object-cover border border-gray-800" />
                          )}
                          <div>
                            <p className="font-medium text-darktext text-lg">{item.name}</p>
                            <p className="text-xs text-darksubtle">{item.description.substring(0, 50)}...</p>
                          </div>
                        </div>
                        <div className="flex flex-wrap gap-1 mb-2">
                          {(Array.isArray(item.categories) ? item.categories : JSON.parse(item.categories || '[]')).map((cat: string, idx: number) => (
                            <span key={cat} className="bg-primary-600 text-white px-2 py-1 rounded-full text-xs font-medium mr-1">
                              {cat}
                            </span>
                          ))}
                        </div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-primary-400 font-bold text-base">{item.price.toLocaleString('pl-PL')} zł</span>
                          <span className="text-darksubtle text-xs">Sprzedaże: {item.sales}</span>
                        </div>
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-yellow-500">★</span>
                          <span className="text-darksubtle">{item.rating}</span>
                          <span className={`px-2 py-1 rounded-full text-xs ${item.status === 'active' ? 'bg-green-900 text-green-300 border border-green-800' : 'bg-red-900 text-red-300 border border-red-800'}`}>{item.status === 'active' ? 'Aktywne' : 'Nieaktywne'}</span>
                        </div>
                        <div className="flex gap-2 mt-2">
                          <button onClick={() => { setSoftwareToEdit(item); setIsEditModalOpen(true) }} className="btn-primary flex-1 py-2 text-xs">Edytuj</button>
                          <button onClick={() => window.open(`/demo/${item.id}`, '_blank')} className="btn-secondary flex-1 py-2 text-xs">Zobacz</button>
                          <button 
                            onClick={() => handleStatusToggle(item.id, item.status)} 
                            className={`flex-1 py-2 text-xs rounded-lg ${item.status === 'active' ? 'bg-orange-700 hover:bg-orange-800 text-white' : 'bg-green-700 hover:bg-green-800 text-white'}`}
                          >
                            {item.status === 'active' ? 'Dezaktywuj' : 'Aktywuj'}
                          </button>
                          <button onClick={async () => { if (confirm('Czy na pewno chcesz usunąć to oprogramowanie?')) { await fetch(`/api/admin/softwares?id=${item.id}`, { method: 'DELETE' }); fetchSoftwares(); } }} className="bg-red-700 hover:bg-red-800 text-white rounded-lg px-2 py-2 text-xs">Usuń</button>
                        </div>
                      </div>
                    ))}
                  </div>
                  {/* Desktop: tabela */}
                  <div className="overflow-x-auto hidden sm:block">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-gray-800">
                          <th className="text-left py-3 px-4 font-medium text-darksubtle">Nazwa</th>
                          <th className="text-left py-3 px-4 font-medium text-darksubtle">Kategoria</th>
                          <th className="text-left py-3 px-4 font-medium text-darksubtle">Cena</th>
                          <th className="text-left py-3 px-4 font-medium text-darksubtle">Sprzedaże</th>
                          <th className="text-left py-3 px-4 font-medium text-darksubtle">Ocena</th>
                          <th className="text-left py-3 px-4 font-medium text-darksubtle">Status</th>
                          <th className="text-left py-3 px-4 font-medium text-darksubtle">Akcje</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredSoftware.map((item) => (
                          <tr key={item.id} className="border-b border-gray-900 hover:bg-darkbg/60">
                            <td className="py-4 px-4">
                              <div className="flex items-center space-x-3">
                                {item.thumbnailUrl && (
                                  <img src={item.thumbnailUrl} alt={item.name} className="w-12 h-12 rounded-lg object-cover border border-gray-800" />
                                )}
                                <div>
                                  <p className="font-medium text-darktext">{item.name}</p>
                                  <p className="text-sm text-darksubtle">{item.description.substring(0, 50)}...</p>
                                </div>
                              </div>
                            </td>
                            <td className="py-4 px-4">
                              <div className="flex flex-wrap gap-1">
                                {(Array.isArray(item.categories) ? item.categories : JSON.parse(item.categories || '[]')).map((cat: string, idx: number) => (
                                  <span key={cat} className="bg-primary-600 text-white px-2 py-1 rounded-full text-xs font-medium mr-1">
                                    {cat}
                                  </span>
                                ))}
                              </div>
                            </td>
                            <td className="py-4 px-4 font-medium text-darktext">
                              {item.price.toLocaleString('pl-PL')} zł
                            </td>
                            <td className="py-4 px-4 text-darksubtle">{item.sales}</td>
                            <td className="py-4 px-4">
                              <div className="flex items-center space-x-1">
                                <span className="text-yellow-500">★</span>
                                <span className="text-darksubtle">{item.rating}</span>
                              </div>
                            </td>
                            <td className="py-4 px-4">
                              <span className={`px-2 py-1 rounded-full text-xs ${item.status === 'active' ? 'bg-green-900 text-green-300 border border-green-800' : 'bg-red-900 text-red-300 border border-red-800'}`}>{item.status === 'active' ? 'Aktywne' : 'Nieaktywne'}</span>
                            </td>
                            <td className="py-4 px-4">
                              <div className="flex space-x-2">
                                <button onClick={() => { setSoftwareToEdit(item); setIsEditModalOpen(true) }} className="text-primary-500 hover:text-primary-300 p-1" title="Edytuj"><Edit className="w-4 h-4" /></button>
                                <button onClick={() => window.open(`/demo/${item.id}`, '_blank')} className="text-green-400 hover:text-green-300 p-1" title="Zobacz demo"><Eye className="w-4 h-4" /></button>
                                <button 
                                  onClick={() => handleStatusToggle(item.id, item.status)} 
                                  className={`p-1 ${item.status === 'active' ? 'text-orange-400 hover:text-orange-300' : 'text-green-400 hover:text-green-300'}`} 
                                  title={item.status === 'active' ? 'Dezaktywuj' : 'Aktywuj'}
                                >
                                  {item.status === 'active' ? '⏸️' : '▶️'}
                                </button>
                                <button onClick={async () => { if (confirm('Czy na pewno chcesz usunąć to oprogramowanie?')) { await fetch(`/api/admin/softwares?id=${item.id}`, { method: 'DELETE' }); fetchSoftwares(); } }} className="text-red-400 hover:text-red-300 p-1" title="Usuń"><Trash2 className="w-4 h-4" /></button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </>
              )}
            </motion.section>
          </>
        )}
        {activeTab === 'users' && (
          <motion.section 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="card"
          >
            <h2 className="text-xl font-bold mb-4">Użytkownicy</h2>
            {loadingUsers ? (
              <div className="text-center py-12 text-lg text-darksubtle">Ładowanie danych...</div>
            ) : (
              <table className="w-full text-left">
                <thead>
                  <tr>
                    <th className="py-2">ID</th>
                    <th className="py-2">Email</th>
                    <th className="py-2">Data rejestracji</th>
                    <th className="py-2">Zgoda na regulamin</th>
                    <th className="py-2">Zgoda marketingowa</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map(user => (
                    <tr key={user.id} className="border-t border-gray-700">
                      <td className="py-2">{user.id}</td>
                      <td className="py-2">{user.email}</td>
                      <td className="py-2">{new Date(user.createdAt).toLocaleString('pl-PL')}</td>
                      <td className="py-2">{user.termsAccepted ? '✔️' : '❌'}</td>
                      <td className="py-2">{user.marketingAccepted ? '✔️' : '❌'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </motion.section>
        )}
        {activeTab === 'orders' && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="card"
          >
            <h2 className="text-xl font-bold mb-4">Zamówienia demo</h2>
            {loadingOrders ? (
              <div className="text-center py-12 text-lg text-darksubtle">Ładowanie danych...</div>
            ) : (
              <table className="w-full text-left">
                <thead>
                  <tr>
                    <th className="py-2">ID</th>
                    <th className="py-2">Email</th>
                    <th className="py-2">Typ</th>
                    <th className="py-2">Produkt</th>
                    <th className="py-2">Telefon</th>
                    <th className="py-2">Status</th>
                    <th className="py-2">Data</th>
                    <th className="py-2">Zgoda na regulamin</th>
                    <th className="py-2">Zgoda marketingowa</th>
                    <th className="py-2">Akcje</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map(order => (
                    <>
                      <tr key={order.id} className="border-t border-gray-700">
                        <td className="py-2">{order.id}</td>
                        <td className="py-2">{order.email || order.user?.email || 'Brak'}</td>
                        <td className="py-2">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            order.orderType === 'consultation' 
                              ? 'bg-blue-600 text-white' 
                              : 'bg-green-600 text-white'
                          }`}>
                            {order.orderType === 'consultation' ? 'Wycena' : 'Demo'}
                          </span>
                        </td>
                        <td className="py-2">{order.productId || 'N/A'}</td>
                        <td className="py-2">{order.phone}</td>
                        <td className="py-2">{order.status}</td>
                        <td className="py-2">{new Date(order.createdAt).toLocaleString('pl-PL')}</td>
                        <td className="py-2">{order.termsAccepted ? '✔️' : '❌'}</td>
                        <td className="py-2">{order.marketingAccepted ? '✔️' : '❌'}</td>
                        <td className="py-2">
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
                            <div>
                              <b>Dodatkowe informacje od zamawiającego:</b><br />
                              {order.info ? order.info : <span className="text-darksubtle">Brak dodatkowych informacji</span>}
                            </div>
                          </td>
                        </tr>
                      )}
                    </>
                  ))}
                </tbody>
              </table>
            )}
          </motion.section>
        )}
        {activeTab === 'components' && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="card"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-darktext">Komponenty</h2>
              <button className="btn-primary flex items-center space-x-2" onClick={() => setIsAddComponentModalOpen(true)}>
                <Plus className="w-4 h-4" />
                <span>Dodaj komponent</span>
              </button>
            </div>
            {loadingComponents ? (
              <div className="text-center py-12 text-lg text-darksubtle">Ładowanie danych...</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-800">
                      <th className="text-left py-3 px-4 font-medium text-darksubtle">Nazwa</th>
                      <th className="text-left py-3 px-4 font-medium text-darksubtle">Koszt od (PLN)</th>
                      <th className="text-left py-3 px-4 font-medium text-darksubtle">Koszt do (PLN)</th>
                      <th className="text-left py-3 px-4 font-medium text-darksubtle">Uwagi</th>
                      <th className="text-left py-3 px-4 font-medium text-darksubtle">Akcje</th>
                    </tr>
                  </thead>
                  <tbody>
                    {components.map((item) => (
                      <tr key={item.id} className="border-b border-gray-900 hover:bg-darkbg/60">
                        <td className="py-4 px-4">{item.name}</td>
                        <td className="py-4 px-4">{item.priceFrom.toLocaleString('pl-PL')}</td>
                        <td className="py-4 px-4">{item.priceTo.toLocaleString('pl-PL')}</td>
                        <td className="py-4 px-4">{item.notes}</td>
                        <td className="py-4 px-4">
                          <div className="flex space-x-2">
                            <button
                              onClick={() => { setEditComponent(item); setIsEditComponentModalOpen(true) }}
                              className="text-primary-500 hover:text-primary-300 p-1"
                              title="Edytuj"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={async () => {
                                if (confirm('Czy na pewno chcesz usunąć ten komponent?')) {
                                  await fetch(`/api/admin/components?id=${item.id}`, { method: 'DELETE' })
                                  fetchComponents()
                                }
                              }}
                              className="text-red-400 hover:text-red-300 p-1"
                              title="Usuń"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </motion.section>
        )}
      </div>

      {/* Edit Modal */}
      {isEditModalOpen && softwareToEdit && (
        <SoftwareFormModal
          isOpen={isEditModalOpen}
          onClose={() => { setIsEditModalOpen(false); setSoftwareToEdit(null) }}
          onAdded={fetchSoftwares}
          softwareToEdit={softwareToEdit}
        />
      )}
      <SoftwareFormModal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} onAdded={fetchSoftwares} />
      {isAddComponentModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-darkpanel rounded-lg p-6 w-full max-w-xl mx-4 border border-gray-800"
          >
            <h3 className="text-lg font-semibold mb-4 text-darktext">Dodaj komponent</h3>
            <form className="space-y-4" onSubmit={async (e) => {
              e.preventDefault();
              const form = e.target as any;
              const newComponent = {
                name: form.name.value,
                priceFrom: Number(form.priceFrom.value),
                priceTo: Number(form.priceTo.value),
                notes: form.notes.value
              };
              await fetch('/api/admin/components', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newComponent)
              });
              setIsAddComponentModalOpen(false);
              fetchComponents();
            }}>
              <div>
                <label className="block text-sm font-medium text-darksubtle mb-1">Nazwa</label>
                <input name="name" required className="w-full px-3 py-2 border border-gray-700 rounded-lg bg-darkbg text-darktext" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-darksubtle mb-1">Koszt od (PLN)</label>
                  <input name="priceFrom" type="number" required className="w-full px-3 py-2 border border-gray-700 rounded-lg bg-darkbg text-darktext" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-darksubtle mb-1">Koszt do (PLN)</label>
                  <input name="priceTo" type="number" required className="w-full px-3 py-2 border border-gray-700 rounded-lg bg-darkbg text-darktext" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-darksubtle mb-1">Uwagi</label>
                <input name="notes" className="w-full px-3 py-2 border border-gray-700 rounded-lg bg-darkbg text-darktext" />
              </div>
              <div className="flex justify-end space-x-3 pt-4">
                <button type="button" onClick={() => setIsAddComponentModalOpen(false)} className="btn-secondary">Anuluj</button>
                <button type="submit" className="btn-primary">Dodaj</button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
      {isEditComponentModalOpen && editComponent && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-darkpanel rounded-lg p-6 w-full max-w-xl mx-4 border border-gray-800"
          >
            <h3 className="text-lg font-semibold mb-4 text-darktext">Edytuj komponent</h3>
            <form className="space-y-4" onSubmit={async (e) => {
              e.preventDefault();
              const form = e.target as any;
              await fetch(`/api/admin/components?id=${editComponent.id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  name: form.name.value,
                  priceFrom: Number(form.priceFrom.value),
                  priceTo: Number(form.priceTo.value),
                  notes: form.notes.value
                })
              })
              setIsEditComponentModalOpen(false)
              setEditComponent(null)
              fetchComponents()
            }}>
              <div>
                <label className="block text-sm font-medium text-darksubtle mb-1">Nazwa</label>
                <input name="name" defaultValue={editComponent.name} required className="w-full px-3 py-2 border border-gray-700 rounded-lg bg-darkbg text-darktext" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-darksubtle mb-1">Koszt od (PLN)</label>
                  <input name="priceFrom" type="number" defaultValue={editComponent.priceFrom} required className="w-full px-3 py-2 border border-gray-700 rounded-lg bg-darkbg text-darktext" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-darksubtle mb-1">Koszt do (PLN)</label>
                  <input name="priceTo" type="number" defaultValue={editComponent.priceTo} required className="w-full px-3 py-2 border border-gray-700 rounded-lg bg-darkbg text-darktext" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-darksubtle mb-1">Uwagi</label>
                <input name="notes" defaultValue={editComponent.notes} className="w-full px-3 py-2 border border-gray-700 rounded-lg bg-darkbg text-darktext" />
              </div>
              <div className="flex justify-end space-x-3 pt-4">
                <button type="button" onClick={() => { setIsEditComponentModalOpen(false); setEditComponent(null) }} className="btn-secondary">Anuluj</button>
                <button type="submit" className="btn-primary">Zapisz zmiany</button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  )
} 