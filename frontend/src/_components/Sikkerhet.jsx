import React from 'react';
import { Link } from "react-router-dom";
const Sikkerhet = () => {
  return (
    <div className="min-h-screen bg-white py-8">
      <div className="max-w-4xl mx-auto p-8">
        <h1 className="text-3xl font-bold text-center mb-6">Sikkerhet</h1>
        <div className="space-y-6">
          <section>
            <h2 className="text-2xl font-semibold mb-4">Personvern</h2>
            <p className="text-gray-700 mb-4">
              Vi tar personvernet ditt på alvor. All personlig informasjon du deler med oss blir behandlet konfidensielt og i henhold til gjeldende lovverk, inkludert GDPR (Generell databeskyttelsesforordning). Vårt mål er å sikre at dine data er trygge, og at du har full kontroll over hvordan de brukes.
            </p>
            <p className="text-gray-700 font-semibold mb-2">Hvilke data samler vi inn?</p>
            <p className="text-gray-700 mb-4">
              Vi samler inn informasjon som er nødvendig for å gi deg en god brukeropplevelse. Dette kan inkludere:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-gray-700">
              <li>
                <strong>Navn og kontaktinformasjon:</strong> Når du registrerer deg for en brukerkonto, melder deg på nyhetsbrev eller kontakter oss direkte.
              </li>
              <li>
                <strong>Bruksdata:</strong> Informasjon om hvordan du bruker nettsiden vår, for eksempel hvilke sider du besøker og hvilke funksjoner du bruker.
              </li>
              <li>
                <strong>Tekniske data:</strong> IP-adresse, nettlesertype, enhetsinformasjon og andre tekniske detaljer som hjelper oss med å forbedre nettsidens ytelse. <Link className="text-blue-500" to ="/Personvern">Les mer på Personvern.</Link>
              </li> 
            </ul>
          </section>
          <section>
            <h2 className="text-2xl font-semibold mb-4">Datasikkerhet</h2>
            <p className="text-gray-700">
              Vi bruker avanserte sikkerhetstiltak for å beskytte dine data mot uautorisert tilgang, endring, avsløring eller ødeleggelse.
            </p>
          </section>
          <section>
            <h2 className="text-2xl font-semibold mb-4">Cookies</h2>
            <p className="text-gray-700">
              Vår nettside bruker cookies for å forbedre brukeropplevelsen. Du kan administrere eller deaktivere cookies gjennom nettleserinnstillingene dine. <Link className="text-blue-500" to ="/informasjonskapsler">Les mer på Informasjonskapsler.</Link>
            </p>
          </section>
          <section>
            <h2 className="text-2xl font-semibold mb-4">Kontakt Oss</h2>
            <p className="text-gray-700">
              Hvis du har spørsmål eller bekymringer angående sikkerheten på vår nettside, kan du <Link className='text-blue-500' to="/KontaktOss">kontakte</Link> oss på{' '}
              <a href="mailto:DiscgolfBø@gmail.no" className="text-blue-500 hover:underline">
                DiscgolfBø@gmail.no
              </a>
              .
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Sikkerhet;