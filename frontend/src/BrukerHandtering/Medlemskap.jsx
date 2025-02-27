//Author: Laurent Zogaj

import React, { useState, useEffect } from "react";
import "../App.css";

const Medlemskap = ({ loggetInnBruker }) => {
  const [bruker, setBruker] = useState(null);
  const [valgtKategori, setValgtKategori] = useState("brukerinnstillinger");
  const [visSlettBoks, setVisSlettBoks] = useState(false);
  const [brukernavnInput, setBrukernavnInput] = useState("");
  const [passord, setPassord] = useState("");
  const [melding, setMelding] = useState("");
  const [venter, setVenter] = useState(true);

  useEffect(() => {
    if (!loggetInnBruker?.epost) {
      const lagretBruker = localStorage.getItem("bruker");
      if (lagretBruker) {
        setBruker(JSON.parse(lagretBruker));
      }
    } else {
      setBruker(loggetInnBruker);
    }
    setVenter(false);
  }, [loggetInnBruker]);
  if (venter) {
    return <p className="text-center text-gray-700 mt-10">Laster inn...</p>;
  }
  if (!bruker) {
    window.location.href = "/Innlogging";
    return null;
  }
  const byttKategori = (kategori) => {
    setVisSlettBoks(false);
    setValgtKategori(kategori);
  };
  const handleSlettBruker = async (e) => {
    e.preventDefault();
    setMelding("");
    if (brukernavnInput !== bruker.bruker) {
      setMelding("Brukernavnet stemmer ikke.");
      return;
    }
    try {
      const respons = await fetch(`${process.env.REACT_APP_API_BASE_URL}/SletteBruker`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ bruker: bruker.bruker, passord }),
      });
      const data = await respons.json();  
      if (respons.ok) {
        localStorage.removeItem("bruker");
        window.location.href = "/Hjem";
        window.location.reload();
      } else {
        setMelding(data.error);
      }
    } catch {
      setMelding("Uventet feil, prøv igjen.");
    }
  };

  //Bruker app.css for noe styling og egendefinerte klasser
  return (
    <div
      className="outer-wrapper"
      style={{
        backgroundImage: `url('https://images.unsplash.com/photo-1616840388998-a514fe2175b9?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3')`,
      }}
    >
      {/* Venstre meny */}
      <div className="menu-box">
        {/* Mobilmeny */}
        <div className="mobile-menu lg:hidden">
          <h2 className="text-lg font-bold mb-4">Innstillinger</h2>
          <ul className="space-y-4">
            {["brukerinnstillinger", "personvern", "sikkerhet", "min klubb"].map((kategori) => (
              <li key={kategori}>
                <button
                  className={`w-full text-left p-2 rounded transition duration-200 ${
                    valgtKategori === kategori
                      ? "bg-gray-100 font-semibold text-black"
                      : "hover:bg-gray-100 text-gray-700"
                  }`}
                  onClick={() => byttKategori(kategori)}
                >
                  {kategori.charAt(0).toUpperCase() + kategori.slice(1)}
                </button>
              </li>
            ))}
          </ul>
        </div>
  
        {/* PCmeny */}
        <div className="desktop-menu hidden lg:block">
          <h2 className="text-lg font-bold mb-4">Innstillinger</h2>
          <ul className="space-y-10">
            {["brukerinnstillinger", "personvern", "sikkerhet", "min klubb"].map((kategori) => (
              <li key={kategori}>
                <button
                  className={`w-full text-left p-3 rounded transition duration-200 ${
                    valgtKategori === kategori
                      ? "bg-gray-100 font-semibold text-black"
                      : "hover:bg-gray-100 text-gray-700"
                  }`}
                  onClick={() => byttKategori(kategori)}
                >
                  {kategori.charAt(0).toUpperCase() + kategori.slice(1)}
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
  
      {/* Høyre meny som viser hovedinnhold for valgt kategori */}
      <div className="content-box flex flex-col items-center justify-center gap-6">
        <h2 className="text-xl font-bold text-black mb-4">
          {valgtKategori.charAt(0).toUpperCase() + valgtKategori.slice(1)}
        </h2>
  
        {valgtKategori === "brukerinnstillinger" && !visSlettBoks && (
          <>
            <div className="space-y-4 w-[400px]">
              <input
                type="text"
                value={bruker.bruker}
                readOnly
                className="w-full px-3 py-2 border border-gray-300 rounded bg-gray-100"
              />
              <input
                type="email"
                value={bruker.epost}
                readOnly
                className="w-full px-3 py-2 border border-gray-300 rounded bg-gray-100"
              />
              <input
                type="password"
                placeholder="Nytt passord (funker ikke enda)"
                className="w-full px-3 py-2 border border-gray-300 rounded"
              />
              <button className="bg-black text-white px-4 py-2 rounded w-full hover:bg-gray-800">
                Lagre Endringer
              </button>
            </div>
  
            <button
              onClick={() => setVisSlettBoks(true)}
              className="bg-red-600 text-white px-4 py-2 rounded w-[400px] hover:bg-red-700"
            >
              Slett Bruker
            </button>
          </>
        )}

        {/* Kategorier */}
        {["personvern", "sikkerhet", "min klubb"].includes(valgtKategori) && !visSlettBoks && (
          <div className="text-gray-600 text-center">Funksjoner kommer snart</div>
        )}
        
         {/* Sletting av bruker */}
        {visSlettBoks && (
          <div className="bg-white p-6 rounded-lg border border-gray-300 shadow-md w-[400px]">
            <h3 className="text-xl font-bold text-black mb-4 text-center">Bekreft sletting</h3>
            <p className="text-gray-600 mb-4 text-center">Denne handlingen kan ikke angres!</p>
            <input
              type="text"
              placeholder="Skriv inn brukernavn"
              value={brukernavnInput}
              onChange={(e) => setBrukernavnInput(e.target.value)}
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
      </div>
    </div>
  );
};

export default Medlemskap;