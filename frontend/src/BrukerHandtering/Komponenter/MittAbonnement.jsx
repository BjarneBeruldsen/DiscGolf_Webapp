//Author: Laurent Zogaj
/*
Denne filen viser frem abonnementet til brukeren og gir mulighet for å betale eller avslutte abonnementet.
*/

import React, { useState } from "react";

const MittAbonnement = ({ valgtUnderKategori, bruker }) => {
  const underKategorier = ["Mitt abonnement"];
  const [harBetalt, setHarBetalt] = useState(bruker?.betalt || false); //Lagres i lokal state henter fra bruker objektet
  const [laster, setLaster] = useState(false);

  //Funksjon for å betale abonnementet
  const handleBetaling = async () => {
    try {
      setLaster(true);
      const respons = await fetch(`${process.env.REACT_APP_API_BASE_URL}/BetaleAbo`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include"
      });
      const data = await respons.json();
      if (respons.ok) { 
        setHarBetalt(true); //Setter harBetalt til true
      } else {
        console.error("Betaling feilet" || data.error);
      }
    } catch (error) {
      console.error("Feil ved betaling:", error);
    } finally {
      setLaster(false); //Setter laster til false
    }
  };

  //Funksjon for å avslutte abonnementet
  const handleAvslutt = async () => {
    try {
      setLaster(true); 
      const respons = await fetch(`${process.env.REACT_APP_API_BASE_URL}/AvslutteAbo`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include"
      });
      const data = await respons.json();
      if (respons.ok) {
        setHarBetalt(false); //Setter harBetalt til false
      } else {
        console.error("Avslutting av abonnement feilet" || data.error);
      }
    }
    catch (error) {
      console.error("Feil ved avslutting av abonnement:", error);
    } finally {
      setLaster(false); //Setter laster til false
    }
  }

//Styling og design for hver funksjon/komponent
  return (
    <div className="bg-white shadow-xl rounded-lg p-6 w-full max-w-[500px] flex flex-col items-center">

      {!underKategorier.includes(valgtUnderKategori) && (
        <p className="text-gray-600">Velg en underkategori for ditt behov</p>
      )}

      {valgtUnderKategori === "Mitt abonnement" && (
        <div className="w-full flex flex-col gap-4">
          <p className="text-xl font-semibold text-center">Abonnementsinformasjon</p>

          <div className=" border-gray-300 rounded-lg p-4 bg-gray-50">
            <h2 className="text-lg font-bold mb-2">Gratis medlemskap</h2>
            <ul className="list-disc list-inside text-sm text-gray-700">
              <li>Tilgang til grunnleggende funksjoner</li>
              <li>Ingen månedlig kostnad</li>
              <li>Begrenset kundestøtte</li>
            </ul>
          </div>

          <div className=" border-gray-300 rounded-lg p-4 bg-gray-50">
            <h2 className="text-lg font-bold mb-2">Betalt medlemskap</h2>
            {harBetalt ? (
              <>
                <p className="text-green-600 font-medium mb-2">Du har betalt for medlemskapet!</p>
                <button
                  onClick={handleAvslutt}
                  disabled={laster}
                  className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded"
                >
                  {laster ? "Behandler..." : "Avslutt abonnement"}
                </button>
              </>
            ) : (
              <>
                <ul className="list-disc list-inside text-sm text-gray-700 mb-4">
                  <li>Full tilgang til alle funksjoner</li>
                  <li>Prioritert kundestøtte</li>
                  <li>99 kr/måned</li>
                </ul>
                <button
                  onClick={handleBetaling}
                  disabled={laster}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded"
                >
                  {laster ? "Behandler betaling..." : "Betal nå"}
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default MittAbonnement;