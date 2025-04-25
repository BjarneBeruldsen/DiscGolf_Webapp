//Author: Laurent Zogaj

/*
Komponent for tilbakestilling av passord.
Validerer token og epost, og sender nytt passord til backend.
Bruker useEffect til validering, useState for felt/holding og meldinger.
*/

import React, { useState, useEffect } from "react";
import { useParams, useHistory } from "react-router-dom";
import { Link } from "react-router-dom";
import { useTranslation } from 'react-i18next';

const TilbakestillPassord = () => {
  const { token } = useParams(); //Henter token fra URL (copilot)
  const urlParams = new URLSearchParams(window.location.search); //Søker etter epost i URLet (copilot)
  const epost = urlParams.get('email');//Henter epost fra URL (copilot)
  const minne = useHistory(); //Force navigering 
  const { t } = useTranslation(); //Oversettelse

  //Ulike states som holder på verdier 
  const [nyttPassord, setNyttPassord] = useState("");
  const [bekreftPassord, setBekreftPassord] = useState("");
  const [melding, setMelding] = useState("");
  const [tokenGyldig, setTokenGyldig] = useState(false);//Boolean som holder på om tokenet er gyldig (om passordet kan tilbakestilles)
  const [laster, setLaster] = useState(true);//Boolean mens validering kjører

  //Validerer tokenet og eposten når komponenten lastes som da er når bruker trykker på lenken i eposten
  //Bruker da useEffect for å kjøre valideringen
  //Jeg satte det opp men copilot kom med tips om å bruke det på denne måten
  useEffect(() => {
    const validerToken = async () => {
      if (!token || !epost) { //Sjekker om token eller epost mangler 
        setMelding(t("Ugyldig tilbakestillingslenke"));
        setTokenGyldig(false); //Fjerner mulighet for å tilbakestille passord
        setLaster(false); //Stopper opp lasting
        return;
      }
      try { //Kontakter backend
        const respons = await fetch(`${process.env.REACT_APP_API_BASE_URL}/passord/valider`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token, epost }), //Sender token og epost til backend
          credentials: "include",
        });
        //Henter respons fra backend
        const data = await respons.json();
        if (!respons.ok || !data.gyldig) {
          setMelding(t("Denne tilbakestillingslenken er utløpt eller ugyldig"));
          setTokenGyldig(false); //Backend svarer med at tokenet er ugyldig og vi setter tokenGyldig til false
        } else {
          setTokenGyldig(true); //Setter token som gyldig og dermed lar brukeren tilbakestille passordet
        }
      } catch (error) { //Feilhåndtering
        console.error("Feil ved validering av token:", error);
        setMelding(t("Kunne ikke validere tilbakestillingslenken"));
        setTokenGyldig(false); //Setter token til false dersom noe feil skjer 
      } finally {
        setLaster(false);
      }
    };
    validerToken(); //Kaller funksjonen for å validere tokenet
  }, [token, epost, t]); //Kjører når komponenten lastes og når token og epost endres

  //Skjemafunksjon for tilbakestilling av passord
  const handleSubmit = async (event) => {
    event.preventDefault();
    setLaster(true);

    //Frontend validering med regex (hentet fra innlogging)
    const passordRegex = /^(?=.*[A-Z])(?=.*[-.@$!%*?&]).{8,20}$/; //Minst 8 tegn og maks 20, ett spesialtegn og stor bokstav
    if (!passordRegex.test(nyttPassord)) {
      setMelding(t("Passord må være 8-20 tegn med minst én stor bokstav og ett spesialtegn"));
      setLaster(false);
      return;
    }
    if (nyttPassord !== bekreftPassord) {
      setMelding(t("Passordene må være like"));
      setLaster(false);
      return;
    }
    try { //Kontakter backend for å oppdatere passordet
      const respons = await fetch(`${process.env.REACT_APP_API_BASE_URL}/passord/tilbakestill`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, epost, nyttPassord }), //Sender token, epost og nytt passord til backend
        credentials: "include",
      });
      const data = await respons.json();
      if (!respons.ok) { //Henter respons fra backend
        setMelding(t(data.error || "Noe gikk galt"));
        //Hvis token er utløpt eller ugyldig setter vi false
        if (data.error && data.error.includes("utløpt")) {
          setTokenGyldig(false);
        }
      } else { //Hvis token er gyldig og alle andre sjekker er ok oppdaterer vi passordet
        setMelding(t("Passordet ble oppdatert!"));
        setTimeout(() => minne.push("/Innlogging"), 2000);
      }
    } catch (error) { //Feilhåndtering
      setMelding(t(error.message || "Feil ved passordoppdatering"));
    } finally {
      setLaster(false);
    }
  };
  //Styling og design
  return (
    <main>
      <div
        className="flex justify-center items-center min-h-screen bg-cover bg-center"
        style={{ backgroundImage: `url('https://images.unsplash.com/photo-1616840388998-a514fe2175b9?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')` }}
      >
        <form
          onSubmit={handleSubmit}
          className="flex flex-col items-center bg-white p-8 rounded-lg shadow-md w-80"
        >
          <h2 className="text-xl font-bold mb-4">{t("Sett nytt passord")}</h2>
          
          {laster ? (
            <p className="text-center mb-4">{t("Validerer tilbakestillingslenke...")}</p>
          ) : tokenGyldig ? (
            <>
              <input
                type="password"
                placeholder={t("Nytt passord")}
                value={nyttPassord}
                onChange={(e) => setNyttPassord(e.target.value)}
                className="px-4 py-3 mb-4 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
                required
              />
              <input
                type="password"
                placeholder={t("Bekreft passord")}
                value={bekreftPassord}
                onChange={(e) => setBekreftPassord(e.target.value)}
                className="px-4 py-3 mb-4 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
                required
              />
              <button
                type="submit"
                className="bg-gray-600 text-white px-4 py-2 mt-4 rounded-lg w-full border border-gray-500"
                disabled={laster}
              >
                {laster ? t("Oppdaterer...") : t("Oppdater passord")}
              </button>
            </>
          ) : (
            <div className="text-center mb-4">
              <p className="text-red-500 mb-2">
                {melding || t("Tilbakestillingslenken er ugyldig")}
              </p>
              <p>
                {t("Vennligst be om en ny tilbakestillingslenke")}
              </p>
            </div>
          )}
          
          <p className="text-blue-500 mt-4">
            <Link to="/Innlogging">{t("Tilbake til innlogging")}</Link>
          </p>

          {melding && tokenGyldig && (
            <p className={`mt-4 ${
              melding.toLocaleLowerCase().includes("oppdatert") || melding.toLowerCase().includes("updated") 
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

export default TilbakestillPassord;