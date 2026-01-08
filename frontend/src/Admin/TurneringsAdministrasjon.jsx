//Author: Severin Waller Sørensen

/* Denne filen er en React-komponent som gir funksjonalitet for å
 * administrere turneringer. Den lar brukeren opprette nye turneringer
 * og hente en liste over turneringer.
 

import React, { useEffect, useState } from "react";
import { apiKall } from '../utils/api';

const TurneringsAdministrasjon = () => {
  const [turneringer, setTurneringer] = useState([]);
  const [nyTurnering, setNyTurnering] = useState({
    navn: "",
    dato: "",
    bane: "",
    beskrivelse: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [visOpprettSkjema, setVisOpprettSkjema] = useState(false); // Ny state for å vise skjemaet

  // Håndterer endringer i input-feltene
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNyTurnering({ ...nyTurnering, [name]: value });
  };

  // POST-forespørsel: opprett en ny turnering
  const opprettTurnering = async () => {
    setIsLoading(true);
    try {
      const respons = await apiKall(`${process.env.REACT_APP_API_BASE_URL}/api/turneringer`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(nyTurnering),
      });

      if (!respons.ok) throw new Error("Kunne ikke opprette turnering");

      const opprettet = await respons.json();
      setTurneringer([...turneringer, opprettet]);
      setNyTurnering({ navn: "", dato: "", bane: "", beskrivelse: "" });
      setVisOpprettSkjema(false); // Gå tilbake til listen etter oppretting
    } catch (error) {
      console.error("Feil:", error.message);
    }
    setIsLoading(false);
  };

  // GET-forespørsel: hent alle turneringer
  const hentTurneringer = async () => {
    setIsLoading(true);
    try {
      const respons = await apiKall(`${process.env.REACT_APP_API_BASE_URL}/api/turneringer`);
      if (!respons.ok) throw new Error("Kunne ikke hente turneringer");

      const data = await respons.json();
      setTurneringer(data);
    } catch (error) {
      console.error("Feil ved henting av turneringer:", error.message);
    }
    setIsLoading(false);
  };

  // Kjør én gang når komponenten vises for å hente turneringer
  useEffect(() => {
    hentTurneringer();
  }, []);

  return (
    <div className="p-4 max-w-4xl mx-auto bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-semibold text-center mb-6">Administrer turneringer</h2>

      {visOpprettSkjema ? (
        // Skjema for å opprette ny turnering
        <div>
          <h3 className="text-xl font-semibold mb-4">Opprett ny turnering</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-lg font-medium text-gray-700">Navn:</label>
              <input
                type="text"
                name="navn"
                value={nyTurnering.navn}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
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
              />
            </div>
            <div className="flex justify-end gap-4 mt-4">
              <button
                onClick={opprettTurnering}
                className="custom-blue px-4 py-2 rounded-md text-white font-semibold shadow-sm hover:bg-blue-600 transition duration-200"
              >
                Opprett turnering
              </button>
              <button
                onClick={() => setVisOpprettSkjema(false)}
                className="bg-gray-500 text-white px-4 py-2 rounded-md font-semibold shadow-sm hover:bg-gray-600 transition duration-200"
              >
                Avbryt
              </button>
            </div>
          </div>
        </div>
      ) : (
        // Liste over eksisterende turneringer
        <div>
          <div className="flex justify-end mb-4">
          <button
            onClick={() => {
              console.log("Viser skjema for ny turnering");
              setVisOpprettSkjema(true);
            }}
            className="custom-blue px-4 py-2 rounded-md text-white font-semibold shadow-sm hover:bg-blue-600 transition duration-200"
          >
            Opprett ny turnering
          </button>
          </div>
          {isLoading ? (
            <div className="text-center text-gray-500">Laster...</div>
          ) : (
             // I likhet som brukerListe.jsx så hadde jeg problemer med Tailwind CSS
             // og spurte copilt om hjelp/inline CSS
            <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "1rem" }}>
              {turneringer.map((turnering) => (
                <div key={turnering.id} className="p-4 border rounded shadow-sm">
                  <h3 className="text-lg font-semibold">{turnering.navn}</h3>
                  <p><strong>Dato:</strong> {turnering.dato}</p>
                  <p><strong>Bane:</strong> {turnering.bane}</p>
                  <p><strong>Beskrivelse:</strong> {turnering.beskrivelse}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default TurneringsAdministrasjon;
*/