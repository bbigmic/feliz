import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || ''
})

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { softwareName, softwareDescription, rating, language, position } = body

    if (!softwareName || !rating) {
      return NextResponse.json(
        { error: 'Brak wymaganych danych' },
        { status: 400 }
      )
    }

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: 'OpenAI API key not configured' },
        { status: 500 }
      )
    }

    const ratingText = rating === 5 ? 'bardzo pozytywną' : rating === 4 ? 'pozytywną' : rating === 3 ? 'neutralną' : 'mieszaną'
    const languageInstruction = language === 'en' ? 'in English' : 'po polsku'
    const positionContext = position ? `\nStanowisko osoby: ${position}` : ''

    const prompt = `Jesteś asystentem, który pomaga użytkownikom pisać opinie o oprogramowaniu.

Oprogramowanie: ${softwareName}
${softwareDescription ? `Opis: ${softwareDescription}` : ''}${positionContext}
Ocena: ${rating}/5 gwiazdek (${ratingText} opinia)

Wygeneruj 3 różne, autentyczne opinie ${languageInstruction} o tym oprogramowaniu, które odpowiadają podanej ocenie ${rating}/5.

Wymagania:
- Każda opinia powinna mieć 2-3 zdania (50-100 słów)
- Opinie powinny być różnorodne i unikalne
- Dostosuj ton do oceny (${rating}/5)
- Opinie powinny brzmieć naturalnie i autentycznie
- Nie używaj zbyt formalnego języka
- Skup się na konkretnych aspektach jak: funkcjonalność, łatwość użycia, design, wsparcie techniczne, stosunek ceny do jakości
${position ? `- Uwzględnij perspektywę osoby na stanowisku: ${position}` : ''}

Zwróć TYLKO i WYŁĄCZNIE tablicę JSON z 3 opiniami w formacie:
["opinia 1", "opinia 2", "opinia 3"]

Bez żadnych dodatkowych wyjaśnień czy tekstu.`

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: 'Jesteś pomocnym asystentem generującym autentyczne opinie o oprogramowaniu. Zawsze zwracasz odpowiedź w formacie JSON array ze stringami.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.8,
      max_tokens: 500,
      response_format: { type: "json_object" }
    })

    const responseText = completion.choices[0]?.message?.content || '[]'
    
    // Parse response - OpenAI może zwrócić w różnych formatach
    let suggestions: string[] = []
    try {
      const parsed = JSON.parse(responseText)
      if (Array.isArray(parsed)) {
        suggestions = parsed
      } else if (parsed.suggestions && Array.isArray(parsed.suggestions)) {
        suggestions = parsed.suggestions
      } else if (parsed.opinions && Array.isArray(parsed.opinions)) {
        suggestions = parsed.opinions
      } else {
        // Szukamy pierwszej tablicy w obiekcie
        const firstArray = Object.values(parsed).find(val => Array.isArray(val))
        if (firstArray) {
          suggestions = firstArray as string[]
        }
      }
    } catch (error) {
      console.error('Error parsing OpenAI response:', error)
      return NextResponse.json(
        { error: 'Błąd parsowania odpowiedzi AI' },
        { status: 500 }
      )
    }

    // Upewnij się, że mamy dokładnie 3 sugestie
    if (suggestions.length === 0) {
      return NextResponse.json(
        { error: 'Nie udało się wygenerować sugestii' },
        { status: 500 }
      )
    }

    // Ogranicz do 3 sugestii
    suggestions = suggestions.slice(0, 3)

    return NextResponse.json({ suggestions })
  } catch (error: any) {
    console.error('Błąd generowania sugestii:', error)
    return NextResponse.json(
      { error: error.message || 'Błąd serwera' },
      { status: 500 }
    )
  }
}
