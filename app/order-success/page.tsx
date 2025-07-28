'use client'

import { CheckCircle } from 'lucide-react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { useEffect, useState, Suspense } from 'react'
import toast from 'react-hot-toast'

function OrderSuccessContent() {
  const searchParams = useSearchParams()
  const orderId = searchParams.get('orderId')
  const [orderType, setOrderType] = useState<'demo' | 'consultation' | null>(null)
  const [loading, setLoading] = useState(true)
  const [statusUpdated, setStatusUpdated] = useState(false)

  useEffect(() => {
    if (orderId) {
      // Najpierw pobierz dane zamówienia
      fetch(`/api/admin/orders`)
        .then(res => res.json())
        .then(data => {
          const order = data.orders.find((o: any) => o.id.toString() === orderId)
          if (order) {
            setOrderType(order.orderType)
            
            // Sprawdź czy zamówienie ma stripeSessionId (czy to płatność przez Stripe)
            if (order.stripeSessionId && order.status === 'pending') {
              // Aktualizuj status zamówienia na "paid"
              const updateOrderStatus = async () => {
                try {
                  const response = await fetch('/api/orders/update-status', {
                    method: 'POST',
                    headers: {
                      'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                      orderId: parseInt(orderId),
                      status: 'paid'
                    })
                  })
                  
                  if (response.ok) {
                    console.log('✅ Status zamówienia zaktualizowany na paid')
                    setStatusUpdated(true)
                  } else {
                    console.log('ℹ️ Status zamówienia już był opłacony lub wystąpił błąd')
                  }
                } catch (error) {
                  console.error('❌ Błąd aktualizacji statusu:', error)
                }
              }

              // Aktualizuj status
              updateOrderStatus()
            } else if (!order.stripeSessionId) {
              console.log('ℹ️ Zamówienie nie ma stripeSessionId - pomijam aktualizację')
            } else if (order.status !== 'pending') {
              console.log(`ℹ️ Zamówienie ma już status: ${order.status}`)
            }
          }
        })
        .catch(() => {
          // Fallback - spróbuj określić typ na podstawie URL
          setOrderType('demo')
        })
        .finally(() => setLoading(false))
    } else {
      setLoading(false)
    }
  }, [orderId])

  const isConsultation = orderType === 'consultation'
  const title = isConsultation 
    ? 'Dziękujemy za zamówienie wyceny/konsultacji!' 
    : 'Dziękujemy za zamówienie demo!'
  
  const description = isConsultation
    ? 'Skontaktujemy się z Tobą pod wskazany numer telefonu, aby omówić szczegóły projektu i przygotować wycenę.'
    : 'Skontaktujemy się z Tobą pod wskazany numer telefonu, aby ustalić szczegóły i uruchomić demo.'

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-darkbg text-darktext">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
        <p className="mt-4 text-darksubtle">Ładowanie...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-darkbg text-darktext">
      <CheckCircle className="w-20 h-20 text-green-500 mb-6" />
      <h1 className="text-3xl font-bold mb-4">{title}</h1>
      <p className="text-lg mb-4 text-center max-w-md">
        {description}
      </p>
      {statusUpdated && (
        <div className="mb-4 p-3 bg-green-900 border border-green-700 rounded-lg">
          <p className="text-green-300 text-sm">✅ Płatność została potwierdzona</p>
        </div>
      )}
      <Link href="/" className="btn-primary mt-4">Wróć na stronę główną</Link>
    </div>
  )
}

export default function OrderSuccess() {
  return (
    <Suspense>
      <OrderSuccessContent />
    </Suspense>
  )
} 