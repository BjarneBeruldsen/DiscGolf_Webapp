//Author: Laurent Zogaj
import React from "react";

const Sikkerhet = ({ valgtUnderKategori }) => {
  const underKategorier = ["To-faktor autentisering", "Gjennoppretting"];
  //Funksjoner for de ulike underkategoriene kan legges til under her




//Styling og design for hver funksjon/komponent
  return (
    <div className="bg-white shadow-xl rounded-lg p-6 w-full max-w-[500px] flex flex-col items-center">

      {!underKategorier.includes(valgtUnderKategori) && (
        <p className="text-gray-600">Velg en underkategori for ditt behov</p>
      )}

      {valgtUnderKategori === "To-faktor autentisering" && <p>2FA</p>}
      {valgtUnderKategori === "Gjennoppretting" && <p>Gjenoppretting</p>}
    </div>
  );
};

export default Sikkerhet;