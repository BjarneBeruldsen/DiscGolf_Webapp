//Author: Severin Waller Sørensen

/* Denne filen er en React-komponent sfor å opprette nye turneringer
 */

import React, { useEffect, useState } from "react";

const LagTurnering = () => {
  const [turneringer, setTurneringer] = useState([]);
  const [feilmelding, setFeilmelding] = useState("");
  const [nyTurnering, setNyTurnering] = useState({
    navn: "",
    dato: "",
    bane: "",
    beskrivelse: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  // Funksjon for å håndtere endringer i inputfeltene
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNyTurnering({ ...nyTurnering, [name]: value });
  };

  // Opprett en ny turnering
  const opprettTurnering = async () => {
    setIsLoading(true);
    try {
      const respons = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/turneringer`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(nyTurnering),
        credentials: "include",
      });

      if (!respons.ok) {
        throw new Error("Kunne ikke opprette turnering");
      }

      const opprettet = await respons.json();
      console.log("Turnering opprettet:", opprettet);
    } catch (error) {
      console.error("Feil ved opprettelse av turnering:", error.message);
      setFeilmelding(error.message);
    }
    setIsLoading(false);
  };

  return ( // Bruk/hjelp av KI (Copilot) for design av skjema/implementering av CSS
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h3 className="text-2xl font-bold mb-6 text-gray-800 text-center">Opprett ny turnering</h3>
      {feilmelding && <p className="text-red-500 text-center mb-4">{feilmelding}</p>}
      <div className="space-y-6">
        <div>
          <label className="block text-lg font-medium text-gray-700">Navn:</label>
          <input
            type="text"
            name="navn"
            value={nyTurnering.navn}
            onChange={handleInputChange}
            className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Skriv inn navn på turneringen"
          />
        </div>
        <div>
          <label className="block text-lg font-medium text-gray-700">Dato:</label>
          <input
            type="date"
            name="dato"
            value={nyTurnering.dato}
            onChange={handleInputChange}
            className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-lg font-medium text-gray-700">Bane:</label>
          <input
            type="text"
            name="bane"
            value={nyTurnering.bane}
            onChange={handleInputChange}
            className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Skriv inn navnet på banen"
          />
        </div>
        <div>
          <label className="block text-lg font-medium text-gray-700">Beskrivelse:</label>
          <textarea
            name="beskrivelse"
            value={nyTurnering.beskrivelse}
            onChange={handleInputChange}
            className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows="4"
            placeholder="Skriv inn en kort beskrivelse av turneringen"
          />
        </div>
        <div className="flex justify-end gap-4">
          <button
            onClick={opprettTurnering}
            className="bg-blue-500 text-white px-6 py-3 rounded-md font-semibold shadow-sm hover:bg-blue-600 transition duration-200"
            disabled={isLoading}
          >
            {isLoading ? "Lagrer..." : "Opprett turnering"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default LagTurnering;