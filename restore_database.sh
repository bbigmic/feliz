#!/bin/bash

# Skrypt do przywrócenia bazy danych FelizTrade
echo "🔄 Przywracanie bazy danych FelizTrade..."

# Sprawdź czy plik SQL istnieje
if [ ! -f "feliztrade_complete_database.sql" ]; then
    echo "❌ Plik feliztrade_complete_database.sql nie istnieje!"
    exit 1
fi

# Pobierz DATABASE_URL z .env
if [ -f ".env" ]; then
    export $(cat .env | grep -v '^#' | xargs)
else
    echo "❌ Plik .env nie istnieje!"
    exit 1
fi

echo "📊 Łączenie z bazą danych..."
echo "🔗 URL: $DATABASE_URL"

# Przywróć dane z pliku SQL
echo "📥 Przywracanie danych z feliztrade_complete_database.sql..."
psql "$DATABASE_URL" -f feliztrade_complete_database.sql

if [ $? -eq 0 ]; then
    echo "✅ Baza danych została pomyślnie przywrócona!"
    echo "📊 Dane zostały załadowane:"
    echo "   - Użytkownicy"
    echo "   - Oprogramowania (13 pozycji)"
    echo "   - Komponenty (14 pozycji)"
    echo "   - Zamówienia"
    echo "   - Zdjęcia oprogramowań"
else
    echo "❌ Błąd podczas przywracania bazy danych!"
    exit 1
fi

echo "🎉 Przywracanie zakończone!" 