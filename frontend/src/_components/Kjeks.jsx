//Author: Laurent Zogaj
import React, { useState, useEffect } from 'react';

const Kjeks = () => {
    const [visBanner, setVisBanner] = useState(false);

    useEffect(() => {
        const lest = sessionStorage.getItem('informasjonskapslerLest');
        if (!lest) {
            setVisBanner(true);
        }
    }, []);

    const lukkBanner = () => {
        sessionStorage.setItem('informasjonskapslerLest', 'true');
        setVisBanner(false);
    };

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
                boxShadow: '0 -4px 10px rgba(0,0,0,0.2)'
            }}
        >
            <div className="max-w-6xl mx-auto">
                <div className="flex flex-col md:flex-row justify-between items-center">
                    <div className="mb-4 md:mb-0 flex-1">
                        <h3 className="text-xl font-bold mb-2">Informasjonskapsler</h3>
                        <p className="text-base">
                            Vi bruker kun nødvendige informasjonskapsler for å forbedre brukeropplevelsen og sørge for at nettsiden fungerer optimalt. 
                            Ved å benytte nettsiden godtar du vår bruk av informasjonskapsler.
                        </p>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-3 ml-0 md:ml-6">
                        <a href="/Informasjonskapsler" className="text-blue-300 hover:text-blue-100 underline text-center">
                            Les mer
                        </a>
                        <button
                            onClick={lukkBanner}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded font-medium text-base min-w-[120px]"
                        >
                            Jeg har lest
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Kjeks;