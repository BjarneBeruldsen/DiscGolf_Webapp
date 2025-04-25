//Author: Laurent Zogaj
import React from "react";
import { useTranslation } from 'react-i18next';

const Personvern = ({ valgtUnderKategori }) => {
  const underKategorier = ["Informasjonskapsler", "Synlighet"];
  const { t } = useTranslation();
  //Funksjoner for de ulike underkategoriene kan legges til under her



/* 

Her hadde jeg ideer om å legge til funskjoner som:

Styring av informasjonskapsler = fjerne cookies hvis applikasjonen for eksempel hadde hatt flere third party cookies
eller cookies som ikke er nødvendige for applikasjonen. 

Synlighet innstillinger = I form av hva andre kan se av informasjon av deg, der man kan "toogle" hva som skal være synlig eller ikke

Eventuelt også en "toggle" for å skru av og på samtykker osv.

*/


//Styling og design for hver funksjon/komponent
return (
  <div className="bg-white shadow-xl rounded-lg p-6 w-full max-w-[500px] flex flex-col items-center">
    {!underKategorier.includes(valgtUnderKategori) && (
      <p className="text-gray-600">{t("Velg en underkategori for ditt behov")}</p>
    )}

    {valgtUnderKategori === t("Informasjonskapsler") && <p>{t("Informasjonskapsler (Ikke implementert)")}</p>}
    {valgtUnderKategori === t("Synlighet") && <p>{t("Synlighetsinnstillinger (Ikke implementert)")}</p>}
  </div>
);
};

export default Personvern;