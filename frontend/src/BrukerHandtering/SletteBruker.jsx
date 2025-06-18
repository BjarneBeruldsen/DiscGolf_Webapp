//Author: Laurent Zogaj

/*
Denne filen håndterer sletting av bruker.
Den tar inn brukerinformasjon og passord fra bruker og sender det til backend for sletting.
Denne filen blir brukt i BrukerInnstillinger.jsx filen også.
*/

import i18n from '../i18n';

//Funksjon for å slette bruker
const SletteBruker = async (brukerInput, passord, setBruker, setMelding, minne) => {

  //Kontakter backend for å slette bruker
  try {
    const respons = await fetch(`${process.env.REACT_APP_API_BASE_URL}/bruker`, {
      method: "DELETE",
      headers: {"Content-Type": "application/json"},
      credentials: "include",
      body: JSON.stringify({brukerInput, passord}), 
    });
    const data = await respons.json();
    if (!respons.ok) {
      console.error("Sletting av bruker feilet:", data);
      setMelding(i18n.t(data.error || "Feil ved sletting av bruker. Sjekk brukernavn eller passord og prøv igjen."));
      return;
    } else { 
      setMelding(i18n.t("Bruker er nå slettet, du blir nå sendt til hjemmesiden"));
      setTimeout(() => {
        setBruker(null); //Nullstiller bruker
        minne.push("/Hjem");  
        window.location.reload(); //Tvinger en refresh for å sikre at alt blir "freshet opp"
      }, 2000);
    }
  } catch (error) {
    setMelding(i18n.t("Feil ved sletting av bruker", error));
  }
};

export default SletteBruker;