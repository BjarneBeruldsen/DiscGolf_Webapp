//Author: Laurent Zogaj
import React from "react";

const Personvern = ({ valgtUnderKategori }) => {
  const underKategorier = ["Informasjonskapsler", "Synlighet", "GDPR"];
  //Funksjoner for de ulike underkategoriene kan legges til under her






//Styling og design for hver funksjon/komponent
  return (
    <div className="bg-white shadow-xl rounded-lg p-6 w-full max-w-[500px] flex flex-col items-center">

      {!underKategorier.includes(valgtUnderKategori) && (
        <p className="text-gray-600">Velg en underkategori for ditt behov</p>
      )}

      {valgtUnderKategori === "Informasjonskapsler" && <p>Informasjonskapsler</p>}
      {valgtUnderKategori === "Synlighet" && <p>Synlighetsinnstillinger</p>}
      {valgtUnderKategori === "GDPR" && <p>GDPR</p>}
    </div>
  );
};

export default Personvern;