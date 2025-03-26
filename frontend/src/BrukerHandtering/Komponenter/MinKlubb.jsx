//Author: Laurent Zogaj
import React from "react";

const MinKlubb = ({ valgtUnderKategori }) => {
  const underKategorier = ["Min klubb", "Søk etter klubb", "Avregistrer"];
  //Funksjoner for de ulike underkategoriene kan legges til under her






  //Styling og design for hver funksjon/komponent
  return (
    <div className="bg-white shadow-xl rounded-lg p-6 w-full max-w-[500px] flex flex-col items-center">

      {!underKategorier.includes(valgtUnderKategori) && (
        <p className="text-gray-600">Velg en underkategori for ditt behov</p>
      )}

      {valgtUnderKategori === "Min klubb" && <p>Informasjon om din klubb</p>}
      {valgtUnderKategori === "Søk etter klubb" && <p>Søkefunksjonalitet</p>}
      {valgtUnderKategori === "Søk etter brukere" && <p>Søk etter brukere</p>}
      {valgtUnderKategori === "Avregistrer" && <p>Avregistrering</p>}
    </div>
  );
};

export default MinKlubb;