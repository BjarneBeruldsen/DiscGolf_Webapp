//Author: Laurent Zogaj
import React from "react";

const Sikkerhet = ({ valgtUnderKategori }) => {
  const underKategorier = ["To-faktor autentisering", "Gjennoppretting"];
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
        <p className="text-gray-600">Velg en underkategori for ditt behov</p>
      )}

      {valgtUnderKategori === "To-faktor autentisering" && <p>2FA(Ikke implementert)</p>}
      {valgtUnderKategori === "Gjennoppretting" && <p>Gjenoppretting(Ikke implementert)</p>}
    </div>
  );
};

export default Sikkerhet;