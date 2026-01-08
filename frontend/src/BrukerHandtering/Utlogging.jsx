//Author: Laurent Zogaj
/*
Denne filen håndter utlogging av bruker
Blir kalt når bruker trykker på loggut knappen som finnes i header.jsx
Brukeren nullstilles i state og blir sendt til hjemmesiden
*/

import i18n from '../i18n';
import { apiKall, resetCsrfToken } from '../utils/api';

//Funksjon for å logge ut bruker
const loggUtBruker = async (setLoggetInnBruker, setMelding) => {

//Kontakter backend for å logge ut bruker
    try {
        const respons = await apiKall(`${process.env.REACT_APP_API_BASE_URL}/session`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json"
            },
        });
        
        // Nullstill CSRF token etter utlogging
        resetCsrfToken();
        if (respons.ok) {
            setLoggetInnBruker(null); //Logger ut bruker
            window.location.reload(); //Tvinger en refresh for å sikre at alt blir "freshet opp"
            window.location.href = "/Hjem"; 
        } else {
            let errorData;
            try {
                errorData = await respons.json();
            } catch {
                errorData = { error: "Utlogging feilet. Prøv igjen." };
            }
            setMelding(i18n.t(errorData.error || "Utlogging feilet. Prøv igjen."));
            return;
        }
    } catch (error) {
        setMelding(i18n.t("Feil ved utlogging", error));
    }
};

export default loggUtBruker;