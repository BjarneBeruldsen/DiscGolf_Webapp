//Author: Laurent Zogaj
import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import SletteBruker from "../SletteBruker.jsx";

const BrukerInnstillinger = ({ bruker, valgtUnderKategori, setBruker }) => {
  const [visSlettBoks, setVisSlettBoks] = useState(false);
  const [brukerInput, setBrukerInput] = useState(""); 
  const [passord, setPassord] = useState("");
  const [melding, setMelding] = useState("");
  const history = useHistory();

  //Sletting av registrert bruker som vi henter fra SletteBruker.jsx
  const handleSlettBruker = async (e) => {
    e.preventDefault();
    setMelding("");
    if (!brukerInput.trim() || !passord.trim()) {
      setMelding("Fyll inn brukernavn/e-post og passord.");
      return;
    }
    await SletteBruker(brukerInput, passord, setBruker, setMelding, history);
  };
  //Endring av brukerinformasjon under her:




  //Andre funksjoner under her:




  //Styling og design for hver funksjon/komponent
  return (
    <div className="bg-white shadow-xl rounded-lg p-6 w-full max-w-[500px] flex flex-col items-center">
      {/* Min informasjon */}
      {valgtUnderKategori === "Min informasjon" && (
        <div className="space-y-4 w-full max-w-[400px]">
          <input
            type="text"
            value={bruker.brukernavn}
            readOnly
            className="w-full px-3 py-2 border border-gray-300 rounded bg-gray-100"
          />
          <input
            type="email"
            value={bruker.epost}
            readOnly
            className="w-full px-3 py-2 border border-gray-300 rounded bg-gray-100"
          />
          <p className="text-gray-600">Her er din registrerte brukerinformasjon</p>
        </div>
      )}
      {/* Endre min informasjon */}
      {valgtUnderKategori === "Endre min informasjon" && (
        <div className="space-y-4 w-full max-w-[400px]">
          <p className="text-gray-600">Endring av brukerinformasjon (ikke implementert ennå).</p>
          <button className="bg-black text-white px-4 py-2 rounded w-full max-w-[400px] hover:bg-gray-800">
            Lagre Endringer
          </button>
        </div>
      )}
      
      {/* Slett bruker */}
      {valgtUnderKategori === "Slett bruker" && !visSlettBoks && (
        <button
          onClick={() => setVisSlettBoks(true)}
          className="bg-red-600 text-white px-4 py-2 rounded w-full max-w-[400px] hover:bg-red-700"
        >
          Slett Bruker
        </button>
      )}

      {valgtUnderKategori === "Slett bruker" && visSlettBoks && (
        <div className="bg-white p-6 rounded-lg border border-gray-300 shadow-md w-full max-w-[400px] mt-4">
          <h3 className="text-lg font-bold text-black mb-4 text-center">Bekreft sletting</h3>
          <p className="text-gray-600 mb-4 text-center">Denne handlingen kan ikke angres!</p>
          <input
            type="text"
            placeholder="Skriv inn brukernavn eller epost"
            value={brukerInput}
            onChange={(e) => setBrukerInput(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded mb-3"
          />
          <input
            type="password"
            placeholder="Bekreft passord"
            value={passord}
            onChange={(e) => setPassord(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded"
          />
          <button
            onClick={handleSlettBruker}
            className="bg-red-600 text-white px-4 py-2 rounded w-full mt-4 hover:bg-red-700"
          >
            Bekreft Sletting
          </button>
          <button
            onClick={() => setVisSlettBoks(false)}
            className="bg-gray-300 text-black px-4 py-2 rounded w-full mt-2 hover:bg-gray-400"
          >
            Avbryt
          </button>
          {melding && <p className="mt-4 text-red-600 text-center">{melding}</p>}
        </div>
      )}

      {/* Fallback melding */}
      {!["Min informasjon", "Endre min informasjon", "Slett bruker"].includes(valgtUnderKategori) && (
        <p className="text-gray-600">Velg en underkategori for ditt behov</p>
      )}
    </div>
  );
};

export default BrukerInnstillinger;