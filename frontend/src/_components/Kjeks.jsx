//Author: Laurent Zogaj
/*
En komponent som oppretter et banner for informasjonskapsler som vises nederst på skjermen.
Dette er lagret i sessionStorage så denne vil alltid dukke opp uansett bruker når man forlatter nettsider vår og kommer tilbake.
Jeg hadde egentlig lyst til å bruke dette med en cookie i begynnelsen. Men så endret jeg det til session men det ble for mye mas og kanskje ikke helt gjennomtenkt. 
Og nå local storage
*/

import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

const Kjeks = () => {
    const [visBanner, setVisBanner] = useState(false); //State
    const { t } = useTranslation();

    useEffect(() => {
        //Sjekker om brukeren tidligere har lukket banneret i nåværende sesjon
        const lest = localStorage.getItem('informasjonskapslerLest');
        if (!lest) {
            //Hvis ikke, vises banneret
            setVisBanner(true);
        }
    }, []);
    //Funksjon for å lukke banneret og lagre status i sessionstorage 
    const lukkBanner = () => {
        localStorage.setItem('informasjonskapslerLest', 'true');
        setVisBanner(false);
    };
    //Hvis banneret ikke skal komme frem returnerer vi null altså ingenting skjer
    if (!visBanner) return null;

    return (
        <div 
            className="fixed bottom-0 left-0 right-0 bg-gray-800 text-white p-6 z-[9999] shadow-xl w-full"
            style={{
                position: 'fixed',
                bottom: '0',
                left: '0',
                right: '0',
                zIndex: 9999,
                boxShadow: '0 -4px 10px rgba(0,0,0,0.2)'        //Dette måtte jeg få hjelp til av copilot
            }}
        >
            <div className="max-w-6xl mx-auto">
                <div className="flex flex-col md:flex-row justify-between items-center">
                    {/* Informasjonstekst */}
                    <div className="mb-4 md:mb-0 flex-1">
                        <h3 className="text-xl font-bold mb-2">{t("Informasjonskapsler")}</h3>
                        <p className="text-base">
                            {t("Vi bruker kun nødvendige informasjonskapsler for å forbedre brukeropplevelsen og sørge for at nettsiden fungerer optimalt. Ved å benytte nettsiden godtar du vår bruk av informasjonskapsler.")}
                        </p>
                    </div>
                    {/* Lenke til mer info og knapp for å godta */}
                    <div className="flex flex-col sm:flex-row gap-3 ml-0 md:ml-6">
                        <a href="/Informasjonskapsler" className="text-blue-300 hover:text-blue-100 underline text-center">
                            {t("Les mer")}
                        </a>
                        <button
                            onClick={lukkBanner}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded font-medium text-base min-w-[120px]"
                        >
                            {t("Jeg har lest")}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Kjeks;