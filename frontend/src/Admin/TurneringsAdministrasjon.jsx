//Author: Severin Waller Sørensen
import React, { useEffect, useState } from "react";

const TurneringsAdministrasjon = () => {
  const [turneringer, setTurneringer] = useState([]);
  const [nyTurnering, setNyTurnering] = useState({
    navn: "",
    dato: "",
    bane: "",
    beskrivelse: "",
  });
  const [isLoading, setIsLoading] = useState(false); // Definer isLoading her

  // Håndterer endringer i input-feltene
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNyTurnering({ ...nyTurnering, [name]: value });
  };

  // POST-forespørsel: opprett en ny turnering
  const opprettTurnering = async () => {
    setIsLoading(true); // Sett isLoading til true før oppretting
    try {
      const respons = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/turneringer`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(nyTurnering),
        credentials: "include",
      });

      if (!respons.ok) throw new Error("Kunne ikke opprette turnering");

      const opprettet = await respons.json();
      setTurneringer([...turneringer, opprettet]); // Legg til i lista
      setNyTurnering({ navn: "", dato: "", bane: "", beskrivelse: "" }); // Tøm skjema
      alert("Turnering opprettet!");
    } catch (error) {
      console.error("Feil:", error.message);
    }
    setIsLoading(false); // Sett isLoading til false etter oppretting
  };

  // GET-forespørsel: hent alle turneringer
  const hentTurneringer = async () => {
    setIsLoading(true); // Sett isLoading til true før henting
    try {
      const respons = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/turneringer`, {
        method: "GET",
        credentials: "include",
      });
      if (!respons.ok) throw new Error("Kunne ikke hente turneringer");

      const data = await respons.json();
      setTurneringer(data);
    } catch (error) {
      console.error("Feil ved henting av turneringer:", error.message);
    }
    setIsLoading(false); // Sett isLoading til false etter henting
  };

  // Kjør én gang når komponenten vises for å hente turneringer
  useEffect(() => {
    hentTurneringer();
  }, []);

  return (
    <div className="p-4 max-w-2xl mx-auto bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-semibold text-center mb-6">Opprett ny turnering</h2>
      {isLoading && <div className="text-center text-gray-500">Laster...</div>}
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
            >Opprett turnering
          </button>
        </div>
      </div>
    </div>
  );
};

export default TurneringsAdministrasjon;
