# FelizTrade - Platforma Sprzedaży Oprogramowań WWW

Nowoczesna platforma do sprzedaży oprogramowań WWW z automatycznym systemem demo przez proxy.

## 🚀 Funkcjonalności

- **Katalog oprogramowań** - Przeglądanie i wyszukiwanie oprogramowań
- **System proxy demo** - Automatyczne wyświetlanie demo oprogramowań
- **Panel administracyjny** - Zarządzanie oprogramowaniami
- **Responsywny design** - Nowoczesny UI na wszystkich urządzeniach
- **System płatności** - Integracja z Stripe (gotowa do implementacji)
- **Filtrowanie i sortowanie** - Zaawansowane opcje wyszukiwania

## 🛠️ Technologie

- **Next.js 14** - Framework React z App Router
- **TypeScript** - Typowanie statyczne
- **Tailwind CSS** - Stylowanie utility-first
- **Framer Motion** - Animacje
- **Lucide React** - Ikony
- **React Hot Toast** - Powiadomienia

## 📦 Instalacja

1. **Sklonuj repozytorium**
```bash
git clone https://github.com/your-username/feliztrade.git
cd feliztrade
```

2. **Zainstaluj zależności**
```bash
npm install
```

3. **Uruchom serwer deweloperski**
```bash
npm run dev
```

4. **Otwórz w przeglądarce**
```
http://localhost:3000
```

## 🏗️ Struktura projektu

```
feliztrade/
├── app/                    # Next.js App Router
│   ├── admin/             # Panel administracyjny
│   ├── api/               # API routes
│   │   └── proxy/         # System proxy demo
│   ├── globals.css        # Globalne style
│   ├── layout.tsx         # Główny layout
│   └── page.tsx           # Strona główna
├── components/            # Komponenty React
│   ├── Header.tsx         # Nagłówek
│   ├── Footer.tsx         # Stopka
│   └── SoftwareCard.tsx   # Karta oprogramowania
├── public/               # Pliki statyczne
└── package.json          # Zależności
```

## 🔧 Konfiguracja

### System Proxy Demo

System proxy automatycznie wyświetla demo oprogramowań przez URL `/demo/{id}`. 

**Mapowanie oprogramowań:**
```typescript
const softwareMap = {
  '1': 'https://example-ecommerce.com',
  '2': 'https://example-crm.com',
  // ... dodaj więcej
}
```

### Dodawanie nowych oprogramowań

1. Dodaj dane do `softwareData` w `app/page.tsx`
2. Dodaj mapowanie URL w `app/api/proxy/[...path]/route.ts`
3. Zaktualizuj panel administracyjny

## 🎨 Customizacja

### Kolory
Edytuj `tailwind.config.js`:
```javascript
colors: {
  primary: {
    500: '#3b82f6', // Główny kolor
    600: '#2563eb',
  }
}
```

### Stylowanie
Dodaj własne style w `app/globals.css`:
```css
@layer components {
  .btn-custom {
    @apply bg-blue-600 hover:bg-blue-700;
  }
}
```

## 📱 Responsywność

Platforma jest w pełni responsywna:
- **Mobile**: 320px - 768px
- **Tablet**: 768px - 1024px  
- **Desktop**: 1024px+

## 🔒 Bezpieczeństwo

- Walidacja danych wejściowych
- Sanityzacja HTML w proxy
- CORS headers
- Rate limiting (do implementacji)

## 🚀 Deployment

### Vercel (zalecane)
```bash
npm run build
vercel --prod
```

### Inne platformy
```bash
npm run build
npm start
```

## 📊 Monitoring

- Google Analytics (do dodania)
- Error tracking (do implementacji)
- Performance monitoring

## 🤝 Contributing

1. Fork projektu
2. Stwórz feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit zmiany (`git commit -m 'Add AmazingFeature'`)
4. Push do branch (`git push origin feature/AmazingFeature`)
5. Otwórz Pull Request

## 📄 Licencja

MIT License - zobacz [LICENSE](LICENSE) dla szczegółów.

## 📞 Kontakt

- **Email**: feliztradeltd@proton.me
- **Website**: https://feliztradeltd.com

## 🎯 Roadmap

- [ ] Integracja z bazą danych
- [ ] System płatności Stripe
- [ ] System użytkowników
- [ ] API REST
- [ ] System ocen i recenzji
- [ ] Multi-language support
- [ ] PWA (Progressive Web App)
- [ ] Dark mode
- [ ] System powiadomień
- [ ] Analytics dashboard

---

**FelizTrade** - Profesjonalne oprogramowania WWW na wyciągnięcie ręki! 🚀 