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

  // Regulamin translations
  regulamin: {
    meta: {
      fallbackTitle: string
    }
    title: string
    subtitle: string
    companyInfo: {
      title: string
      labels: {
        companyName: string
        address: string
        email: string
        phone: string
        regNumber: string
        website: string
      }
      companyName: string
      address: string
      email: string
      phone: string
      regNumber: string
      website: string
    }
    definitions: {
      title: string
      items: {
        platform: {
          term: string
          description: string
        }
        company: {
          term: string
          description: string
        }
        user: {
          term: string
          description: string
        }
        client: {
          term: string
          description: string
        }
        services: {
          term: string
          description: string
        }
      }
    }
    scope: {
      title: string
      points: string[]
    }
    servicesKinds: {
      title: string
      softwareSales: {
        title: string
        items: string[]
      }
      technicalConsulting: {
        title: string
        items: string[]
      }
      devCollaboration: {
        title: string
        items: string[]
      }
      sourceCodeDelivery: {
        title: string
        items: string[]
      }
      appHosting: {
        title: string
        items: string[]
      }
    }
          hosting: {
        title: string
        period: {
          title: string
          items: string[]
        }
        maintenanceFee: {
          title: string
          items: string[]
        }
        consequences: {
          title: string
          items: string[]
        }
        renewal: {
          title: string
          items: string[]
        }
      }
    ordering: {
      title: string
      process: {
        title: string
        steps: string[]
      }
      requiredData: {
        title: string
        items: string[]
      }
      requiredConsents: {
        title: string
        items: string[]
      }
    }
    payments: {
      title: string
      methods: {
        title: string
        items: string[]
      }
      pricing: {
        title: string
        items: string[]
      }
      settlements: {
        title: string
        items: string[]
      }
    }
    fulfillment: {
      title: string
      leadTimes: {
        title: string
        items: string[]
      }
      process: {
        title: string
        steps: string[]
      }
      quality: {
        title: string
        items: string[]
      }
    }
    rightsDuties: {
      title: string
      companyRights: {
        title: string
        items: string[]
      }
      companyDuties: {
        title: string
        items: string[]
      }
      clientRights: {
        title: string
        items: string[]
      }
      clientDuties: {
        title: string
        items: string[]
      }
    }
    privacy: {
      title: string
      controller: {
        title: string
        items: string[]
      }
      purposes: {
        title: string
        items: string[]
      }
      userRights: {
        title: string
        items: string[]
      }
    }
    intellectualProperty: {
      title: string
      software: {
        title: string
        items: string[]
      }
      sourceCode: {
        title: string
        items: string[]
      }
      infringements: {
        title: string
        items: string[]
      }
    }
    liability: {
      title: string
      companyLiability: {
        title: string
        items: string[]
      }
      complaints: {
        title: string
        items: string[]
      }
      disputeResolution: {
        title: string
        items: string[]
      }
    }
    finalProvisions: {
      title: string
      changes: {
        title: string
        items: string[]
      }
      validity: {
        title: string
        items: string[]
      }
      entryIntoForce: {
        title: string
        items: string[]
      }
    }
    compliance: {
      title: string
      intro: string
      uk: string[]
    }
    contact: {
      title: string
      labels: {
        email: string
        phone: string
        address: string
        website: string
      }
      email: string
      phone: string
      address: string
      website: string
    }
    updateInfo: {
      lastUpdatedLabel: string
      lastUpdatedDate: string
      versionLabel: string
      version: string
    }
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
       collaborationConsent: 'Akceptuję, że opłata zaliczkowa w wysokości 30% ceny oprogramowania jest warunkiem rozpoczęcia współpracy, a pozostałe 70% zostanie rozliczone ratalnie w kolejnych etapach.',
       codeConsent: 'Akceptuję, że opłata w wysokości 100% ceny oprogramowania obejmuje dostarczenie repozytorium kodu wraz z instrukcjami uruchomienia i edycji.',
      termsAccept: 'Akceptuję',
      termsLink: 'regulamin.',
      marketingAccept: 'Chcę otrzymywać informacje marketingowe (opcjonalnie)',
      submitButton: 'Zamów {type}',
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
    },
    "regulamin": {
      "meta": {
        "fallbackTitle": "Regulamin - FelizTrade"
      },
      "title": "Regulamin",
      "subtitle": "Zapoznaj się z zasadami korzystania z Platformy.",
      "companyInfo": {
        "title": "Informacje o firmie",
        "labels": {
          "companyName": "Nazwa firmy:",
          "address": "Adres:",
          "email": "Email:",
          "phone": "Telefon:",
          "regNumber": "Numer rejestrowy:",
          "website": "Strona internetowa:"
        },
        "companyName": "Feliz Trade LTD",
        "address": "Preston, Lancashire, United Kingdom",
        "email": "FelizTradeLTD@proton.me",
        "phone": "+48 502 600 739",
        "regNumber": "16008964",
        "website": "https://feliztradeltd.com"
      },
      "definitions": {
        "title": "Definicje",
        "items": {
          "platform": {
            "term": "Platforma",
            "description": "Strona internetowa dostępna pod adresem https://feliztradeltd.com"
          },
          "company": {
            "term": "Firma",
            "description": "FELIZ TRADE LTD, spółka z ograniczoną odpowiedzialnością zarejestrowana w Wielkiej Brytanii"
          },
          "user": {
            "term": "Użytkownik",
            "description": "Osoba fizyczna, prawna lub jednostka organizacyjna korzystająca z Platformy"
          },
          "client": {
            "term": "Klient",
            "description": "Użytkownik składający zamówienie przez Platformę"
          },
          "services": {
            "term": "Usługi",
            "description": "Oprogramowania komputerowe, konsultacje techniczne, współpraca programistyczna"
          }
        }
      },
      "scope": {
        "title": "Postanowienia ogólne i zakres regulaminu",
        "points": [
          "Regulamin określa zasady świadczenia usług drogą elektroniczną przez Firmę, zasady korzystania z Platformy, w tym zakup oprogramowania, konsultacje oraz współpracę.",
          "Regulamin jest integralną częścią umowy o świadczenie usług",
          "Firma zastrzega sobie prawo do wprowadzania zmian w regulaminie w dowolnym momencie. Zmiany te będą obowiązywać od momentu ich opublikowania na platformie.",
          "Korzystanie z platformy FelizTrade oznacza akceptację regulaminu."
        ]
      },
      "servicesKinds": {
        "title": "Rodzaje usług",
        "softwareSales": {
          "title": "1. Sprzedaż oprogramowań",
          "items": [
            "Gotowe oprogramowania internetowe z kategorii określonych na Platformie",
            "Ceny podane w PLN lub GBP w zależności od wybranego języka",
            "Każde oprogramowanie posiada opis, funkcje i demo"
          ]
        },
        "technicalConsulting": {
          "title": "2. Konsultacje techniczne",
          "items": [
            "Doradztwo w zakresie projektów IT",
            "Wyceny projektów programistycznych",
            "Analiza wymagań technicznych"
          ]
        },
        "devCollaboration": {
          "title": "3. Współpraca programistyczna",
          "items": [
            "Implementacja oprogramowań na zamówienie",
            "Dostosowanie istniejących rozwiązań",
            "Wsparcie techniczne i szkolenia"
          ]
        },
        "sourceCodeDelivery": {
          "title": "4. Dostarczanie kodu źródłowego",
          "items": [
            "Przekazanie kodu oprogramowania",
            "Instrukcje instalacji i konfiguracji",
            "Dokumentacja techniczna"
          ]
        },
        "appHosting": {
          "title": "5. Serwerowanie aplikacji",
          "items": [
            "Hosting aplikacji na serwerach zewnętrznych usługodawców",
            "Pierwszy miesiąc serwerowania wliczony jest w cenę zakupu",
            "Po upływie pierwszego miesiąca po wdrożeniu aplikacji wymagana jest opłata utrzymaniowa na miesiąc kolejny",
            "Kolejne miesiące wymagają subskrypcji miesięcznej dokonywanej przez system subskrypcyjny Stripe",
            "Link do subskrypcji miesięcznej wysyłany jest drogą elektroniczną lub w inny indywidualnie ustalony sposób",
            "Klient zobowiązany jest do subskrybcji miesięcznej w celu utrzymania serwerowania zakupionego oprogramowania w kolejnych miesiącach",
            "Klient może anulować subskrypcję w dowolnym momencie, co oznacza rezygnację z usług serwerowania aplikacji",
            "Dokładna kwota ustalana indywidualnie w zależności od złożoności aplikacji i jej miesięcznych kosztów"
          ]
        }
      },
      "hosting": {
        "title": "Serwerowanie aplikacji",
        "period": {
          "title": "1. Okres serwerowania",
          "items": [
            "Serwerowanie aplikacji przez Feliz Trade świadczone jest w cykliczności miesięcznej",
            "Okres liczony od daty wdrożenia oprogramowania",
            "W trakcie okresu serwerowania zapewnione jest pełne wsparcie techniczne"
          ]
        },
        "maintenanceFee": {
          "title": "2. Opłata utrzymaniowa",
          "items": [
            "Po upływie pierwszego darmowego miesiąca wymagana jest opłata utrzymaniowa na kolejny miesiąc",
            "Wysokość opłaty utrzymaniowej: 10-50 GBP (lub 50-250 PLN) miesięcznie w zależności od aplikacji",
            "Dokładna kwota ustalana indywidualnie dla każdej aplikacji",
            "Wpływ na wysokość opłaty ma złożoność i wymagania techniczne aplikacji"
          ]
        },
        "consequences": {
          "title": "3. Konsekwencje braku opłaty",
          "items": [
            "Brak opłaty utrzymaniowej skutkuje wstrzymaniem serwerowania",
            "Aplikacja zostaje wyłączona",
            "Dane aplikacji są archiwizowane przez maksymalnie 30 dni",
            "Po 30 dniach dane mogą zostać usunięte"
          ]
        },
        "renewal": {
          "title": "4. Odnowienie serwerowania",
          "items": [
            "Możliwość odnowienia serwerowania po uiszczeniu opłaty utrzymaniowej",
            "Odnowienie możliwe w ciągu 30 dni od wstrzymania",
            "Po 30 dniach wymagane ponowne uruchomienie aplikacji (dodatkowa opłata)"
          ]
        }
      },
      "ordering": {
        "title": "Zasady składania zamówień",
        "process": {
          "title": "1. Proces zamawiania",
          "steps": [
            "Wybór produktu/usługi na Platformie",
            "Wypełnienie formularza zamówienia",
            "Akceptacja regulaminu i polityki prywatności",
            "Wybór metody płatności (Stripe)",
            "Potwierdzenie zamówienia (e-mail)"
          ]
        },
        "requiredData": {
          "title": "2. Wymagane dane",
          "items": [
            "Adres email (wymagane)",
            "Numer telefonu (wymagane)",
            "Dodatkowe informacje o projekcie",
            "Zgody na przetwarzanie danych osobowych"
          ]
        },
        "requiredConsents": {
          "title": "3. Zgody wymagane",
          "items": [
            "Akceptacja regulaminu (obowiązkowe)",
            "Zgoda na marketing (opcjonalne)",
            "Zgoda na współpracę (dla zamówień collaboration)",
            "Zgoda na kod (dla zamówień code)"
          ]
        }
      },
      "payments": {
        "title": "Płatności i rozliczenia",
        "methods": {
          "title": "1. Metody płatności",
          "items": [
            "Bramka płatnicza przez system Stripe",
            "Waluty: PLN (Polska) lub GBP (Wielka Brytania)",
            "Płatności online w czasie rzeczywistym"
          ]
        },
        "pricing": {
          "title": "2. Struktura cen",
          "items": [
            "Konsultacje: 200 PLN / 50 GBP",
            "Współpraca: 30% ceny oprogramowania (zaliczka)",
            "Kod źródłowy: 100% ceny oprogramowania",
            "Ceny komponentów funkcjonalnych: od-do w zależności od złożoności"
          ]
        },
        "settlements": {
          "title": "3. Rozliczenia",
          "items": [
            "Płatność przed rozpoczęciem realizacji",
            "Możliwość refundacji zgodnie z prawem"
          ]
        }
      },
      "fulfillment": {
        "title": "Realizacja zamówień",
        "leadTimes": {
          "title": "1. Czasy realizacji",
          "items": [
            "Konsultacje: kontakt w ciągu 24h",
            "Współpraca: kontakt w ciągu 24h, harmonogram ustalany indywidualnie",
            "Kod źródłowy: dostarczenie w ciągu 7 dni roboczych"
          ]
        },
        "process": {
          "title": "2. Proces realizacji",
          "steps": [
            "Potwierdzenie zamówienia drogą elektroniczną",
            "Kontakt telefoniczny w celu ustalenia szczegółów",
            "Realizacja zgodnie z ustalonym harmonogramem",
            "Przekazanie produktu/usługi"
          ]
        },
        "quality": {
          "title": "3. Jakość usług",
          "items": [
            "Usługi świadczone zgodnie z najlepszymi praktykami branżowymi",
            "Zgodność z opisem na Platformie",
            "Możliwość reklamacji w terminie 14 dni"
          ]
        }
      },
      "rightsDuties": {
        "title": "Prawa i obowiązki stron",
        "companyRights": {
          "title": "1. Prawa Firmy",
          "items": [
            "Odmowa realizacji zamówienia bez podawania przyczyny",
            "Zmiana cen i warunków z zachowaniem praw Klientów",
            "Zawieszenie świadczenia usług w przypadku naruszenia regulaminu"
          ]
        },
        "companyDuties": {
          "title": "2. Obowiązki Firmy",
          "items": [
            "Świadczenie usług zgodnie z umową",
            "Zachowanie poufności informacji Klienta",
            "Przekazanie produktu/usługi w ustalonym terminie",
            "Wsparcie techniczne w zakresie świadczonych usług"
          ]
        },
        "clientRights": {
          "title": "3. Prawa Klienta",
          "items": [
            "Informacja o statusie zamówienia",
            "Reklamacja wadliwych usług",
            "Odstąpienie od umowy w terminie 14 dni",
            "Ochrona danych osobowych"
          ]
        },
        "clientDuties": {
          "title": "4. Obowiązki Klienta",
          "items": [
            "Prawdziwość podanych informacji",
            "Terminowe płatności",
            "Współpraca w procesie realizacji",
            "Przestrzeganie regulaminu"
          ]
        }
      },
      "privacy": {
        "title": "Ochrona danych osobowych",
        "controller": {
          "title": "1. Administrator danych",
          "items": [
            "Feliz Trade LTD jako administrator danych osobowych",
            "Przetwarzanie zgodnie z RODO (UK GDPR)"
          ]
        },
        "purposes": {
          "title": "2. Cele przetwarzania",
          "items": [
            "Realizacja zamówień i świadczenie usług",
            "Marketing (za zgodą)",
            "Analiza statystyczna i poprawa jakości usług"
          ]
        },
        "userRights": {
          "title": "3. Prawa użytkownika",
          "items": [
            "Dostęp do swoich danych",
            "Poprawianie i usuwanie danych",
            "Przenoszenie danych",
            "Sprzeciw wobec przetwarzania"
          ]
        }
      },
      "intellectualProperty": {
        "title": "Własność intelektualna",
        "software": {
          "title": "1. Oprogramowania",
          "items": [
            "Wszystkie prawa własności intelektualnej należą do Firmy",
            "Licencja na użytkowanie oprogramowania",
            "Zakaz kopiowania, modyfikacji i rozpowszechniania"
          ]
        },
        "sourceCode": {
          "title": "2. Kod źródłowy",
          "items": [
            "Przekazanie praw do kodu po pełnej płatności",
            "Licencja na użytkowanie i modyfikację",
            "Zachowanie praw Firmy do wykorzystania w innych projektach"
          ]
        },
        "infringements": {
          "title": "3. Naruszenia",
          "items": [
            "Odpowiedzialność cywilna i karna",
            "Możliwość zawieszenia licencji",
            "Roszczenia o odszkodowanie"
          ]
        }
      },
      "liability": {
        "title": "Odpowiedzialność i reklamacje",
        "companyLiability": {
          "title": "1. Odpowiedzialność Firmy",
          "items": [
            "Ograniczona do wysokości opłaty za usługę",
            "Wyłączenie odpowiedzialności za szkody pośrednie"
          ]
        },
        "complaints": {
          "title": "2. Reklamacje",
          "items": [
            "Termin: 14 dni od otrzymania usługi",
            "Forma: pisemna lub elektroniczna",
            "Rozpatrzenie w terminie 14 dni",
            "Możliwość odwołania się do sądu"
          ]
        },
        "disputeResolution": {
          "title": "3. Rozstrzyganie sporów",
          "items": [
            "Sąd właściwy: sądy Wielkiej Brytanii",
            "Prawo właściwe: prawo angielskie",
            "Możliwość mediacji i arbitrażu"
          ]
        }
      },
      "finalProvisions": {
        "title": "Postanowienia końcowe",
        "changes": {
          "title": "1. Zmiany regulaminu",
          "items": [
            "Informacja o zmianach 30 dni wcześniej",
            "Akceptacja zmian przez dalsze korzystanie",
            "Możliwość odstąpienia od umowy"
          ]
        },
        "validity": {
          "title": "2. Ważność postanowień",
          "items": [
            "Nieważność pojedynczych postanowień nie wpływa na całość",
            "Zastąpienie nieważnych postanowień zgodnymi z prawem"
          ]
        },
        "entryIntoForce": {
          "title": "3. Wejście w życie",
          "items": [
            "Regulamin wchodzi w życie z dniem publikacji",
            "Obowiązuje wszystkich użytkowników Platformy"
          ]
        }
      },
      "compliance": {
        "title": "Zgodność z przepisami",
        "intro": "Ten regulamin jest zgodny z przepisami:",
        "uk": [
          "Consumer Rights Act 2015",
          "Electronic Commerce Regulations 2002",
          "UK GDPR"
        ]
      },
      "contact": {
        "title": "Kontakt w sprawach regulaminu",
        "labels": {
          "email": "Email:",
          "phone": "Telefon:",
          "address": "Adres:",
          "website": "Strona:"
        },
        "email": "FelizTradeLTD@proton.me",
        "phone": "+48 502 600 739",
        "address": "Preston, Lancashire, United Kingdom",
        "website": "https://feliztradeltd.com"
      },
      "updateInfo": {
        "lastUpdatedLabel": "Data ostatniej aktualizacji:",
        "lastUpdatedDate": "15.01.2025",
        "versionLabel": "Wersja:",
        "version": "1.0"
      }
    },
    
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
       collaborationConsent: 'I accept that a down payment of 30% of the software price is required to commence the cooperation, and the remaining 70% will be settled in installments at subsequent stages.',
       codeConsent: 'I accept that the payment of 100% of the software price covers the delivery of the code repository together with instructions for running and editing it.',
      termsAccept: 'I accept',
      termsLink: 'terms and conditions.',
      marketingAccept: 'I want to receive marketing information (optional)',
      submitButton: 'Order {type}',
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
     },
     "regulamin": {
      "meta": {
        "fallbackTitle": "Terms & Conditions - FelizTrade"
      },
      "title": "Terms & Conditions",
      "subtitle": "Review the rules for using the Platform.",
      "companyInfo": {
        "title": "Company Information",
        "labels": {
          "companyName": "Company name:",
          "address": "Address:",
          "email": "Email:",
          "phone": "Phone:",
          "regNumber": "Registration number:",
          "website": "Website:"
        },
        "companyName": "Feliz Trade LTD",
        "address": "Preston, Lancashire, United Kingdom",
        "email": "FelizTradeLTD@proton.me",
        "phone": "+48 502 600 739",
        "regNumber": "16008964",
        "website": "https://feliztradeltd.com"
      },
      "definitions": {
        "title": "Definitions",
        "items": {
          "platform": {
            "term": "Platform",
            "description": "Website available at https://feliztradeltd.com"
          },
          "company": {
            "term": "Company",
            "description": "FELIZ TRADE LTD, a limited company registered in the United Kingdom"
          },
          "user": {
            "term": "User",
            "description": "A natural person, legal person, or organizational unit using the Platform"
          },
          "client": {
            "term": "Customer",
            "description": "A User placing an order via the Platform"
          },
          "services": {
            "term": "Services",
            "description": "Computer software, technical consulting, developer collaboration"
          }
        }
      },
      "scope": {
        "title": "General Provisions and Scope of the Terms",
        "points": [
          "These Terms set out the rules for the provision of electronic services by the Company and the rules for using the Platform, including the purchase of software, consultations, and collaboration.",
          "The Terms form an integral part of the service agreement.",
          "The Company reserves the right to amend the Terms at any time. Such changes will apply from the moment they are published on the Platform.",
          "Use of the FelizTrade Platform constitutes acceptance of the Terms."
        ]
      },
      "servicesKinds": {
        "title": "Types of Services",
        "softwareSales": {
          "title": "1. Software Sales",
          "items": [
            "Ready-made web software in categories listed on the Platform",
            "Prices shown in PLN or GBP depending on the selected language",
            "Each software product includes a description, features, and a demo"
          ]
        },
        "technicalConsulting": {
          "title": "2. Technical Consulting",
          "items": [
            "Advisory services for IT projects",
            "Estimations for software development projects",
            "Analysis of technical requirements"
          ]
        },
        "devCollaboration": {
          "title": "3. Developer Collaboration",
          "items": [
            "Custom software implementation",
            "Adaptation of existing solutions",
            "Technical support and training"
          ]
        },
        "sourceCodeDelivery": {
          "title": "4. Source Code Delivery",
          "items": [
            "Transfer of the software code",
            "Installation and configuration instructions",
            "Technical documentation"
          ]
        },
        "appHosting": {
          "title": "5. Application Hosting",
          "items": [
            "Application hosting on third-party provider servers.",
            "The first month of hosting is included in the purchase price.",
            "After the first month following application deployment, a maintenance fee is due for the subsequent month.",
            "Subsequent months require a monthly subscription processed via Stripe's subscription system.",
            "A link to the monthly subscription will be sent electronically or via another individually agreed method.",
            "The Client is required to maintain an active monthly subscription to continue hosting the purchased software in subsequent months.",
            "The Client may cancel the subscription at any time, which will constitute termination of the application hosting services.",
            "The exact amount is determined individually based on the application's complexity and its monthly operating costs."
          ]
        }
      },
      "hosting": {
        "title": "Application Hosting",
        "period": {
          "title": "1. Hosting Period",
          "items": [
            "Application hosting by Feliz Trade is provided on a monthly recurring basis.",
            "The period is counted from the software deployment date.",
            "Full technical support is provided throughout the hosting period."
          ]
        },
        "maintenanceFee": {
          "title": "2. Maintenance Fee",
          "items": [
            "After the first free month, a maintenance fee is required for the following month.",
            "Monthly maintenance fee: 10–50 GBP (or 50–250 PLN), depending on the application.",
            "The exact amount is determined individually for each application.",
            "The fee depends on the application's complexity and technical requirements."
          ]
        },
        "consequences": {
          "title": "3. Consequences of Non-Payment",
          "items": [
            "Non-payment of the maintenance fee results in suspension of hosting services.",
            "The application will be disabled.",
            "Application data will be archived for up to 30 days.",
            "After 30 days, the data may be deleted."
          ]
        },
        "renewal": {
          "title": "4. Hosting Renewal",
          "items": [
            "Hosting can be reinstated upon payment of the maintenance fee.",
            "Renewal is available within 30 days of suspension.",
            "After 30 days, the application requires reactivation (additional fee applies)."
          ]
        }
      },
      "ordering": {
        "title": "Ordering Rules",
        "process": {
          "title": "1. Ordering Process",
          "steps": [
            "Select a product/service on the Platform",
            "Fill in the order form",
            "Accept the Terms and the Privacy Policy",
            "Choose the payment method (Stripe)",
            "Confirm the order (email)"
          ]
        },
        "requiredData": {
          "title": "2. Required Data",
          "items": [
            "Email address (required)",
            "Phone number (required)",
            "Additional project information",
            "Consents for personal data processing"
          ]
        },
        "requiredConsents": {
          "title": "3. Required Consents",
          "items": [
            "Acceptance of the Terms (mandatory)",
            "Marketing consent (optional)",
            "Collaboration consent (for collaboration orders)",
            "Code consent (for code orders)"
          ]
        }
      },
      "payments": {
        "title": "Payments and Billing",
        "methods": {
          "title": "1. Payment Methods",
          "items": [
            "Payment gateway via Stripe",
            "Currencies: PLN (Poland) or GBP (United Kingdom)",
            "Real-time online payments"
          ]
        },
        "pricing": {
          "title": "2. Pricing Structure",
          "items": [
            "Consultations: 200 PLN / 50 GBP",
            "Collaboration: 30% of the software price (deposit)",
            "Source code: 100% of the software price",
            "Functional component prices: vary depending on complexity"
          ]
        },
        "settlements": {
          "title": "3. Billing",
          "items": [
            "Payment before work commences",
            "Refunds available in accordance with the law"
          ]
        }
      },
      "fulfillment": {
        "title": "Order Fulfillment",
        "leadTimes": {
          "title": "1. Lead Times",
          "items": [
            "Consultations: contact within 24h",
            "Collaboration: contact within 24h, schedule set individually",
            "Source code: delivery within 7 business days"
          ]
        },
        "process": {
          "title": "2. Fulfillment Process",
          "steps": [
            "Order confirmation by electronic means",
            "Phone contact to arrange details",
            "Execution according to the agreed schedule",
            "Delivery of the product/service"
          ]
        },
        "quality": {
          "title": "3. Service Quality",
          "items": [
            "Services provided in line with best industry practices",
            "Compliance with the description on the Platform",
            "Possibility to file a complaint within 14 days"
          ]
        }
      },
      "rightsDuties": {
        "title": "Rights and Obligations of the Parties",
        "companyRights": {
          "title": "1. Company Rights",
          "items": [
            "Refusal to fulfill an order without stating a reason",
            "Change of prices and terms while respecting Customers’ rights",
            "Suspension of services in case of a breach of the Terms"
          ]
        },
        "companyDuties": {
          "title": "2. Company Obligations",
          "items": [
            "Provision of services in accordance with the agreement",
            "Confidentiality of Customer information",
            "Delivery of the product/service within the agreed timeframe",
            "Technical support within the scope of the services provided"
          ]
        },
        "clientRights": {
          "title": "3. Customer Rights",
          "items": [
            "Information about order status",
            "Complaint of defective services",
            "Right to withdraw from the contract within 14 days",
            "Protection of personal data"
          ]
        },
        "clientDuties": {
          "title": "4. Customer Obligations",
          "items": [
            "Accuracy of the information provided",
            "Timely payments",
            "Cooperation during fulfillment",
            "Compliance with the Terms"
          ]
        }
      },
      "privacy": {
        "title": "Personal Data Protection",
        "controller": {
          "title": "1. Data Controller",
          "items": [
            "Feliz Trade LTD as the personal data controller",
            "Processing in accordance with GDPR (UK GDPR)"
          ]
        },
        "purposes": {
          "title": "2. Purposes of Processing",
          "items": [
            "Order fulfillment and service provision",
            "Marketing (with consent)",
            "Statistical analysis and service quality improvement"
          ]
        },
        "userRights": {
          "title": "3. User Rights",
          "items": [
            "Access to one’s data",
            "Rectification and erasure of data",
            "Data portability",
            "Objection to processing"
          ]
        }
      },
      "intellectualProperty": {
        "title": "Intellectual Property",
        "software": {
          "title": "1. Software",
          "items": [
            "All intellectual property rights belong to the Company",
            "License to use the software",
            "Prohibition of copying, modification, and distribution"
          ]
        },
        "sourceCode": {
          "title": "2. Source Code",
          "items": [
            "Transfer of rights to the code after full payment",
            "License to use and modify",
            "Company’s right to reuse in other projects retained"
          ]
        },
        "infringements": {
          "title": "3. Infringements",
          "items": [
            "Civil and criminal liability",
            "Possibility of license suspension",
            "Claims for damages"
          ]
        }
      },
      "liability": {
        "title": "Liability and Complaints",
        "companyLiability": {
          "title": "1. Company Liability",
          "items": [
            "Limited to the amount of the service fee",
            "Exclusion of liability for indirect damages"
          ]
        },
        "complaints": {
          "title": "2. Complaints",
          "items": [
            "Time limit: 14 days from receipt of the service",
            "Form: written or electronic",
            "Review within 14 days",
            "Option to bring the case to court"
          ]
        },
        "disputeResolution": {
          "title": "3. Dispute Resolution",
          "items": [
            "Competent court: courts of the United Kingdom",
            "Governing law: English law",
            "Possibility of mediation and arbitration"
          ]
        }
      },
      "finalProvisions": {
        "title": "Final Provisions",
        "changes": {
          "title": "1. Changes to the Terms",
          "items": [
            "Notice of changes 30 days in advance",
            "Acceptance of changes through continued use",
            "Option to withdraw from the contract"
          ]
        },
        "validity": {
          "title": "2. Validity of Provisions",
          "items": [
            "Invalidity of individual provisions does not affect the whole",
            "Invalid provisions will be replaced with lawful ones"
          ]
        },
        "entryIntoForce": {
          "title": "3. Entry into Force",
          "items": [
            "The Terms enter into force on the date of publication",
            "They apply to all Platform users"
          ]
        }
      },
      "compliance": {
        "title": "Compliance",
        "intro": "These Terms comply with:",
        "uk": [
          "Consumer Rights Act 2015",
          "Electronic Commerce Regulations 2002",
          "UK GDPR"
        ]
      },
      "contact": {
        "title": "Contact Regarding the Terms",
        "labels": {
          "email": "Email:",
          "phone": "Phone:",
          "address": "Address:",
          "website": "Website:"
        },
        "email": "FelizTradeLTD@proton.me",
        "phone": "+48 502 600 739",
        "address": "Preston, Lancashire, United Kingdom",
        "website": "https://feliztradeltd.com"
      },
      "updateInfo": {
        "lastUpdatedLabel": "Last updated:",
        "lastUpdatedDate": "18.01.2025",
        "versionLabel": "Version:",
        "version": "1.0"
      }
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