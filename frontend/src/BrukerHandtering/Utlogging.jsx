//Author: Laurent Zogaj
/*
Denne filen håndter utlogging av bruker
Blir kalt når bruker trykker på loggut knappen som finnes i header.jsx
Brukeren nullstilles i state og blir sendt til hjemmesiden
*/

import i18n from '../i18n';

//Funksjon for å logge ut bruker
const loggUtBruker = async (setLoggetInnBruker, setMelding) => {

//Kontakter backend for å logge ut bruker
    try {
        const respons = await fetch(`${process.env.REACT_APP_API_BASE_URL}/session`, {
            method: "DELETE",
            credentials: "include",
            headers: {"Content-Type": "application/json"},
        });
        const data = await respons.json();
        if (respons.ok) {
            setLoggetInnBruker(null); //Logger ut bruker
            window.location.reload(); //Tvinger en refresh for å sikre at alt blir "freshet opp"
            window.location.href = "/Hjem"; 
        } else {
            setMelding(i18n.t(data.error || "Utlogging feilet. Prøv igjen."));
            return;
        }
    } catch (error) {
        setMelding(i18n.t("Feil ved utlogging", error));
    }
};

export default loggUtBruker;