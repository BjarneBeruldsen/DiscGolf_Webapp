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
    <div className="min-h-screen w-full bg-gray-50">
      {/* Desktop layout */}
      <div className="hidden lg:grid lg:grid-cols-[300px_1fr] lg:min-h-screen">
        <aside className="bg-white p-6 shadow-lg h-full sticky top-0">
          <h2 className="text-2xl font-bold mb-8">Innstillinger</h2>
          <ul className="space-y-3">
            {["brukerinnstillinger", "personvern", "sikkerhet", "min klubb"].map((kategori) => (
              <li key={kategori}>
                <button
                  className={`w-full text-left p-3 rounded-lg transition-all duration-200 ${
                    valgtKategori === kategori
                      ? "bg-blue-100 text-blue-700 font-semibold"
                      : "hover:bg-gray-100 text-gray-700"
                  }`}
                  onClick={() => byttKategori(kategori)}
                >
                  {kategori.charAt(0).toUpperCase() + kategori.slice(1)}
                </button>
              </li>
            ))}
          </ul>
        </aside>

        <main className="p-8 max-w-3xl mx-auto w-full">
          <div className="bg-white rounded-xl shadow-md p-8">
            {valgtKategori === "brukerinnstillinger" && !visSlettBoks && (
              <>
                <h1 className="text-3xl font-bold mb-6">Brukerinnstillinger</h1>
                <div className="space-y-4">
                  <input
                    type="text"
                    value={bruker.bruker || ""}
                    readOnly
                    className="w-full p-3 border rounded-lg bg-gray-50"
                  />
                  <input
                    type="email"
                    value={bruker.epost || ""}
                    readOnly
                    className="w-full p-3 border rounded-lg bg-gray-50"
                  />
                  <input
                    type="password"
                    placeholder="Nytt passord (funker ikke enda)"
                    className="w-full p-3 border rounded-lg"
                  />
                  <button className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors">
                    Lagre Endringer
                  </button>
                </div>
                <hr className="my-6 border-gray-200" />
                <button
                  onClick={() => setVisSlettBoks(true)}
                  className="w-full bg-red-600 text-white py-3 rounded-lg hover:bg-red-700 transition-colors"
                >
                  Slett Bruker
                </button>
              </>
            )}

            {["personvern", "sikkerhet", "min klubb"].includes(valgtKategori) && (
              <>
                <h2 className="text-2xl font-bold mb-4">
                  {valgtKategori.charAt(0).toUpperCase() + valgtKategori.slice(1)}
                </h2>
                <p className="text-gray-600">Funksjoner kommer snart</p>
              </>
            )}

            {visSlettBoks && (
              <div className="mt-6">
                <div className="bg-white p-6 rounded-lg border border-gray-200">
                  <h3 className="text-xl font-bold mb-4">Bekreft sletting</h3>
                  <p className="text-red-600 mb-4">Denne handlingen kan ikke angres!</p>
                  <input
                    type="text"
                    placeholder="Skriv inn brukernavn"
                    value={brukernavnInput}
                    onChange={(e) => setBrukernavnInput(e.target.value)}
                    className="w-full p-3 border rounded-lg mb-3"
                  />
                  <input
                    type="password"
                    placeholder="Bekreft passord"
                    value={passord}
                    onChange={(e) => setPassord(e.target.value)}
                    className="w-full p-3 border rounded-lg"
                  />
                  <button
                    onClick={handleSlettBruker}
                    className="w-full bg-red-600 text-white py-3 rounded-lg mt-4 hover:bg-red-700"
                  >
                    Bekreft sletting
                  </button>
                  <button
                    onClick={() => setVisSlettBoks(false)}
                    className="w-full bg-gray-200 text-black py-3 rounded-lg mt-2 hover:bg-gray-300"
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

      {/* Mobil layout */}
      <div className="lg:hidden p-4">
        <div className="bg-white rounded-xl shadow-md p-4">
          <h2 className="text-xl font-bold mb-4">Innstillinger</h2>
          <select
            className="w-full p-3 border rounded-lg mb-6"
            onChange={(e) => byttKategori(e.target.value)}
            value={valgtKategori}
          >
            {["brukerinnstillinger", "personvern", "sikkerhet", "min klubb"].map((kategori) => (
              <option key={kategori} value={kategori}>
                {kategori.charAt(0).toUpperCase() + kategori.slice(1)}
              </option>
            ))}
          </select>

          {/* Mobilinnhold */}
          <div className="bg-white rounded-lg p-4">
            {valgtKategori === "brukerinnstillinger" && !visSlettBoks && (
              <>
                <h2 className="text-xl font-bold mb-4">Brukerinnstillinger</h2>
                <div className="space-y-3">
                  <input
                    type="text"
                    value={bruker.bruker || ""}
                    readOnly
                    className="w-full p-2 border rounded"
                  />
                  <input
                    type="email"
                    value={bruker.epost || ""}
                    readOnly
                    className="w-full p-2 border rounded"
                  />
                  <input
                    type="password"
                    placeholder="Nytt passord"
                    className="w-full p-2 border rounded"
                  />
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Medlemskap;