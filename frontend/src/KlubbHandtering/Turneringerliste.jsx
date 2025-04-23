// Author: Bjarne Hovd Beruldsen

import React, { useEffect, useState } from "react";

const Turneringerliste = () => {
  const [turneringer, setTurneringer] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [feilmelding, setFeilmelding] = useState("");

  // Henter turneringer fra backend
  const hentTurneringer = async () => {
    setIsLoading(true);
    try {
      const respons = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/turneringer`, {
        method: "GET",
        credentials: "include",
      });

      if (!respons.ok) {
        throw new Error("Kunne ikke hente turneringer");
      }

      const data = await respons.json();
      setTurneringer(data);
    } catch (error) {
      setFeilmelding(error.message);
    }
    setIsLoading(false);
  };

  // Kjør én gang når komponenten vises
  useEffect(() => {
    hentTurneringer();
  }, []);

  return (
    <div className="h-[100vh] p-4">
      <h1 className="text-2xl font-bold mb-4">Turneringer</h1>
      {feilmelding && <p className="text-red-500">{feilmelding}</p>}
      {isLoading ? (
        <div className="text-center text-gray-500">Laster...</div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "1rem" }}>
          {turneringer.length > 0 ? (
            turneringer.map((turnering) => (
              <div key={turnering._id} className="p-4 border rounded shadow-sm">
                <h3 className="text-lg font-semibold">{turnering.navn}</h3>
                <p><strong>Dato:</strong> {turnering.dato}</p>
                <p><strong>Bane:</strong> {turnering.bane}</p>
                <p><strong>Beskrivelse:</strong> {turnering.beskrivelse}</p>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-500">Ingen turneringer funnet.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default Turneringerliste;