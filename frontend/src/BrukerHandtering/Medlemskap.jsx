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
    <div
      className="grid grid-cols-1 lg:grid-cols-[300px_1fr] min-h-screen w-full bg-cover bg-center"
      style={{
        backgroundImage: `url('https://images.unsplash.com/photo-1616840388998-a514fe2175b9?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3')`,
      }}
    >
      <aside className="bg-white p-6 shadow-md h-full">
        <h2 className="text-xl font-bold mb-6">Innstillinger</h2>
        <ul className="space-y-4">
          {["brukerinnstillinger","personvern","sikkerhet","min klubb"].map((kategori) => (
            <li key={kategori}>
              <button
                className={`w-full text-left p-3 rounded transition duration-200 ${
                  valgtKategori === kategori 
                    ? "bg-gray-300 font-bold" 
                    : "hover:bg-gray-200"
                }`}
                onClick={() => byttKategori(kategori)}
              >
                {kategori.charAt(0).toUpperCase() + kategori.slice(1)}
              </button>
            </li>
          ))}
        </ul>
      </aside>

      <main className="flex-1 p-6 min-w-0">
        <div className="bg-white w-full p-8 rounded-lg border border-gray-300 shadow-md max-w-2xl mx-auto">
          {valgtKategori === "brukerinnstillinger" && !visSlettBoks && (
            <>
              <h2 className="title-xl">Brukerinnstillinger</h2>
              <div className="space-y-4">
                <input
                  type="text"
                  value={bruker.bruker || ""}
                  readOnly
                  className="input-text input-text-gray"
                />
                <input
                  type="email"
                  value={bruker.epost || ""}
                  readOnly
                  className="input-text input-text-gray"
                />
                <input
                  type="password"
                  placeholder="Nytt passord (funker ikke enda)"
                  className="input-text"
                />
                <button className="btn-save">Lagre Endringer</button>
              </div>
              <hr className="my-6" />
              <button onClick={() => setVisSlettBoks(true)} className="btn-delete">
                Slett Bruker
              </button>
            </>
          )}

          {["personvern","sikkerhet","min klubb"].includes(valgtKategori) && (
            <>
              <h2 className="title-xl">
                {valgtKategori.charAt(0).toUpperCase() + valgtKategori.slice(1)}
              </h2>
              <p className="text-gray-600">Funksjoner kommer snart</p>
            </>
          )}

          {visSlettBoks && (
            <div className="flex flex-col justify-center items-center w-full mt-4">
              <div className="bg-white p-6 rounded-lg border border-gray-300 shadow-md w-full max-w-md">
                <h3 className="title-xl">Bekreft sletting</h3>
                <p className="text-gray-600 mb-4">Denne handlingen kan ikke angres!</p>
                <input
                  type="text"
                  placeholder="Skriv inn brukernavn"
                  value={brukernavnInput}
                  onChange={(e) => setBrukernavnInput(e.target.value)}
                  required
                  className="input-text mb-3"
                />
                <input
                  type="password"
                  placeholder="Bekreft passord"
                  value={passord}
                  onChange={(e) => setPassord(e.target.value)}
                  required
                  className="input-text"
                />
                <button
                  type="submit"
                  onClick={handleSlettBruker}
                  className="btn-delete mt-2"
                >
                  Bekreft Sletting
                </button>
                <button
                  onClick={() => setVisSlettBoks(false)}
                  className="bg-gray-300 text-black px-4 py-2 rounded w-full mt-2 hover:bg-gray-400"
                >
                  Avbryt
                </button>
                {melding && <p className="mt-4 text-red-600">{melding}</p>}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Medlemskap;