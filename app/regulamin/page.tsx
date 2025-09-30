'use client'

import Header from '@/components/Header'
import Footer from '@/components/Footer'
import DynamicTitle from '@/components/DynamicTitle'
import { useLanguage } from '@/contexts/LanguageContext'

export default function Regulamin() {
  const { t, language } = useLanguage()

  return (
    <div className="min-h-screen flex flex-col bg-darkbg text-darktext">
      <DynamicTitle titleKey="regulamin" fallbackTitle={t('regulamin.meta.fallbackTitle')} />
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
                  <p>
                    <strong>{t('regulamin.companyInfo.labels.companyName')}</strong>{' '}
                    {t('regulamin.companyInfo.companyName')}
                  </p>
                  <p>
                    <strong>{t('regulamin.companyInfo.labels.address')}</strong>{' '}
                    {t('regulamin.companyInfo.address')}
                  </p>
                  <p>
                    <strong>{t('regulamin.companyInfo.labels.email')}</strong>{' '}
                    {t('regulamin.companyInfo.email')}
                  </p>
                </div>
                <div>
                  <p>
                    <strong>{t('regulamin.companyInfo.labels.phone')}</strong>{' '}
                    {t('regulamin.companyInfo.phone')}
                  </p>
                  <p>
                    <strong>{t('regulamin.companyInfo.labels.regNumber')}</strong>{' '}
                    {t('regulamin.companyInfo.regNumber')}
                  </p>
                  <p>
                    <strong>{t('regulamin.companyInfo.labels.website')}</strong>{' '}
                    {t('regulamin.companyInfo.website')}
                  </p>
                </div>
              </div>
            </section>

            {/* Definicje */}
            <section className="bg-darkpanel rounded-xl p-6 border border-gray-800">
              <h2 className="text-2xl font-bold mb-4 text-primary-400">§ 1. {t('regulamin.definitions.title')}</h2>
              <div className="space-y-4 text-gray-300">
                <div>
                  <h3 className="font-semibold text-white mb-2">{t('regulamin.definitions.items.platform.term')}</h3>
                  <p>{t('regulamin.definitions.items.platform.description')}</p>
                </div>
                <div>
                  <h3 className="font-semibold text-white mb-2">{t('regulamin.definitions.items.company.term')}</h3>
                  <p>{t('regulamin.definitions.items.company.description')}</p>
                </div>
                <div>
                  <h3 className="font-semibold text-white mb-2">{t('regulamin.definitions.items.user.term')}</h3>
                  <p>{t('regulamin.definitions.items.user.description')}</p>
                </div>
                <div>
                  <h3 className="font-semibold text-white mb-2">{t('regulamin.definitions.items.client.term')}</h3>
                  <p>{t('regulamin.definitions.items.client.description')}</p>
                </div>
                <div>
                  <h3 className="font-semibold text-white mb-2">{t('regulamin.definitions.items.services.term')}</h3>
                  <p>{t('regulamin.definitions.items.services.description')}</p>
                </div>
              </div>
            </section>

            {/* Zakres regulaminu */}
            <section className="bg-darkpanel rounded-xl p-6 border border-gray-800">
              <h2 className="text-2xl font-bold mb-4 text-primary-400">§ 2. {t('regulamin.scope.title')}</h2>
              <div className="space-y-4 text-gray-300">
                <p>{t('regulamin.scope.points.0')}</p>
                <p>{t('regulamin.scope.points.1')}</p>
                <p>{t('regulamin.scope.points.2')}</p>
                <p>{t('regulamin.scope.points.3')}</p>
              </div>
            </section>

            {/* Rodzaje usług */}
            <section className="bg-darkpanel rounded-xl p-6 border border-gray-800">
              <h2 className="text-2xl font-bold mb-4 text-primary-400">§ 3. {t('regulamin.servicesKinds.title')}</h2>
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-semibold text-white mb-3">
                    {t('regulamin.servicesKinds.softwareSales.title')}
                  </h3>
                  <ul className="list-disc list-inside space-y-2 text-gray-300 ml-4">
                    <li>{t('regulamin.servicesKinds.softwareSales.items.0')}</li>
                    <li>{t('regulamin.servicesKinds.softwareSales.items.1')}</li>
                    <li>{t('regulamin.servicesKinds.softwareSales.items.2')}</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-white mb-3">
                    {t('regulamin.servicesKinds.technicalConsulting.title')}
                  </h3>
                  <ul className="list-disc list-inside space-y-2 text-gray-300 ml-4">
                    <li>{t('regulamin.servicesKinds.technicalConsulting.items.0')}</li>
                    <li>{t('regulamin.servicesKinds.technicalConsulting.items.1')}</li>
                    <li>{t('regulamin.servicesKinds.technicalConsulting.items.2')}</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-white mb-3">
                    {t('regulamin.servicesKinds.devCollaboration.title')}
                  </h3>
                  <ul className="list-disc list-inside space-y-2 text-gray-300 ml-4">
                    <li>{t('regulamin.servicesKinds.devCollaboration.items.0')}</li>
                    <li>{t('regulamin.servicesKinds.devCollaboration.items.1')}</li>
                    <li>{t('regulamin.servicesKinds.devCollaboration.items.2')}</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-white mb-3">
                    {t('regulamin.servicesKinds.sourceCodeDelivery.title')}
                  </h3>
                  <ul className="list-disc list-inside space-y-2 text-gray-300 ml-4">
                    <li>{t('regulamin.servicesKinds.sourceCodeDelivery.items.0')}</li>
                    <li>{t('regulamin.servicesKinds.sourceCodeDelivery.items.1')}</li>
                    <li>{t('regulamin.servicesKinds.sourceCodeDelivery.items.2')}</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-white mb-3">
                    {t('regulamin.servicesKinds.appHosting.title')}
                  </h3>
                  <ul className="list-disc list-inside space-y-2 text-gray-300 ml-4">
                    <li>{t('regulamin.servicesKinds.appHosting.items.0')}</li>
                    <li>{t('regulamin.servicesKinds.appHosting.items.1')}</li>
                    <li>{t('regulamin.servicesKinds.appHosting.items.2')}</li>
                    <li>{t('regulamin.servicesKinds.appHosting.items.3')}</li>
                    <li>{t('regulamin.servicesKinds.appHosting.items.4')}</li>
                    <li>{t('regulamin.servicesKinds.appHosting.items.5')}</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Serwerowanie aplikacji */}
            <section className="bg-darkpanel rounded-xl p-6 border border-gray-800">
              <h2 className="text-2xl font-bold mb-4 text-primary-400">§ 4. {t('regulamin.hosting.title')}</h2>
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-semibold text-white mb-3">
                    {t('regulamin.hosting.period.title')}
                  </h3>
                  <ul className="list-disc list-inside space-y-2 text-gray-300 ml-4">
                    <li>{t('regulamin.hosting.period.items.0')}</li>
                    <li>{t('regulamin.hosting.period.items.1')}</li>
                    <li>{t('regulamin.hosting.period.items.2')}</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-white mb-3">
                    {t('regulamin.hosting.maintenanceFee.title')}
                  </h3>
                  <ul className="list-disc list-inside space-y-2 text-gray-300 ml-4">
                    <li>{t('regulamin.hosting.maintenanceFee.items.0')}</li>
                    <li>{t('regulamin.hosting.maintenanceFee.items.1')}</li>
                    <li>{t('regulamin.hosting.maintenanceFee.items.2')}</li>
                    <li>{t('regulamin.hosting.maintenanceFee.items.3')}</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-white mb-3">
                    {t('regulamin.hosting.consequences.title')}
                  </h3>
                  <ul className="list-disc list-inside space-y-2 text-gray-300 ml-4">
                    <li>{t('regulamin.hosting.consequences.items.0')}</li>
                    <li>{t('regulamin.hosting.consequences.items.1')}</li>
                    <li>{t('regulamin.hosting.consequences.items.2')}</li>
                    <li>{t('regulamin.hosting.consequences.items.3')}</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-white mb-3">
                    {t('regulamin.hosting.renewal.title')}
                  </h3>
                  <ul className="list-disc list-inside space-y-2 text-gray-300 ml-4">
                    <li>{t('regulamin.hosting.renewal.items.0')}</li>
                    <li>{t('regulamin.hosting.renewal.items.1')}</li>
                    <li>{t('regulamin.hosting.renewal.items.2')}</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Zasady składania zamówień */}
            <section className="bg-darkpanel rounded-xl p-6 border border-gray-800">
              <h2 className="text-2xl font-bold mb-4 text-primary-400">§ 5. {t('regulamin.ordering.title')}</h2>
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-semibold text-white mb-3">
                    {t('regulamin.ordering.process.title')}
                  </h3>
                  <ol className="list-decimal list-inside space-y-2 text-gray-300 ml-4">
                    <li>{t('regulamin.ordering.process.steps.0')}</li>
                    <li>{t('regulamin.ordering.process.steps.1')}</li>
                    <li>{t('regulamin.ordering.process.steps.2')}</li>
                    <li>{t('regulamin.ordering.process.steps.3')}</li>
                    <li>{t('regulamin.ordering.process.steps.4')}</li>
                  </ol>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-white mb-3">
                    {t('regulamin.ordering.requiredData.title')}
                  </h3>
                  <ul className="list-disc list-inside space-y-2 text-gray-300 ml-4">
                    <li>{t('regulamin.ordering.requiredData.items.0')}</li>
                    <li>{t('regulamin.ordering.requiredData.items.1')}</li>
                    <li>{t('regulamin.ordering.requiredData.items.2')}</li>
                    <li>{t('regulamin.ordering.requiredData.items.3')}</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-white mb-3">
                    {t('regulamin.ordering.requiredConsents.title')}
                  </h3>
                  <ul className="list-disc list-inside space-y-2 text-gray-300 ml-4">
                    <li>{t('regulamin.ordering.requiredConsents.items.0')}</li>
                    <li>{t('regulamin.ordering.requiredConsents.items.1')}</li>
                    <li>{t('regulamin.ordering.requiredConsents.items.2')}</li>
                    <li>{t('regulamin.ordering.requiredConsents.items.3')}</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Płatności i rozliczenia */}
            <section className="bg-darkpanel rounded-xl p-6 border border-gray-800">
              <h2 className="text-2xl font-bold mb-4 text-primary-400">§ 6. {t('regulamin.payments.title')}</h2>
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-semibold text-white mb-3">
                    {t('regulamin.payments.methods.title')}
                  </h3>
                  <ul className="list-disc list-inside space-y-2 text-gray-300 ml-4">
                    <li>{t('regulamin.payments.methods.items.0')}</li>
                    <li>{t('regulamin.payments.methods.items.1')}</li>
                    <li>{t('regulamin.payments.methods.items.2')}</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-white mb-3">
                    {t('regulamin.payments.pricing.title')}
                  </h3>
                  <ul className="list-disc list-inside space-y-2 text-gray-300 ml-4">
                    <li>{t('regulamin.payments.pricing.items.0')}</li>
                    <li>{t('regulamin.payments.pricing.items.1')}</li>
                    <li>{t('regulamin.payments.pricing.items.2')}</li>
                    <li>{t('regulamin.payments.pricing.items.3')}</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-white mb-3">
                    {t('regulamin.payments.settlements.title')}
                  </h3>
                  <ul className="list-disc list-inside space-y-2 text-gray-300 ml-4">
                    <li>{t('regulamin.payments.settlements.items.0')}</li>
                    <li>{t('regulamin.payments.settlements.items.1')}</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Realizacja zamówień */}
            <section className="bg-darkpanel rounded-xl p-6 border border-gray-800">
              <h2 className="text-2xl font-bold mb-4 text-primary-400">§ 7. {t('regulamin.fulfillment.title')}</h2>
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-semibold text-white mb-3">
                    {t('regulamin.fulfillment.leadTimes.title')}
                  </h3>
                  <ul className="list-disc list-inside space-y-2 text-gray-300 ml-4">
                    <li>{t('regulamin.fulfillment.leadTimes.items.0')}</li>
                    <li>{t('regulamin.fulfillment.leadTimes.items.1')}</li>
                    <li>{t('regulamin.fulfillment.leadTimes.items.2')}</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-white mb-3">
                    {t('regulamin.fulfillment.process.title')}
                  </h3>
                  <ol className="list-decimal list-inside space-y-2 text-gray-300 ml-4">
                    <li>{t('regulamin.fulfillment.process.steps.0')}</li>
                    <li>{t('regulamin.fulfillment.process.steps.1')}</li>
                    <li>{t('regulamin.fulfillment.process.steps.2')}</li>
                    <li>{t('regulamin.fulfillment.process.steps.3')}</li>
                  </ol>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-white mb-3">
                    {t('regulamin.fulfillment.quality.title')}
                  </h3>
                  <ul className="list-disc list-inside space-y-2 text-gray-300 ml-4">
                    <li>{t('regulamin.fulfillment.quality.items.0')}</li>
                    <li>{t('regulamin.fulfillment.quality.items.1')}</li>
                    <li>{t('regulamin.fulfillment.quality.items.2')}</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Prawa i obowiązki stron */}
            <section className="bg-darkpanel rounded-xl p-6 border border-gray-800">
              <h2 className="text-2xl font-bold mb-4 text-primary-400">§ 8. {t('regulamin.rightsDuties.title')}</h2>
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-semibold text-white mb-3">
                    {t('regulamin.rightsDuties.companyRights.title')}
                  </h3>
                  <ul className="list-disc list-inside space-y-2 text-gray-300 ml-4">
                    <li>{t('regulamin.rightsDuties.companyRights.items.0')}</li>
                    <li>{t('regulamin.rightsDuties.companyRights.items.1')}</li>
                    <li>{t('regulamin.rightsDuties.companyRights.items.2')}</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-white mb-3">
                    {t('regulamin.rightsDuties.companyDuties.title')}
                  </h3>
                  <ul className="list-disc list-inside space-y-2 text-gray-300 ml-4">
                    <li>{t('regulamin.rightsDuties.companyDuties.items.0')}</li>
                    <li>{t('regulamin.rightsDuties.companyDuties.items.1')}</li>
                    <li>{t('regulamin.rightsDuties.companyDuties.items.2')}</li>
                    <li>{t('regulamin.rightsDuties.companyDuties.items.3')}</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-white mb-3">
                    {t('regulamin.rightsDuties.clientRights.title')}
                  </h3>
                  <ul className="list-disc list-inside space-y-2 text-gray-300 ml-4">
                    <li>{t('regulamin.rightsDuties.clientRights.items.0')}</li>
                    <li>{t('regulamin.rightsDuties.clientRights.items.1')}</li>
                    <li>{t('regulamin.rightsDuties.clientRights.items.2')}</li>
                    <li>{t('regulamin.rightsDuties.clientRights.items.3')}</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-white mb-3">
                    {t('regulamin.rightsDuties.clientDuties.title')}
                  </h3>
                  <ul className="list-disc list-inside space-y-2 text-gray-300 ml-4">
                    <li>{t('regulamin.rightsDuties.clientDuties.items.0')}</li>
                    <li>{t('regulamin.rightsDuties.clientDuties.items.1')}</li>
                    <li>{t('regulamin.rightsDuties.clientDuties.items.2')}</li>
                    <li>{t('regulamin.rightsDuties.clientDuties.items.3')}</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Ochrona danych osobowych */}
            <section className="bg-darkpanel rounded-xl p-6 border border-gray-800">
              <h2 className="text-2xl font-bold mb-4 text-primary-400">§ 9. {t('regulamin.privacy.title')}</h2>
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-semibold text-white mb-3">
                    {t('regulamin.privacy.controller.title')}
                  </h3>
                  <ul className="list-disc list-inside space-y-2 text-gray-300 ml-4">
                    <li>{t('regulamin.privacy.controller.items.0')}</li>
                    <li>{t('regulamin.privacy.controller.items.1')}</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-white mb-3">
                    {t('regulamin.privacy.purposes.title')}
                  </h3>
                  <ul className="list-disc list-inside space-y-2 text-gray-300 ml-4">
                    <li>{t('regulamin.privacy.purposes.items.0')}</li>
                    <li>{t('regulamin.privacy.purposes.items.1')}</li>
                    <li>{t('regulamin.privacy.purposes.items.2')}</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-white mb-3">
                    {t('regulamin.privacy.userRights.title')}
                  </h3>
                  <ul className="list-disc list-inside space-y-2 text-gray-300 ml-4">
                    <li>{t('regulamin.privacy.userRights.items.0')}</li>
                    <li>{t('regulamin.privacy.userRights.items.1')}</li>
                    <li>{t('regulamin.privacy.userRights.items.2')}</li>
                    <li>{t('regulamin.privacy.userRights.items.3')}</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Własność intelektualna */}
            <section className="bg-darkpanel rounded-xl p-6 border border-gray-800">
              <h2 className="text-2xl font-bold mb-4 text-primary-400">§ 10. {t('regulamin.intellectualProperty.title')}</h2>
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-semibold text-white mb-3">
                    {t('regulamin.intellectualProperty.software.title')}
                  </h3>
                  <ul className="list-disc list-inside space-y-2 text-gray-300 ml-4">
                    <li>{t('regulamin.intellectualProperty.software.items.0')}</li>
                    <li>{t('regulamin.intellectualProperty.software.items.1')}</li>
                    <li>{t('regulamin.intellectualProperty.software.items.2')}</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-white mb-3">
                    {t('regulamin.intellectualProperty.sourceCode.title')}
                  </h3>
                  <ul className="list-disc list-inside space-y-2 text-gray-300 ml-4">
                    <li>{t('regulamin.intellectualProperty.sourceCode.items.0')}</li>
                    <li>{t('regulamin.intellectualProperty.sourceCode.items.1')}</li>
                    <li>{t('regulamin.intellectualProperty.sourceCode.items.2')}</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-white mb-3">
                    {t('regulamin.intellectualProperty.infringements.title')}
                  </h3>
                  <ul className="list-disc list-inside space-y-2 text-gray-300 ml-4">
                    <li>{t('regulamin.intellectualProperty.infringements.items.0')}</li>
                    <li>{t('regulamin.intellectualProperty.infringements.items.1')}</li>
                    <li>{t('regulamin.intellectualProperty.infringements.items.2')}</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Odpowiedzialność i reklamacje */}
            <section className="bg-darkpanel rounded-xl p-6 border border-gray-800">
              <h2 className="text-2xl font-bold mb-4 text-primary-400">§ 11. {t('regulamin.liability.title')}</h2>
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-semibold text-white mb-3">
                    {t('regulamin.liability.companyLiability.title')}
                  </h3>
                  <ul className="list-disc list-inside space-y-2 text-gray-300 ml-4">
                    <li>{t('regulamin.liability.companyLiability.items.0')}</li>
                    <li>{t('regulamin.liability.companyLiability.items.1')}</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-white mb-3">
                    {t('regulamin.liability.complaints.title')}
                  </h3>
                  <ul className="list-disc list-inside space-y-2 text-gray-300 ml-4">
                    <li>{t('regulamin.liability.complaints.items.0')}</li>
                    <li>{t('regulamin.liability.complaints.items.1')}</li>
                    <li>{t('regulamin.liability.complaints.items.2')}</li>
                    <li>{t('regulamin.liability.complaints.items.3')}</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-white mb-3">
                    {t('regulamin.liability.disputeResolution.title')}
                  </h3>
                  <ul className="list-disc list-inside space-y-2 text-gray-300 ml-4">
                    <li>{t('regulamin.liability.disputeResolution.items.0')}</li>
                    <li>{t('regulamin.liability.disputeResolution.items.1')}</li>
                    <li>{t('regulamin.liability.disputeResolution.items.2')}</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Postanowienia końcowe */}
            <section className="bg-darkpanel rounded-xl p-6 border border-gray-800">
              <h2 className="text-2xl font-bold mb-4 text-primary-400">§ 12. {t('regulamin.finalProvisions.title')}</h2>
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-semibold text-white mb-3">
                    {t('regulamin.finalProvisions.changes.title')}
                  </h3>
                  <ul className="list-disc list-inside space-y-2 text-gray-300 ml-4">
                    <li>{t('regulamin.finalProvisions.changes.items.1')}</li>
                    <li>{t('regulamin.finalProvisions.changes.items.2')}</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-white mb-3">
                    {t('regulamin.finalProvisions.validity.title')}
                  </h3>
                  <ul className="list-disc list-inside space-y-2 text-gray-300 ml-4">
                    <li>{t('regulamin.finalProvisions.validity.items.0')}</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-white mb-3">
                    {t('regulamin.finalProvisions.entryIntoForce.title')}
                  </h3>
                  <ul className="list-disc list-inside space-y-2 text-gray-300 ml-4">
                    <li>{t('regulamin.finalProvisions.entryIntoForce.items.0')}</li>
                    <li>{t('regulamin.finalProvisions.entryIntoForce.items.1')}</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Informacje o zgodności z prawem */}
            <section className="bg-darkpanel rounded-xl p-6 border border-gray-800">
              <h2 className="text-2xl font-bold mb-4 text-primary-400">{t('regulamin.compliance.title')}</h2>
              <div className="space-y-4 text-gray-300">
                <p>{t('regulamin.compliance.intro')}</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>{t('regulamin.compliance.uk.0')}</li>
                  <li>{t('regulamin.compliance.uk.1')}</li>
                  <li>{t('regulamin.compliance.uk.2')}</li>
                </ul>
              </div>
            </section>

            {/* Kontakt */}
            <section className="bg-darkpanel rounded-xl p-6 border border-gray-800">
              <h2 className="text-2xl font-bold mb-4 text-primary-400">{t('regulamin.contact.title')}</h2>
              <div className="grid md:grid-cols-2 gap-4 text-gray-300">
                <div>
                  <p>
                    <strong>{t('regulamin.contact.labels.email')}</strong> {t('regulamin.contact.email')}
                  </p>
                  <p>
                    <strong>{t('regulamin.contact.labels.phone')}</strong> {t('regulamin.contact.phone')}
                  </p>
                </div>
                <div>
                  <p>
                    <strong>{t('regulamin.contact.labels.address')}</strong> {t('regulamin.contact.address')}
                  </p>
                  <p>
                    <strong>{t('regulamin.contact.labels.website')}</strong> {t('regulamin.contact.website')}
                  </p>
                </div>
              </div>
            </section>

            {/* Data aktualizacji */}
            <section className="bg-darkpanel rounded-xl p-6 border border-gray-800">
              <div className="text-center text-gray-400">
                <p>
                  <strong>{t('regulamin.updateInfo.lastUpdatedLabel')}</strong>{' '}
                  {t('regulamin.updateInfo.lastUpdatedDate')}
                </p>
                <p>
                  <strong>{t('regulamin.updateInfo.versionLabel')}</strong> {t('regulamin.updateInfo.version')}
                </p>
              </div>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
