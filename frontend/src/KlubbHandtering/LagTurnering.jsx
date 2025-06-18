//Author: Severin Waller Sørensen & Laurent Zogaj

/* Denne filen er en React-komponent for å opprette nye turneringer
 */

import { useState } from "react";
import { useTranslation } from 'react-i18next';

const LagTurnering = () => {
  const { t } = useTranslation();
  const [turneringer, setTurneringer] = useState([]);
  const [melding, setMelding] = useState({ text: "", type: "" });
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
    if (melding.text) setMelding({ text: "", type: "" });
  };

  // Opprett en ny turnering
  const opprettTurnering = async () => {
    setIsLoading(true);
    setMelding({ text: "", type: "" });
    try {
      const respons = await fetch(
        `${process.env.REACT_APP_API_BASE_URL}/api/turneringer`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(nyTurnering),
          credentials: "include",
        }
      );
      const data = await respons.json();
      if (!respons.ok) {
        setMelding({
          text: `${data.error} \nKan derfor ikke opprette turnering`,
          type: "error"
        });
      } else {
        setTurneringer([...turneringer, data]);
        setMelding({ text: t('Turnering opprettet!'), type: "success" });
        setNyTurnering({ navn: "", dato: "", bane: "", beskrivelse: "" });
        setTimeout(() => window.location.reload(), 1000);
      }
    } catch (error) {
      console.error("Feil ved opprettelse av turnering:", error.message);
      setMelding({ text: error.message, type: "error" });
    }
    setIsLoading(false);
  };

  return ( // Bruk/hjelp av KI (Copilot) for design av skjema/implementering av CSS
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h3 className="text-2xl font-bold mb-6 text-gray-800 text-center">
        {t('Opprett ny turnering')}
      </h3>
      {melding.text && (
        <p className={`text-center mb-4 ${melding.type === 'error' ? 'text-red-500' : 'text-green-600'}`}>
          {melding.text}
        </p>
      )}
      <div className="space-y-6">
        <div>
          <label className="block text-lg font-medium text-gray-700">{t('Navn')}:</label>
          <input
            type="text"
            name="navn"
            value={nyTurnering.navn}
            onChange={handleInputChange}
            className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder={t('Skriv inn navn på turneringen')}
          />
        </div>
        <div>
          <label className="block text-lg font-medium text-gray-700">{t('Dato')}:</label>
          <input
            type="date"
            name="dato"
            value={nyTurnering.dato}
            onChange={handleInputChange}
            className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-lg font-medium text-gray-700">{t('Bane')}:</label>
          <input
            type="text"
            name="bane"
            value={nyTurnering.bane}
            onChange={handleInputChange}
            className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder={t('Skriv inn navnet på banen')}
          />
        </div>
        <div>
          <label className="block text-lg font-medium text-gray-700">{t('Beskrivelse')}:</label>
          <textarea
            name="beskrivelse"
            value={nyTurnering.beskrivelse}
            onChange={handleInputChange}
            className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows="4"
            placeholder={t('Skriv inn en kort beskrivelse av turneringen')}
          />
        </div>
        <div className="flex justify-end gap-4">
          <button
            onClick={opprettTurnering}
            className="bg-blue-500 text-white px-6 py-3 rounded-md font-semibold shadow-sm hover:bg-blue-600 transition duration-200"
            disabled={isLoading}
          >
            {isLoading ? t('Lagrer...') : t('Opprett turnering')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default LagTurnering;