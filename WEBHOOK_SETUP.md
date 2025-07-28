# Konfiguracja Webhook Stripe

## Problem
Po udanej płatności status zamówienia powinien się zmieniać z `pending` na `paid` w bazie danych.

## Rozwiązanie

### 1. Konfiguracja w Stripe Dashboard

1. **Zaloguj się do Stripe Dashboard**
   - Przejdź na https://dashboard.stripe.com
   - Zaloguj się na swoje konto

2. **Przejdź do sekcji Webhooks**
   - W menu po lewej stronie kliknij **Developers**
   - Następnie kliknij **Webhooks**

3. **Dodaj nowy webhook**
   - Kliknij **Add endpoint**
   - W polu **Endpoint URL** wpisz: `https://twoja-domena.com/api/webhook/stripe`
   - W sekcji **Events to send** wybierz:
     - `checkout.session.completed`
     - `checkout.session.expired`
   - Kliknij **Add endpoint**

4. **Skopiuj Webhook Secret**
   - Po utworzeniu webhooka, kliknij na niego
   - W sekcji **Signing secret** kliknij **Reveal**
   - Skopiuj secret (zaczyna się od `whsec_`)

### 2. Konfiguracja w aplikacji

1. **Dodaj Webhook Secret do pliku .env**
   ```env
   STRIPE_WEBHOOK_SECRET=whsec_twój_secret_tutaj
   ```

2. **Uruchom aplikację ponownie**
   ```bash
   npm run dev
   ```

### 3. Testowanie

1. **Sprawdź konfigurację**
   - Otwórz w przeglądarce: `http://localhost:3000/api/debug-webhook`
   - Sprawdź czy wszystkie zmienne są skonfigurowane

2. **Przetestuj płatność**
   - Utwórz nowe zamówienie
   - Przejdź przez proces płatności
   - Sprawdź w panelu admin czy status zmienił się na "Opłacone"

3. **Sprawdź logi**
   - W konsoli deweloperskiej powinny pojawić się logi:
     ```
     🔔 Webhook Stripe otrzymany
     ✅ Podpis zweryfikowany, typ eventu: checkout.session.completed
     💰 Płatność zakończona dla zamówienia: 123
     ✅ Zamówienie 123 zostało oznaczone jako opłacone
     ```

### 4. Debugowanie

Jeśli webhook nie działa:

1. **Sprawdź czy STRIPE_WEBHOOK_SECRET jest ustawiony**
   - GET `/api/debug-webhook` - sprawdź konfigurację

2. **Sprawdź logi w Stripe Dashboard**
   - Przejdź do Webhooks w Stripe Dashboard
   - Kliknij na webhook
   - Sprawdź sekcję **Recent deliveries**

3. **Sprawdź logi aplikacji**
   - Uruchom aplikację w trybie deweloperskim
   - Sprawdź konsolę pod kątem błędów

4. **Przetestuj ręcznie**
   - POST `/api/debug-webhook` z body: `{"orderId": 123}`
   - To symuluje aktualizację statusu zamówienia

### 5. Statusy zamówień

- **pending** - Oczekujące na płatność
- **paid** - Opłacone
- **expired** - Wygasłe (sesja Stripe wygasła)

### 6. Produkcja

W środowisku produkcyjnym:

1. **Użyj HTTPS URL**
   - Webhook URL musi być HTTPS
   - Przykład: `https://feliztradeltd.com/api/webhook/stripe`

2. **Sprawdź zmienne środowiskowe**
   - `STRIPE_SECRET_KEY` - klucz produkcyjny
   - `STRIPE_WEBHOOK_SECRET` - secret z produkcyjnego webhooka
   - `NEXT_PUBLIC_BASE_URL` - URL aplikacji

3. **Monitoruj logi**
   - Sprawdź logi aplikacji regularnie
   - Monitoruj webhook deliveries w Stripe Dashboard

## Struktura kodu

### Webhook endpoint
- `app/api/webhook/stripe/route.ts` - główny endpoint webhooka

### Debug endpoint
- `app/api/debug-webhook/route.ts` - testowanie i debugowanie

### Tworzenie zamówień
- `app/api/orders/route.ts` - tworzenie zamówień i sesji Stripe

### Panel admin
- `app/admin/page.tsx` - wyświetlanie zamówień z statusami 