'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { motion } from 'framer-motion'
import { User, Mail, Upload, Save } from 'lucide-react'
import toast from 'react-hot-toast'

export default function ProfilePage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [user, setUser] = useState<any>(null)
  
  const [email, setEmail] = useState('')
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [bio, setBio] = useState('')
  const [profileImageUrl, setProfileImageUrl] = useState('')

  useEffect(() => {
    fetchUser()
  }, [])

  const fetchUser = async () => {
    try {
      const res = await fetch('/api/auth/me')
      const data = await res.json()
      
      if (!data.user) {
        router.push('/')
        return
      }
      
      setUser(data.user)
      setEmail(data.user.email || '')
      setFirstName(data.user.firstName || '')
      setLastName(data.user.lastName || '')
      setBio(data.user.bio || '')
      setProfileImageUrl(data.user.profileImageUrl || '')
      setLoading(false)
    } catch (error) {
      console.error('Błąd pobierania profilu:', error)
      toast.error('Nie udało się pobrać danych profilu')
      router.push('/')
    }
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    const formData = new FormData()
    formData.append('file', file)

    try {
      const res = await fetch('/api/user/upload-avatar', {
        method: 'POST',
        body: formData
      })
      
      const data = await res.json()
      
      if (res.ok && data.imageUrl) {
        setProfileImageUrl(data.imageUrl)
        toast.success('Zdjęcie profilowe zostało zaktualizowane!')
      } else {
        toast.error(data.error || 'Błąd podczas przesyłania zdjęcia')
      }
    } catch (error) {
      console.error('Błąd uploadu:', error)
      toast.error('Nie udało się przesłać zdjęcia')
    } finally {
      setUploading(false)
    }
  }

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

    try {
      const res = await fetch('/api/user/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName,
          lastName,
          bio,
          profileImageUrl
        })
      })

      const data = await res.json()

      if (res.ok) {
        toast.success('Profil został zaktualizowany!')
        // Odśwież dane użytkownika
        fetchUser()
      } else {
        toast.error(data.error || 'Błąd podczas zapisywania profilu')
      }
    } catch (error) {
      console.error('Błąd zapisywania:', error)
      toast.error('Nie udało się zapisać profilu')
    } finally {
      setSaving(false)
    }
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
        <div className="container mx-auto max-w-2xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="card"
          >
            <h1 className="text-3xl font-bold mb-6 text-darktext">Edycja Profilu</h1>

            {/* Avatar Section */}
            <div className="flex flex-col items-center mb-8">
              <div className="relative group">
                {profileImageUrl ? (
                  <img 
                    src={profileImageUrl} 
                    alt="Avatar" 
                    className="w-32 h-32 rounded-full object-cover border-4 border-primary-600"
                  />
                ) : (
                  <div className="w-32 h-32 rounded-full bg-primary-700 flex items-center justify-center">
                    <User className="w-16 h-16 text-white" />
                  </div>
                )}
                
                <label className="absolute bottom-0 right-0 bg-primary-600 hover:bg-primary-700 text-white rounded-full p-3 cursor-pointer transition-colors shadow-lg">
                  <Upload className="w-5 h-5" />
                  <input 
                    type="file" 
                    className="hidden" 
                    accept="image/*"
                    onChange={handleImageUpload}
                    disabled={uploading}
                  />
                </label>
              </div>
              {uploading && <p className="text-sm text-primary-400 mt-2">Przesyłanie...</p>}
            </div>

            {/* Form */}
            <form onSubmit={handleSaveProfile} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-darksubtle mb-2">
                  Email (nie można zmienić)
                </label>
                <div className="flex items-center gap-2 p-3 bg-darkbg rounded-lg border border-gray-700">
                  <Mail className="w-5 h-5 text-darksubtle" />
                  <input
                    type="email"
                    value={email}
                    disabled
                    className="flex-1 bg-transparent text-darktext outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-darksubtle mb-2">
                    Imię
                  </label>
                  <input
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="Twoje imię"
                    className="w-full p-3 bg-darkbg border border-gray-700 rounded-lg text-darktext focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-darksubtle mb-2">
                    Nazwisko
                  </label>
                  <input
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder="Twoje nazwisko"
                    className="w-full p-3 bg-darkbg border border-gray-700 rounded-lg text-darktext focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-darksubtle mb-2">
                  Bio / Opis
                </label>
                <textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Opowiedz coś o sobie..."
                  rows={4}
                  className="w-full p-3 bg-darkbg border border-gray-700 rounded-lg text-darktext focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={saving}
                className="btn-primary w-full flex items-center justify-center gap-2"
              >
                <Save className="w-5 h-5" />
                <span>{saving ? 'Zapisywanie...' : 'Zapisz zmiany'}</span>
              </button>
            </form>
          </motion.div>
        </div>
      </div>
      <Footer />
    </>
  )
}

