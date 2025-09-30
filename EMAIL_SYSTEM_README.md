# 📧 System Maili FelizTrade

## 🎯 **Przegląd Systemu**

FelizTrade posiada zaawansowany system automatycznej wysyłki maili, który zapewnia komunikację z klientami na każdym etapie procesu zamawiania.

## 📨 **Typy Wysyłanych Maili**

### **1. Maile do Właściciela Platformy**
- **Odbiorca**: `order@feliztradeltd.com`
- **Wysyłane**: Po każdym złożeniu zamówienia
- **Zawartość**: Szczegóły zamówienia, dane klienta, informacje o produkcie

### **2. Maile Potwierdzające do Klientów**
- **Odbiorca**: Email podany przez klienta podczas zamawiania
- **Wysyłane**: TYLKO po potwierdzeniu płatności przez Stripe
- **Wersje językowe**: Polski i angielski

### **3. Maile Powiadamiające**
- **Wygasła sesja płatności**: Informacja o konieczności ponownego zamówienia
- **Potwierdzenie płatności**: Potwierdzenie udanej transakcji

## 🔄 **Poprawiony Przepływ Maili**

```
Klient składa zamówienie
         ↓
   Mail do właściciela ✅
         ↓
   Klient płaci przez Stripe
         ↓
   Webhook Stripe potwierdza płatność
         ↓
   Mail potwierdzający do klienta ✅
```

**WAŻNE**: Email potwierdzający do klienta NIE jest wysyłany po złożeniu zamówienia - tylko po potwierdzeniu płatności!

## 📧 **Szablony Maili**

### **Konsultacja/Wycena**
- **Polski**: "Płatność potwierdzona - Zamówienie konsultacji"
- **Angielski**: "Payment Confirmed - Consultation Order"

### **Współpraca (MVP)**
- **Polski**: "Płatność potwierdzona - Zamówienie współpracy"
- **Angielski**: "Payment Confirmed - Collaboration Order"

### **Kod z Instrukcjami**
- **Polski**: "Płatność potwierdzona - Zamówienie kodu"
- **Angielski**: "Payment Confirmed - Code Order"

## 🌐 **Wielojęzyczność**

### **Automatyczne Wykrywanie Języka**
- Język jest określany na podstawie wyboru użytkownika w interfejsie
- Wszystkie maile są wysyłane w odpowiednim języku
- Obsługa polskiego (PL) i angielskiego (EN)

### **Lokalizacja Treści**
- Powitania i pożegnania
- Nazwy pól formularza
- Instrukcje i opisy
- Informacje kontaktowe

## ⚙️ **Konfiguracja SMTP**

### **Zmienne Środowiskowe**
```env
SMTP_SERVER=your-smtp-server.com
SMTP_PORT=587
EMAIL_USER=order@feliztradeltd.com
EMAIL_PASS=your-email-password
```

### **Konfiguracja Transportera**
```typescript
const transporter = nodemailer.createTransporter({
  host: process.env.SMTP_SERVER,
  port: Number(process.env.SMTP_PORT),
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
})
```

## 📋 **Zawartość Maili do Klientów**

### **Po Potwierdzeniu Płatności (JEDYNY email do klienta)**
- Powitanie w odpowiednim języku
- Potwierdzenie udanej płatności
- Szczegóły zamówienia (ID, typ, telefon)
- Harmonogram realizacji
- Informacje kontaktowe FelizTrade
- Podziękowanie

### **Po Wygasnięciu Sesji Płatności**
- Informacja o wygaśnięciu
- Instrukcja ponownego zamówienia
- Link do strony głównej
- Informacje kontaktowe

## 🚀 **Implementacja Techniczna**

### **1. API Endpoint Zamówień (`/api/orders`)**
```typescript
// Mail do właściciela
await transporter.sendMail({
  from: `FelizTrade <${process.env.EMAIL_USER}>`,
  to: process.env.EMAIL_USER,
  subject: emailSubject,
  text: emailBody
})

// NIE wysyłamy maila do klienta tutaj!
// Email potwierdzający zostanie wysłany dopiero po potwierdzeniu płatności
```

### **2. Webhook Stripe (`/api/webhook/stripe`)**
```typescript
case 'checkout.session.completed':
  // Wyślij mail potwierdzający płatność do klienta
  await transporter.sendMail({
    from: `FelizTrade <${process.env.EMAIL_USER}>`,
    to: order.email,
    subject: paymentSubject,
    text: paymentEmailText
  })

case 'checkout.session.expired':
  // Wyślij mail o wygaśnięciu sesji
  await transporter.sendMail({
    from: `FelizTrade <${process.env.EMAIL_USER}>`,
    to: expiredOrder.email,
    subject: expiredSubject,
    text: expiredEmailText
  })
```

## 📊 **Monitoring i Logi**

### **Logi Sukcesu**
- Potwierdzenie wysłania maila do właściciela
- Potwierdzenie wysłania maila potwierdzającego płatność
- Informacje o wygasłych sesjach

### **Logi Błędów**
- Błędy SMTP podczas wysyłki
- Błędy konfiguracji transportera
- Problemy z adresami email

## 🔒 **Bezpieczeństwo**

### **Walidacja Adresów Email**
- Sprawdzanie poprawności formatu
- Weryfikacja przed wysłaniem
- Obsługa błędów wysyłki

### **Ochrona Danych**
- Szyfrowanie połączeń SMTP
- Bezpieczne przechowywanie haseł
- Logowanie tylko niezbędnych informacji

## 🧪 **Testowanie**

### **Środowisko Deweloperskie**
- Użyj lokalnego serwera SMTP (np. MailHog)
- Testuj różne typy zamówień
- Sprawdzaj wersje językowe

### **Środowisko Produkcyjne**
- Weryfikuj konfigurację SMTP
- Monitoruj dostarczalność maili
- Sprawdzaj foldery spam

## 📈 **Rozwój Systemu**

### **Planowane Funkcjonalności**
- [ ] Szablony HTML zamiast tekstowych
- [ ] System szablonów maili
- [ ] Automatyczne przypomnienia
- [ ] Integracja z systemem powiadomień
- [ ] Analytics dostarczalności maili

### **Optymalizacje**
- Kolejkowanie maili dla dużych wolumenów
- Retry mechanism dla nieudanych wysyłek
- Kompresja załączników
- Personalizacja treści

## 📞 **Wsparcie Techniczne**

### **Rozwiązywanie Problemów**
1. **Sprawdź logi SMTP** w konsoli
2. **Weryfikuj zmienne środowiskowe**
3. **Testuj połączenie SMTP** lokalnie
4. **Sprawdź foldery spam** klientów

### **Kontakt**
- **Email**: feliztradeltd@proton.me
- **Website**: https://feliztradeltd.com

---

**FelizTrade Email System** - Profesjonalna komunikacja z klientami! 🚀 

**Uwaga**: System został zoptymalizowany - klienci otrzymują email potwierdzający TYLKO po udanej płatności, nie po złożeniu zamówienia. 