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
                <p><strong>NIP/VAT:</strong> [do uzupełnienia]</p>
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
                <p><strong>Licencja</strong> - prawo do użytkowania oprogramowania na określonych warunkach</p>
                <p><strong>Wsparcie techniczne</strong> - pomoc w zakresie użytkowania oprogramowania</p>
                <p><strong>Dokumentacja</strong> - materiały opisujące funkcjonalność i użytkowanie oprogramowania</p>
              </div>
            </section>

            {/* Ogólne postanowienia */}
            <section className="bg-darkpanel rounded-xl p-6 border border-gray-800">
              <h2 className="text-2xl font-bold mb-4 text-primary-400">3. Ogólne postanowienia</h2>
              <div className="space-y-4 text-gray-300">
                <p>Niniejszy regulamin określa zasady korzystania z Platformy FelizTrade oraz świadczenia usług przez FelizTrade LTD.</p>
                <p>Korzystanie z Platformy oznacza akceptację niniejszego regulaminu.</p>
                <p>FelizTrade LTD zastrzega sobie prawo do zmiany regulaminu. O zmianach Użytkownicy będą informowani na Platformie z wyprzedzeniem 30 dni.</p>
                <p>W przypadku braku akceptacji zmian regulaminu, Klient ma prawo do anulowania zamówień w toku.</p>
                <p>Wszelkie spory będą rozstrzygane przez sądy właściwe dla siedziby FelizTrade LTD, z możliwością mediacji.</p>
                <p>Regulamin podlega prawu brytyjskiemu, z zastrzeżeniem praw konsumenckich kraju zamieszkania Klienta.</p>
              </div>
            </section>

            {/* Usługi */}
            <section className="bg-darkpanel rounded-xl p-6 border border-gray-800">
              <h2 className="text-2xl font-bold mb-4 text-primary-400">4. Usługi</h2>
              <div className="space-y-4 text-gray-300">
                <h3 className="text-xl font-semibold text-white">4.1. Oprogramowania</h3>
                <p>FelizTrade oferuje gotowe oprogramowania WWW w różnych kategoriach biznesowych.</p>
                <p>Ceny oprogramowań są podane w PLN i zawierają podatek VAT.</p>
                <p>Oprogramowania są dostarczane w formie kodu źródłowego z dokumentacją techniczną.</p>
                <p>Każde oprogramowanie objęte jest 90-dniową gwarancją na błędy funkcjonalne.</p>
                <p>FelizTrade zapewnia 6 miesięcy wsparcia technicznego po zakupie oprogramowania.</p>
                
                <h3 className="text-xl font-semibold text-white">4.2. Demo oprogramowań</h3>
                <p>Demo to wersja demonstracyjna oprogramowania dostępna za opłatą w wysokości 20% ceny pełnej.</p>
                <p>Demo jest udostępniane online w ciągu 7 dni roboczych od zaksięgowania płatności.</p>
                <p>Demo ma charakter poglądowy i może zawierać ograniczenia funkcjonalne. Nie gwarantuje pełnej funkcjonalności.</p>
                <p>Dostęp do demo trwa 30 dni od momentu udostępnienia.</p>
                <p>Demo nie może być używane w środowisku produkcyjnym ani udostępniane osobom trzecim.</p>
                <p>Pełny dostęp do kodu źródłowego możliwy jest po uiszczeniu pełnej kwoty za oprogramowanie.</p>
                <p>Kwota zapłacona za demo jest zaliczana na poczet pełnej ceny oprogramowania.</p>
                
                <h3 className="text-xl font-semibold text-white">4.3. Konsultacje i wyceny</h3>
                <p>Usługa konsultacji obejmuje analizę wymagań i przygotowanie szczegółowej wyceny.</p>
                <p>Koszt konsultacji wynosi 500 PLN i obejmuje maksymalnie 2 godziny pracy.</p>
                <p>Wycena jest ważna przez 30 dni od jej wystawienia.</p>
                <p>FelizTrade oferuje bezpłatną konsultację wstępną (30 minut) dla nowych klientów.</p>
              </div>
            </section>

            {/* Licencje i prawa autorskie */}
            <section className="bg-darkpanel rounded-xl p-6 border border-gray-800">
              <h2 className="text-2xl font-bold mb-4 text-primary-400">5. Licencje i prawa autorskie</h2>
              <div className="space-y-4 text-gray-300">
                <h3 className="text-xl font-semibold text-white">5.1. Prawa autorskie</h3>
                <p>Wszystkie prawa autorskie do oprogramowania należą do FelizTrade LTD.</p>
                <p>Klient otrzymuje licencję komercyjną na użytkowanie oprogramowania w ramach jednej organizacji.</p>
                <p>Licencja obejmuje prawo do modyfikacji kodu źródłowego dla własnych potrzeb.</p>
                <p>Zabronione jest udostępnianie kodu źródłowego osobom trzecim bez zgody FelizTrade.</p>
                
                <h3 className="text-xl font-semibold text-white">5.2. Ograniczenia licencyjne</h3>
                <p>Klient nie może sprzedawać, wynajmować ani udostępniać oprogramowania jako własnego produktu.</p>
                <p>Dozwolone jest używanie oprogramowania w wielu projektach jednej organizacji.</p>
                <p>Klient może tworzyć kopie zapasowe oprogramowania wyłącznie na własny użytek.</p>
                <p>W przypadku naruszenia warunków licencji, FelizTrade może cofnąć licencję bez zwrotu środków.</p>
                
                <h3 className="text-xl font-semibold text-white">5.3. Własność intelektualna</h3>
                <p>FelizTrade zachowuje prawa do algorytmów, architektury i koncepcji oprogramowania.</p>
                <p>Klient zachowuje prawa do własnych modyfikacji i rozszerzeń.</p>
                <p>W przypadku współpracy nad customizacją, prawa są ustalane indywidualnie.</p>
              </div>
            </section>

            {/* Zamówienia i płatności */}
            <section className="bg-darkpanel rounded-xl p-6 border border-gray-800">
              <h2 className="text-2xl font-bold mb-4 text-primary-400">6. Zamówienia i płatności</h2>
              <div className="space-y-4 text-gray-300">
                <h3 className="text-xl font-semibold text-white">6.1. Procedura zamawiania</h3>
                <p>Zamówienia można składać przez Platformę lub telefonicznie.</p>
                <p>Każde zamówienie wymaga podania aktualnych danych kontaktowych.</p>
                <p>FelizTrade potwierdza przyjęcie zamówienia w ciągu 24 godzin.</p>
                <p>FelizTrade zastrzega sobie prawo do odmowy realizacji zamówienia w uzasadnionych przypadkach.</p>
                
                <h3 className="text-xl font-semibold text-white">6.2. Płatności</h3>
                <p>Płatności są realizowane przez system Stripe w walucie PLN.</p>
                <p>Akceptowane są karty kredytowe, debetowe oraz płatności online.</p>
                <p>Po dokonaniu płatności Klient otrzymuje potwierdzenie na podany adres email.</p>
                <p>W przypadku problemów z płatnością, Klient może skontaktować się z obsługą klienta.</p>
                
                <h3 className="text-xl font-semibold text-white">6.3. Rabaty i promocje</h3>
                <p>FelizTrade oferuje rabaty dla klientów biznesowych przy zamówieniach powyżej 5000 PLN.</p>
                <p>Promocje sezonowe są ogłaszane na Platformie z wyprzedzeniem.</p>
                <p>Rabaty nie łączą się z innymi promocjami.</p>
                <p>FelizTrade zastrzega sobie prawo do zmiany cen z 30-dniowym wyprzedzeniem.</p>
              </div>
            </section>

            {/* Dostarczanie i realizacja */}
            <section className="bg-darkpanel rounded-xl p-6 border border-gray-800">
              <h2 className="text-2xl font-bold mb-4 text-primary-400">7. Dostarczanie i realizacja</h2>
              <div className="space-y-4 text-gray-300">
                <h3 className="text-xl font-semibold text-white">7.1. Czas dostarczenia</h3>
                <p>Demo oprogramowania: maksymalnie 7 dni roboczych od płatności.</p>
                <p>Pełne oprogramowanie: maksymalnie 14 dni roboczych od płatności.</p>
                <p>Konsultacje: maksymalnie 5 dni roboczych od płatności.</p>
                <p>W przypadku opóźnień, Klient jest informowany o nowym terminie.</p>
                
                <h3 className="text-xl font-semibold text-white">7.2. Format dostarczenia</h3>
                <p>Oprogramowanie jest dostarczane w formie archiwum ZIP z kodem źródłowym.</p>
                <p>Dokumentacja techniczna jest dostarczana w formacie PDF.</p>
                <p>Dostęp do demo jest realizowany przez link z hasłem.</p>
                <p>FelizTrade może dostarczyć oprogramowanie przez Git na życzenie Klienta.</p>
                
                <h3 className="text-xl font-semibold text-white">7.3. Weryfikacja dostarczenia</h3>
                <p>Klient potwierdza otrzymanie oprogramowania w ciągu 7 dni.</p>
                <p>Brak potwierdzenia w tym terminie oznacza uznanie dostarczenia za prawidłowe.</p>
                <p>FelizTrade może poprosić o potwierdzenie funkcjonalności oprogramowania.</p>
              </div>
            </section>

            {/* Wsparcie techniczne */}
            <section className="bg-darkpanel rounded-xl p-6 border border-gray-800">
              <h2 className="text-2xl font-bold mb-4 text-primary-400">8. Wsparcie techniczne</h2>
              <div className="space-y-4 text-gray-300">
                <h3 className="text-xl font-semibold text-white">8.1. Zakres wsparcia</h3>
                <p>Wsparcie obejmuje pomoc w instalacji i konfiguracji oprogramowania.</p>
                <p>FelizTrade pomaga w rozwiązywaniu błędów funkcjonalnych.</p>
                <p>Wsparcie nie obejmuje modyfikacji kodu na życzenie Klienta.</p>
                <p>Wsparcie jest świadczone przez email i telefon w godzinach 9:00-17:00 (CET).</p>
                
                <h3 className="text-xl font-semibold text-white">8.2. Czas odpowiedzi</h3>
                <p>Krytyczne błędy: maksymalnie 24 godziny.</p>
                <p>Błędy funkcjonalne: maksymalnie 72 godziny.</p>
                <p>Pytania ogólne: maksymalnie 5 dni roboczych.</p>
                <p>W weekendy i święta czas odpowiedzi może być wydłużony.</p>
                
                <h3 className="text-xl font-semibold text-white">8.3. Dokumentacja</h3>
                <p>Każde oprogramowanie zawiera szczegółową dokumentację techniczną.</p>
                <p>Dokumentacja obejmuje instrukcję instalacji i konfiguracji.</p>
                <p>FelizTrade udostępnia przykłady użycia i najlepsze praktyki.</p>
                <p>Dokumentacja jest aktualizowana w przypadku zmian w oprogramowaniu.</p>
              </div>
            </section>

            {/* Gwarancje i odpowiedzialność */}
            <section className="bg-darkpanel rounded-xl p-6 border border-gray-800">
              <h2 className="text-2xl font-bold mb-4 text-primary-400">9. Gwarancje i odpowiedzialność</h2>
              <div className="space-y-4 text-gray-300">
                <h3 className="text-xl font-semibold text-white">9.1. Gwarancje</h3>
                <p>FelizTrade gwarantuje funkcjonalność oprogramowania zgodnie z opisem przez 90 dni.</p>
                <p>Gwarancja obejmuje usunięcie błędów funkcjonalnych.</p>
                <p>Gwarancja nie obejmuje błędów wynikających z modyfikacji kodu przez Klienta.</p>
                <p>FelizTrade nie gwarantuje kompatybilności z konkretnymi środowiskami serwerowymi.</p>
                
                <h3 className="text-xl font-semibold text-white">9.2. Ograniczenie odpowiedzialności</h3>
                <p>Odpowiedzialność FelizTrade jest ograniczona do kwoty zapłaconej za oprogramowanie.</p>
                <p>FelizTrade nie odpowiada za pośrednie szkody wynikające z użytkowania oprogramowania.</p>
                <p>Klient ponosi odpowiedzialność za backup własnych danych.</p>
                <p>FelizTrade nie odpowiada za szkody wynikające z nieprawidłowej instalacji.</p>
                
                <h3 className="text-xl font-semibold text-white">9.3. Zgłaszanie błędów</h3>
                <p>Błędy należy zgłaszać przez email z opisem problemu i środowiska.</p>
                <p>FelizTrade może poprosić o dodatkowe informacje techniczne.</p>
                <p>Błędy są klasyfikowane według priorytetu i rozwiązywane w kolejności.</p>
                <p>Klient może śledzić status zgłoszenia przez email.</p>
              </div>
            </section>

            {/* Anulowanie i zwroty */}
            <section className="bg-darkpanel rounded-xl p-6 border border-gray-800">
              <h2 className="text-2xl font-bold mb-4 text-primary-400">10. Anulowanie i zwroty</h2>
              <div className="space-y-4 text-gray-300">
                <h3 className="text-xl font-semibold text-white">10.1. Prawo do odstąpienia</h3>
                <p>Klient ma prawo odstąpić od umowy w ciągu 14 dni od zakupu (prawo konsumenckie).</p>
                <p>Prawo do odstąpienia nie przysługuje po rozpoczęciu pobierania oprogramowania.</p>
                <p>W przypadku odstąpienia, FelizTrade zwraca pełną kwotę w ciągu 14 dni.</p>
                <p>Koszty zwrotu ponosi Klient, chyba że wada jest po stronie FelizTrade.</p>
                
                <h3 className="text-xl font-semibold text-white">10.2. Anulowanie zamówienia</h3>
                <p>Zamówienie można anulować przed rozpoczęciem realizacji.</p>
                <p>Po rozpoczęciu realizacji anulowanie może wiązać się z opłatą.</p>
                <p>FelizTrade może anulować zamówienie w przypadku problemów z płatnością.</p>
                <p>Anulowanie jest potwierdzane przez email.</p>
                
                <h3 className="text-xl font-semibold text-white">10.3. Zwroty środków</h3>
                <p>Zwroty są realizowane tą samą metodą co płatność.</p>
                <p>FelizTrade może wstrzymać zwrot w przypadku podejrzenia nadużycia.</p>
                <p>Zwroty są przetwarzane w ciągu 14 dni roboczych.</p>
                <p>Klient jest informowany o statusie zwrotu przez email.</p>
              </div>
            </section>

            {/* Bezpieczeństwo i ochrona danych */}
            <section className="bg-darkpanel rounded-xl p-6 border border-gray-800">
              <h2 className="text-2xl font-bold mb-4 text-primary-400">11. Bezpieczeństwo i ochrona danych</h2>
              <div className="space-y-4 text-gray-300">
                <h3 className="text-xl font-semibold text-white">11.1. Szyfrowanie i bezpieczeństwo</h3>
                <p>Wszystkie dane są szyfrowane podczas przesyłania (SSL/TLS).</p>
                <p>Dane są przechowywane na serwerach z certyfikatem bezpieczeństwa.</p>
                <p>FelizTrade stosuje regularne aktualizacje zabezpieczeń.</p>
                <p>Dostęp do danych mają tylko upoważnione osoby.</p>
                
                <h3 className="text-xl font-semibold text-white">11.2. Backup i odzyskiwanie</h3>
                <p>FelizTrade wykonuje codzienne kopie zapasowe danych.</p>
                <p>Backupy są przechowywane w bezpiecznej lokalizacji.</p>
                <p>W przypadku awarii, dane są odtwarzane w ciągu 24 godzin.</p>
                <p>Klient jest informowany o planowanych pracach technicznych.</p>
                
                <h3 className="text-xl font-semibold text-white">11.3. Incydenty bezpieczeństwa</h3>
                <p>W przypadku wycieku danych, Klient jest informowany w ciągu 72 godzin.</p>
                <p>FelizTrade współpracuje z organami nadzoru w przypadku incydentów.</p>
                <p>Klient może zgłaszać podejrzane działania przez email.</p>
                <p>FelizTrade prowadzi rejestr incydentów bezpieczeństwa.</p>
              </div>
            </section>

            {/* Reklamacje */}
            <section className="bg-darkpanel rounded-xl p-6 border border-gray-800">
              <h2 className="text-2xl font-bold mb-4 text-primary-400">12. Reklamacje</h2>
              <div className="space-y-4 text-gray-300">
                <h3 className="text-xl font-semibold text-white">12.1. Procedura reklamacyjna</h3>
                <p>Reklamacje można zgłaszać na adres email: FelizTradeLTD@proton.me</p>
                <p>Reklamacja powinna zawierać: opis problemu, numer zamówienia, dane kontaktowe.</p>
                <p>FelizTrade rozpatruje reklamacje w ciągu 14 dni roboczych.</p>
                <p>W przypadku uznania reklamacji, Klient może otrzymać zwrot środków lub poprawkę oprogramowania.</p>
                
                <h3 className="text-xl font-semibold text-white">12.2. Rozstrzyganie sporów</h3>
                <p>W przypadku sporu, strony dążą do polubownego rozwiązania.</p>
                <p>FelizTrade oferuje mediację jako pierwszy krok rozstrzygania sporów.</p>
                <p>W przypadku braku porozumienia, spór rozstrzyga sąd właściwy.</p>
                <p>Klient może skorzystać z pozasądowego rozstrzygania sporów.</p>
              </div>
            </section>

            {/* Polityka prywatności */}
            <section className="bg-darkpanel rounded-xl p-6 border border-gray-800">
              <h2 className="text-2xl font-bold mb-4 text-primary-400">13. Polityka Prywatności</h2>
              <div className="space-y-4 text-gray-300">
                <h3 className="text-xl font-semibold text-white">13.1. Administrator danych</h3>
                <p>Administratorem danych osobowych jest FelizTrade LTD z siedzibą w Preston, Lancashire, UK.</p>
                
                <h3 className="text-xl font-semibold text-white">13.2. Gromadzone dane</h3>
                <p>FelizTrade gromadzi następujące dane osobowe:</p>
                <ul className="list-disc list-inside ml-4 space-y-2">
                  <li>Adres email</li>
                  <li>Numer telefonu</li>
                  <li>Dane zamówienia (typ, status, informacje dodatkowe)</li>
                  <li>Dane o zgodach (regulamin, marketing, demo)</li>
                  <li>Dane techniczne (IP, cookies, logi serwera)</li>
                  <li>Historia płatności i transakcji</li>
                  <li>Dane o wsparciu technicznym</li>
                </ul>
                
                <h3 className="text-xl font-semibold text-white">13.3. Cel przetwarzania</h3>
                <p>Dane są przetwarzane w celu:</p>
                <ul className="list-disc list-inside ml-4 space-y-2">
                  <li>Realizacji zamówień i świadczenia usług</li>
                  <li>Komunikacji z Klientami</li>
                  <li>Marketing (za zgodą)</li>
                  <li>Analizy i poprawy Platformy</li>
                  <li>Wypełnienia obowiązków prawnych</li>
                  <li>Świadczenia wsparcia technicznego</li>
                  <li>Zapewnienia bezpieczeństwa</li>
                </ul>
                
                <h3 className="text-xl font-semibold text-white">13.4. Podstawa prawna</h3>
                <p>Przetwarzanie odbywa się na podstawie:</p>
                <ul className="list-disc list-inside ml-4 space-y-2">
                  <li>Art. 6 ust. 1 lit. b) RODO - wykonanie umowy</li>
                  <li>Art. 6 ust. 1 lit. a) RODO - zgoda (marketing)</li>
                  <li>Art. 6 ust. 1 lit. f) RODO - uzasadniony interes</li>
                  <li>Art. 6 ust. 1 lit. c) RODO - obowiązek prawny</li>
                </ul>
                
                <h3 className="text-xl font-semibold text-white">13.5. Okres przechowywania</h3>
                <p>Dane są przechowywane przez:</p>
                <ul className="list-disc list-inside ml-4 space-y-2">
                  <li>Dane zamówień: 5 lat (obowiązek podatkowy)</li>
                  <li>Dane konta użytkownika: do momentu usunięcia</li>
                  <li>Dane marketingowe: do wycofania zgody</li>
                  <li>Logi techniczne: 12 miesięcy</li>
                  <li>Dane wsparcia technicznego: 3 lata</li>
                </ul>
                
                <h3 className="text-xl font-semibold text-white">13.6. Prawa użytkownika</h3>
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
                
                <h3 className="text-xl font-semibold text-white">13.7. Udostępnianie danych</h3>
                <p>Dane mogą być udostępniane:</p>
                <ul className="list-disc list-inside ml-4 space-y-2">
                  <li>Dostawcom usług (Stripe, hosting, email)</li>
                  <li>Organom administracji publicznej (na żądanie)</li>
                  <li>Innym podmiotom (za zgodą lub na podstawie prawa)</li>
                  <li>Partnerom technicznym (w celu wsparcia)</li>
                </ul>
                
                <h3 className="text-xl font-semibold text-white">13.8. Bezpieczeństwo</h3>
                <p>FelizTrade stosuje odpowiednie środki techniczne i organizacyjne w celu ochrony danych osobowych.</p>
                <p>Dane są szyfrowane podczas przesyłania i przechowywania.</p>
                <p>Dostęp do danych mają tylko upoważnione osoby.</p>
                <p>FelizTrade prowadzi regularne audyty bezpieczeństwa.</p>
              </div>
            </section>

            {/* Cookies */}
            <section className="bg-darkpanel rounded-xl p-6 border border-gray-800">
              <h2 className="text-2xl font-bold mb-4 text-primary-400">14. Polityka Cookies</h2>
              <div className="space-y-4 text-gray-300">
                <p>Platforma używa plików cookies w celu:</p>
                <ul className="list-disc list-inside ml-4 space-y-2">
                  <li>Zapamiętywania preferencji użytkownika</li>
                  <li>Analizy ruchu na stronie</li>
                  <li>Zapewnienia funkcjonalności Platformy</li>
                  <li>Bezpieczeństwa sesji</li>
                  <li>Personalizacji treści</li>
                  <li>Optymalizacji wydajności</li>
                </ul>
                <p>Użytkownik może wyłączyć cookies w ustawieniach przeglądarki.</p>
                <p>Wyłączenie cookies może wpłynąć na funkcjonalność Platformy.</p>
                <p>FelizTrade używa cookies analitycznych do poprawy usług.</p>
              </div>
            </section>

            {/* Postanowienia końcowe */}
            <section className="bg-darkpanel rounded-xl p-6 border border-gray-800">
              <h2 className="text-2xl font-bold mb-4 text-primary-400">15. Postanowienia końcowe</h2>
              <div className="space-y-4 text-gray-300">
                <p>Regulamin wchodzi w życie z dniem publikacji na Platformie.</p>
                <p>W sprawach nieuregulowanych niniejszym regulaminem zastosowanie mają przepisy prawa brytyjskiego.</p>
                <p>W przypadku nieważności któregoś z postanowień, pozostałe zachowują ważność.</p>
                <p>Kontakt w sprawach regulaminowych: FelizTradeLTD@proton.me</p>
                <p>FelizTrade zastrzega sobie prawo do zmiany regulaminu z 30-dniowym wyprzedzeniem.</p>
                <p>W przypadku zmiany regulaminu, Klient jest informowany przez email i na Platformie.</p>
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