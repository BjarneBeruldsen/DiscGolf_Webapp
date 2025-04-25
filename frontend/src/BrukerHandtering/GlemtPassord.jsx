//Author: Laurent Zogaj

/* 
Denne komponenten håndterer glemt passord for bruker.
Bruker useState for å håndtere ulike tilstander og data
Det har også blitt kodet en manuell captcha for ekstra beskyttelse.
Den håndterer også enkel validering av inputfeltene med regex.
Bruker skjemafunksjon fra react.
*/
import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { Link } from "react-router-dom";
import i18n from "../i18n";
import { useTranslation } from 'react-i18next'; 

const GlemtPassord = () => {
  //Ulike states som holder på verdier
  const [brukerInput, setBrukerInput] = useState("");
  const [melding, setMelding] = useState("");
  const [tall, setTall] = useState(Math.floor(Math.random() * 99) + 1);
  const [tallInput, setTallInput] = useState("");
  const [laster, setLaster] = useState(false);
  const minne = useHistory(); 
  const { t } = useTranslation();

  //Skjemafunksjon for glemt passord
  const handleSubmit = async (event) => {
    event.preventDefault();
    setLaster(true);

    //Frontend validering med regex (hentet fra innlogging)
    const brukernavnRegex = /^[a-zA-Z0-9]{3,15}$/; //3-15 tegn, kun bokstaver og tall
    const epostRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/; //E-post validering sjekker @ og .
    const tallRegex = /^[0-9]+$/; //Sjekker at input er tall

    const erEpost = epostRegex.test(brukerInput);
    const erBrukernavn = brukernavnRegex.test(brukerInput);
    const erTall = tallRegex.test(tallInput);

    //Sjekker om brukernavnet eller eposten er gyldig i henhold til regex
    if (!erEpost && !erBrukernavn) {
      setMelding(i18n.t("Skriv inn enten brukernavn (3-15 tegn) eller en gyldig e-post."));
      setLaster(false);
      return;
    }
    if (!erTall || tallInput.length > 2) {
      setMelding(i18n.t("Tallet må være et gyldig tall."));
      setLaster(false);
      return;
    }
    //Enkel captcha hvis feil tall kan ikke brukeren fortsette
    if (parseInt(tallInput) !== tall) {
      setLaster(false);
      return;
    }
    //Kontakter backend for glemt passord
    try {
      const respons = await fetch(`${process.env.REACT_APP_API_BASE_URL}/passord/glemt`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({brukerInput}),
        credentials: "include",
      });
      //Henter respons fra backend
      const data = await respons.json();
      if (!respons.ok) {
        console.error("Feil ved sending", data);
        setTall(Math.floor(Math.random() * 99) + 1); //Genererer nytt tall
        setTallInput(""); //Nullstiller feltet
        setMelding(i18n.t(data.error || "Feil ved sending av epost"));
      } else {
        setMelding(i18n.t("E-post sendt! Sjekk innboksen din for tilbakestillingslenke."));
        setBrukerInput("");
        setTimeout(() => { minne.push("/Innlogging"); }, 2000);
      }
    } catch (error) {
      setMelding(i18n.t(error.message || "En feil har skjedd"));
      setTall(Math.floor(Math.random() * 99) + 1);
      setTallInput("");
    } finally {
      setLaster(false);
    }
  };

  //Sjekker om det er gyldig og gir deretter beskjed i UI via brukergrensesnittet nedenfor
  const tallRiktig = tallInput !== "" && parseInt(tallInput) === tall; 
  //Styling og design
  return (
    <main>
      <div
        className="flex justify-center items-center min-h-screen bg-cover bg-center relative"
        style={{ backgroundImage: `url('https://images.unsplash.com/photo-1616840388998-a514fe2175b9?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')` }}
      >
        <form
          onSubmit={handleSubmit}
          className="flex flex-col items-center bg-white p-8 rounded-lg shadow-md w-80"
        >
          <h2 className="text-xl font-bold mb-4">{t("Glemt passord")}</h2>
          <input
            type="text"
            placeholder={t("E-post eller brukernavn")}
            value={brukerInput}
            onChange={(e) => setBrukerInput(e.target.value)}
            className="px-4 py-3 mb-4 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
          />
          <label className="text-gray-700 mt-1 mb-2">
            {t("Skriv inn tallet for å fortsette:")} <span className="text-red-500">{tall}</span>
          </label>
          <input 
            type="number"
            id="input"
            placeholder={t("Skriv inn tallet")}
            value={tallInput}
            onChange={(e) => setTallInput(e.target.value)}
            required
            className="px-5 py-3 mb-2 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          {tallInput !== "" && (
            tallRiktig ? 
            <p className="text-green-500 mt-2">{t("Tallet er riktig")}</p> :
            <p className="text-red-500 mt-2">{t("Tallet er feil")}</p>
          )}
          <button
            type="submit"
            className="bg-gray-600 text-white px-4 py-2 mt-4 rounded-lg w-full border border-gray-500"
            disabled={laster}
          >
            {laster ? t("Sender...") : t("Send tilbakestillingslenke")}
          </button>
          <p className="text-blue-500 mt-4">
            <Link to="/Innlogging">{t("Tilbake til innlogging")}</Link>
          </p>
          {melding && (
          <p className={`mt-4 ${
          melding.toLowerCase().includes("sendt") || melding.toLowerCase().includes("sent") 
          ? "text-green-500" 
          : "text-red-500"} 
          text-center`}>
            {melding}
          </p>
          )}
        </form>
      </div>
    </main>
  );
};

export default GlemtPassord;