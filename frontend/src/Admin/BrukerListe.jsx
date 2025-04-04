import React, { useEffect, useState } from "react";
import "../App.css"; // Importer CSS-fil for styling

const BrukerListe = () => {
  const [brukere, setBrukere] = useState([]);
  const [feilmelding, setFeilmelding] = useState("");
  const [redigerBruker, setRedigerBruker] = useState(null); // Tilstand for redigering

  const hentBrukere = async () => {
    try {
      const respons = await fetch("http://localhost:8000/api/brukere", {
        method: "GET",
        credentials: "include", // Sender cookies for autentisering
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
        const respons = await fetch(`http://localhost:8000/api/brukere/${redigerBruker._id}`, { // Sørg for at base-URL er riktig
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ rolle: redigerBruker.rolle }), // Oppdater rolle
            credentials: "include",
        });
        if (!respons.ok) {
            throw new Error("Kunne ikke oppdatere bruker");
        }
        alert("Bruker oppdatert!");
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
      // Fjern eller tilbakestill denne delen hvis den ble endret
      console.log(`Sletting av bruker med ID: ${brukerId}`);
    } catch (error) {
      console.error("Feil ved sletting av bruker:", error.message);
      setFeilmelding("Kunne ikke slette brukeren. Prøv igjen senere.");
    }
  };

  return (
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
        <ul className="space-y-2">
          {brukere.map((bruker) => (
            <li key={bruker._id} className="p-2 border rounded">
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
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default BrukerListe;