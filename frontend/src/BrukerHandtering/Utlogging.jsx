//Author: Laurent Zogaj

import i18n from '../i18n';

//Funksjon for å logge ut bruker
const loggUtBruker = async (setLoggetInnBruker, setMelding) => {

//Kontakter backend for å logge ut bruker
    try {
        const respons = await fetch(`${process.env.REACT_APP_API_BASE_URL}/Utlogging`, {
            method: "POST",
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