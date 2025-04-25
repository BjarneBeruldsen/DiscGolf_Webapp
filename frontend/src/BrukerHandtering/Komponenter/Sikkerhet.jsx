//Author: Laurent Zogaj
import React from "react";
import { useTranslation } from 'react-i18next';

const Sikkerhet = ({ valgtUnderKategori }) => {
  const underKategorier = ["To-faktor autentisering", "Gjennoppretting"];
  const { t } = useTranslation();
  //Funksjoner for de ulike underkategoriene kan legges til under her


/* 

Her hadde jeg ideer om å legge til funskjoner som:

Gjennopprettning = f.eks. tilbakestilling av passord eller gjenoppretting av konto ved hjelp av koder eller liggnende

To-faktor autentisering = f.eks. autentisering via sms eller e-post eller begge. Evt også med autentiseringsapper via QR-kode eller kode.

*/


//Styling og design for hver funksjon/komponent
return (
  <div className="bg-white shadow-xl rounded-lg p-6 w-full max-w-[500px] flex flex-col items-center">
      {!underKategorier.includes(valgtUnderKategori) && (
      <p className="text-gray-600">{t("Velg en underkategori for ditt behov")}</p>
    )}
      {valgtUnderKategori === t("To-faktor autentisering") && <p>{t("2FA(Ikke implementert)")}</p>}
      {valgtUnderKategori === t("Gjennoppretting") && <p>{t("Gjenoppretting(Ikke implementert)")}</p>}
    </div>
  );
};

export default Sikkerhet;