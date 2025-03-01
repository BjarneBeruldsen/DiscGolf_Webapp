//Author: Laurent Zogaj
import React, { useState, useEffect } from "react";
import "../App.css";

const Medlemskap = ({ loggetInnBruker }) => {
  const [bruker, setBruker] = useState(null);
  const [valgtKategori, setValgtKategori] = useState("Brukerinnstillinger");
  const [valgtUnderKategori, setValgtUnderKategori] = useState("");
  const [underKategoriOpen, setUnderKategoriOpen] = useState(true);
  const [visSlettBoks, setVisSlettBoks] = useState(false);
  const [brukernavnInput, setBrukernavnInput] = useState("");
  const [passord, setPassord] = useState("");
  const [melding, setMelding] = useState("");
  const [venter, setVenter] = useState(true);

  const hovedKategorier = [
    "Brukerinnstillinger",
    "Personvern",
    "Sikkerhet",
    "Min Klubb",
    "Mitt abonnement"
  ];

  const underKategorier = {
    Brukerinnstillinger: ["Min informasjon", "Endre min informasjon", "Slett bruker"],
    Personvern: ["Informasjonskapsler", "Synlighet", "GDPR"],
    Sikkerhet: ["To-faktor autentisering", "Gjennoppretting"],
    "Min Klubb": ["Min klubb", "Søk etter klubb", "Avregistrer"],
    "Mitt abonnement": ["Mitt abonnement", "Betaling", "Avslutt abonnement"]
  };

  useEffect(() => {
    if (!loggetInnBruker?.epost) {
      const lagretBruker = localStorage.getItem("bruker");
      if (lagretBruker) setBruker(JSON.parse(lagretBruker));
    } else {
      setBruker(loggetInnBruker);
    }
    setVenter(false);
  }, [loggetInnBruker]);
  if (venter) return <p className="text-center text-gray-700 mt-10">Laster inn...</p>;
  if (!bruker) {
    window.location.href = "/Innlogging";
    return null;
  }

  const toggleUnderKategori = (kategori) => {
    if (valgtKategori === kategori) {
      setUnderKategoriOpen(!underKategoriOpen);
    } else {
      setValgtKategori(kategori);
      setUnderKategoriOpen(true);
    }
    setValgtUnderKategori("");
    setVisSlettBoks(false);
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

//CSS
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
      <h2 className="text-lg font-bold mb-4">Innstillinger</h2>
      <ul className="space-y-4">
        {hovedKategorier.map((kat) => (
          <li key={kat}>
            <button
              className={`w-full text-left p-2 rounded transition duration-200 ${
                valgtKategori === kat
                  ? "bg-gray-100 font-semibold text-black"
                  : "hover:bg-gray-100 text-gray-700"
              }`}
              onClick={() => toggleUnderKategori(kat)}
            >
              {kat}
            </button>
            {valgtKategori === kat && underKategoriOpen && underKategorier[kat] && (
              <ul className="ml-4 space-y-2 mt-2">
                {underKategorier[kat].map((underkategori) => (
                  <li key={underkategori}>
                    <button
                      className={`w-full text-left p-2 rounded transition duration-200 ${
                        valgtUnderKategori === underkategori
                          ? "bg-gray-200 font-semibold text-black"
                          : "hover:bg-gray-200 text-gray-700"
                      }`}
                      onClick={() => setValgtUnderKategori(underkategori)}
                    >
                      {underkategori}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </li>
        ))}
      </ul>
    </div>

    {/* Høyre meny */}
    <div className="content-box flex flex-col items-center justify-center gap-6">
      {valgtKategori === "Brukerinnstillinger" && !visSlettBoks ? (
        valgtUnderKategori === "Min informasjon" ? (
          <div className="space-y-4 w-full max-w-[400px]">
            <input
              type="text"
              value={bruker.bruker}
              readOnly
              className="w-full max-w-[400px] px-3 py-2 border border-gray-300 rounded bg-gray-100"
            />
            <input
              type="email"
              value={bruker.epost}
              readOnly
              className="w-full max-w-[400px] px-3 py-2 border border-gray-300 rounded bg-gray-100"
            />
            <p className="text-gray-600">Her er din registrerte brukerinformasjon</p>
          </div>
        ) : valgtUnderKategori === "Endre min informasjon" ? (
          <div className="space-y-4 w-full max-w-[400px]">
            <p className="text-gray-600">
              Endring av brukerinformasjon (ikke implementert ennå).
            </p>
            <button className="bg-black text-white px-4 py-2 rounded w-full max-w-[400px] hover:bg-gray-800">
              Lagre Endringer
            </button>
          </div>
        ) : valgtUnderKategori === "Slett bruker" ? (
          <button
            onClick={() => setVisSlettBoks(true)}
            className="bg-red-600 text-white px-4 py-2 rounded w-full max-w-[400px] hover:bg-red-700"
          >
            Slett Bruker
          </button>
        ) : (
          <div className="space-y-4 w-full max-w-[400px]">
            <p className="text-gray-600 text-center">
              Velg en underkategori for ditt behov
            </p>
          </div>
        )
      ) : (["Personvern", "Sikkerhet", "Min Klubb", "Mitt abonnement"].includes(valgtKategori) &&
          !visSlettBoks) ? (
        <div className="text-gray-600 text-center w-full max-w-[400px]">
          Funksjoner kommer snart
        </div>
      ) : null}

      {/* Slett bruker */}
      {visSlettBoks && (
        <div className="bg-white p-6 rounded-lg border border-gray-300 shadow-md w-full max-w-[400px]">
          <h3 className="text-xl font-bold text-black mb-4 text-center">
            Bekreft sletting
          </h3>
          <p className="text-gray-600 mb-4 text-center">
            Denne handlingen kan ikke angres!
          </p>
          <input
            type="text"
            placeholder="Skriv inn brukernavn"
            value={brukernavnInput}
            onChange={(e) => setBrukernavnInput(e.target.value)}
            className="w-full max-w-[400px] px-3 py-2 border border-gray-300 rounded mb-3"
          />
          <input
            type="password"
            placeholder="Bekreft passord"
            value={passord}
            onChange={(e) => setPassord(e.target.value)}
            className="w-full max-w-[400px] px-3 py-2 border border-gray-300 rounded"
          />
          <button
            onClick={handleSlettBruker}
            className="bg-red-600 text-white px-4 py-2 rounded w-full max-w-[400px] mt-4 hover:bg-red-700"
          >
            Bekreft Sletting
          </button>
          <button
            onClick={() => setVisSlettBoks(false)}
            className="bg-gray-300 text-black px-4 py-2 rounded w-full max-w-[400px] mt-2 hover:bg-gray-400"
          >
            Avbryt
          </button>
          {melding && (
            <p className="mt-4 text-red-600 text-center">{melding}</p>
          )}
        </div>
      )}
    </div>
  </div>
);
};

export default Medlemskap;