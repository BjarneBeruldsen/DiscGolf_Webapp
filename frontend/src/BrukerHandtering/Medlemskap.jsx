//Author: Laurent Zogaj

import React, { useState, useEffect } from "react";

const Medlemskap = ({ loggetInnBruker }) => {
  const [bruker, setBruker] = useState(loggetInnBruker || null);
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

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-center relative"
      style={{ backgroundImage: `url('https://images.unsplash.com/photo-1616840388998-a514fe2175b9?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fA%3D%3D')`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
      
      {/* Sidemeny */}
      <div className="w-full md:w-1/4 bg-white p-4 md:p-6 shadow-md">
        <h2 className="text-lg md:text-xl font-bold mb-4 md:mb-6">Innstillinger</h2>
        <ul className="grid grid-cols-1 gap-2 md:gap-4">
          {["brukerinnstillinger", "personvern", "sikkerhet", "min klubb"].map((kategori) => (
            <li key={kategori}>
              <button className={`w-full text-left p-2 md:p-3 rounded transition duration-200 text-sm md:text-base ${valgtKategori === kategori ? "bg-gray-300 font-bold" : "hover:bg-gray-200"}`} onClick={() => byttKategori(kategori)}>
                {kategori.charAt(0).toUpperCase() + kategori.slice(1)}
              </button>
            </li>
          ))}
        </ul>
      </div>
  
      {/* Innhold */}
      <div className="flex-1 flex justify-center items-center p-4 md:p-8">
        <div className="bg-white p-4 md:p-8 rounded-lg border border-gray-300 shadow-md w-full max-w-lg">
          {valgtKategori === "brukerinnstillinger" && !visSlettBoks && (
            <>
              <h2 className="text-lg md:text-xl font-bold text-black mb-4">Brukerinnstillinger</h2>
              <div className="space-y-3 md:space-y-4">
                <input type="text" value={bruker.bruker || ""} readOnly className="w-full px-3 py-2 text-sm md:text-base border border-gray-300 rounded bg-gray-100" />
                <input type="email" value={bruker.epost || ""} readOnly className="w-full px-3 py-2 text-sm md:text-base border border-gray-300 rounded bg-gray-100" />
                <input type="password" placeholder="Nytt passord (funker ikke enda)" className="w-full px-3 py-2 text-sm md:text-base border border-gray-300 rounded" />
                <button className="bg-black text-white px-4 py-2 text-sm md:text-base rounded w-full hover:bg-gray-800">Lagre Endringer</button>
              </div>
              <hr className="my-4 md:my-6 border-gray-300" />
              <button onClick={() => setVisSlettBoks(true)} className="bg-red-600 text-white px-4 py-2 text-sm md:text-base rounded w-full hover:bg-red-700">Slett Bruker</button>
            </>
          )}
  
          {["personvern", "sikkerhet", "min klubb"].includes(valgtKategori) && (
            <>
              <h2 className="text-lg md:text-xl font-bold text-black mb-4">{valgtKategori.charAt(0).toUpperCase() + valgtKategori.slice(1)}</h2>
              <p className="text-gray-600 text-sm md:text-base">Funksjoner kommer snart</p>
            </>
          )}
  
          {visSlettBoks && (
            <div className="flex flex-col justify-center items-center w-full">
              <div className="bg-white p-4 md:p-6 rounded-lg border border-gray-300 shadow-md w-full max-w-xs md:max-w-md">
                <h3 className="text-lg md:text-xl font-bold text-black">Bekreft sletting</h3>
                <p className="text-gray-600 mb-3 md:mb-4 text-sm md:text-base">Denne handlingen kan ikke angres!</p>
                <input type="text" placeholder="Skriv inn brukernavn" value={brukernavnInput} onChange={(e) => setBrukernavnInput(e.target.value)} required className="w-full px-3 py-2 text-sm md:text-base border border-gray-300 rounded mb-2 md:mb-3" />
                <input type="password" placeholder="Bekreft passord" value={passord} onChange={(e) => setPassord(e.target.value)} required className="w-full px-3 py-2 text-sm md:text-base border border-gray-300 rounded" />
                <button type="submit" onClick={handleSlettBruker} className="bg-red-600 text-white px-4 py-2 text-sm md:text-base rounded w-full mt-2 hover:bg-red-700">Bekreft Sletting</button>
                <button onClick={() => setVisSlettBoks(false)} className="bg-gray-300 text-black px-4 py-2 text-sm md:text-base rounded w-full mt-2 hover:bg-gray-400">Avbryt</button>
                {melding && <p className="mt-3 md:mt-4 text-red-600 text-sm md:text-base">{melding}</p>}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Medlemskap;