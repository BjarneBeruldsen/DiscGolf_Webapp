//Author: Laurent Zogaj & Severin Waller Sørensen
import React, { useState } from "react";
import "../App.css";
import BrukerInnstillinger from "./Komponenter/BrukerInnstillinger.jsx";
import Personvern from "./Komponenter/Personvern.jsx";
import Sikkerhet from "./Komponenter/Sikkerhet.jsx";
import MinKlubb from "./Komponenter/MinKlubb.jsx";
import MittAbonnement from "./Komponenter/MittAbonnement.jsx";
import HentBruker from "./HentBruker.jsx"; 
import AdminDashboard from "../Admin/AdminDashboard";
import Systeminnstillinger from "../Admin/Systeminnstillinger.jsx";

const Medlemskap = () => {
  const { bruker, setBruker } = HentBruker(); //Henter brukerdata fra HentBruker.jsx
  const [valgtKategori, setValgtKategori] = useState("Brukerinnstillinger");
  const [valgtUnderKategori, setValgtUnderKategori] = useState("");
  const [underKategoriOpen, setUnderKategoriOpen] = useState(true);

  //Definerer hovedkategorier
  const hovedKategorier = (() => {
    if (bruker?.rolle === "super-admin") {
      return [
        "Systeminnstillinger",
        "Administrasjon",
        "Klubbinnstillinger",
        "Brukerinnstillinger",
        "Personvern",
        "Sikkerhet",
        "Min Klubb",
        "Mitt abonnement",
      ];
    } else if (bruker?.rolle === "admin") {
      return [
        "Administrasjon",
        "Klubbinnstillinger",
        "Brukerinnstillinger",
        "Personvern",
        "Sikkerhet",
        "Min Klubb",
        "Mitt abonnement",
      ];
    } else if (bruker?.rolle === "klubbleder") {
      return [
        "Klubbinnstillinger",
        "Brukerinnstillinger",
        "Personvern",
        "Sikkerhet",
        "Min Klubb",
        "Mitt abonnement",
      ];
    } else if (bruker?.rolle === "klubbmedlem") {
      return [
        "Brukerinnstillinger",
        "Personvern",
        "Sikkerhet",
        "Min Klubb",
        "Mitt abonnement",
      ];
    } else if (bruker?.rolle === "loggetInn") {
      return [
        "Brukerinnstillinger",
        "Personvern",
        "Sikkerhet",
      ];
    } else {
      return []; // Ingen tilgang hvis ingen rolle er definert
    }
  })();

  //Definerer underkategorier
  const underKategorier = {
    Systeminnstillinger: ["Globale innstillinger", "Hovedadministrasjon av brukere", "Systemlogg"],
    Administrasjon: ["AdminDashboard", "Administrere klubber", "Administrere brukere"],
    Klubbinnstillinger: ["Klubbinformasjon", "Endre klubbinfo", "Administrede medlem", "Slett klubb"],
    Brukerinnstillinger: ["Min informasjon", "Endre min informasjon", "Slett bruker"],
    Personvern: ["Informasjonskapsler", "Synlighet", "GDPR"],
    Sikkerhet: ["To-faktor autentisering", "Gjennoppretting"],
    "Min Klubb": ["Min klubb", "Søk etter klubb", "Søk etter brukere", "Avregistrer"],
    "Mitt abonnement": ["Mitt abonnement", "Betaling", "Avslutt abonnement"],
  };

  //Funksjon for å bytte mellom hovedkategorier og underkategorier
  const toggleUnderKategori = (kategori) => {
    if (valgtKategori === kategori) {
      setUnderKategoriOpen(!underKategoriOpen);
    } else {
      setValgtKategori(kategori);
      setUnderKategoriOpen(true);
    }
    setValgtUnderKategori("");
  };

  //Design og Styling for menyer og innhold i Medlemskap 
  return (
    <div
      className="outer-wrapper"
      style={{
        backgroundImage: `url('https://images.unsplash.com/photo-1616840388998-a514fe2175b9?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3')`,
      }}
    >
      {/*Venstre Meny*/}
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

      {/*Høyre Meny*/}
      <div className="content-box flex flex-col items-center justify-center gap-6">

        {valgtKategori === "Brukerinnstillinger" && valgtUnderKategori && (
          <BrukerInnstillinger bruker={bruker} valgtUnderKategori={valgtUnderKategori} setBruker={setBruker} />
        )}

        {valgtKategori === "Personvern" && valgtUnderKategori && (
          <Personvern valgtUnderKategori={valgtUnderKategori} />
        )}

        {valgtKategori === "Sikkerhet" && valgtUnderKategori && (
          <Sikkerhet valgtUnderKategori={valgtUnderKategori} />
        )}

        {valgtKategori === "Min Klubb" && valgtUnderKategori && (
          <MinKlubb valgtUnderKategori={valgtUnderKategori} />
        )}

        {valgtKategori === "Mitt abonnement" && valgtUnderKategori && (
          <MittAbonnement valgtUnderKategori={valgtUnderKategori} />
        )}

        {valgtKategori === "Administrasjon" && valgtUnderKategori === "AdminDashboard" && (
          <AdminDashboard />
        )}

        {/* Fallback melding*/}
        {!valgtUnderKategori && (
          <p className="text-gray-600 text-center">Velg en underkategori for ditt behov</p>
        )}
      </div>
    </div>
  );
};

export default Medlemskap;