//Author: Laurent Zogaj & Severin Waller Sørensen

/*
 *
 */

import React, { useEffect, useState } from "react";

const MinKlubb = ({ valgtUnderKategori }) => {
  const [rolle, setRolle] = useState(null);
  const [hovedAdmin, setHovedAdmin] = useState(false);
  const underKategorier = ["Min klubb", "Søk etter klubb", "Avregistrer"];

  useEffect(() => {
    // Hent brukerens rolle og hoved-admin-status fra backend
    const fetchBrukerInfo = async () => {
      try {
        const respons = await fetch(`${process.env.REACT_APP_API_BASE_URL}/brukere/rolle`, {
          withCredentials: true, // Sender cookies for autentisering
        });
        console.log("API-respons:", respons.data); // Legg til logging
        setRolle(respons.data.rolle);
        setHovedAdmin(respons.data.hovedAdmin);
      } catch (error) {
        console.error("Feil ved henting av brukerens rolle:", error);
      }
    };

    fetchBrukerInfo();
  }, []);

  return (
    <div className="bg-white shadow-xl rounded-lg p-6 w-full max-w-[500px] flex flex-col items-center">

      {!underKategorier.includes(valgtUnderKategori) && (
        <p className="text-gray-600">Velg en underkategori for ditt behov</p>
      )}

      {valgtUnderKategori === "Min klubb" && <p>Informasjon om din klubb</p>}
      {valgtUnderKategori === "Søk etter klubb" && <p>Søkefunksjonalitet</p>}
      {valgtUnderKategori === "Søk etter brukere" && <p>Søk etter brukere</p>}
      {valgtUnderKategori === "Avregistrer" && <p>Avregistrering</p>}

      {/* Dynamisk innhold basert på rolle */}
      {rolle === "admin" && (
        <div className="mt-4">
          <h3 className="text-lg font-bold">Admin-funksjoner</h3>
          <ul>
            <li>Administrer brukere</li>
            <li>Administrer klubber</li>
          </ul>
        </div>
      )}

      {/* hoved-admin-funksjonalitet */}
      {hovedAdmin && (
        <div className="mt-4">
          <h3 className="text-lg font-bold text-red-600">hoved-Admin-funksjoner</h3>
          <ul>
            <li>Full tilgang til alle data</li>
            <li>Administrer applikasjonsinnstillinger</li>
            <li>Se systemlogger</li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default MinKlubb;