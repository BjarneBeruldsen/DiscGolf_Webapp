//Author: Laurent Zogaj
import React from "react";

const MittAbonnement = ({ valgtUnderKategori }) => {
  const underKategorier = ["Mitt abonnement", "Betaling", "Avslutt abonnement"];
  //Funksjoner for de ulike underkategoriene kan legges til under her





  //Styling og design for hver funksjon/komponent
  return (
    <div className="bg-white shadow-xl rounded-lg p-6 w-full max-w-[500px] flex flex-col items-center">

      {!underKategorier.includes(valgtUnderKategori) && (
        <p className="text-gray-600">Velg en underkategori for ditt behov</p>
      )}

      {valgtUnderKategori === "Mitt abonnement" && <p>Abonnementsinformasjon</p>}
      {valgtUnderKategori === "Betaling" && <p>Betaling</p>}
      {valgtUnderKategori === "Avslutt abonnement" && <p>Avslutte abonnement</p>}
    </div>
  );
};

export default MittAbonnement;