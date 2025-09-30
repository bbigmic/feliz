const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function addTranslations() {
  try {
    // Aktualizuj komponenty z tłumaczeniami angielskimi
    await prisma.component.updateMany({
      where: { name: 'System płatności online' },
      data: {
        nameEn: 'Online payment system',
        notesEn: 'Integration with Stripe, PayPal, and other payment gateways'
      }
    })

    await prisma.component.updateMany({
      where: { name: 'Panel administracyjny' },
      data: {
        nameEn: 'Admin panel',
        notesEn: 'Comprehensive management interface for content and users'
      }
    })

    await prisma.component.updateMany({
      where: { name: 'System rezerwacji' },
      data: {
        nameEn: 'Booking system',
        notesEn: 'Calendar-based reservation system with email notifications'
      }
    })

    await prisma.component.updateMany({
      where: { name: 'Integracja z API' },
      data: {
        nameEn: 'API integration',
        notesEn: 'Connection with external services and third-party APIs'
      }
    })

    // Aktualizuj oprogramowania z tłumaczeniami angielskimi
    await prisma.software.updateMany({
      where: { name: 'Platforma E-commerce' },
      data: {
        nameEn: 'E-commerce Platform',
        descriptionEn: 'Complete e-commerce platform with payment system and user management panel with analytics',
        featuresEn: JSON.stringify(['Responsive design', 'Payment system', 'Admin panel', 'SEO friendly'])
      }
    })

    await prisma.software.updateMany({
      where: { name: 'Strona Internetowa Restauracji' },
      data: {
        nameEn: 'Restaurant Website',
        descriptionEn: 'Increase your restaurant reach with a website',
        featuresEn: JSON.stringify(['Online menu', 'Contact'])
      }
    })

    await prisma.software.updateMany({
      where: { name: 'Portal Nieruchomości' },
      data: {
        nameEn: 'Real Estate Portal',
        descriptionEn: 'Professional website for real estate agency',
        featuresEn: JSON.stringify(['Property listings', 'Contact form', 'About company'])
      }
    })

    await prisma.software.updateMany({
      where: { name: 'Platforma Learningowa' },
      data: {
        nameEn: 'Learning Platform',
        descriptionEn: 'E-learning platform with online courses and educational offer management',
        featuresEn: JSON.stringify(['Courses and training', 'Student tests', 'Document transfer', 'Certificates'])
      }
    })

    await prisma.software.updateMany({
      where: { name: 'Landing page usług Twojej firmy' },
      data: {
        nameEn: 'Your company services landing page',
        descriptionEn: 'Landing page with service offer',
        featuresEn: JSON.stringify(['Responsive design', 'Service offer with pricing', 'Contact', 'Social media integration'])
      }
    })

    await prisma.software.updateMany({
      where: { name: 'Generator QR kodu do opinii Twojej firmy Google' },
      data: {
        nameEn: 'QR Code Generator for Google Reviews',
        descriptionEn: 'Application for generating QR codes for Google reviews of your company',
        featuresEn: JSON.stringify(['QR code generation', 'Google API', 'Analytics panel', 'Affiliate program', 'Payment gateway'])
      }
    })

    await prisma.software.updateMany({
      where: { name: 'Platforma do zarządzania restauracją' },
      data: {
        nameEn: 'Restaurant Management Platform',
        descriptionEn: 'Restaurant management system - customizable menu, online ordering for table/delivery, customizable photo carousel on homepage from admin panel',
        featuresEn: JSON.stringify(['Online ordering', 'Menu management', 'Homepage content management', 'Adding events', 'Adding pop-up ads on website'])
      }
    })

    await prisma.software.updateMany({
      where: { name: 'Transkrybowanie wideo z AI' },
      data: {
        nameEn: 'AI Video Transcription',
        descriptionEn: 'Audio/video transcription generator and note extraction directly from YouTube/Instagram reels link. Ability to chat with AI about transcription. Credit payment system and credit monetization',
        featuresEn: JSON.stringify(['SaaS', 'AI', 'Micropayments', 'User system', 'Transcription history'])
      }
    })

    await prisma.software.updateMany({
      where: { name: 'Generator QR kodu do własnego linku' },
      data: {
        nameEn: 'QR Code Generator for Custom Links',
        descriptionEn: 'Generate QR code for link or other custom data and modify its appearance by changing shape, color or adding logo. Download QR code in various formats and resolutions',
        featuresEn: JSON.stringify(['QR code', 'Free', 'CPM Monetization'])
      }
    })

    console.log('Translations added successfully!')
  } catch (error) {
    console.error('Error adding translations:', error)
  } finally {
    await prisma.$disconnect()
  }
}

addTranslations() 