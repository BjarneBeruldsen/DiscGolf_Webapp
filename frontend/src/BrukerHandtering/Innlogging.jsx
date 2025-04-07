//Author: Laurent Zogaj

import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { Link } from "react-router-dom";

const Innlogging = ({ setLoggetInnBruker }) => {
  const [brukernavn, setBrukernavn] = useState("");
  const [passord, setPassord] = useState("");
  const [melding, setMelding] = useState("");
  const minne = useHistory(); 
  const [tall, setTall] = useState(Math.floor(Math.random() * 99) + 1);
  const [tallInput, setTallInput] = useState("");

  //Skjemafunksjon for innlogging
  const handleSubmit = async (event) => {              //https://legacy.reactjs.org/docs/forms.html
    event.preventDefault();
    setMelding("");

    //Frontend validering med regex
    const brukernavnRegex = /^[a-zA-Z0-9]{3,15}$/; //3-15 tegn, kun bokstaver og tall
    const epostRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; //E-post validering sjekker @ og .
    const passordRegex = /^(?=.*[A-Z])(?=.*[-.@$!%*?&]).{8,20}$/; //Minst 8 tegn og maks 20, ett spesialtegn
    const tallRegex = /^[0-9]+$/; //Sjekker at input er tall

    const erEpost = epostRegex.test(brukernavn);
    const erBrukernavn = brukernavnRegex.test(brukernavn);
    const erTall = tallRegex.test(tallInput);

    //Sjekker om brukernavn, epost og passord er gyldig i henhold til regex
    if (!erEpost && !erBrukernavn) {
      setMelding("Skriv inn enten brukernavn (3-15 tegn) eller en gyldig e-post.");
      return;
    }
    if (!passordRegex.test(passord)) {
      setMelding("Passord må være minst 8 tegn og maks 20 tegn og ha ett spesialtegn.");
      return;
    }
    if (!erTall || tallInput.length > 2) {
      setMelding("Tallet må være et gyldig tall.");
      return;
    }
    //Enkel captcha hvis feil tall kan ikke brukeren logge inn
    if (parseInt(tallInput) !== tall) {
      return;
    }
    //Kontakter backend for innlogging
    try {
      const respons = await fetch(`${process.env.REACT_APP_API_BASE_URL}/Innlogging`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ brukernavn, passord }),
        credentials: "include",
      });
      //Henter respons fra backend
      const data = await respons.json();
      if (!respons.ok) {
        console.error("Innloggingsfeil:", data);
        setTall(Math.floor(Math.random() * 99) + 1);
        setTallInput("");
        setMelding(data.error || "Feil ved innlogging. Sjekk brukernavn og passord, prøv igjen deretter.");
      } else {
        setMelding("Innlogging vellykket!");
        setTimeout(() => {
          setLoggetInnBruker(data.bruker);
          setTimeout(() => minne.push("/Hjem"), 1000);
          window.location.reload();
        }, 100);
      }
    } catch (error) {
      console.error("Innloggingsfeil:", error);
      setTall(Math.floor(Math.random() * 99) + 1);
      setTallInput("");
      setMelding("Feil ved innlogging. Prøv igjen.");
    }
  };

//Sjekker om det er gyldig og gir deretter beskjed i UI via brukergrensesnittet nedenfor
const tallRiktig = tallInput !== "" && parseInt(tallInput) === tall; 
//Styling og design for innloggingsskjema
  return (
    <header>
      <div 
        className="flex justify-center items-center min-h-screen bg-cover bg-center relative"
        style={{ backgroundImage: `url('https://images.unsplash.com/photo-1616840388998-a514fe2175b9?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')` }}
      >
        <form
          onSubmit={handleSubmit}
          className="flex flex-col items-center bg-white p-8 rounded-lg shadow-md w-80"
        >
          <input
            type="text"
            placeholder="Brukernavn eller e-post"
            value={brukernavn}
            onChange={(e) => setBrukernavn(e.target.value)}
            required
            className="px-4 py-3 mb-3 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <input
            type="password"
            placeholder="Passord"
            value={passord}
            onChange={(e) => setPassord(e.target.value)}
            required
            className="px-5 py-3 m-2 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <label className="text-gray-700 mt-4">
            Skriv inn tallet for å logge inn: {tall} 
          </label>
          <input 
            type="number"
            id="input"
            placeholder="Skriv inn tallet"
            value={tallInput}
            onChange={(e) => setTallInput(e.target.value)}
            required
            className="px-5 py-3 m-2 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          {tallInput !== "" && (
            tallRiktig ? 
            <p className="text-green-500 mt-2">Tallet er riktig</p> :
            <p className="text-red-500 mt-2">Tallet er feil</p>
          )}
          <button
            type="submit"
            className="bg-gray-600 text-white px-4 py-2 mt-4 rounded-lg w-full border border-gray-500"
          >
            Logg inn
          </button>
          <p className="text-blue-500 mt-4">
            <Link to="./registrering">Har du ikke konto? Opprett bruker her</Link>
          </p>
          <p className="text-blue-500 mt-4">
            <Link to="">Glemt passord?</Link>
          </p>
          {melding && (
            <p className="mt-4 text-red-500 text-center">
              {melding}
            </p>
          )}
        </form>
      </div>
    </header>
  );
};

export default Innlogging;