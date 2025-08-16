'use client'

import { CheckCircle } from 'lucide-react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { useEffect, useState, Suspense } from 'react'
import { useLanguage } from "@/contexts/LanguageContext"
import DynamicTitle from '@/components/DynamicTitle'

function OrderSuccessContent() {
  const { t } = useLanguage()
  const searchParams = useSearchParams()
  const orderId = searchParams.get('orderId')
  const [orderType, setOrderType] = useState<'collaboration' | 'code' | 'consultation' | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (orderId) {
      fetch(`/api/admin/orders`)
        .then(res => res.json())
        .then(data => {
          const order = data.orders.find((o: any) => o.id.toString() === orderId)
          if (order) {
            setOrderType(order.orderType)
          }
        })
        .catch(() => {
          // Fallback - spróbuj określić typ na podstawie URL
          setOrderType('collaboration')
        })
        .finally(() => setLoading(false))
    } else {
      setLoading(false)
    }
  }, [orderId])

  const isConsultation = orderType === 'consultation'
  const isCollaboration = orderType === 'collaboration'
  const isCode = orderType === 'code'
  
  let title, description
  
  if (isConsultation) {
    title = t('orderSuccess.consultationTitle')
    description = t('orderSuccess.consultationDescription')
  } else if (isCollaboration) {
    title = t('orderSuccess.collaborationTitle')
    description = t('orderSuccess.collaborationDescription')
  } else if (isCode) {
    title = t('orderSuccess.codeTitle')
    description = t('orderSuccess.codeDescription')
  } else {
    // Fallback
    title = t('orderSuccess.collaborationTitle')
    description = t('orderSuccess.collaborationDescription')
  }

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-darkbg text-darktext">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
        <p className="mt-4 text-darksubtle">{t('orderSuccess.loading')}</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-darkbg text-darktext">
      <DynamicTitle titleKey="orderSuccess" fallbackTitle="Dziękujemy za zamówienie - FelizTrade" />
      <CheckCircle className="w-20 h-20 text-green-500 mb-6" />
      <h1 className="text-3xl font-bold mb-4">{title}</h1>
      <p className="text-lg mb-4 text-center max-w-md">
        {description}
      </p>
      <Link href="/" className="btn-primary mt-4">{t('orderSuccess.backToHome')}</Link>
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