//Author: Laurent Zogaj
/*
En enkel komponent for å vise informasjon om informasjonskapsler og sesjoner.
*/

import React from 'react';
import { useTranslation } from 'react-i18next';

const Informasjonskapsler = () => {
  const { t } = useTranslation();
  return (
    <div className="min-h-screen bg-white py-8">
      <div className="max-w-4xl mx-auto p-8">
        <h1 className="text-3xl font-bold text-center mb-6">{t("Informasjonskapsler")}</h1>
        <h2 className="text-2xl font-semibold mt-6 mb-2">{t("1. Hva er informasjonskapsler?")}</h2>
        <p className="text-gray-700">
          {t("Informasjonskapsler er små tekstfiler som lagres på enheten din når du besøker en nettside. De brukes for å lagre informasjon mellom besøk.")}
        </p>
        <h2 className="text-2xl font-semibold mt-6 mb-2">{t("2. Hva er sesjoner?")}</h2>
        <p className="text-gray-700">
          {t("En sesjon er en midlertidig tilkobling mellom deg og nettsiden, og lagres trygt på vår server. Hos oss lagres sesjonsdata i databasen i inntil 5 dager, eller til du logger ut (eller ved forespørsel om sletting av data). Etter dette slettes de automatisk, og du må logge inn på nytt. Selve informasjonskapselen i nettleseren inneholder kun en ID, og ingen sensitiv informasjon.")}
        </p>
        <h2 className="text-2xl font-semibold mt-6 mb-2">{t("3. Hvilke informasjonskapsler bruker vi?")}</h2>
        <p className="text-gray-700">
          {t("Vi bruker kun en informasjonskapsel som er nødvendig for at applikasjonen skal fungere som den skal:")}
        </p>

        <ul className="list-disc pl-6 mt-2 text-gray-700">
          <li>
            <strong>connect.sid:</strong> {t("Denne informasjonskapselen opprettes automatisk ved innlogging, og brukes til å holde deg innlogget så lenge sesjonen varer. Den inneholder ingen personlig informasjon, og slettes når du logger ut eller etter en viss tids inaktivitet.")}
          </li>
        </ul>
        <p className="text-gray-700 mt-4">
          {t("I tillegg benyttes informasjonskapsler som automatisk settes av tredjeparts API-er vi bruker, som f.eks. værdata fra")} <strong>Yr</strong> {t("og karttjenester fra")} <strong>Mapbox</strong>.{" "}
          {t("Disse brukes kun for å vise nødvendig funksjonalitet, som værmelding og interaktive kart, og ikke til sporing eller analyse.")}
        </p>
        <p className="text-gray-700 mt-2">
          <strong>{t("Vi bruker ikke analyse- eller markedsføringskapsler.")}</strong>
        </p>
        <h2 className="text-2xl font-semibold mt-6 mb-2">{t("4. Hvordan administrerer jeg informasjonskapsler?")}</h2>
        <p className="text-gray-700">
          {t("Du kan administrere og slette informasjonskapsler via innstillingene i nettleseren din. Hvis du sletter nødvendige informasjonskapsler, kan innlogging og enkelte funksjoner slutte å fungere.")}
        </p>
        <h2 className="text-2xl font-semibold mt-6 mb-2">{t("5. Ønsker du å slette dine data?")}</h2>
        <p className="text-gray-700">
          <a href="/Personvern" className="text-blue-500 hover:underline">
            {t("Les mer her")}
          </a> {t("dersom du ønsker å slette dine data.")} 
        </p>
      </div>
    </div>
  );
};

export default Informasjonskapsler;