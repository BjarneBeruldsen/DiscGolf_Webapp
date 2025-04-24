// Authors: Bjarne Hovd Beruldsen & Severin Waller Sørensen

/* Denne filen er en React-komponent som henter en liste over turneringer
 */

import React, { useEffect, useState } from "react";
import { useTranslation } from 'react-i18next';

const Turneringerliste = () => {
  const [turneringer, setTurneringer] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [feilmelding, setFeilmelding] = useState("");
  const { t } = useTranslation();

  const hentTurneringer = async () => {
    setIsLoading(true); 
    try {
      const respons = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/turneringer`, {
        method: "GET",
        credentials: "include",
      });

      // Sjekker om responsen er vellykket
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

  useEffect(() => {
    hentTurneringer();
  }, []);

  return ( // Bruk/hjelp av KI (Copilot) for design/implementering av CSS
    <div className="p-6 bg-gray-100">
      <h1 className="text-3xl font-bold text-center mb-6 text-gray-800">{t('Turneringer')}</h1>
      {feilmelding && <p className="text-red-500 text-center">{feilmelding}</p>}
      {isLoading ? (
        <div className="text-center text-gray-500">{t('Laster...')}</div>
      ) : (
        <div className="grid grid-cols-2 gap-6">
          {turneringer.length > 0 ? (
            turneringer.map((turnering) => (
              <div
                key={turnering._id}
                className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
              >
                <h3 className="text-xl font-semibold text-gray-800 mb-2">{turnering.navn}</h3>
                <p className="text-gray-600 mb-1">
                  <strong>{t('Dato')}:</strong> {turnering.dato}
                </p>
                <p className="text-gray-600 mb-1">
                  <strong>{t('Bane')}:</strong> {turnering.bane}
                </p>
                <p className="text-gray-600 mb-4">
                  <strong>{t('Beskrivelse')}:</strong> {turnering.beskrivelse}
                </p>
                <button className="bg-blue-500 text-white px-4 py-2 rounded-md font-semibold hover:bg-blue-600 transition duration-200">
                  {t('Se detaljer')}
                </button>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-500 col-span-full">{t('Ingen turneringer funnet.')}</p>
          )}
        </div>
      )}
    </div>
  );
};

export default Turneringerliste;