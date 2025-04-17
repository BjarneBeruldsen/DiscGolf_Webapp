//Author: Laurent Zogaj
import React from 'react';

/* Inspo hentet herifra: https://cookieinformation.com/no/kunnskapsbase/blog-nb/cookie-banner-tekst/ */

const Informasjonskapsler = () => {
    return (
        <div className="min-h-screen bg-white py-8">
            <div className="max-w-4xl mx-auto p-8">
                <h1 className="text-3xl font-bold text-center mb-6">Informasjonskapsler</h1>

                <h2 className="text-2xl font-semibold mt-6 mb-2">1. Hva er informasjonskapsler?</h2>
                <p className="text-gray-700">
                    Informasjonskapsler er små tekstfiler som lagres på enheten din når du besøker en nettside. 
                    De brukes for å lagre informasjon mellom besøk.
                </p>

                <h2 className="text-2xl font-semibold mt-6 mb-2">2. Hvilke informasjonskapsler bruker vi?</h2>
                <p className="text-gray-700">
                    Vi bruker kun en informasjonskapsel, og den er nødvendig for at applikasjonen skal være funksjonell:
                </p>
                <ul className="list-disc pl-6 mt-2 text-gray-700">
                    <li>
                        <strong>connect.sid:</strong> Denne informasjonskapselen opprettes automatisk ved innlogging, og brukes til å holde deg innlogget så lenge sesjonen varer. 
                        Den inneholder ingen personlig informasjon, og slettes når du logger ut eller etter en viss tids inaktivitet.
                    </li>
                </ul>
                <p className="text-gray-700 mt-2">
                    Vi bruker ikke analyse- eller markedsføringskapsler.
                </p>

                <h2 className="text-2xl font-semibold mt-6 mb-2">3. Hvordan administrerer jeg informasjonskapsler?</h2>
                <p className="text-gray-700">
                    Du kan administrere og slette informasjonskapsler via innstillingene i nettleseren din. 
                    Hvis du sletter nødvendige informasjonskapsler, kan innlogging og enkelte funksjoner slutte å fungere.
                </p>
            </div>
        </div>
    );
};

export default Informasjonskapsler;