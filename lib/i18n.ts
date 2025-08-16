export type Language = 'pl' | 'en'

export interface Translations {
  // Hero section
  hero: {
    title: string
    titleHighlight: string
    subtitle: string
    softwareCount: string
    rating: string
    salesCount: string
    scrollDown: string
  }
  
  // Header navigation
  header: {
    home: string
    software: string
    pricing: string
    contact: string
    openMenu: string
    closeMenu: string
    logout: string
    login: string
  }
  
  // Footer
  footer: {
    description: string
    quickLinks: string
    contact: string
    allRightsReserved: string
  }
  orderModal: {
    consultationTitle: string
    collaborationTitle: string
    codeTitle: string
    orderAs: string
    email: string
    phone: string
    selectCategory: string
    consultationDescription: string
    collaborationDescription: string
    codeDescription: string
    collaborationPrice: string
    codePrice: string
    collaborationConsent: string
    codeConsent: string
    termsAccept: string
    termsLink: string
    marketingAccept: string
    submitButton: string
    submitButtonLoading: string
    or: string
    callUs: string
    phoneNumber: string
    loadingSoftware: string
    softwareNotFound: string
    attachFiles: string
    selectedFiles: string
    attachedFiles: string
    fileSize: string
    removeFile: string
    uploadSuccess: string
    uploadError: string
    orderTypeConsultation: string
    orderTypeCollaboration: string
    orderTypeCode: string
  }
  orderSuccess: {
    consultationTitle: string
    collaborationTitle: string
    codeTitle: string
    consultationDescription: string
    collaborationDescription: string
    codeDescription: string
    loading: string
    backToHome: string
  }
  
  // Stripe checkout translations
  stripe: {
    consultationTitle: string
    consultationDescription: string
    collaborationTitle: string
    collaborationDescription: string
    codeTitle: string
    codeDescription: string
  }
  
  // Email translations
  email: {
    consultationSubject: string
    collaborationSubject: string
    codeSubject: string
    consultationBody: string
    collaborationBody: string
    codeBody: string
    loggedInUser: string
    orderId: string
    software: string
    collaborationPrice: string
    codePrice: string
    // Customer confirmation emails
    customerConsultationSubject: string
    customerCollaborationSubject: string
    customerCodeSubject: string
    customerConsultationBody: string
    customerCollaborationBody: string
    customerCodeBody: string
    customerGreeting: string
    customerOrderDetails: string
    customerNextSteps: string
    customerContactInfo: string
    customerThankYou: string
  }
  
  // API error messages
  api: {
    missingData: string
    softwareNotFound: string
    serverError: string
    missingSignature: string
    invalidSignature: string
    orderPaid: string
    salesIncremented: string
    salesError: string
    orderExpired: string
    unhandledEvent: string
    webhookError: string
  }
  
  // Preloader
  preloader: {
    loading: string
  }
  
  // Filters
  filters: {
    searchPlaceholder: string
    allCategories: string
    sortByName: string
    sortByPrice: string
    sortByRating: string
    sortBySales: string
  }
  
  // Software card
  softwareCard: {
    order: string
    from: string
    id: string
    view: string
  }
  
  // Loading and errors
  common: {
    loading: string
    error: string
    noResults: string
  }
  
  // Pricing section
  pricing: {
    title: string
    component: string
    cost: string
    notes: string
  }
  
  // CTA section
  cta: {
    title: string
    description: string
    button: string
  }
  
  // Page titles
  pageTitles: {
    home: string
    about: string
    regulamin: string
    orderSuccess: string
  }
}

export const translations: Record<Language, Translations> = {
  pl: {
    hero: {
      title: 'Profesjonalne Oprogramowania WWW i Aplikacje Mobilne',
      titleHighlight: 'Oprogramowania WWW i Aplikacje Mobilne',
      subtitle: 'Odkryj naszą kolekcję gotowych rozwiązań webowych. Zamów nowoczesne oprogramowanie i automatyzacje dopasowane do potrzeb Twojej firmy.',
      softwareCount: '30+ Oprogramowań',
      rating: '4.9/5 Ocena',
      salesCount: '500+ Sprzedaży',
      scrollDown: 'Przewiń w dół'
    },
    header: {
      home: 'Strona główna',
      software: 'Oprogramowania',
      pricing: 'Cennik',
      contact: 'Kontakt',
      openMenu: 'Otwórz menu',
      closeMenu: 'Zamknij menu',
      logout: 'Wyloguj się',
      login: 'Zaloguj się'
    },
    footer: {
      description: 'Profesjonalna platforma sprzedaży oprogramowań WWW i mobilnych. Oferujemy gotowe rozwiązania webowe oraz dostosowane do Twoich potrzeb.',
      quickLinks: 'Szybkie linki',
      contact: 'Kontakt',
      allRightsReserved: 'Wszystkie prawa zastrzeżone.'
    },
    filters: {
      searchPlaceholder: 'Szukaj oprogramowań...',
      allCategories: 'Wszystkie kategorie',
      sortByName: 'Sortuj po nazwie',
      sortByPrice: 'Sortuj po cenie',
      sortByRating: 'Sortuj po ocenie',
      sortBySales: 'Sortuj po sprzedaży'
    },
    softwareCard: {
      order: 'Zamów',
      from: 'od',
      id: 'ID',
      view: 'Zobacz'
    },
    common: {
      loading: 'Ładowanie oprogramowań...',
      error: 'Błąd ładowania oprogramowań',
      noResults: 'Nie znaleziono oprogramowań spełniających kryteria.'
    },
    pricing: {
      title: 'Cennik komponentów funkcjonalnych',
      component: 'Komponent',
      cost: 'Koszt',
      notes: 'Uwagi'
    },
    cta: {
      title: 'Zamów wycenę własnej aplikacji',
      description: 'Masz pomysł na własny system, aplikację lub automatyzację? Zrealizujemy Twój projekt kompleksowo – od analizy po wdrożenie i wsparcie.',
      button: 'Zamów konsultację i wycenę'
    },
    orderModal: {
      consultationTitle: 'Zamów konsultację i wycenę',
      collaborationTitle: 'Zamów MVP',
      codeTitle: 'Zamów kod',
      orderAs: 'Zamawiasz jako',
      email: 'Twój email',
      phone: 'Numer telefonu',
      selectCategory: 'Wybierz kategorię projektu',
      consultationDescription: 'Opisz swój projekt, wymagania i oczekiwania (opcjonalnie)',
      collaborationDescription: 'Dodatkowe informacje o współpracy (opcjonalnie)',
      codeDescription: 'Dodatkowe informacje o kodzie (opcjonalnie)',
             collaborationPrice: 'Zaliczka netto (30%):',
       codePrice: 'Cena netto (100%):',
       collaborationConsent: 'Oświadczam, że opłata zaliczkowa w wysokości 30% ceny oprogramowania dotyczy rozpoczęcia współpracy. Skontaktujemy się z Tobą w ciągu 24 godzin w celu ustalenia dalszych kroków i harmonogramu realizacji projektu.',
       codeConsent: 'Oświadczam, że opłata w wysokości 100% ceny oprogramowania dotyczy dostarczenia repozytorium kodu z instrukcjami uruchomienia i edycji. Kod zostanie dostarczony w ciągu 7 dni roboczych od zaksięgowania płatności.',
      termsAccept: 'Akceptuję',
      termsLink: 'regulamin.',
      marketingAccept: 'Chcę otrzymywać informacje marketingowe (opcjonalnie)',
      submitButton: 'Zamów {type} i przejdź do płatności',
      submitButtonLoading: '...',
      or: 'lub',
      callUs: 'Zadzwoń na',
      phoneNumber: '+48 502 600 739',
      loadingSoftware: 'Ładowanie informacji o oprogramowaniu...',
      softwareNotFound: 'Nie znaleziono oprogramowania',
      attachFiles: 'Chcę załączyć pliki',
      selectedFiles: 'Wybrane pliki:',
      attachedFiles: 'Załączone pliki:',
      fileSize: 'MB',
      removeFile: 'Usuń',
      uploadSuccess: 'Pliki zostały załączone pomyślnie',
      uploadError: 'Błąd podczas załączania plików',
      orderTypeConsultation: 'wycenę',
      orderTypeCollaboration: 'współpracę',
      orderTypeCode: 'kod'
    },
    orderSuccess: {
      consultationTitle: 'Dziękujemy za zamówienie wyceny/konsultacji!',
      collaborationTitle: 'Dziękujemy za zamówienie współpracy!',
      codeTitle: 'Dziękujemy za zamówienie kodu!',
      consultationDescription: 'Skontaktujemy się z Tobą pod wskazany numer telefonu, aby omówić szczegóły projektu i przygotować wycenę.',
             collaborationDescription: 'Skontaktujemy się z Tobą w ciągu 24 godzin pod wskazany numer telefonu, aby ustalić dalsze kroki współpracy i harmonogram realizacji projektu.',
       codeDescription: 'Kod z instrukcjami uruchomienia i edycji zostanie dostarczony w ciągu 7 dni roboczych na podany adres email.',
      loading: 'Ładowanie...',
      backToHome: 'Wróć na stronę główną'
    },
    stripe: {
      consultationTitle: 'Konsultacja/Wycena',
      consultationDescription: 'Zamówienie konsultacji lub wyceny FelizTrade',
      collaborationTitle: 'Zamówienie współpracy',
      collaborationDescription: 'Zamówienie współpracy FelizTrade',
      codeTitle: 'Zamówienie kodu',
      codeDescription: 'Zamówienie kodu FelizTrade'
    },
    email: {
      consultationSubject: 'Nowa wycena/konsultacja',
      collaborationSubject: 'Nowe zamówienie współpracy',
      codeSubject: 'Nowe zamówienie kodu',
      consultationBody: 'Nowe zamówienie (wycena/konsultacja):',
      collaborationBody: 'Nowe zamówienie (współpraca):',
      codeBody: 'Nowe zamówienie (kod):',
      loggedInUser: 'zalogowany użytkownik',
      orderId: 'ID zamówienia',
      software: 'Oprogramowanie',
      collaborationPrice: 'Zaliczka za współpracę',
      codePrice: 'Zaliczka za kod',
      // Customer confirmation emails
      customerConsultationSubject: 'Potwierdzenie zamówienia konsultacji - FelizTrade',
      customerCollaborationSubject: 'Potwierdzenie zamówienia współpracy - FelizTrade',
      customerCodeSubject: 'Potwierdzenie zamówienia kodu - FelizTrade',
      customerConsultationBody: 'Dziękujemy za zamówienie konsultacji i wyceny!',
      customerCollaborationBody: 'Dziękujemy za zamówienie współpracy!',
      customerCodeBody: 'Dziękujemy za zamówienie kodu!',
      customerGreeting: 'Dzień dobry',
      customerOrderDetails: 'Szczegóły zamówienia',
      customerNextSteps: 'Następne kroki',
      customerContactInfo: 'Informacje kontaktowe',
      customerThankYou: 'Dziękujemy za wybór FelizTrade!'
    },
    api: {
      missingData: 'Brak wymaganych danych.',
      softwareNotFound: 'Nie znaleziono oprogramowania.',
      serverError: 'Błąd serwera.',
      missingSignature: 'Brak podpisu',
      invalidSignature: 'Nieprawidłowy podpis',
      orderPaid: 'Zamówienie {orderId} zostało opłacone',
      salesIncremented: 'Zwiększono licznik sprzedaży dla oprogramowania {productId}',
      salesError: 'Błąd podczas zwiększania licznika sprzedaży:',
      orderExpired: 'Zamówienie {orderId} wygasło',
      unhandledEvent: 'Nieobsługiwany typ eventu: {eventType}',
      webhookError: 'Błąd podczas przetwarzania webhook:'
    },
    preloader: {
      loading: 'Ładowanie...'
    },
         pageTitles: {
       home: 'Budowanie aplikacji | FelizTrade - Platforma Zakupu Oprogramowań',
       about: 'O nas',
       regulamin: 'Regulamin',
       orderSuccess: 'Dziękujemy za zamówienie wyceny/konsultacji!'
     }
  },
  en: {
    hero: {
      title: 'Professional Web Software and Mobile Applications',
      titleHighlight: 'Web Software and Mobile Applications',
      subtitle: 'Discover our collection of ready-made web solutions. Order modern software and automation tailored to your company\'s needs.',
      softwareCount: '30+ Software',
      rating: '4.9/5 Rating',
      salesCount: '500+ Sales',
      scrollDown: 'Scroll down'
    },
    header: {
      home: 'Home',
      software: 'Software',
      pricing: 'Pricing',
      contact: 'Contact',
      openMenu: 'Open menu',
      closeMenu: 'Close menu',
      logout: 'Logout',
      login: 'Login'
    },
    footer: {
      description: 'Professional web and mobile software sales platform. We offer ready-made web and mobile solutions tailored to your needs.',
      quickLinks: 'Quick Links',
      contact: 'Contact',
      allRightsReserved: 'All rights reserved.'
    },
    filters: {
      searchPlaceholder: 'Search software...',
      allCategories: 'All categories',
      sortByName: 'Sort by name',
      sortByPrice: 'Sort by price',
      sortByRating: 'Sort by rating',
      sortBySales: 'Sort by sales'
    },
    softwareCard: {
      order: 'Order',
      from: 'from',
      id: 'ID',
      view: 'View'
    },
    common: {
      loading: 'Loading software...',
      error: 'Error loading software',
      noResults: 'No software found matching the criteria.'
    },
    pricing: {
      title: 'Functional Components Pricing',
      component: 'Component',
      cost: 'Cost',
      notes: 'Notes'
    },
    cta: {
      title: 'Order a quote for your own application',
      description: 'Have an idea for your own system, application or automation? We will implement your project comprehensively – from analysis to deployment and support.',
      button: 'Order consultation and quote'
    },
    orderModal: {
      consultationTitle: 'Order consultation and quote',
      collaborationTitle: 'Order MVP',
      codeTitle: 'Order code',
      orderAs: 'Ordering as',
      email: 'Your email',
      phone: 'Phone number',
      selectCategory: 'Select project category',
      consultationDescription: 'Describe your project, requirements and expectations (optional)',
             collaborationDescription: 'Additional information about collaboration and project requirements (optional)',
       codeDescription: 'Additional information about code requirements and customization needs (optional)',
             collaborationPrice: 'Net prepayment (30%):',
       codePrice: 'Net price (100%):',
       collaborationConsent: 'I declare that the advance payment of 30% of the software price applies to starting collaboration. We will contact you within 24 hours to arrange next steps and project implementation schedule.',
       codeConsent: 'I declare that the payment of 100% of the software price applies to delivery of code repository with installation and editing instructions. Code will be delivered within 7 working days from payment being credited.',
      termsAccept: 'I accept',
      termsLink: 'terms and conditions.',
      marketingAccept: 'I want to receive marketing information (optional)',
      submitButton: 'Order {type} and proceed to payment',
      submitButtonLoading: '...',
      or: 'or',
      callUs: 'Call us at',
      phoneNumber: '+48 502 600 739',
      loadingSoftware: 'Loading software information...',
      softwareNotFound: 'Software not found',
      attachFiles: 'I want to attach files',
      selectedFiles: 'Selected files:',
      attachedFiles: 'Attached files:',
      fileSize: 'MB',
      removeFile: 'Remove',
      uploadSuccess: 'Files attached successfully',
      uploadError: 'Error attaching files',
      orderTypeConsultation: 'quote',
      orderTypeCollaboration: 'collaboration',
      orderTypeCode: 'code'
    },
    orderSuccess: {
      consultationTitle: 'Thank you for ordering a quote/consultation!',
      collaborationTitle: 'Thank you for ordering a collaboration!',
      codeTitle: 'Thank you for ordering a code!',
      consultationDescription: 'We will contact you at the provided phone number to discuss project details and prepare a quote.',
             collaborationDescription: 'We will contact you within 24 hours at the provided phone number to arrange next collaboration steps and project implementation schedule.',
       codeDescription: 'Code with installation and editing instructions will be delivered within 7 working days to the provided email address.',
      loading: 'Loading...',
      backToHome: 'Back to homepage'
    },
    stripe: {
      consultationTitle: 'Consultation/Quote',
      consultationDescription: 'FelizTrade consultation or quote order',
      collaborationTitle: 'Collaboration order',
      collaborationDescription: 'FelizTrade collaboration order',
      codeTitle: 'Code order',
      codeDescription: 'FelizTrade code order'
    },
    email: {
      consultationSubject: 'New quote/consultation',
      collaborationSubject: 'New collaboration order',
      codeSubject: 'New code order',
      consultationBody: 'New order (quote/consultation):',
      collaborationBody: 'New order (collaboration):',
      codeBody: 'New order (code):',
      loggedInUser: 'logged in user',
      orderId: 'Order ID',
      software: 'Software',
      collaborationPrice: 'Collaboration prepayment',
      codePrice: 'Code prepayment',
      // Customer confirmation emails
      customerConsultationSubject: 'Consultation Order Confirmation - FelizTrade',
      customerCollaborationSubject: 'Collaboration Order Confirmation - FelizTrade',
      customerCodeSubject: 'Code Order Confirmation - FelizTrade',
      customerConsultationBody: 'Thank you for ordering consultation and quote!',
      customerCollaborationBody: 'Thank you for ordering collaboration!',
      customerCodeBody: 'Thank you for ordering code!',
      customerGreeting: 'Hello',
      customerOrderDetails: 'Order Details',
      customerNextSteps: 'Next Steps',
      customerContactInfo: 'Contact Information',
      customerThankYou: 'Thank you for choosing FelizTrade!'
    },
    api: {
      missingData: 'Missing required data.',
      softwareNotFound: 'Software not found.',
      serverError: 'Server error.',
      missingSignature: 'Missing signature',
      invalidSignature: 'Invalid signature',
      orderPaid: 'Order {orderId} has been paid',
      salesIncremented: 'Sales counter incremented for software {productId}',
      salesError: 'Error while incrementing sales counter:',
      orderExpired: 'Order {orderId} has expired',
      unhandledEvent: 'Unhandled event type: {eventType}',
      webhookError: 'Error while processing webhook:'
    },
    preloader: {
      loading: 'Loading...'
    },
         pageTitles: {
       home: 'Building Applications | FelizTrade - Software Purchase Platform',
       about: 'About',
       regulamin: 'Terms and Conditions',
       orderSuccess: 'Thank you for ordering a quote/consultation!'
     }
  }
}

export function getTranslation(lang: Language, key: string): string {
  const keys = key.split('.')
  let value: any = translations[lang]
  
  for (const k of keys) {
    if (value && typeof value === 'object' && k in value) {
      value = value[k]
    } else {
      return key // Return key if translation not found
    }
  }
  
  return typeof value === 'string' ? value : key
}

// Funkcje walutowe
export function getCurrency(lang: Language): string {
  return lang === 'en' ? 'GBP' : 'PLN'
}

export function getCurrencySymbol(lang: Language): string {
  return lang === 'en' ? '£' : 'PLN'
}

export function getLocale(lang: Language): string {
  return lang === 'en' ? 'en-GB' : 'pl-PL'
}

export function convertPrice(price: number, lang: Language): number {
  if (lang === 'en') {
    return Math.round(price / 4) // Konwersja PLN na GBP (przybliżony kurs)
  }
  return price
}

export function formatPrice(price: number, lang: Language): string {
  const convertedPrice = convertPrice(price, lang)
  const locale = getLocale(lang)
  const currency = getCurrency(lang)
  
  return `${convertedPrice.toLocaleString(locale)} ${currency}`
} 