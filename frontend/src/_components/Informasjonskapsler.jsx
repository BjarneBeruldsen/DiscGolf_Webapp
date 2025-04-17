//Author: Laurent Zogaj
import React from 'react';

const Informasjonskapsler = () => {
    return (
        <div className="p-6 max-w-3xl mx-auto">
            <h1 className="text-3xl font-bold mb-4">Informasjonskapsler</h1>
            <p>Vi bruker informasjonskapsler (cookies) for å sikre funksjonalitet og sikkerhet.</p>

            {/* Inspo hentet herifra: https://cookieinformation.com/no/kunnskapsbase/blog-nb/cookie-banner-tekst/ */}

            <h2 className="text-2xl font-semibold mt-6 mb-2">1. Hva er informasjonskapsler?</h2>
            <p>Informasjonskapsler er små tekstfiler som lagres på enheten din når du besøker en nettside. De brukes for å lagre informasjon mellom besøk.</p>

            <h2 className="text-2xl font-semibold mt-6 mb-2">2. Hvilke informasjonskapsler bruker vi?</h2>
            <p>Vi bruker kun en informasjonskapsel, og den er nødvendig for at applikasjonen skal være funksjonell:</p>
            <ul className="list-disc pl-6 mt-2">
                <li>
                    <strong>connect.sid:</strong> Denne informasjonskapselen opprettes automatisk ved innlogging, og brukes til å holde deg innlogget så lenge sesjonen varer. 
                    Den inneholder ingen personlig informasjon, og slettes når du logger ut eller etter en viss tids inaktivitet.
                </li>
            </ul>
            <p className="mt-2">
                Vi bruker ikke analyse- eller markedsføringskapsler.
            </p>

            <h2 className="text-2xl font-semibold mt-6 mb-2">3. Hvordan administrerer jeg informasjonskapsler?</h2>
            <p>Du kan administrere og slette informasjonskapsler via innstillingene i nettleseren din. 
            Hvis du sletter nødvendige informasjonskapsler, kan innlogging og enkelte funksjoner slutte å fungere.</p>
        </div>
    );
};

export default Informasjonskapsler;