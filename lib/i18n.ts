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
    title: string
    subtitle: string
    companyInfo: {
      title: string
      companyName: string
      address: string
      email: string
      phone: string
      regNumber: string
    }
    definitions: {
      title: string
      platform: string
      company: string
      user: string
      client: string
      services: string
    }
    generalProvisions: {
      title: string
      scope: string
      changes: string
      acceptance: string
    }
    services: {
      title: string
      software: string
      consultation: string
      collaboration: string
      code: string
      pricing: string
    }
    orders: {
      title: string
      process: string
      requiredData: string
      consents: string
      termsConsent: string
      marketingConsent: string
      collaborationConsent: string
      codeConsent: string
    }
    payments: {
      title: string
      methods: string
      currencies: string
      consultationPrice: string
      collaborationPrice: string
      codePrice: string
      invoices: string
    }
    delivery: {
      title: string
      consultationTime: string
      collaborationTime: string
      codeTime: string
      process: string
      quality: string
    }
    rights: {
      title: string
      companyRights: string
      companyObligations: string
      clientRights: string
      clientObligations: string
    }
    dataProtection: {
      title: string
      controller: string
      purposes: string
      userRights: string
    }
    intellectualProperty: {
      title: string
      software: string
      sourceCode: string
      violations: string
    }
    liability: {
      title: string
      companyLiability: string
      complaints: string
      disputeResolution: string
    }
    finalProvisions: {
      title: string
      changes: string
      validity: string
      effectiveDate: string
    }
    contact: {
      title: string
      email: string
      phone: string
      website: string
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
     },
    regulamin: {
      title: 'Regulamin FelizTrade',
      subtitle: 'Zasady i warunki korzystania z platformy FelizTrade',
      companyInfo: {
        title: 'Informacje o firmie',
               companyName: 'FelizTrade LTD',
       address: 'Preston, Lancashire, United Kingdom',
       email: 'FelizTradeLTD@proton.me',
       phone: '+48 502 600 739',
       regNumber: '16008964'
      },
      definitions: {
        title: 'Definicje',
        platform: 'Platforma FelizTrade to internetowy serwis, który umożliwia użytkownikom zakup oprogramowania, konsultacje oraz współpracę z firmami.',
        company: 'Firma FelizTrade to osoba prawna, która prowadzi działalność gospodarczą na rzecz użytkowników platformy.',
        user: 'Użytkownik to osoba, która korzysta z platformy FelizTrade, zarejestrowana na niej i posiadająca konto.',
        client: 'Klient to osoba fizyczna lub prawna, która zamawia oprogramowanie lub konsultację od firmy FelizTrade.',
        services: 'Usługi oferowane przez platformę FelizTrade obejmują: zakup oprogramowania, konsultacje, współpracę oraz dostarczanie kodu.'
      },
      generalProvisions: {
        title: 'Ogólne postanowienia',
        scope: 'Regulamin określa zasady korzystania z platformy FelizTrade, w tym zakup oprogramowania, konsultacje oraz współpracę.',
        changes: 'Firma FelizTrade zastrzega sobie prawo do wprowadzania zmian w regulaminie w dowolnym momencie. Zmiany te będą obowiązywać od momentu ich opublikowania na platformie.',
        acceptance: 'Korzystanie z platformy FelizTrade oznacza akceptację regulaminu.'
      },
      services: {
        title: 'Usługi',
        software: 'Oprogramowanie dostarczane przez platformę FelizTrade jest gotowe do użycia i nie wymaga dodatkowych instalacji.',
        consultation: 'Konsultacje odbywają się w formie online lub telefonicznej. Konsultant przeprowadza analizę potrzeb klienta i oferuje odpowiednie rozwiązania.',
        collaboration: 'Współpraca polega na współdziałaniu klienta i firmy FelizTrade w celu realizacji projektu. Klient przekazuje wymagania i oczekiwania, a firma odpowiada na pytania i udziela porad.',
        code: 'Dostarczanie kodu odbywa się w formie elektronicznej. Kod zawiera wszystkie niezbędne instrukcje uruchomienia i edycji.',
        pricing: 'Ceny usług są ustalane indywidualnie i zależą od rodzaju usługi oraz złożoności projektu.'
      },
      orders: {
        title: 'Zamówienia',
        process: 'Proces zamawiania usług odbywa się poprzez wypełnienie formularza zamówienia na platformie FelizTrade. Klient wskazuje rodzaj usługi, którą chce zamówić, oraz wymagania i oczekiwania.',
        requiredData: 'Do realizacji zamówienia wymagane są dane osobowe klienta, takie jak imię, nazwisko, adres e-mail, numer telefonu oraz dane do płatności.',
        consents: 'Klient musi wyrazić zgodę na przetwarzanie jego danych osobowych w celu realizacji zamówienia oraz w celu wysyłania informacji marketingowych (opcjonalnie).',
        termsConsent: 'Klient musi zaakceptować regulamin platformy FelizTrade przed złożeniem zamówienia.',
        marketingConsent: 'Klient może otrzymywać informacje marketingowe od firmy FelizTrade (opcjonalnie).',
        collaborationConsent: 'Oświadczam, że opłata zaliczkowa w wysokości 30% ceny oprogramowania dotyczy rozpoczęcia współpracy. Skontaktujemy się z Tobą w ciągu 24 godzin w celu ustalenia dalszych kroków i harmonogramu realizacji projektu.',
        codeConsent: 'Oświadczam, że opłata w wysokości 100% ceny oprogramowania dotyczy dostarczenia repozytorium kodu z instrukcjami uruchomienia i edycji. Kod zostanie dostarczony w ciągu 7 dni roboczych od zaksięgowania płatności.'
      },
      payments: {
        title: 'Płatności',
        methods: 'Płatności odbywają się poprzez przelew bankowy lub przelew internetowy. Firma FelizTrade zastrzega sobie prawo do wprowadzania zmian w metodach płatności w dowolnym momencie.',
        currencies: 'Wszystkie ceny są wyrażone w polskich złotych (PLN) lub funtach szterlingowych (GBP).',
        consultationPrice: 'Cena konsultacji wynosi 100 PLN (netto) lub 200 GBP (netto).',
        collaborationPrice: 'Cena współpracy wynosi 300 PLN (netto) lub 600 GBP (netto).',
        codePrice: 'Cena kodu wynosi 1000 PLN (netto) lub 2000 GBP (netto).',
        invoices: 'Firma FelizTrade wystawia faktury elektroniczne na wszystkie płatności.'
      },
      delivery: {
        title: 'Dostawa',
        consultationTime: 'Czas realizacji konsultacji to 24 godziny od momentu otrzymania zamówienia.',
        collaborationTime: 'Czas realizacji współpracy to 7 dni roboczych od momentu otrzymania zamówienia.',
        codeTime: 'Czas dostarczenia kodu to 7 dni roboczych od zaksięgowania płatności.',
        process: 'Dostawa odbywa się poprzez wysłanie kodu na adres e-mail klienta lub bezpośrednio na platformie FelizTrade.',
        quality: 'Kod dostarczany przez platformę FelizTrade jest pełnym i niezmienionym repozytorium kodu, zawierającym wszystkie niezbędne pliki i instrukcje.'
      },
      rights: {
        title: 'Prawa i obowiązki',
        companyRights: 'Firma FelizTrade ma prawo do wprowadzania zmian w regulaminie oraz do wprowadzania zmian w cenach i metodach płatności w dowolnym momencie.',
        companyObligations: 'Firma FelizTrade jest zobowiązana do udzielania klientom pomocy technicznej oraz do współpracy w terminie.',
        clientRights: 'Klient ma prawo do korzystania z platformy FelizTrade, do otrzymywania informacji o nowych ofertach oraz do wysyłania zapytań i propozycji.',
        clientObligations: 'Klient jest zobowiązany do płatności za usługi, do zachowania poufności danych oraz do przestrzegania regulaminu.'
      },
      dataProtection: {
        title: 'Ochrona danych osobowych',
        controller: 'Firma FelizTrade jest kontrolerem danych osobowych. Dane osobowe klientów są przetwarzane w celu realizacji zamówienia oraz w celu wysyłania informacji marketingowych (opcjonalnie).',
        purposes: 'Przetwarzane dane obejmują: imię, nazwisko, adres e-mail, numer telefonu, dane do płatności oraz dane do identyfikacji użytkownika.',
        userRights: 'Klient ma prawo do dostępu do swoich danych osobowych, do ich sprostowania, usunięcia oraz do ograniczenia przetwarzania.'
      },
      intellectualProperty: {
        title: 'Własność intelektualna',
        software: 'Oprogramowanie dostarczane przez platformę FelizTrade jest własnością intelektualną firmy FelizTrade. Klient otrzymuje licencję na używanie oprogramowania wyłącznie w zakresie określonym w regulaminie.',
        sourceCode: 'Kod dostarczany przez platformę FelizTrade jest własnością intelektualną firmy FelizTrade. Klient otrzymuje licencję na używanie kodu wyłącznie w zakresie określonym w regulaminie.',
        violations: 'W przypadku naruszenia praw autorskich lub innych praw własności intelektualnej, firma FelizTrade zastrzega sobie prawo do wniesienia roszczenia o odszkodowanie oraz do wniesienia roszczenia o zbanowanie użytkownika.'
      },
      liability: {
        title: 'Odpowiedzialność',
        companyLiability: 'Firma FelizTrade nie ponosi odpowiedzialności za szkody wynikające z niewykonania lub nienależytego wykonania zobowiązań wynikających z regulaminu.',
        complaints: 'W przypadku wystąpienia sprawy, klient może skontaktować się z firmą FelizTrade poprzez platformę lub telefonicznie.',
        disputeResolution: 'W przypadku sporów dotyczących regulaminu lub usług, strony zobowiązane są do próby ich rozwiązania drogą pokojową.'
      },
      finalProvisions: {
        title: 'Zakończenie umowy',
        changes: 'Firma FelizTrade zastrzega sobie prawo do wprowadzania zmian w regulaminie w dowolnym momencie. Zmiany te będą obowiązywać od momentu ich opublikowania na platformie.',
        validity: 'Regulamin obowiązuje od momentu jego opublikowania na platformie FelizTrade.',
        effectiveDate: 'Regulamin został wprowadzony z dniem 01.01.2024.'
      },
             contact: {
         title: 'Kontakt',
         email: 'FelizTradeLTD@proton.me',
         phone: '+48 502 600 739',
         website: 'https://feliztradeltd.com'
       }
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
     },
    regulamin: {
      title: 'FelizTrade Terms and Conditions',
      subtitle: 'Rules and conditions for using the FelizTrade platform',
      companyInfo: {
        title: 'Company Information',
               companyName: 'FelizTrade LTD',
       address: 'Preston, Lancashire, United Kingdom',
       email: 'FelizTradeLTD@proton.me',
       phone: '+48 502 600 739',
       regNumber: '16008964'
      },
      definitions: {
        title: 'Definitions',
        platform: 'FelizTrade platform is an online service that allows users to purchase software, consultations, and collaborate with companies.',
        company: 'FelizTrade company is a legal person conducting business on behalf of users of the platform.',
        user: 'User is a person who uses the FelizTrade platform, registered on it, and has an account.',
        client: 'Client is a natural or legal person who orders software or a consultation from FelizTrade company.',
        services: 'Services offered by the FelizTrade platform include: software purchase, consultations, collaboration, and code delivery.'
      },
      generalProvisions: {
        title: 'General Provisions',
        scope: 'The regulations define the rules of using the FelizTrade platform, including software purchase, consultations, and collaboration.',
        changes: 'FelizTrade reserves the right to make changes to the regulations at any time. These changes will take effect from the moment they are published on the platform.',
        acceptance: 'Using the FelizTrade platform means accepting the regulations.'
      },
      services: {
        title: 'Services',
        software: 'Software provided by the FelizTrade platform is ready to use and does not require additional installation.',
        consultation: 'Consultations are conducted online or by telephone. The consultant analyzes the client\'s needs and offers appropriate solutions.',
        collaboration: 'Collaboration involves cooperation between the client and the FelizTrade company to implement the project. The client provides requirements and expectations, and the company answers questions and provides advice.',
        code: 'Code delivery is electronic. The code includes all necessary installation and editing instructions.',
        pricing: 'Service prices are determined individually and depend on the type of service and the complexity of the project.'
      },
      orders: {
        title: 'Orders',
        process: 'The order process involves filling out an order form on the FelizTrade platform. The client indicates the type of service they wish to order, as well as requirements and expectations.',
        requiredData: 'To fulfill an order, the client\'s personal data, such as first name, last name, email address, phone number, and payment data are required.',
        consents: 'The client must express their consent to the processing of their personal data for the purpose of fulfilling the order and for the purpose of sending marketing information (optional).',
        termsConsent: 'The client must accept the FelizTrade platform regulations before submitting an order.',
        marketingConsent: 'The client may receive marketing information from FelizTrade company (optional).',
        collaborationConsent: 'I declare that the advance payment of 30% of the software price applies to starting collaboration. We will contact you within 24 hours to arrange next steps and project implementation schedule.',
        codeConsent: 'I declare that the payment of 100% of the software price applies to delivery of code repository with installation and editing instructions. Code will be delivered within 7 working days from payment being credited.'
      },
      payments: {
        title: 'Payments',
        methods: 'Payments are made via bank transfer or online transfer. FelizTrade reserves the right to change payment methods at any time.',
        currencies: 'All prices are expressed in Polish złoty (PLN) or British pounds (GBP).',
        consultationPrice: 'Consultation price is 100 PLN (net) or 200 GBP (net).',
        collaborationPrice: 'Collaboration price is 300 PLN (net) or 600 GBP (net).',
        codePrice: 'Code price is 1000 PLN (net) or 2000 GBP (net).',
        invoices: 'FelizTrade issues electronic invoices for all payments.'
      },
      delivery: {
        title: 'Delivery',
        consultationTime: 'Consultation time is 24 hours from the moment the order is received.',
        collaborationTime: 'Collaboration time is 7 working days from the moment the order is received.',
        codeTime: 'Code delivery time is 7 working days from payment being credited.',
        process: 'Delivery is carried out by sending the code to the client\'s email address or directly on the FelizTrade platform.',
        quality: 'The code delivered by the FelizTrade platform is a full and unmodified code repository, containing all necessary files and instructions.'
      },
      rights: {
        title: 'Rights and Obligations',
        companyRights: 'FelizTrade reserves the right to make changes to the regulations and to change prices and payment methods at any time.',
        companyObligations: 'FelizTrade is obliged to provide technical assistance to clients and to cooperate within the agreed time.',
        clientRights: 'The client has the right to use the FelizTrade platform, to receive information about new offers, and to send inquiries and proposals.',
        clientObligations: 'The client is obliged to pay for services, to maintain confidentiality of data, and to comply with the regulations.'
      },
      dataProtection: {
        title: 'Data Protection',
        controller: 'FelizTrade is the data controller. The personal data of clients are processed for the purpose of fulfilling the order and for the purpose of sending marketing information (optional).',
        purposes: 'The data processed include: first name, last name, email address, phone number, payment data, and user identification data.',
        userRights: 'The client has the right to access their personal data, to correct them, to delete them, and to limit processing.'
      },
      intellectualProperty: {
        title: 'Intellectual Property',
        software: 'The software provided by the FelizTrade platform is intellectual property of FelizTrade company. The client receives a license to use the software only within the scope defined in the regulations.',
        sourceCode: 'The code delivered by the FelizTrade platform is intellectual property of FelizTrade company. The client receives a license to use the code only within the scope defined in the regulations.',
        violations: 'In case of intellectual property rights or other intellectual property rights violations, FelizTrade reserves the right to claim compensation and to ban the user.'
      },
      liability: {
        title: 'Liability',
        companyLiability: 'FelizTrade is not liable for damages resulting from non-fulfillment or improper fulfillment of obligations arising from the regulations.',
        complaints: 'In case of a dispute, the client can contact FelizTrade via the platform or by telephone.',
        disputeResolution: 'In case of disputes regarding the regulations or services, the parties are obliged to try to resolve them by peaceful means.'
      },
      finalProvisions: {
        title: 'Termination of the Agreement',
        changes: 'FelizTrade reserves the right to make changes to the regulations at any time. These changes will take effect from the moment they are published on the platform.',
        validity: 'The regulations are effective from the moment they are published on the FelizTrade platform.',
        effectiveDate: 'The regulations were introduced on January 1, 2024.'
      },
             contact: {
         title: 'Contact',
         email: 'FelizTradeLTD@proton.me',
         phone: '+48 502 600 739',
         website: 'https://feliztradeltd.com'
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