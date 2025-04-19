//Author: Laurent Zogaj

import React from 'react';
import { useTranslation } from 'react-i18next';

const Sikkerhet = () => {
  const { t } = useTranslation();
  return (
    <div className="min-h-screen bg-white py-8">
      <div className="max-w-4xl mx-auto p-8">
        <h1 className="text-3xl font-bold text-center mb-6">{t("Sikkerhet")}</h1>
        <div className="space-y-6">
          <section>
            <h2 className="text-2xl font-semibold mb-4">{t("Sikkerhetstiltak")}</h2>
            <p className="text-gray-700">
              {t("Vi tar sikkerhet på alvor og implementerer robuste tiltak for å beskytte både brukerdata og systemet vårt.")}
            </p>
            <ul className="list-disc pl-6 space-y-2 text-gray-700">
              <li>
                <strong>{t("Kontinuerlig overvåkning")}:</strong> {t("Alle aktiviteter logges og overvåkes for å oppdage uvanlige mønstre eller sikkerhetstrusler.")}
              </li>
              <li>
                <strong>{t("Beskyttelse av data")}:</strong> {t("Vi anvender sikre standarder for kryptering og lagring for å forhindre uautorisert tilgang.")}
              </li>
              <li>
                <strong>{t("Sikre forbindelser")}:</strong> {t("All trafikk til og fra tjenesten skjer via sikre protokoller for å beskytte mot datalekkasjer.")}
              </li>
              <li>
                <strong>{t("Tilgangskontroll")}:</strong> {t("Strenge regler for autentisering og autorisasjon sikrer at kun autoriserte brukere har tilgang til sensitiv informasjon.")}
              </li>
              <li>
                <strong>{t("Forebygging av angrep")}:</strong> {t("Systemet er beskyttet mot vanlige angrep som brute-force, injeksjonsangrep og forsøk på uautorisert tilgang.")}
              </li>
            </ul>
          </section>
          <section>
            <h2 className="text-2xl font-semibold mb-4">{t("Kontakt oss")}</h2>
            <p className="text-gray-700">
              {t("Hvis du har spørsmål eller bekymringer angående sikkerheten på vår nettside, kan du kontakte oss på:")} 
              <a href="/KontaktOss" className="text-blue-500 hover:underline"> {t("Kontakt oss")}</a>
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Sikkerhet;