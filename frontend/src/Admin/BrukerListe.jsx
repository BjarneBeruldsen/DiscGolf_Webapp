import React, { useEffect, useState } from "react";

const BrukerListe = () => {
    const [brukere, setBrukere] = useState([]);
    const [feilmelding, setFeilmelding] = useState("");

    const hentBrukere = async () => {
        try {
            const respons = await fetch("http://localhost:8000/api/brukere", { // Oppdater URL hvis nødvendig
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

    const handleEdit = async (bruker) => {
        const oppdateringer = { rolle: "hoved-admin" }; // Eksempel: Oppdater rolle
        try {
            const respons = await fetch(`/api/brukere/${bruker._id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(oppdateringer),
                credentials: "include",
            });
            if (!respons.ok) {
                throw new Error("Kunne ikke oppdatere bruker");
            }
            alert("Bruker oppdatert!");
            // Oppdater listen over brukere
            hentBrukere();
        } catch (error) {
            console.error(error.message);
        }
    };

    const handleDelete = async (brukerId) => {
        try {
            const respons = await fetch(`/api/brukere/${brukerId}`, {
                method: "DELETE",
                credentials: "include",
            });
            if (!respons.ok) {
                throw new Error("Kunne ikke slette bruker");
            }
            alert("Bruker slettet!");
            // Oppdater listen over brukere
            hentBrukere();
        } catch (error) {
            console.error(error.message);
        }
    };

    return (
        <div>
          <h2 className="text-lg font-bold mb-4">Brukerliste</h2>
          {feilmelding && <p className="text-red-500">{feilmelding}</p>}
          <ul className="space-y-2">
            {brukere.map((bruker) => (
              <li key={bruker._id} className="p-2 border rounded">
                <p><strong>Brukernavn:</strong> {bruker.brukernavn}</p>
                <p><strong>E-post:</strong> {bruker.epost}</p>
                <p><strong>Rolle:</strong> {bruker.rolle}</p>
                <button 
                  className="bg-green-500 text-white px-2 py-1 rounded mr-2 hover:bg-blue-600"
                  onClick={() => handleEdit(bruker)}
                >
                  Rediger
                </button>
                <button 
                  className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                  onClick={() => handleDelete(bruker._id)}
                >
                  Slett
                </button>
              </li>
            ))}
          </ul>
        </div>
      );
}

export default BrukerListe;