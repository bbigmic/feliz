# Implementacja Wielojęzyczności w FelizTrade

## Przegląd

Zaimplementowano system wielojęzyczności dla aplikacji FelizTrade, który pozwala na wyświetlanie treści w języku polskim i angielskim. System jest zbudowany w taki sposób, że backend pozostaje w jednym języku, a frontend dynamicznie tłumaczy treści na podstawie wybranego języka.

## Architektura

### 1. Struktura plików

```
lib/
├── i18n.ts              # Konfiguracja tłumaczeń
hooks/
├── useLanguage.ts        # Hook do zarządzania językiem
components/
├── LanguageSwitcher.tsx  # Komponent przełącznika języka
```

### 2. Baza danych

W schemacie Prisma dodano pola wielojęzyczne:

```prisma
model Software {
  // ... istniejące pola
  nameEn        String?
  descriptionEn String?
  featuresEn    String?
}

model Component {
  // ... istniejące pola
  nameEn String?
  notesEn String?
}
```

## Implementacja

### 1. Konfiguracja tłumaczeń (`lib/i18n.ts`)

Plik zawiera:
- Typ `Language` definiujący dostępne języki
- Interfejs `Translations` z typami dla wszystkich tłumaczeń
- Obiekt `translations` z tłumaczeniami dla PL i EN
- Funkcję `getTranslation()` do pobierania tłumaczeń

### 2. Hook zarządzania językiem (`hooks/useLanguage.ts`)

Hook zapewnia:
- Stan aktualnego języka
- Funkcję `changeLanguage()` do zmiany języka
- Funkcję `t()` do pobierania tłumaczeń
- Persystencję wybranego języka w localStorage

### 3. Komponent przełącznika (`components/LanguageSwitcher.tsx`)

Przełącznik zawiera:
- Przyciski z flagami dla każdego języka
- Wizualne oznaczenie aktywnego języka
- Responsywny design

## Użycie

### 1. W komponentach

```tsx
import { useLanguage } from '@/hooks/useLanguage'

export default function MyComponent() {
  const { t, language } = useLanguage()
  
  return (
    <div>
      <h1>{t('hero.title')}</h1>
      <p>{t('hero.subtitle')}</p>
    </div>
  )
}
```

### 2. Dla danych z backendu

```tsx
// Dla oprogramowań
const softwareName = language === 'en' && software.nameEn 
  ? software.nameEn 
  : software.name

// Dla komponentów
const componentName = language === 'en' && component.nameEn 
  ? component.nameEn 
  : component.name
```

## Dodawanie nowych tłumaczeń

### 1. Dodaj klucz do interfejsu `Translations`

```tsx
export interface Translations {
  // ... istniejące sekcje
  newSection: {
    newKey: string
  }
}
```

### 2. Dodaj tłumaczenia do obiektu `translations`

```tsx
export const translations: Record<Language, Translations> = {
  pl: {
    // ... istniejące tłumaczenia
    newSection: {
      newKey: 'Polski tekst'
    }
  },
  en: {
    // ... istniejące tłumaczenia
    newSection: {
      newKey: 'English text'
    }
  }
}
```

### 3. Użyj w komponencie

```tsx
const { t } = useLanguage()
return <div>{t('newSection.newKey')}</div>
```

## Dodawanie tłumaczeń do bazy danych

### 1. Aktualizuj schemat Prisma (jeśli potrzebne)

```prisma
model YourModel {
  // ... istniejące pola
  nameEn String?
  descriptionEn String?
}
```

### 2. Dodaj tłumaczenia przez API lub skrypt

```javascript
// Przykład skryptu
await prisma.yourModel.updateMany({
  where: { name: 'Polska nazwa' },
  data: {
    nameEn: 'English name',
    descriptionEn: 'English description'
  }
})
```

## Funkcjonalności

### ✅ Zaimplementowane

1. **Przełącznik języka** - widoczny w headerze (desktop i mobile)
2. **Persystencja wyboru** - język zapisywany w localStorage
3. **Tłumaczenia statyczne** - wszystkie teksty UI
4. **Tłumaczenia dynamiczne** - dane z backendu (nazwy, opisy, funkcje)
5. **Responsywność** - przełącznik działa na wszystkich urządzeniach

### 🔄 Sekcje z tłumaczeniami

1. **Hero section** - tytuł, podtytuł, statystyki
2. **Filtry** - placeholdery, opcje sortowania
3. **Karty oprogramowań** - nazwy, opisy, funkcje, przyciski
4. **Cennik komponentów** - nazwy, uwagi
5. **Sekcja CTA** - tytuł, opis, przycisk
6. **Komunikaty** - ładowanie, błędy, brak wyników

## Testowanie

### 1. Sprawdź przełącznik języka
- Otwórz aplikację w przeglądarce
- Kliknij przycisk EN w headerze
- Sprawdź, czy teksty się zmieniły na angielski

### 2. Sprawdź persystencję
- Zmień język na angielski
- Odśwież stronę
- Sprawdź, czy język pozostał angielski

### 3. Sprawdź dane z backendu
- Przełącz na angielski
- Sprawdź, czy nazwy oprogramowań i komponentów są po angielsku
- Sprawdź, czy opisy i funkcje są przetłumaczone

## Rozszerzanie

### Dodanie nowego języka

1. Dodaj kod języka do typu `Language`
2. Dodaj tłumaczenia do obiektu `translations`
3. Dodaj flagę do `LanguageSwitcher`
4. Zaktualizuj pola w bazie danych (jeśli potrzebne)

### Dodanie nowych sekcji

1. Dodaj sekcję do interfejsu `Translations`
2. Dodaj tłumaczenia do obiektu `translations`
3. Użyj `t()` w komponencie

## Uwagi techniczne

- System używa localStorage do zapisywania wybranego języka
- Tłumaczenia są ładowane statycznie (nie ma API dla tłumaczeń)
- Dane z backendu są sprawdzane pod kątem pól wielojęzycznych
- Fallback: jeśli brak tłumaczenia, używany jest tekst polski
- System jest łatwo rozszerzalny o nowe języki i sekcje 