'use client'

import Header from '@/components/Header'
import Footer from '@/components/Footer'
import DynamicTitle from '@/components/DynamicTitle'
import { useLanguage } from '@/contexts/LanguageContext'

export default function Regulamin() {
  const { t, language } = useLanguage()

  return (
    <div className="min-h-screen flex flex-col bg-darkbg text-darktext">
      <DynamicTitle titleKey="regulamin" fallbackTitle="Regulamin - FelizTrade" />
      <Header />
      <main className="flex-1 container mx-auto px-4 py-12 pt-20">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4 text-primary-400">{t('regulamin.title')}</h1>
            <p className="text-lg text-darksubtle">{t('regulamin.subtitle')}</p>
          </div>
          
          <div className="space-y-8">
            {/* Informacje o firmie */}
            <section className="bg-darkpanel rounded-xl p-6 border border-gray-800">
              <h2 className="text-2xl font-bold mb-4 text-primary-400">{t('regulamin.companyInfo.title')}</h2>
              <div className="grid md:grid-cols-2 gap-4 text-gray-300">
                <div>
                  <p><strong>Nazwa firmy:</strong> FelizTrade LTD</p>
                  <p><strong>Adres:</strong> Preston, Lancashire, United Kingdom</p>
                  <p><strong>Email:</strong> FelizTradeLTD@proton.me</p>
                </div>
                <div>
                  <p><strong>Telefon:</strong> +48 502 600 739</p>
                  <p><strong>Numer rejestrowy:</strong> 16008964</p>
                  <p><strong>Strona internetowa:</strong> https://feliztradeltd.com</p>
                </div>
              </div>
            </section>

            {/* Definicje */}
            <section className="bg-darkpanel rounded-xl p-6 border border-gray-800">
              <h2 className="text-2xl font-bold mb-4 text-primary-400">§ 1. {t('regulamin.definitions.title')}</h2>
              <div className="space-y-4 text-gray-300">
                <div>
                  <h3 className="font-semibold text-white mb-2">Platforma</h3>
                  <p>Strona internetowa dostępna pod adresem https://feliztradeltd.com</p>
                </div>
                <div>
                  <h3 className="font-semibold text-white mb-2">Firma</h3>
                  <p>FelizTrade LTD, spółka z ograniczoną odpowiedzialnością zarejestrowana w Wielkiej Brytanii</p>
                </div>
                <div>
                  <h3 className="font-semibold text-white mb-2">Użytkownik</h3>
                  <p>Osoba fizyczna, prawna lub jednostka organizacyjna korzystająca z Platformy</p>
                </div>
                <div>
                  <h3 className="font-semibold text-white mb-2">Klient</h3>
                  <p>Użytkownik składający zamówienie przez Platformę</p>
                </div>
                <div>
                  <h3 className="font-semibold text-white mb-2">Usługi</h3>
                  <p>Oprogramowania komputerowe, konsultacje techniczne, współpraca programistyczna</p>
                </div>
              </div>
            </section>

            {/* Zakres regulaminu */}
            <section className="bg-darkpanel rounded-xl p-6 border border-gray-800">
              <h2 className="text-2xl font-bold mb-4 text-primary-400">§ 2. Zakres regulaminu</h2>
              <div className="space-y-4 text-gray-300">
                <p>Regulamin określa zasady świadczenia usług drogą elektroniczną przez Platformę</p>
                <p>Regulamin jest integralną częścią umowy o świadczenie usług</p>
                <p>Firma zastrzega sobie prawo do zmiany regulaminu z zachowaniem praw Klientów</p>
              </div>
            </section>

            {/* Rodzaje usług */}
            <section className="bg-darkpanel rounded-xl p-6 border border-gray-800">
              <h2 className="text-2xl font-bold mb-4 text-primary-400">§ 3. Rodzaje usług</h2>
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-semibold text-white mb-3">1. Sprzedaż oprogramowań</h3>
                  <ul className="list-disc list-inside space-y-2 text-gray-300 ml-4">
                    <li>Gotowe oprogramowania internetowe z kategorii określonych na Platformie</li>
                    <li>Ceny podane w PLN lub GBP w zależności od wybranego języka</li>
                    <li>Każde oprogramowanie posiada opis, funkcje i demo</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-white mb-3">2. Konsultacje techniczne</h3>
                  <ul className="list-disc list-inside space-y-2 text-gray-300 ml-4">
                    <li>Doradztwo w zakresie projektów IT</li>
                    <li>Wyceny projektów programistycznych</li>
                    <li>Analiza wymagań technicznych</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-white mb-3">3. Współpraca programistyczna</h3>
                  <ul className="list-disc list-inside space-y-2 text-gray-300 ml-4">
                    <li>Implementacja oprogramowań na zamówienie</li>
                    <li>Dostosowanie istniejących rozwiązań</li>
                    <li>Wsparcie techniczne i szkolenia</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-white mb-3">4. Dostarczanie kodu źródłowego</h3>
                  <ul className="list-disc list-inside space-y-2 text-gray-300 ml-4">
                    <li>Przekazanie kodu oprogramowania</li>
                    <li>Instrukcje instalacji i konfiguracji</li>
                    <li>Dokumentacja techniczna</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Zasady składania zamówień */}
            <section className="bg-darkpanel rounded-xl p-6 border border-gray-800">
              <h2 className="text-2xl font-bold mb-4 text-primary-400">§ 4. Zasady składania zamówień</h2>
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-semibold text-white mb-3">1. Proces zamawiania</h3>
                  <ol className="list-decimal list-inside space-y-2 text-gray-300 ml-4">
                    <li>Wybór produktu/usługi na Platformie</li>
                    <li>Wypełnienie formularza zamówienia</li>
                    <li>Akceptacja regulaminu i polityki prywatności</li>
                    <li>Wybór metody płatności (Stripe)</li>
                    <li>Potwierdzenie zamówienia</li>
                  </ol>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-white mb-3">2. Wymagane dane</h3>
                  <ul className="list-disc list-inside space-y-2 text-gray-300 ml-4">
                    <li>Adres email (opcjonalnie dla zalogowanych użytkowników)</li>
                    <li>Numer telefonu (wymagane)</li>
                    <li>Dodatkowe informacje o projekcie</li>
                    <li>Zgody na przetwarzanie danych osobowych</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-white mb-3">3. Zgody wymagane</h3>
                  <ul className="list-disc list-inside space-y-2 text-gray-300 ml-4">
                    <li>Akceptacja regulaminu (obowiązkowe)</li>
                    <li>Zgoda na marketing (opcjonalne)</li>
                    <li>Zgoda na współpracę (dla zamówień collaboration)</li>
                    <li>Zgoda na kod (dla zamówień code)</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Płatności i rozliczenia */}
            <section className="bg-darkpanel rounded-xl p-6 border border-gray-800">
              <h2 className="text-2xl font-bold mb-4 text-primary-400">§ 5. Płatności i rozliczenia</h2>
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-semibold text-white mb-3">1. Metody płatności</h3>
                  <ul className="list-disc list-inside space-y-2 text-gray-300 ml-4">
                    <li>Karty płatnicze przez system Stripe</li>
                    <li>Waluty: PLN (Polska) lub GBP (Wielka Brytania)</li>
                    <li>Płatności online w czasie rzeczywistym</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-white mb-3">2. Struktura cen</h3>
                  <ul className="list-disc list-inside space-y-2 text-gray-300 ml-4">
                    <li><strong>Konsultacje:</strong> 200 PLN / 50 GBP</li>
                    <li><strong>Współpraca:</strong> 30% ceny oprogramowania (zaliczka)</li>
                    <li><strong>Kod źródłowy:</strong> 100% ceny oprogramowania</li>
                    <li>Ceny komponentów funkcjonalnych: od-do w zależności od złożoności</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-white mb-3">3. Rozliczenia</h3>
                  <ul className="list-disc list-inside space-y-2 text-gray-300 ml-4">
                    <li>Płatność przed rozpoczęciem realizacji</li>
                    <li>Faktury VAT wystawiane po potwierdzeniu płatności</li>
                    <li>Możliwość refundacji zgodnie z prawem</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Realizacja zamówień */}
            <section className="bg-darkpanel rounded-xl p-6 border border-gray-800">
              <h2 className="text-2xl font-bold mb-4 text-primary-400">§ 6. Realizacja zamówień</h2>
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-semibold text-white mb-3">1. Czasy realizacji</h3>
                  <ul className="list-disc list-inside space-y-2 text-gray-300 ml-4">
                    <li><strong>Konsultacje:</strong> kontakt w ciągu 24h</li>
                    <li><strong>Współpraca:</strong> kontakt w ciągu 24h, harmonogram ustalany indywidualnie</li>
                    <li><strong>Kod źródłowy:</strong> dostarczenie w ciągu 7 dni roboczych</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-white mb-3">2. Proces realizacji</h3>
                  <ol className="list-decimal list-inside space-y-2 text-gray-300 ml-4">
                    <li>Potwierdzenie zamówienia drogą elektroniczną</li>
                    <li>Kontakt telefoniczny w celu ustalenia szczegółów</li>
                    <li>Realizacja zgodnie z ustalonym harmonogramem</li>
                    <li>Przekazanie produktu/usługi</li>
                  </ol>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-white mb-3">3. Jakość usług</h3>
                  <ul className="list-disc list-inside space-y-2 text-gray-300 ml-4">
                    <li>Usługi świadczone zgodnie z najlepszymi praktykami branżowymi</li>
                    <li>Zgodność z opisem na Platformie</li>
                    <li>Możliwość reklamacji w terminie 14 dni</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Prawa i obowiązki stron */}
            <section className="bg-darkpanel rounded-xl p-6 border border-gray-800">
              <h2 className="text-2xl font-bold mb-4 text-primary-400">§ 7. Prawa i obowiązki stron</h2>
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-semibold text-white mb-3">1. Prawa Firmy</h3>
                  <ul className="list-disc list-inside space-y-2 text-gray-300 ml-4">
                    <li>Odmowa realizacji zamówienia w uzasadnionych przypadkach</li>
                    <li>Zmiana cen i warunków z zachowaniem praw Klientów</li>
                    <li>Zawieszenie świadczenia usług w przypadku naruszenia regulaminu</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-white mb-3">2. Obowiązki Firmy</h3>
                  <ul className="list-disc list-inside space-y-2 text-gray-300 ml-4">
                    <li>Świadczenie usług zgodnie z umową</li>
                    <li>Zachowanie poufności informacji Klienta</li>
                    <li>Przekazanie produktu/usługi w ustalonym terminie</li>
                    <li>Wsparcie techniczne w zakresie świadczonych usług</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-white mb-3">3. Prawa Klienta</h3>
                  <ul className="list-disc list-inside space-y-2 text-gray-300 ml-4">
                    <li>Informacja o statusie zamówienia</li>
                    <li>Reklamacja wadliwych usług</li>
                    <li>Odstąpienie od umowy w terminie 14 dni (konsultacje)</li>
                    <li>Ochrona danych osobowych</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-white mb-3">4. Obowiązki Klienta</h3>
                  <ul className="list-disc list-inside space-y-2 text-gray-300 ml-4">
                    <li>Prawdziwość podanych informacji</li>
                    <li>Terminowe płatności</li>
                    <li>Współpraca w procesie realizacji</li>
                    <li>Przestrzeganie regulaminu</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Ochrona danych osobowych */}
            <section className="bg-darkpanel rounded-xl p-6 border border-gray-800">
              <h2 className="text-2xl font-bold mb-4 text-primary-400">§ 8. Ochrona danych osobowych</h2>
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-semibold text-white mb-3">1. Administrator danych</h3>
                  <ul className="list-disc list-inside space-y-2 text-gray-300 ml-4">
                    <li>FelizTrade LTD jako administrator danych osobowych</li>
                    <li>Przetwarzanie zgodnie z RODO (UK GDPR) i polskim prawem</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-white mb-3">2. Cele przetwarzania</h3>
                  <ul className="list-disc list-inside space-y-2 text-gray-300 ml-4">
                    <li>Realizacja zamówień i świadczenie usług</li>
                    <li>Marketing (za zgodą)</li>
                    <li>Analiza statystyczna i poprawa jakości usług</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-white mb-3">3. Prawa użytkownika</h3>
                  <ul className="list-disc list-inside space-y-2 text-gray-300 ml-4">
                    <li>Dostęp do swoich danych</li>
                    <li>Poprawianie i usuwanie danych</li>
                    <li>Przenoszenie danych</li>
                    <li>Sprzeciw wobec przetwarzania</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Własność intelektualna */}
            <section className="bg-darkpanel rounded-xl p-6 border border-gray-800">
              <h2 className="text-2xl font-bold mb-4 text-primary-400">§ 9. Własność intelektualna</h2>
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-semibold text-white mb-3">1. Oprogramowania</h3>
                  <ul className="list-disc list-inside space-y-2 text-gray-300 ml-4">
                    <li>Wszystkie prawa własności intelektualnej należą do Firmy</li>
                    <li>Licencja na użytkowanie oprogramowania</li>
                    <li>Zakaz kopiowania, modyfikacji i rozpowszechniania</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-white mb-3">2. Kod źródłowy</h3>
                  <ul className="list-disc list-inside space-y-2 text-gray-300 ml-4">
                    <li>Przekazanie praw do kodu po pełnej płatności</li>
                    <li>Licencja na użytkowanie i modyfikację</li>
                    <li>Zachowanie praw Firmy do wykorzystania w innych projektach</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-white mb-3">3. Naruszenia</h3>
                  <ul className="list-disc list-inside space-y-2 text-gray-300 ml-4">
                    <li>Odpowiedzialność cywilna i karna</li>
                    <li>Możliwość zawieszenia licencji</li>
                    <li>Roszczenia o odszkodowanie</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Odpowiedzialność i reklamacje */}
            <section className="bg-darkpanel rounded-xl p-6 border border-gray-800">
              <h2 className="text-2xl font-bold mb-4 text-primary-400">§ 10. Odpowiedzialność i reklamacje</h2>
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-semibold text-white mb-3">1. Odpowiedzialność Firmy</h3>
                  <ul className="list-disc list-inside space-y-2 text-gray-300 ml-4">
                    <li>Ograniczona do wysokości opłaty za usługę</li>
                    <li>Wyłączenie odpowiedzialności za szkody pośrednie</li>
                    <li>Odpowiedzialność za wady ukryte</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-white mb-3">2. Reklamacje</h3>
                  <ul className="list-disc list-inside space-y-2 text-gray-300 ml-4">
                    <li>Termin: 14 dni od otrzymania usługi</li>
                    <li>Forma: pisemna lub elektroniczna</li>
                    <li>Rozpatrzenie w terminie 14 dni</li>
                    <li>Możliwość odwołania się do sądu</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-white mb-3">3. Rozstrzyganie sporów</h3>
                  <ul className="list-disc list-inside space-y-2 text-gray-300 ml-4">
                    <li>Sąd właściwy: UK dla klientów z UK, Polska dla klientów z Polski</li>
                    <li>Prawo właściwe: UK dla klientów z UK, polskie dla klientów z Polski</li>
                    <li>Możliwość mediacji i arbitrażu</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Postanowienia końcowe */}
            <section className="bg-darkpanel rounded-xl p-6 border border-gray-800">
              <h2 className="text-2xl font-bold mb-4 text-primary-400">§ 11. Postanowienia końcowe</h2>
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-semibold text-white mb-3">1. Zmiany regulaminu</h3>
                  <ul className="list-disc list-inside space-y-2 text-gray-300 ml-4">
                    <li>Informacja o zmianach 30 dni wcześniej</li>
                    <li>Akceptacja zmian przez dalsze korzystanie</li>
                    <li>Możliwość odstąpienia od umowy</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-white mb-3">2. Ważność postanowień</h3>
                  <ul className="list-disc list-inside space-y-2 text-gray-300 ml-4">
                    <li>Nieważność pojedynczych postanowień nie wpływa na całość</li>
                    <li>Zastąpienie nieważnych postanowień zgodnymi z prawem</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-white mb-3">3. Wejście w życie</h3>
                  <ul className="list-disc list-inside space-y-2 text-gray-300 ml-4">
                    <li>Regulamin wchodzi w życie z dniem publikacji</li>
                    <li>Obowiązuje wszystkich użytkowników Platformy</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Informacje o zgodności z prawem */}
            <section className="bg-darkpanel rounded-xl p-6 border border-gray-800">
              <h2 className="text-2xl font-bold mb-4 text-primary-400">Zgodność z przepisami</h2>
              <div className="space-y-4 text-gray-300">
                <p>Ten regulamin jest zgodny z przepisami:</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li><strong>UK:</strong> Consumer Rights Act 2015, Electronic Commerce Regulations 2002, UK GDPR</li>
                  <li><strong>Polska:</strong> Ustawa o świadczeniu usług drogą elektroniczną, RODO, Kodeks cywilny</li>
                </ul>
              </div>
            </section>

            {/* Kontakt */}
            <section className="bg-darkpanel rounded-xl p-6 border border-gray-800">
              <h2 className="text-2xl font-bold mb-4 text-primary-400">Kontakt w sprawach regulaminu</h2>
              <div className="grid md:grid-cols-2 gap-4 text-gray-300">
                <div>
                  <p><strong>Email:</strong> FelizTradeLTD@proton.me</p>
                  <p><strong>Telefon:</strong> +48 502 600 739</p>
                </div>
                <div>
                  <p><strong>Adres:</strong> Preston, Lancashire, United Kingdom</p>
                  <p><strong>Strona:</strong> https://feliztradeltd.com</p>
                </div>
              </div>
            </section>

            {/* Data aktualizacji */}
            <section className="bg-darkpanel rounded-xl p-6 border border-gray-800">
              <div className="text-center text-gray-400">
                <p><strong>Data ostatniej aktualizacji:</strong> 15.01.2025</p>
                <p><strong>Wersja:</strong> 1.0</p>
              </div>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
} 