'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import toast from 'react-hot-toast'

function LeadPageContent() {
  const searchParams = useSearchParams()
  const ref = searchParams.get('ref')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [info, setInfo] = useState('')
  const [loading, setLoading] = useState(false)
  const [categories, setCategories] = useState<string[]>([])
  const [softwares, setSoftwares] = useState<any[]>([])
  const [showSoftwareTemplate, setShowSoftwareTemplate] = useState(false)
  const [selectedSoftware, setSelectedSoftware] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch('/api/admin/softwares')
        const data = await res.json()
        if (data.softwares) {
          setSoftwares(data.softwares)
          const allCategories = data.softwares.flatMap((software: any) => JSON.parse(software.categories))
          setCategories(Array.from(new Set(allCategories))) // Usuwamy duplikaty
        }
      } catch (error) {
        console.error('Błąd pobierania danych:', error)
        toast.error('Błąd pobierania danych')
      }
    }
    fetchData()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const response = await fetch('/api/seller/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          phone,
          info,
          selectedCategory,
          sellerId: ref,
          selectedSoftware: showSoftwareTemplate ? selectedSoftware : null
        })
      })

      const data = await response.json()

      if (response.ok) {
        toast.success('Lead został dodany pomyślnie')
        setEmail('')
        setPhone('')
        setInfo('')
      } else {
        toast.error(data.error || 'Błąd podczas dodawania leada')
      }
    } catch (error) {
      toast.error('Błąd podczas dodawania leada')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-darkbg text-darktext py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Formularz */}
        <div className="max-w-md mx-auto bg-darkpanel p-6 rounded-lg shadow-md mb-8">
          <h2 className="text-2xl font-bold mb-4">Stwórz aplikację z FelizTrade</h2>
          <p className="text-darksubtle mb-4">Zostaw swoje dane kontaktowe, a nasz zespół skontaktuje się z Tobą w sprawie najlepszych rozwiązań dla Twojego biznesu.</p>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-darksubtle mb-1">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 border border-gray-700 rounded-lg bg-darkbg text-darktext"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-darksubtle mb-1">Telefon</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-3 py-2 border border-gray-700 rounded-lg bg-darkbg text-darktext"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-darksubtle mb-1">Dodatkowe informacje</label>
              <textarea
                value={info}
                onChange={(e) => setInfo(e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-gray-700 rounded-lg bg-darkbg text-darktext"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-darksubtle mb-1">Kategoria</label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-3 py-2 border border-gray-700 rounded-lg bg-darkbg text-darktext"
                required
              >
                <option value="">Wybierz kategorię...</option>
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>
            
            {/* Checkbox dla szablonu oprogramowania */}
            <div className="flex items-center">
              <input
                type="checkbox"
                id="softwareTemplate"
                checked={showSoftwareTemplate}
                onChange={(e) => setShowSoftwareTemplate(e.target.checked)}
                className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-700 rounded bg-darkbg"
              />
              <label htmlFor="softwareTemplate" className="text-sm text-darktext">
                Chcę wybrać szablon oprogramowania
              </label>
            </div>
            
            {/* Select dla szablonu oprogramowania - pokazuje się tylko gdy checkbox jest zaznaczony */}
            {showSoftwareTemplate && (
              <div>
                <label className="block text-sm font-medium text-darksubtle mb-1">Wybierz szablon oprogramowania</label>
                <select
                  value={selectedSoftware}
                  onChange={(e) => setSelectedSoftware(e.target.value)}
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
            
            <div className="flex justify-end">
              <button
                type="submit"
                className="btn-primary"
                disabled={loading}
              >
                {loading ? 'Wysyłanie...' : 'Wyślij zapytanie'}
              </button>
            </div>
          </form>
        </div>

        {/* Kafelki z korzyściami - responsywnie */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          <div className="bg-darkpanel p-6 rounded-lg border border-gray-700">
            <div className="flex items-center mb-3">
              <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center mr-4">
                <span className="text-white text-sm font-bold">1</span>
              </div>
              <h3 className="font-semibold text-darktext">Custom Admin Panel</h3>
            </div>
            <p className="text-darksubtle text-sm">Otrzymasz spersonalizowany panel administracyjny dostosowany do specyfiki Twojego biznesu z pełną kontrolą nad danymi.</p>
          </div>
          
          <div className="bg-darkpanel p-6 rounded-lg border border-gray-700">
            <div className="flex items-center mb-3">
              <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center mr-4">
                <span className="text-white text-sm font-bold">2</span>
              </div>
              <h3 className="font-semibold text-darktext">Integracje AI</h3>
            </div>
            <p className="text-darksubtle text-sm">Wdrażamy zaawansowane rozwiązania sztucznej inteligencji, które automatyzują procesy i zwiększają efektywność Twojego biznesu.</p>
          </div>
          
          <div className="bg-darkpanel p-6 rounded-lg border border-gray-700">
            <div className="flex items-center mb-3">
              <div className="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center mr-4">
                <span className="text-white text-sm font-bold">3</span>
              </div>
              <h3 className="font-semibold text-darktext">Mobilne Aplikacje</h3>
            </div>
            <p className="text-darksubtle text-sm">Tworzymy natywne aplikacje mobilne na iOS i Android, które zapewniają użytkownikom doskonałe doświadczenie na każdym urządzeniu.</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function LeadPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-darkbg">
        <div className="text-darktext">Ładowanie...</div>
      </div>
    }>
      <LeadPageContent />
    </Suspense>
  )
}
