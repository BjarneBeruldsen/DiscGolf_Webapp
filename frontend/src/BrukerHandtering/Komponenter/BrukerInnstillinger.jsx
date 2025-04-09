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
  //Brukerinformasjon
  const [nyttBrukernavn, setNyttBrukernavn] = useState("");
  const [nyEpost, setNyEpost] = useState("");
  const [nyttPassord, setNyttPassord] = useState("");
  //Personlig informasjon
  const [fornavn, setFornavn] = useState("");
  const [etternavn, setEtternavn] = useState("");
  const [telefonnummer, setTelefonnummer] = useState("");
  const [bosted, setBosted] = useState("");
  
  const minne = useHistory();
  const erAdmin = bruker?.rolle === "admin" || bruker?.rolle === "hoved-admin";

  //Setter brukerinformasjonen i feltene som viser brukeren informasjonen
  useEffect(() => {
    if (bruker) {
      setNyttBrukernavn(bruker.brukernavn);
      setNyEpost(bruker.epost);
      setFornavn(bruker.fornavn);
      setEtternavn(bruker.etternavn);
      setTelefonnummer(bruker.telefonnummer);
      setBosted(bruker.bosted);
    }
  }, [bruker]);

  //Foreløpig så kommer ikke oppdatert info opp i UIet, jeg vet ish hvorfor og er på saken har bare ikke tid til å fikse det nå. Men bruker blir i hvert fall oppdatert i databasen. 

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
    if (nyttPassord && !passord) {
      setMelding("Du må oppgi ditt nåværende passord for å endre til nytt passord.");
      return;
    }
    await endreBruker(
      nyttBrukernavn, 
      nyEpost, 
      nyttPassord, 
      passord,
      fornavn, 
      etternavn, 
      telefonnummer, 
      bosted, 
      minne, 
      setMelding
    );
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
          {erAdmin && (
            <p className="text-blue-600">Du er registrert som: {bruker.rolle} og har tilgang til flere funksjoner.</p>
          )}
          {!erAdmin && (
            <p className="text-red-600">Du er registrert som: Bruker og har kun tilgang til enkle funksjoner.</p>
          )}
        </div>
      )}
      {/* Endre min informasjon */}
      {valgtUnderKategori === "Endre min informasjon" && (
        <div className="space-y-4 w-full max-w-[400px]">
          <h3 className="text-lg font-bold text-black mb-3">Endre brukerinformasjon</h3>
          {/* Brukerkonto informasjon */}
          <p className="text-sm font-medium text-gray-700">Brukerkonto:</p>
          <input
            type="text"
            value={nyttBrukernavn}
            onChange={(e) => setNyttBrukernavn(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded"
            placeholder="Brukernavn"
          />
          <input
            type="email"
            value={nyEpost}
            onChange={(e) => setNyEpost(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded"
            placeholder="E-post"
          />
          {/* Personlig informasjon */}
          <p className="text-sm font-medium text-gray-700 mt-2">Personlig informasjon:</p>
          <input
            type="text"
            value={fornavn}
            onChange={(e) => setFornavn(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded"
            placeholder="Fornavn"
          />
          <input
            type="text"
            value={etternavn}
            onChange={(e) => setEtternavn(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded"
            placeholder="Etternavn"
          />
          <input
            type="text"
            value={telefonnummer}
            onChange={(e) => setTelefonnummer(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded"
            placeholder="Telefonnummer"
          />
          <input
            type="text"
            value={bosted}
            onChange={(e) => setBosted(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded"
            placeholder="Bosted"
          />
          {/* Passord */}
          <p className="text-sm font-medium text-gray-700 mt-2">Endre passord:</p>
          <input
            type="password"
            value={passord}
            onChange={(e) => setPassord(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded"
            placeholder="Nåværende passord (oppgis ved endring av passord)"
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