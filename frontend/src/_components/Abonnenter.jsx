//Author: Laurent Zogaj

/*
En enkel komponent for å vise informasjon om abonnementer vi tilbyr.
*/

import React from 'react';
import { useTranslation } from 'react-i18next';

const AbonnementInfo = () => {
  const { t } = useTranslation();
  return (
    <div className="min-h-screen bg-white py-8">
      <div className="max-w-4xl mx-auto p-8">
        <h1 className="text-3xl font-bold text-center mb-6">
          {t("Ulike abonnementer vi tilbyr")}
        </h1>

        <h2 className="text-2xl font-semibold mt-6 mb-2">{t("1. Gratis medlemskap")}</h2>
        <p className="text-gray-700 mb-4">
          {t("Vårt gratis medlemskap gir deg tilgang til grunnleggende funksjonalitet uten noen kostnader. Dette alternativet passer godt for nye brukere eller de som kun trenger enkel tilgang.")}
        </p>
        <ul className="list-disc pl-6 text-gray-700 mb-6">
          <li>{t("Tilgang til grunnleggende funksjoner")}</li>
          <li>{t("Ingen månedlig kostnad")}</li>
          <li>{t("Begrenset kundestøtte")}</li>
        </ul>

        <h2 className="text-2xl font-semibold mt-6 mb-2">{t("2. Betalt medlemskap")}</h2>
        <p className="text-gray-700 mb-4">
          {t("Med betalt medlemskap får du full tilgang til alle funksjoner og prioritet hos kundestøtte. Dette er det beste valget for aktive brukere som ønsker maksimal verdi.")}
        </p>
        <ul className="list-disc pl-6 text-gray-700 mb-6">
          <li>{t("Full tilgang til alle funksjoner")}</li>
          <li>{t("Prioritert kundestøtte")}</li>
          <li>{t("Pris: 99 kr/måned")}</li>
        </ul>

        <p className="text-gray-700 mt-4">
          {t('Du kan administrere eller oppgradere abonnementet ditt via underkategorien "Mitt abonnement" ved ditt medlemskap når som helst.')}
        </p>
      </div>
    </div>
  );
};

export default AbonnementInfo;