//Author: Laurent Zogaj
/*
Denne filen håndterer det som kommer frem i UIet på medlemskap i brukerinstillinger
Samt at den innhenter funksjoner fra SletteBruker.jsx og endreBruker.jsx.
Ikke fått oversetting til å funke her dessverre, fikk heller ikke tid til å debugge det. Dårlig prioritering fra min side.
*/
import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import SletteBruker from "../SletteBruker.jsx";
import endreBruker from "../endringAvBruker.jsx";

const BrukerInnstillinger = ({ bruker, valgtUnderKategori, setBruker }) => {
  const [visSlettBoks, setVisSlettBoks] = useState(false); //Viser eller skjuler slettingsboksen
  const [laster, setLaster] = useState(false); //En laster som brukes for å vise at noe skjer
  //Default verdier som er satt til tomme strenger
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
  //Sjekker om hva slags rolle bruker har
  //const hvaErBruker = bruker && ["Admin", "Hoved-admin", "Klubbleder", "Medlem"].includes(bruker.rolle);

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

  //Sletting av registrert bruker som vi henter fra SletteBruker.jsx
  const handleSlettBruker = async (e) => {
    e.preventDefault();
    setMelding("");
    if (!brukerInput.trim().toLowerCase() || !passord.trim().toLowerCase()) {
      setMelding("Fyll inn brukernavn/e-post og passord.");
      return;
    }
      setLaster(true);
    try {
      await SletteBruker(brukerInput, passord, setBruker, setMelding, minne); //Slettebruker fra SletteBruker.jsx
    } catch (error) {
      console.error("Feil ved sletting av bruker:", error);
      setMelding("Feil ved sletting av bruker, sjekk brukernavn/epost og passord, prøv igjen deretter.");
    } finally {
      setLaster(false);
    }
  };
  //Endring av brukerinformasjon under her: 
  const handleEndringAvBruker = async () => {
    setMelding("");
    const regex = /^[a-zA-ZæøåÆØÅ]+$/; //Frontend validering 
    const regexTelefon = /^[0-9+\s-]{8,15}$/; //Telefonnummer validering   
    //Validerer inputfeltene, vi tilatter ikke at brukeren sender inn tomme felt 
    if (!nyttBrukernavn || nyttBrukernavn.trim() === "" || !nyEpost || nyEpost.trim() === "") {
      setMelding("Brukernavn og e-post kan ikke være tomme.");
      return;
    }
    //Validerer at fornavn og etternavn kun inneholder bokstaver
    if ((fornavn && !regex.test(fornavn)) || (etternavn && !regex.test(etternavn)) || ((bosted && !regex.test(bosted)))) {
      setMelding("Fornavn, etternavn og bosted kan kun inneholde bokstaver.");
      return;
    }
    //Validerer at telefonnummeret er gyldig
    if (telefonnummer && !regexTelefon.test(telefonnummer)) {
      setMelding("Telefonnummer må være et gyldig format.");
      return;
    }
    //Bekreftelse av passord for å endre det
    if (nyttPassord && !passord) {
      setMelding("Du må oppgi ditt nåværende passord for å endre til nytt passord.");
      return;
    }
    //Her konverterer vi tomme strenger til null, slik at fjerning i backend kan fjerne unødvendige felter som er tomme
    //Denne metoden ble foreslått av Copilot 
    const fornavnTilBackend = fornavn === "" ? null : fornavn;
    const etternavnTilBackend = etternavn === "" ? null : etternavn;
    const telefonnummerTilBackend = telefonnummer === "" ? null : telefonnummer;
    const bostedTilBackend = bosted === "" ? null : bosted;
    
    //Kaller på endreBruker funksjonen som henter fra backend og oppdaterer informasjonen
    await endreBruker( //EndreBruker fra endreBruker.jsx
      nyttBrukernavn, 
      nyEpost, 
      nyttPassord, 
      passord,
      fornavnTilBackend,  
      etternavnTilBackend,  
      telefonnummerTilBackend,  
      bostedTilBackend,  
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
          {/* Viser hva slags rolle bruker har */}
          {bruker && bruker.rolle && (
          <p className="text-blue-600">Du er registrert som: {bruker.rolle} og har tilgang til ulike funksjoner.</p>
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
            disabled={laster}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded mb-3"
          />
          <input
            type="password"
            placeholder="Bekreft passord"
            value={passord}
            onChange={(e) => setPassord(e.target.value)}
            disabled={laster}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded"
          />
          <button
            onClick={handleSlettBruker}
            disabled={laster}
            className="bg-red-600 text-white px-4 py-2 rounded w-full mt-4 hover:bg-red-700"
          >
            {laster ? "Laster..." : "Bekreft Sletting"}
          </button>
          {!laster && (
          <button
            onClick={() => setVisSlettBoks(false)}
            className="bg-gray-300 text-black px-4 py-2 rounded w-full mt-2 hover:bg-gray-400"
          >
            Avbryt
            </button>
          )}
          {laster && ( 
            <p className="mt-4 text-gray-600 text-center">Sletter bruker, vennligst vent...</p>
          )}
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