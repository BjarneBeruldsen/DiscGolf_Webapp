//Author: Severin Waller Sørensen

/* Denne filen definerer en komponent for å vise en liste over brukere.
 * Komponenten/filen henter brukerlisten via backend-API kall.
 */

import React, { useEffect, useState } from "react";
import "../App.css";

const BrukerListe = () => {
  const [brukere, setBrukere] = useState([]);
  const [feilmelding, setFeilmelding] = useState("");
  const [redigerBruker, setRedigerBruker] = useState(null); 

  const hentBrukere = async () => {
    try {
      const respons = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/brukere`, {
        method: "GET",
        credentials: "include", 
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (!respons.ok) {
        throw new Error("Kunne ikke hente brukere");
      }
      const data = await respons.json();
      setBrukere(data);
    } catch (error) {
      setFeilmelding(error.message);
    }
  };

  useEffect(() => {
    hentBrukere();
  }, []);

  const handleEdit = (bruker) => {
    setRedigerBruker(bruker); // Sett brukeren som skal redigeres
  };

  const handleSave = async () => {
    try {
        console.log("Oppdaterer bruker:", redigerBruker); // Logg dataene som sendes til backend

        const respons = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/brukere/${redigerBruker._id}`, {
          method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ rolle: redigerBruker.rolle }), // Oppdater rolle
            credentials: "include",
        });

        if (!respons.ok) {
            const errorData = await respons.json();
            console.error("Feil fra backend:", errorData); // Logg feilmeldingen fra backend
            throw new Error("Kunne ikke oppdatere bruker");
        }

        // Logg handlingen i systemloggen
        await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/systemlogg`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({
            bruker: "DinBrukerNavn", // Bytt ut med faktisk brukernavn fra autentisering
            handling: "Oppdaterte brukerrolle",
            detaljer: `Endret rolle til '${redigerBruker.rolle}' for bruker '${redigerBruker.brukernavn}'`,
          }),
        });

        setRedigerBruker(null); // Lukk redigeringsskjemaet
        hentBrukere(); // Oppdater listen over brukere
    } catch (error) {
        console.error("Feil ved oppdatering av bruker:", error.message);
        setFeilmelding("Kunne ikke oppdatere brukeren. Prøv igjen senere.");
    }
  };

  const handleCancel = () => {
    setRedigerBruker(null); // Lukk redigeringsskjemaet uten å lagre
  };

  const handleDelete = async (brukerId, brukernavn) => {
    const bekreft = window.confirm(`Er du sikker på at du vil slette brukeren "${brukernavn}"?`);
    if (!bekreft) return;
    try {
      const respons = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/brukere/${brukerId}`, {
        method: "DELETE",
        credentials: "include",
      });
    
      if (!respons.ok) {
        throw new Error("Kunne ikke slette brukeren");
      }

      // Logg slettingen i systemloggen
      await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/systemlogg`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({
              bruker: "DinBrukerNavn", // Bytt ut med faktisk brukernavn fra autentisering
              handling: "Slettet bruker",
              detaljer: `Slettet brukeren '${brukernavn}' med ID '${brukerId}'`,
          }),
      });
    
      // Oppdater listen etter sletting
      hentBrukere();
    } catch (error) {
      console.error("Feil ved sletting av bruker:", error.message);
      setFeilmelding("Kunne ikke slette brukeren. Prøv igjen senere.");
    }
  };

  return ( // Skrev et førsteutkast men spurte copilot om den kunne forbedre det og legge til CSS
    <div>
      <h2 className="text-lg font-bold mb-4">Brukerliste</h2>
      {feilmelding && <p className="text-red-500">{feilmelding}</p>}

      {redigerBruker ? (
        <div className="p-4 border rounded mb-4">
          <h3 className="text-lg font-bold mb-2">Rediger bruker</h3>
          <p><strong>Brukernavn:</strong> {redigerBruker.brukernavn}</p>
          <p><strong>E-post:</strong> {redigerBruker.epost}</p>
          <label className="block mb-2">
            <strong>Rolle:</strong>
            <select
              className="border p-2 rounded w-full"
              value={redigerBruker.rolle}
              onChange={(e) => setRedigerBruker({ ...redigerBruker, rolle: e.target.value })}
            >
              <option value="bruker">Bruker</option>
              <option value="medlem">Medlem</option>
              <option value="klubbleder">Klubbleder</option>
              <option value="admin">Admin</option>
              <option value="hoved-admin">Hoved-admin</option>
            </select>
          </label>
          <div className="flex gap-2">
            <button
              className="custom-blue"
              onClick={handleSave}
            >
              Lagre
            </button>
            <button
              className="bg-gray-500 text-white px-2 py-1 rounded hover:bg-gray-600"
              onClick={handleCancel}
            >
              Avbryt
            </button>
          </div>
        </div>
      ) : (
        // Hadde problemer med Tailwind og spurte copilt om hjelp/inline CSS
        // dette (om burk av tailwind) ble foreslått for å gjøre det responsivt:
        // Tailwind forslag <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "1rem" }}>
        {brukere.map((bruker) => (
          <div key={bruker._id} className="p-4 border rounded shadow-sm">
            <p><strong>Brukernavn:</strong> {bruker.brukernavn}</p>
            <p><strong>E-post:</strong> {bruker.epost}</p>
            <p><strong>Rolle:</strong> {bruker.rolle}</p>
            <button
              className="custom-blue"
              onClick={() => handleEdit(bruker)}
            >
              Rediger
            </button>
            <button 
              className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
              onClick={() => handleDelete(bruker._id, bruker.brukernavn)}
            >
              Slett
            </button>
          </div>
        ))}
      </div>
        
      )}
    </div>
  );
};

// Eksport av komponenten
export default BrukerListe;