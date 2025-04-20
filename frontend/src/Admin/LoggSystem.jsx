//Author: Severin Waller Sørensen

/* Denne filen er en React-komponent som henter og viser systemloggdata
 * fra backend i en tabell.
 */

import React, { useEffect, useState } from "react";

const SystemLogg = () => {
  const [logg, setLogg] = useState([]); // State for systemloggdata
  const [isLoading, setIsLoading] = useState(true); // State for lasting
  const [error, setError] = useState(null); // State for feil

  // Henter systemloggdata fra backend
  useEffect(() => {
    const hentSystemlogg = async () => {
      try {
        const respons = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/systemlogg`, {
          method: "GET",
          credentials: "include",
        });

        if (!respons.ok) {
          throw new Error("Kunne ikke hente systemloggdata");
        }

        const data = await respons.json();
        setLogg(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    hentSystemlogg();
  }, []);

  // Spurte KI (Copilot) om hjelp til å få tabell i synkende rekkefølge
  // sort({ tidspunkt: -1 })  i backend (Systemlogg.js) fungerte ikke slik jeg ønsket
  return ( 
    <div>
      <h2 className="text-lg font-bold mb-4">Systemlogg</h2>

      {isLoading ? (
        <p className="text-gray-500">Laster systemlogg...</p>
      ) : error ? (
        <p className="text-red-500">Feil: {error}</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="table-auto w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-gray-300 px-4 py-2 text-left">Tidspunkt</th>
                <th className="border border-gray-300 px-4 py-2 text-left">Bruker</th>
                <th className="border border-gray-300 px-4 py-2 text-left">Handling</th>
                <th className="border border-gray-300 px-4 py-2 text-left">Detaljer</th>
              </tr>
            </thead>
            <tbody>
            {logg
                .sort((a, b) => new Date(b.tidspunkt) - new Date(a.tidspunkt)) // Sorter i synkende rekkefølge
                .map((hendelse, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="border border-gray-300 px-4 py-2">{new Date(hendelse.tidspunkt).toLocaleString()}</td>
                    <td className="border border-gray-300 px-4 py-2">{hendelse.bruker}</td>
                    <td className="border border-gray-300 px-4 py-2">{hendelse.handling}</td>
                    <td className="border border-gray-300 px-4 py-2">{hendelse.detaljer}</td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default SystemLogg;