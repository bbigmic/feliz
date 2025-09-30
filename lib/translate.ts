/**
 * Funkcja do automatycznego tłumaczenia tekstu z polskiego na angielski
 * Używa Google Translate API
 */

export async function translateToEnglish(text: string): Promise<string> {
  if (!text || text.trim() === '') {
    return '';
  }

  try {
    // Używamy Google Translate API
    const response = await fetch(`https://translate.googleapis.com/translate_a/single?client=gtx&sl=pl&tl=en&dt=t&q=${encodeURIComponent(text)}`);
    
    if (!response.ok) {
      console.warn('Błąd tłumaczenia Google Translate:', response.status);
      return text; // Zwracamy oryginalny tekst w przypadku błędu
    }

    const data = await response.json();
    
    // Google Translate zwraca tablicę z tłumaczeniami
    if (data && data[0] && data[0][0] && data[0][0][0]) {
      return data[0][0][0];
    }
    
    return text; // Fallback do oryginalnego tekstu
  } catch (error) {
    console.warn('Błąd podczas tłumaczenia:', error);
    return text; // Zwracamy oryginalny tekst w przypadku błędu
  }
}

/**
 * Funkcja do tłumaczenia tablicy tekstów
 */
export async function translateArrayToEnglish(texts: string[]): Promise<string[]> {
  if (!texts || texts.length === 0) {
    return [];
  }

  const translations = await Promise.all(
    texts.map(text => translateToEnglish(text))
  );

  return translations;
}

/**
 * Funkcja do tłumaczenia kategorii (JSON string)
 */
export async function translateCategoriesToEnglish(categoriesJson: string): Promise<string> {
  try {
    const categories = JSON.parse(categoriesJson);
    if (Array.isArray(categories)) {
      const translatedCategories = await translateArrayToEnglish(categories);
      return JSON.stringify(translatedCategories);
    }
    return categoriesJson;
  } catch (error) {
    console.warn('Błąd podczas parsowania kategorii:', error);
    return categoriesJson;
  }
} 