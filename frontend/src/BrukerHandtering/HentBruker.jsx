// Author: Laurent Zogaj
import { useEffect, useState } from "react";

const HentBruker = () => {
    const [bruker, setBruker] = useState(null);
    const [venter, setVenter] = useState(true);

    useEffect(() => {
        const sjekkSession = async () => {
            try {
                const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/sjekk-session`, {
                    method: "GET",
                    headers: { "Content-Type": "application/json" },
                    credentials: "include",
                });
                if (!response.ok) {
                    throw new Error("Ingen aktiv session");
                }
                const data = await response.json();
                setBruker(data.bruker); 
                console.log("Bruker er logget inn"); 
            } catch (error) {
                console.log("Ingen bruker er logget inn"); 
                setBruker(null);
            } finally {
                setVenter(false);
            }
        };

        sjekkSession();
    }, []);

    return { bruker, setBruker, venter };
};

export default HentBruker;