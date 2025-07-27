import Header from '@/components/Header'
import Footer from '@/components/Footer'

export default function Regulamin() {
  return (
    <div className="min-h-screen flex flex-col bg-darkbg text-darktext">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-12 pt-20">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-8 text-center">Regulamin i Polityka Prywatności</h1>
          
          <div className="space-y-8">
            {/* Informacje o firmie */}
            <section className="bg-darkpanel rounded-xl p-6 border border-gray-800">
              <h2 className="text-2xl font-bold mb-4 text-primary-400">1. Informacje o firmie</h2>
              <div className="space-y-4 text-gray-300">
                <p><strong>Nazwa firmy:</strong> FelizTrade LTD</p>
                <p><strong>Adres:</strong> Preston, Lancashire, United Kingdom</p>
                <p><strong>Email:</strong> FelizTradeLTD@proton.me</p>
                <p><strong>Telefon:</strong> +48 502 600 739</p>
                <p><strong>Numer rejestrowy:</strong> 16008964</p>
              </div>
            </section>

            {/* Definicje */}
            <section className="bg-darkpanel rounded-xl p-6 border border-gray-800">
              <h2 className="text-2xl font-bold mb-4 text-primary-400">2. Definicje</h2>
              <div className="space-y-4 text-gray-300">
                <p><strong>Platforma</strong> - strona internetowa FelizTrade dostępna pod adresem feliztradeltd.com</p>
                <p><strong>Użytkownik</strong> - osoba korzystająca z Platformy</p>
                <p><strong>Klient</strong> - Użytkownik składający zamówienie</p>
                <p><strong>Oprogramowanie</strong> - produkty cyfrowe oferowane przez FelizTrade</p>
                <p><strong>Demo</strong> - wersja demonstracyjna oprogramowania</p>
                <p><strong>Konsultacja</strong> - usługa doradcza i wyceny</p>
                <p><strong>Zamówienie</strong> - oświadczenie woli Klienta zmierzające do zawarcia umowy</p>
              </div>
            </section>

            {/* Ogólne postanowienia */}
            <section className="bg-darkpanel rounded-xl p-6 border border-gray-800">
              <h2 className="text-2xl font-bold mb-4 text-primary-400">3. Ogólne postanowienia</h2>
              <div className="space-y-4 text-gray-300">
                <p>Niniejszy regulamin określa zasady korzystania z Platformy FelizTrade oraz świadczenia usług przez FelizTrade LTD.</p>
                <p>Korzystanie z Platformy oznacza akceptację niniejszego regulaminu.</p>
                <p>FelizTrade LTD zastrzega sobie prawo do zmiany regulaminu. O zmianach Użytkownicy będą informowani na Platformie.</p>
                <p>Wszelkie spory będą rozstrzygane przez sądy właściwe dla siedziby FelizTrade LTD.</p>
              </div>
            </section>

            {/* Usługi */}
            <section className="bg-darkpanel rounded-xl p-6 border border-gray-800">
              <h2 className="text-2xl font-bold mb-4 text-primary-400">4. Usługi</h2>
              <div className="space-y-4 text-gray-300">
                <h3 className="text-xl font-semibold text-white">4.1. Oprogramowania</h3>
                <p>FelizTrade oferuje gotowe oprogramowania WWW w różnych kategoriach biznesowych.</p>
                <p>Ceny oprogramowań są podane w PLN i zawierają podatek VAT.</p>
                <p>Oprogramowania są dostarczane w formie kodu źródłowego z dokumentacją.</p>
                
                <h3 className="text-xl font-semibold text-white">4.2. Demo oprogramowań</h3>
                <p>Demo to wersja demonstracyjna oprogramowania dostępna za opłatą w wysokości 20% ceny pełnej.</p>
                <p>Demo jest udostępniane online w ciągu 7 dni roboczych od zaksięgowania płatności.</p>
                <p>Demo ma charakter poglądowy i może zawierać błędy. Nie gwarantuje pełnej funkcjonalności.</p>
                <p>Pełny dostęp do kodu źródłowego możliwy jest po uiszczeniu pełnej kwoty za oprogramowanie.</p>
                
                <h3 className="text-xl font-semibold text-white">4.3. Konsultacje i wyceny</h3>
                <p>Usługa konsultacji obejmuje analizę wymagań i przygotowanie wyceny.</p>
                <p>Koszt konsultacji wynosi 500 PLN.</p>
                <p>Wycena jest ważna przez 30 dni od jej wystawienia.</p>
              </div>
            </section>

            {/* Zamówienia i płatności */}
            <section className="bg-darkpanel rounded-xl p-6 border border-gray-800">
              <h2 className="text-2xl font-bold mb-4 text-primary-400">5. Zamówienia i płatności</h2>
              <div className="space-y-4 text-gray-300">
                <p>Zamówienia można składać przez Platformę lub telefonicznie.</p>
                <p>Płatności są realizowane przez system Stripe w walucie PLN.</p>
                <p>Po dokonaniu płatności Klient otrzymuje potwierdzenie na podany adres email.</p>
                <p>FelizTrade zastrzega sobie prawo do odmowy realizacji zamówienia w uzasadnionych przypadkach.</p>
                <p>W przypadku problemów z płatnością, Klient może skontaktować się z obsługą klienta.</p>
              </div>
            </section>

            {/* Reklamacje */}
            <section className="bg-darkpanel rounded-xl p-6 border border-gray-800">
              <h2 className="text-2xl font-bold mb-4 text-primary-400">6. Reklamacje</h2>
              <div className="space-y-4 text-gray-300">
                <p>Reklamacje można zgłaszać na adres email: FelizTradeLTD@proton.me</p>
                <p>Reklamacja powinna zawierać: opis problemu, numer zamówienia, dane kontaktowe.</p>
                <p>FelizTrade rozpatruje reklamacje w ciągu 14 dni roboczych.</p>
                <p>W przypadku uznania reklamacji, Klient może otrzymać zwrot środków lub poprawkę oprogramowania.</p>
              </div>
            </section>

            {/* Polityka prywatności */}
            <section className="bg-darkpanel rounded-xl p-6 border border-gray-800">
              <h2 className="text-2xl font-bold mb-4 text-primary-400">7. Polityka Prywatności</h2>
              <div className="space-y-4 text-gray-300">
                <h3 className="text-xl font-semibold text-white">7.1. Administrator danych</h3>
                <p>Administratorem danych osobowych jest FelizTrade LTD z siedzibą w Preston, Lancashire, UK.</p>
                
                <h3 className="text-xl font-semibold text-white">7.2. Gromadzone dane</h3>
                <p>FelizTrade gromadzi następujące dane osobowe:</p>
                <ul className="list-disc list-inside ml-4 space-y-2">
                  <li>Adres email</li>
                  <li>Numer telefonu</li>
                  <li>Dane zamówienia (typ, status, informacje dodatkowe)</li>
                  <li>Dane o zgodach (regulamin, marketing, demo)</li>
                  <li>Dane techniczne (IP, cookies, logi serwera)</li>
                </ul>
                
                <h3 className="text-xl font-semibold text-white">7.3. Cel przetwarzania</h3>
                <p>Dane są przetwarzane w celu:</p>
                <ul className="list-disc list-inside ml-4 space-y-2">
                  <li>Realizacji zamówień i świadczenia usług</li>
                  <li>Komunikacji z Klientami</li>
                  <li>Marketing (za zgodą)</li>
                  <li>Analizy i poprawy Platformy</li>
                  <li>Wypełnienia obowiązków prawnych</li>
                </ul>
                
                <h3 className="text-xl font-semibold text-white">7.4. Podstawa prawna</h3>
                <p>Przetwarzanie odbywa się na podstawie:</p>
                <ul className="list-disc list-inside ml-4 space-y-2">
                  <li>Art. 6 ust. 1 lit. b) RODO - wykonanie umowy</li>
                  <li>Art. 6 ust. 1 lit. a) RODO - zgoda (marketing)</li>
                  <li>Art. 6 ust. 1 lit. f) RODO - uzasadniony interes</li>
                  <li>Art. 6 ust. 1 lit. c) RODO - obowiązek prawny</li>
                </ul>
                
                <h3 className="text-xl font-semibold text-white">7.5. Okres przechowywania</h3>
                <p>Dane są przechowywane przez:</p>
                <ul className="list-disc list-inside ml-4 space-y-2">
                  <li>Dane zamówień: 5 lat (obowiązek podatkowy)</li>
                  <li>Dane konta użytkownika: do momentu usunięcia</li>
                  <li>Dane marketingowe: do wycofania zgody</li>
                  <li>Logi techniczne: 12 miesięcy</li>
                </ul>
                
                <h3 className="text-xl font-semibold text-white">7.6. Prawa użytkownika</h3>
                <p>Użytkownik ma prawo do:</p>
                <ul className="list-disc list-inside ml-4 space-y-2">
                  <li>Dostępu do swoich danych</li>
                  <li>Poprawiania nieprawidłowych danych</li>
                  <li>Usunięcia danych (prawo do bycia zapomnianym)</li>
                  <li>Ograniczenia przetwarzania</li>
                  <li>Przenoszenia danych</li>
                  <li>Wniesienia sprzeciwu</li>
                  <li>Wycofania zgody</li>
                </ul>
                
                <h3 className="text-xl font-semibold text-white">7.7. Udostępnianie danych</h3>
                <p>Dane mogą być udostępniane:</p>
                <ul className="list-disc list-inside ml-4 space-y-2">
                  <li>Dostawcom usług (Stripe, hosting, email)</li>
                  <li>Organom administracji publicznej (na żądanie)</li>
                  <li>Innym podmiotom (za zgodą lub na podstawie prawa)</li>
                </ul>
                
                <h3 className="text-xl font-semibold text-white">7.8. Bezpieczeństwo</h3>
                <p>FelizTrade stosuje odpowiednie środki techniczne i organizacyjne w celu ochrony danych osobowych.</p>
                <p>Dane są szyfrowane podczas przesyłania i przechowywania.</p>
                <p>Dostęp do danych mają tylko upoważnione osoby.</p>
              </div>
            </section>

            {/* Cookies */}
            <section className="bg-darkpanel rounded-xl p-6 border border-gray-800">
              <h2 className="text-2xl font-bold mb-4 text-primary-400">8. Polityka Cookies</h2>
              <div className="space-y-4 text-gray-300">
                <p>Platforma używa plików cookies w celu:</p>
                <ul className="list-disc list-inside ml-4 space-y-2">
                  <li>Zapamiętywania preferencji użytkownika</li>
                  <li>Analizy ruchu na stronie</li>
                  <li>Zapewnienia funkcjonalności Platformy</li>
                  <li>Bezpieczeństwa sesji</li>
                </ul>
                <p>Użytkownik może wyłączyć cookies w ustawieniach przeglądarki.</p>
                <p>Wyłączenie cookies może wpłynąć na funkcjonalność Platformy.</p>
              </div>
            </section>

            {/* Postanowienia końcowe */}
            <section className="bg-darkpanel rounded-xl p-6 border border-gray-800">
              <h2 className="text-2xl font-bold mb-4 text-primary-400">9. Postanowienia końcowe</h2>
              <div className="space-y-4 text-gray-300">
                <p>Regulamin wchodzi w życie z dniem publikacji na Platformie.</p>
                <p>W sprawach nieuregulowanych niniejszym regulaminem zastosowanie mają przepisy prawa brytyjskiego.</p>
                <p>W przypadku nieważności któregoś z postanowień, pozostałe zachowują ważność.</p>
                <p>Kontakt w sprawach regulaminowych: FelizTradeLTD@proton.me</p>
                <p><strong>Ostatnia aktualizacja:</strong> 27 lipca 2025</p>
              </div>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
} 