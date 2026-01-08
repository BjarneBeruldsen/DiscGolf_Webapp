//Author: Severin Waller Sørensen

/* Denne filen er en React-komponent som henter og viser systemloggdata
 * fra backend i en tabell.
 */

import React, { useEffect, useState } from "react";
import { apiKall } from '../utils/api';

const SystemLogg = () => {
  const [logg, setLogg] = useState([]); 
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Henter systemloggdata fra backend
  const hentSystemlogg = async () => {
    try {
      setIsLoading(true);
      const respons = await apiKall(`${process.env.REACT_APP_API_BASE_URL}/api/systemlogg`);

      if (!respons.ok) {
        throw new Error("Kunne ikke hente systemloggdata");
      }

      const data = await respons.json();
      setLogg(data);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    hentSystemlogg();
  }, []);

  // Funksjon for å tømme systemloggen
  const handleClearLogg = async () => {
    const bekreft = window.confirm("Er du sikker på at du vil tømme hele systemloggen? Denne handlingen kan ikke angres.");
    if (!bekreft) return;

    try {
      const respons = await apiKall(`${process.env.REACT_APP_API_BASE_URL}/api/systemlogg`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json"
        }
      });

      if (!respons.ok) {
        throw new Error("Kunne ikke tømme systemloggen");
      }

      // Hent oppdatert logg etter sletting
      await hentSystemlogg();
    } catch (err) {
      setError(err.message);
    }
  };
  // Bruk/hjelp av KI (Copilot) for design/implementering av CSS
  // Spurte KI (Copilot) om hjelp til å få tabell i synkende rekkefølge
  // sort({ tidspunkt: -1 })  i backend (Systemlogg.js) fungerte ikke slik jeg ønsket
  return ( 
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-bold">Systemlogg</h2>
        <button
          onClick={handleClearLogg}
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition-colors"
        >
          Tøm systemlogg
        </button>
      </div>

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