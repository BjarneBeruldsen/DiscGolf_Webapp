// Author: Laurent Zogaj

import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { Link } from "react-router-dom";

const Innlogging = ({ setLoggetInnBruker }) => {
  const [bruker, setBruker] = useState("");
  const [passord, setPassord] = useState("");
  const [melding, setMelding] = useState("");
  const minne = useHistory(); 

  const handleSubmit = async (e) => {                   //https://react-hook-form.com/docs/useform/handlesubmit
    e.preventDefault();
    setMelding("");

    // Frontend validering
    const brukernavnRegex = /^[a-zA-Z0-9]{3,15}$/; // 3-15 tegn, kun bokstaver og tall
    const epostRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // E-post-validering
    const passordRegex = /^(?=.*[A-Z])(?=.*[-.@$!%*?&]).{8,}$/; // Minst 8 tegn, ett spesialtegn

    const erEpost = epostRegex.test(bruker);
    const erBrukernavn = brukernavnRegex.test(bruker);

    if (!erEpost && !erBrukernavn) {
        setMelding("Skriv inn enten brukernavn (3-15 tegn) eller en gyldig e-post.");
        return;
    }

    if (!passordRegex.test(passord)) {
        setMelding("Passord må være minst 8 tegn og ha ett spesialtegn.");
        return;
    }
    try {
      const respons = await fetch(`${process.env.REACT_APP_API_BASE_URL}/Innlogging`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bruker: bruker.trim().toLowerCase(), passord }), 
        credentials: "include",
      });

      const data = await respons.json();

      if (!respons.ok) {
          setMelding(data.errors ? data.errors.map(err => err.msg).join(", ") : data.error || "Innlogging feilet."); 
      } else {
          setLoggetInnBruker(data.bruker);
          localStorage.setItem("bruker", JSON.stringify(data.bruker));
          setMelding("Innlogging vellykket!");
          setTimeout(() => {
            minne.push("/Hjem");
            window.location.reload();
      }, 1000);
    }
  } catch {
    setMelding("Feil ved innlogging");
  }
};

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
            value={bruker}
            onChange={(e) => setBruker(e.target.value)}
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
          <button
            type="submit"
            className="bg-gray-600 text-white px-4 py-2 mt-4 rounded-lg w-full border border-gray-500"
          >
            Logg inn
          </button>
          <p className="text-blue-500 mt-4">
            <Link to="./registrering">Har du ikke konto? Opprett bruker her</Link>
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