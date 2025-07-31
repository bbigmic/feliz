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
    demoTitle: string
    orderAs: string
    email: string
    phone: string
    selectCategory: string
    consultationDescription: string
    demoDescription: string
    demoPrice: string
    demoConsent: string
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
  }
  orderSuccess: {
    consultationTitle: string
    demoTitle: string
    consultationDescription: string
    demoDescription: string
    loading: string
    backToHome: string
  }
  
  // Stripe checkout translations
  stripe: {
    consultationTitle: string
    consultationDescription: string
    demoTitle: string
    demoDescription: string
  }
  
  // Email translations
  email: {
    consultationSubject: string
    demoSubject: string
    consultationBody: string
    demoBody: string
    loggedInUser: string
    orderId: string
    software: string
    demoPrice: string
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
      demoTitle: 'Zamów demo',
      orderAs: 'Zamawiasz jako',
      email: 'Twój email',
      phone: 'Numer telefonu',
      selectCategory: 'Wybierz kategorię projektu',
      consultationDescription: 'Opisz swój projekt, wymagania i oczekiwania (opcjonalnie)',
      demoDescription: 'Dodatkowe informacje o stronie/aplikacji (opcjonalnie)',
      demoPrice: 'Zaliczka netto (20%):',
      demoConsent: 'Oświadczam, że opłata zaliczkowa dotyczy wyłącznie przygotowania wersji demonstracyjnej aplikacji, która zostanie udostępniona online pod linkiem przesłanym na podany adres e-mail w ciągu 7 dni roboczych od zaksięgowania płatności. Wersja demo może zawierać błędy i ma charakter poglądowy. Pełny dostęp do kodu źródłowego i jego przekazanie możliwe będzie po uiszczeniu pełnej kwoty za oprogramowanie. Dostosowanie oprogramowania do potrzeb zamawiającego odbywa się na podstawie odrębnej wyceny komponentów funkcjonalnych i wizualnych.',
      termsAccept: 'Akceptuję',
      termsLink: 'regulamin.',
      marketingAccept: 'Chcę otrzymywać informacje marketingowe (opcjonalnie)',
      submitButton: 'Zamów {type} i przejdź do płatności',
      submitButtonLoading: '...',
      or: 'lub',
      callUs: 'Zadzwoń na',
      phoneNumber: '+48 502 600 739',
      loadingSoftware: 'Ładowanie informacji o oprogramowaniu...',
      softwareNotFound: 'Nie znaleziono oprogramowania'
    },
    orderSuccess: {
      consultationTitle: 'Dziękujemy za zamówienie wyceny/konsultacji!',
      demoTitle: 'Dziękujemy za zamówienie demo!',
      consultationDescription: 'Skontaktujemy się z Tobą pod wskazany numer telefonu, aby omówić szczegóły projektu i przygotować wycenę.',
      demoDescription: 'Skontaktujemy się z Tobą pod wskazany numer telefonu, aby ustalić szczegóły i uruchomić demo.',
      loading: 'Ładowanie...',
      backToHome: 'Wróć na stronę główną'
    },
    stripe: {
      consultationTitle: 'Konsultacja/Wycena',
      consultationDescription: 'Zamówienie konsultacji lub wyceny FelizTrade',
      demoTitle: 'Zaliczka za demo',
      demoDescription: 'Zaliczka za demo: {softwareName}'
    },
    email: {
      consultationSubject: 'Nowa wycena/konsultacja',
      demoSubject: 'Nowe zamówienie demo',
      consultationBody: 'Nowe zamówienie (wycena/konsultacja):',
      demoBody: 'Nowe zamówienie (demo):',
      loggedInUser: 'zalogowany użytkownik',
      orderId: 'ID zamówienia',
      software: 'Oprogramowanie',
      demoPrice: 'Zaliczka za demo'
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
      demoTitle: 'Order demo',
      orderAs: 'Ordering as',
      email: 'Your email',
      phone: 'Phone number',
      selectCategory: 'Select project category',
      consultationDescription: 'Describe your project, requirements and expectations (optional)',
      demoDescription: 'Additional information about website/application (optional)',
      demoPrice: 'Net prepayment (20%):',
      demoConsent: 'I declare that the advance payment applies only to the preparation of a demonstration version of the application, which will be made available online under a link sent to the provided e-mail address within 7 working days from the payment being credited. The demo version may contain errors and is for illustrative purposes only. Full access to the source code and its transfer will be possible after paying the full amount for the software. Adaptation of the software to the needs of the ordering party takes place on the basis of a separate valuation of functional and visual components.',
      termsAccept: 'I accept',
      termsLink: 'terms and conditions.',
      marketingAccept: 'I want to receive marketing information (optional)',
      submitButton: 'Order {type} and proceed to payment',
      submitButtonLoading: '...',
      or: 'or',
      callUs: 'Call us at',
      phoneNumber: '+48 502 600 739',
      loadingSoftware: 'Loading software information...',
      softwareNotFound: 'Software not found'
    },
    orderSuccess: {
      consultationTitle: 'Thank you for ordering a quote/consultation!',
      demoTitle: 'Thank you for ordering a demo!',
      consultationDescription: 'We will contact you at the provided phone number to discuss project details and prepare a quote.',
      demoDescription: 'We will contact you at the provided phone number to arrange details and launch the demo.',
      loading: 'Loading...',
      backToHome: 'Back to homepage'
    },
    stripe: {
      consultationTitle: 'Consultation/Quote',
      consultationDescription: 'FelizTrade consultation or quote order',
      demoTitle: 'Demo prepayment',
      demoDescription: 'Demo prepayment: {softwareName}'
    },
    email: {
      consultationSubject: 'New quote/consultation',
      demoSubject: 'New demo order',
      consultationBody: 'New order (quote/consultation):',
      demoBody: 'New order (demo):',
      loggedInUser: 'logged in user',
      orderId: 'Order ID',
      software: 'Software',
      demoPrice: 'Demo prepayment'
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