# 🤖 AI-Powered Testimonials - Konfiguracja

## 📋 Przegląd

System opinii został rozszerzony o funkcję AI, która automatycznie generuje 3 propozycje opinii dla użytkowników, aby ułatwić im proces dodawania recenzji.

## 🔧 Konfiguracja

### 1. Klucz API OpenAI

Aby funkcja AI działała, musisz dodać klucz API OpenAI do zmiennych środowiskowych.

#### Jak uzyskać klucz API:

1. Przejdź do https://platform.openai.com/
2. Zaloguj się lub utwórz konto
3. Przejdź do sekcji "API keys" (https://platform.openai.com/api-keys)
4. Kliknij "Create new secret key"
5. Skopiuj wygenerowany klucz

#### Dodaj klucz do projektu:

Dodaj następującą linię do pliku `.env` (lub `.env.local`):

```bash
OPENAI_API_KEY=sk-proj-xxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

⚠️ **WAŻNE:** Nie commituj pliku `.env` do repozytorium! Upewnij się, że jest on w `.gitignore`.

### 2. Model AI

Używamy modelu `gpt-4o-mini`, który jest:
- ✅ Szybki (odpowiedzi w ~2-3 sekundy)
- ✅ Ekonomiczny (~$0.15 za 1M tokenów wejściowych)
- ✅ Wystarczająco dobry do generowania opinii

Możesz zmienić model w pliku:
`app/api/testimonials/generate-suggestions/route.ts`

## 🎯 Jak to działa

### Dla użytkownika:

1. Użytkownik wchodzi na formularz opinii (`/testimonial?software=ID`)
2. Wybiera ocenę (1-5 gwiazdek)
3. Klika przycisk **"Sugestie AI"** ✨
4. System generuje 3 propozycje opinii dopasowane do oceny
5. Użytkownik może kliknąć na wybraną sugestię, aby wypełnić pole tekstowe
6. Może edytować tekst lub użyć go bez zmian

### Parametry generowania:

- **Nazwa oprogramowania** - z bazy danych
- **Opis oprogramowania** - z bazy danych
- **Ocena** - wybrana przez użytkownika (1-5)
- **Język** - aktualny język interfejsu (PL/EN)

### Przykładowy prompt do AI:

```
Jesteś asystentem, który pomaga użytkownikom pisać opinie o oprogramowaniu.

Oprogramowanie: [nazwa]
Opis: [opis]
Ocena: [1-5]/5 gwiazdek

Wygeneruj 3 różne, autentyczne opinie po polsku/in English
o tym oprogramowaniu, które odpowiadają podanej ocenie.

Wymagania:
- Każda opinia powinna mieć 2-3 zdania (50-100 słów)
- Opinie powinny być różnorodne i unikalne
- Dostosuj ton do oceny
- Opinie powinny brzmieć naturalnie i autentycznie
```

## 💰 Koszty

Szacunkowe koszty przy użyciu `gpt-4o-mini`:

- **1 generowanie** = ~300 tokenów (wejście + wyjście)
- **Koszt:** ~$0.00005 za generowanie
- **1000 generowań** = ~$0.05 (5 groszy)

Czyli nawet przy dużym ruchu koszty są minimalne! 🎉

## 🔒 Bezpieczeństwo

### Rate limiting (opcjonalne):

Możesz dodać ograniczenia, aby zapobiec nadużyciom:

```typescript
// Przykład: max 3 generowania na IP/godzinę
const rateLimiter = new Map<string, number>()
```

### Moderacja treści:

Wszystkie opinie trafiają do moderacji w panelu admina przed publikacją, więc nawet jeśli AI wygeneruje coś nieodpowiedniego, nie trafi na stronę.

## 🎨 UI/UX

### Przycisk "Sugestie AI":
- 🎨 Gradient fioletowo-niebieski
- ✨ Ikona Sparkles
- ⏳ Animacja ładowania (spinner)

### Sugestie:
- 📋 3 karty do kliknięcia
- 🎭 Animowane pojawienie się
- 🖱️ Hover efekt
- ➡️ Automatyczne wypełnienie pola tekstowego po kliknięciu

## 🐛 Debugging

### Problem: "OpenAI API key not configured"
**Rozwiązanie:** Sprawdź czy zmienna `OPENAI_API_KEY` jest ustawiona w `.env`

### Problem: "Failed to generate suggestions"
**Rozwiązanie:** 
1. Sprawdź czy masz środki na koncie OpenAI
2. Sprawdź czy klucz API jest aktywny
3. Zobacz logi w konsoli dla szczegółów błędu

### Problem: Sugestie w złym języku
**Rozwiązanie:** Sprawdź czy parametr `language` jest poprawnie przekazywany do API

## 📊 Monitorowanie

Możesz monitorować użycie API w panelu OpenAI:
https://platform.openai.com/usage

## 🚀 Opcjonalne ulepszenia

1. **Cache'owanie:** Zapisuj wygenerowane sugestie dla popularnychoprogramowań
2. **Personalizacja:** Dodaj preferencje użytkownika (ton opinii, długość)
3. **A/B Testing:** Test różnych promptów i modeli
4. **Analytics:** Śledź które sugestie są najczęściej wybierane

## 📝 Notatki

- Model AI generuje opinie w języku formularza (PL lub EN)
- Opinie są dopasowane do wybranej oceny gwiazdkowej
- Użytkownik może swobodnie edytować wygenerowany tekst
- Wszystkie opinie wymagają zatwierdzenia przez admina

---

**Ostatnia aktualizacja:** Październik 2025
**Wersja:** 1.0
