import Header from '@/components/Header'
import Footer from '@/components/Footer'
import DynamicTitle from '@/components/DynamicTitle'

export default function About() {
  return (
    <div className="min-h-screen flex flex-col bg-darkbg text-darktext">
      <DynamicTitle titleKey="about" fallbackTitle="O nas - FelizTrade" />
      <Header />
      <main className="flex-1 container mx-auto px-4 py-12 pt-20">
        <section className="mb-12 text-center">
          <h1 className="text-4xl font-bold mb-4">O nas</h1>
          <p className="text-lg max-w-2xl mx-auto text-darksubtle">
            <b>Feliz Trade LTD</b> to nowoczesna firma technologiczna z siedzibą w Wielkiej Brytanii, specjalizująca się w tworzeniu innowacyjnych rozwiązań webowych, automatyzacji oraz dedykowanych systemów IT dla biznesu. Naszą misją jest dostarczanie klientom narzędzi, które realnie wspierają rozwój ich firm i pozwalają osiągać przewagę konkurencyjną.
          </p>
        </section>
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-8 text-center">Nasz zespół</h2>
          <div className="flex flex-col md:flex-row justify-center gap-8">
            <div className="bg-darkpanel rounded-xl shadow-lg p-6 flex flex-col items-center w-full md:w-1/3">
              <img src="/screeny/pablo.png" alt="Michał" className="w-28 h-28 rounded-full object-cover mb-4 border-4 border-primary-500" />
              <h3 className="text-xl font-semibold mb-2">Pablo</h3>
              <p className="text-darksubtle text-center">Założyciel i CEO. Odpowiedzialny za strategię, rozwój produktów oraz kontakt z klientami. Pasjonat nowych technologii i automatyzacji.</p>
            </div>
            <div className="bg-darkpanel rounded-xl shadow-lg p-6 flex flex-col items-center w-full md:w-1/3">
              <img src="/screeny/mike.png" alt="Paweł" className="w-28 h-28 rounded-full object-cover mb-4 border-4 border-primary-500" />
              <h3 className="text-xl font-semibold mb-2">Mike</h3>
              <p className="text-darksubtle text-center">CTO i Full Stack Developer. Odpowiada za architekturę techniczną, wdrożenia oraz rozwój aplikacji. Specjalista od rozwiązań sztucznej inteligencji i blockchain oraz UX designingu.</p>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
} 