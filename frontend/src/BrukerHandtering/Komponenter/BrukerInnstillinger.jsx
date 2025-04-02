//Author: Laurent Zogaj
import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import SletteBruker from "../SletteBruker.jsx";
import endreBruker from "../endringAvBruker.jsx";

const BrukerInnstillinger = ({ bruker, valgtUnderKategori, setBruker }) => {
  const [visSlettBoks, setVisSlettBoks] = useState(false);
  const [brukerInput, setBrukerInput] = useState(""); 
  const [passord, setPassord] = useState("");
  const [melding, setMelding] = useState("");
  const [brukernavn, setBrukernavn] = useState("");
  const [epost, setEpost] = useState("");
  const [gammeltPassord, setGammeltPassord] = useState("");
  const [nyttPassord, setNyttPassord] = useState("");
  const minne = useHistory();

  //Setter brukerinformasjonen i feltene som viser brukeren informasjonen
  useEffect(() => {
    if (bruker) {
      setBrukernavn(bruker.brukernavn || "");
      setEpost(bruker.epost || "");
    }
  }, [bruker]);

  //Sletting av registrert bruker som vi henter fra SletteBruker.jsx
  const handleSlettBruker = async (e) => {
    e.preventDefault();
    setMelding("");
    if (!brukerInput.trim().toLowerCase() || !passord.trim().toLowerCase()) {
      setMelding("Fyll inn brukernavn/e-post og passord.");
      return;
    } try {
      await SletteBruker(brukerInput, passord, setBruker, setMelding, minne);
    } catch (error) {
      console.error("Feil ved sletting av bruker:", error);
      setMelding("Feil ved sletting av bruker, sjekk brukernavn/epost og passord, prøv igjen deretter.");
    }
  };
  //Endring av brukerinformasjon under her:  IKKE KLAR
  const handleEndringAvBruker = async () => {
    setMelding(""); 
    if (!gammeltPassord || !brukernavn || !epost) {
      setMelding("Alle feltene må fylles ut.");
      return;
    }
    await endreBruker(brukernavn, epost, nyttPassord, gammeltPassord, setMelding, minne);
  };
  //Andre funksjoner for brukerinstillinger under her:




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
          {/* Viser om bruker er admin eller ikke under brukerinformasjon */}
          {bruker.rolle === "admin" ? (
            <p className="text-black text-center">
              Du er admin, og har tilgang til flere funksjoner
            </p>
          ) : (
            <p className="text-red-600 text-center">
              Du er ikke admin, og har ikke tilgang til flere funksjoner
            </p>
          )}
        </div>
      )}
      {/* !!!!!! Ikke klart enda bare gjort det klart, mangler rute i backend er på saken !!!!!!*/}
      {/* Endre min informasjon */}
      {valgtUnderKategori === "Endre min informasjon" && (
        <div className="space-y-4 w-full max-w-[400px]">
          <input
            type="text"
            value={brukernavn}
            onChange={(e) => setBrukernavn(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded"
            placeholder="Endre brukernavn"
          />
          <input
            type="email"
            value={epost}
            onChange={(e) => setEpost(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded"
            placeholder="Endre e-post"
          />
          <input
            type="password"
            value={gammeltPassord}
            onChange={(e) => setGammeltPassord(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded"
            placeholder="Gammelt passord"
          />
          <input
            type="password"
            value={nyttPassord}
            onChange={(e) => setNyttPassord(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded"
            placeholder="Nytt passord (valgfritt)"
          />
          {melding && <p className="mt-4 text-red-600 text-center">{melding}</p>}
          <button
            onClick={handleEndringAvBruker}
            className="bg-black text-white px-4 py-2 rounded w-full mt-4 hover:bg-gray-800"
          >
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
          {melding && (
          <p className="mt-4 text-red-600 text-center">{melding}</p>
          )}
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