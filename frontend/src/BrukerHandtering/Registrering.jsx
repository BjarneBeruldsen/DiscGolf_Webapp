//Author: Laurent Zogaj
/*
Denne komponenten håndterer registrering av bruker.
Bruker useState for å håndtere ulike tilstander og data
Det har også blitt kodet en manuell captcha for ekstra beskyttelse.
Den håndterer også enkel validering av inputfeltene med regex.
Bruker skjemafunksjon fra react.
Her blir bruker registrering sendt til backend for en sjekk og tilbake for å vise melding.
*/

import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { Link } from "react-router-dom";
import i18n from "../i18n";
import { useTranslation } from 'react-i18next'; 

const Registrering = () => {
    const [brukernavn, setBrukernavn] = useState("");
    const [epost, setEpost] = useState(""); 
    const [passord, setPassord] = useState("");
    const [bekreftPassord, setbekreftPassord] = useState("");
    const [melding, setMelding] = useState("");
    const [laster, setLaster] = useState(false);
    const minne = useHistory(); 
    const [tall, setTall] = useState(Math.floor(Math.random() * 99) + 1);
    const [tallInput, setTallInput] = useState("");
    const { t } = useTranslation(); 

    //Skjemafunksjon for registrering
    const handleSubmit = async (event) => {        //https://legacy.reactjs.org/docs/forms.html
        event.preventDefault();

        //Frontend validering med regex (Fått hjelp av Copilot med regex)
        const brukernavnRegex = /^[a-zA-Z0-9]{3,15}$/; //3-15 tegn, kun bokstaver og tall
        const epostRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/; //E-post validering sjekker @ og .
        const passordRegex = /^(?=.*[A-Z])(?=.*[-.@$!%*?&]).{8,20}$/; //Minst 8 tegn og maks 20, ett spesialtegn og stor bokstav
        const tallRegex = /^[0-9]+$/; //Sjekker at input er tall

        const erEpost = epostRegex.test(epost);
        const erBrukernavn = brukernavnRegex.test(brukernavn);
        const erPassord = passordRegex.test(passord);
        const erBekreftPassord = passordRegex.test(bekreftPassord);
        const erTall = tallRegex.test(tallInput);
        
        //Sjekker om brukernavn, epost og passord er gyldig i henhold til regex
        if (!erBrukernavn) {
            setMelding(i18n.t("Brukernavn må være 3-15 tegn langt og kun inneholde bokstaver og tall."));
            return;
        }
        if (!erEpost) {
            setMelding(i18n.t("E-post må være gyldig"));
            return;
        }
        if (!erPassord) {
            setMelding(i18n.t("Passord må være minst 8 tegn og maks 20 tegn og ha minst en stor bokstav og spesialtegn."));
            return;
        }
        if (!erBekreftPassord) {
            setMelding(i18n.t("Passord må være gyldig, (minst 8 tegn og maks 20 tegn og ha ett spesialtegn)."));
            return;
        }
        //Sjekker om passordene er like 
        if (passord !== bekreftPassord) {
            setMelding(i18n.t("Passordene stemmer ikke overens."));
            return;
        }
        //Sjekker om tallinput fra captchaen er gyldig 
        if (!erTall || tallInput.length > 2) {
            setMelding(i18n.t("Tallet må være et gyldig tall."));
            return;
        }
        //Enkel captcha hvis feil tall kan ikke brukeren registrere seg
        if (parseInt(tallInput) !== tall) {
        return;
        }
        setLaster(true);
        //Kontakter backend for registrering
        try {
            const respons = await fetch(`${process.env.REACT_APP_API_BASE_URL}/bruker`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ brukernavn, epost, passord, bekreftPassord }),
                credentials: "include",
            });
            const data = await respons.json();
            if (!respons.ok) { //Hvis responsen ikke er ok fra backend
                setMelding(i18n.t(data.error || "Registrering feilet. Prøv igjen."));
                setTall(Math.floor(Math.random() * 99) + 1); //Genererer nytt tall
                setTallInput(""); //Nullstiller feltet
                return;
            } else {
                setMelding(i18n.t("Registrering vellykket! Du blir omdirigert til innlogging..."));
                setTimeout(() => minne.push("/Innlogging"), 2000);
            }
        } catch (error) {
            setMelding(i18n.t("Noe gikk galt. Prøv igjen."));
            console.error(i18n.t("Registreringsfeil:", error));
            setTall(Math.floor(Math.random() * 99) + 1);
            setTallInput("");
        }
        finally {
            setLaster(false); 
        }
    }; 
    
//Sjekker om det er gyldig og gir deretter beskjed i UI via brukergrensesnittet nedenfor
const tallRiktig = tallInput !== "" && parseInt(tallInput) === tall; 
//Design og Styling for registreringsskjema
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
                <h2 className="text-xl font-bold mb-4">{t("Registrer deg som bruker!")}</h2>
                <input
                    type="email" 
                    placeholder={t("E-post")}
                    value={epost}
                    onChange={(e) => setEpost(e.target.value)}
                    required
                    disabled={laster}
                    className="px-4 py-3 mb-4 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
                <input
                    type="username"
                    placeholder={t("Brukernavn")}
                    value={brukernavn}
                    onChange={(e) => setBrukernavn(e.target.value)}
                    required
                    disabled={laster}
                    className="px-4 py-3 mb-4 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
                <input
                    type="password"
                    placeholder={t("Passord")}
                    value={passord}
                    onChange={(e) => setPassord(e.target.value)}
                    required
                    disabled={laster}
                    className="px-4 py-3 mb-3 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
                <input
                    type="password"
                    placeholder={t("Bekreft passord")}
                    value={bekreftPassord}
                    onChange={(e) => setbekreftPassord(e.target.value)}
                    required
                    disabled={laster}
                    className="px-4 py-3 mb-4 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
                <label className="text-gray-700 mt-4">
                    {t("Skriv inn tallet for å registrere deg:")} <span className="text-red-500">{tall}</span>
                </label>
                <input 
                    type="number"
                    id="input"
                    placeholder={t("Skriv inn tallet")}
                    value={tallInput}
                    onChange={(e) => setTallInput(e.target.value)}
                    required
                    disabled={laster}
                    className="px-5 py-3 m-2 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
                {tallInput !== "" && (
                    tallRiktig ? 
                    <p className="text-green-500 mt-2">{t("Tallet er riktig")}</p> :
                    <p className="text-red-500 mt-2">{t("Tallet er feil")}</p>
                )}
                <button
                    type="submit"
                    disabled={laster}
                    className="bg-gray-600 text-white px-4 py-2 mt-4 rounded-lg w-full border border-gray-500"
                >
                    {laster ? t("Laster...") : t("Registrer deg")}
                </button>
                <p className="text-blue-500 mt-4">
                    <Link to="./Innlogging">{t("Har du allerede en konto? Klikk her")}</Link>
                </p>
                <div className="text-xs text-center text-gray-500 mt-6">
                    <p>
                        {t("Vi behandler personopplysninger i samsvar med personopplysningsloven og GDPR.")}
                        <Link to="/Personvern" className="text-blue-500 hover:underline"> {t("Les mer her")}</Link>
                    </p>
                </div>
                {melding && (
                    <p
                        className={`mt-4 text-center ${
                            melding.toLowerCase().includes("vellykket") || melding.toLowerCase().includes("successful") 
                            ? "text-green-500"
                                : "text-red-500"
                        }`}
                    >
                        {melding}
                    </p>
                )}
            </form>
        </div>
    </main>
);
};

export default Registrering;