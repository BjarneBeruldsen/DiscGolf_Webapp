//Author: Laurent Zogaj
/*
Dette er en hook som henter brukerdata fra innlogget bruker.
Den kontakter da sjekk-session i backend for å sjekke om brukeren er logget inn,
og deretter returnerer den brukerdataen som er definert i backend.
*/
import { useEffect, useState } from "react";

const HentBruker = () => {
    const [bruker, setBruker] = useState(null); //Holder på brukerinfo
    const [venter, setVenter] = useState(true); //Holder på lastestatus

    //Sjekker om brukeren er logget inn
    useEffect(() => {
        const sjekkSession = async () => {
            try {
                //Henter brukerdata fra sjekk-session i backend
                const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/sjekk-session`, {
                    method: "GET",
                    headers: { "Content-Type": "application/json" },
                    credentials: "include", 
                });
                //Hvis forespørselen er ok setter vi brukerdata
                if (response.ok) {
                    const data = await response.json();
                    setBruker(data.bruker); //Setter brukerdata
                    console.log("Bruker er logget inn"); 
                } else {
                    throw new Error("Ingen aktiv session");
                }
            } catch (error) {
                console.log("Ingen bruker er logget inn"); 
                setBruker(null); 
            } finally {
                setVenter(false); 
            }
        };
        sjekkSession(); //Kaller funksjonen for å sjekke brukerens session
    }, []); //Gjør som at komponenten kun kjøres en gang når den er lastet inn

    return { bruker, setBruker, venter }; //Returnerer brukerdata og lastestatus
};

export default HentBruker;