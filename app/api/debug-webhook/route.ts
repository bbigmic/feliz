import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import Stripe from 'stripe'

const prisma = new PrismaClient()
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: '2023-10-16' })

export async function GET() {
  try {
    console.log('🔍 Debug webhook Stripe')
    
    const config = {
      stripeSecretKey: process.env.STRIPE_SECRET_KEY ? '✅ Skonfigurowany' : '❌ Brak',
      stripeWebhookSecret: process.env.STRIPE_WEBHOOK_SECRET ? '✅ Skonfigurowany' : '❌ Brak',
      baseUrl: process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000',
      webhookUrl: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/webhook/stripe`
    }
    
    // Sprawdź ostatnie zamówienia
    const recentOrders = await prisma.order.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        email: true,
        status: true,
        orderType: true,
        stripeSessionId: true,
        createdAt: true
      }
    })
    
    // Sprawdź statystyki zamówień
    const stats = {
      total: await prisma.order.count(),
      pending: await prisma.order.count({ where: { status: 'pending' } }),
      paid: await prisma.order.count({ where: { status: 'paid' } }),
      expired: await prisma.order.count({ where: { status: 'expired' } })
    }
    
    return NextResponse.json({
      success: true,
      message: 'Debug webhook Stripe',
      config,
      stats,
      recentOrders,
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.error('Debug webhook error:', error)
    return NextResponse.json({ 
      error: String(error),
      message: 'Błąd debugowania webhook'
    }, { status: 500 })
  } finally {
    await prisma.$disconnect()
  }
}

export async function POST(request: NextRequest) {
  try {
    const { orderId } = await request.json()
    
    if (!orderId) {
      return NextResponse.json({ error: 'Brak orderId' }, { status: 400 })
    }
    
    // Symuluj aktualizację statusu zamówienia
    const order = await prisma.order.findUnique({
      where: { id: parseInt(orderId) }
    })
    
    if (!order) {
      return NextResponse.json({ error: 'Zamówienie nie istnieje' }, { status: 404 })
    }
    
    // Aktualizuj status na 'paid'
    await prisma.order.update({
      where: { id: parseInt(orderId) },
      data: { status: 'paid' }
    })
    
    console.log(`✅ Test: Zamówienie ${orderId} oznaczone jako opłacone`)
    
    return NextResponse.json({
      success: true,
      message: `Zamówienie ${orderId} zostało oznaczone jako opłacone`,
      order: {
        id: order.id,
        status: 'paid',
        email: order.email,
        orderType: order.orderType
      }
    })
  } catch (error) {
    console.error('Test webhook error:', error)
    return NextResponse.json({ 
      error: String(error),
      message: 'Błąd testowania webhook'
    }, { status: 500 })
  } finally {
    await prisma.$disconnect()
  }
} 