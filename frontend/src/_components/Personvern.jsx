//Author: Laurent Zogaj

import React from 'react';

const Personvern = () => {
    return (
        <div className="min-h-screen bg-white py-8">
            <div className="max-w-4xl mx-auto p-8">
                <h1 className="text-3xl font-bold text-center mb-6">Personvernserklæring</h1>
                <p className="text-sm text-gray-700 text-center mb-6"><strong>Sist oppdatert:</strong> 18.04.2025</p>

                {/* Inspo hentet herifra: https://gdprcontrol.no/personvernerklaring-mal/ */}

                <p className="text-gray-700 mb-4">
                    <strong>DiscGolf</strong> er behandlingsansvarlig for behandlingen av personopplysninger som beskrevet i denne erklæringen.  
                    Denne personvernerklæringen gjelder for: 
                    <a href="https://disk-applikasjon-39f504b7af19.herokuapp.com/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline ml-1">
                        https://disk-applikasjon-39f504b7af19.herokuapp.com/
                    </a>.
                </p>

                <h2 className="text-2xl font-semibold mt-6 mb-2">1. Hvilke personopplysninger vi samler inn</h2>
                <p className="text-gray-700">Vi behandler følgende kategorier av personopplysninger:</p>
                <ul className="list-disc pl-6 mt-2 text-gray-700 space-y-1">
                    <li><strong>Grunnleggende informasjon:</strong> Brukernavn</li>
                    <li><strong>Kontaktinformasjon:</strong> Navn, bosted og telefonnummer (hvis oppgitt frivillig av bruker)</li>
                    <li><strong>Konto og profilinformasjon:</strong> Passord, kontoinnstillinger</li>
                    <li>
                        <strong>Informasjonskapsler:</strong> Se vår 
                        <a href="/informasjonskapsler" className="text-blue-600 hover:underline ml-1">Informasjonskapsler</a>-side.
                    </li>
                </ul>

                <h2 className="text-2xl font-semibold mt-6 mb-2">2. Hvordan vi bruker personopplysningene</h2>
                <p className="text-gray-700">Vi bruker dine opplysninger til:</p>
                <ul className="list-disc pl-6 mt-2 text-gray-700 space-y-1">
                    <li>Å administrere kontoen din og gi deg tilgang til tjenesten.</li>
                    <li>Sikkerhet, for å beskytte brukerne våre mot svindel.</li>
                </ul>
                <p className="text-gray-700 mt-2">
                    Vi deler ikke dine personopplysninger med tredjeparter, med mindre det er nødvendig for å oppfylle en avtale med deg eller vi er pålagt dette ved lov.
                </p>

                <h2 className="text-2xl font-semibold mt-6 mb-2">3. Dine rettigheter</h2>
                <p className="text-gray-700">Du har følgende rettigheter når det gjelder dine personopplysninger:</p>
                <ul className="list-disc pl-6 mt-2 text-gray-700 space-y-1">
                    <li><strong>Rett til innsyn:</strong> Du kan be om en kopi av dine opplysninger.</li>
                    <li><strong>Rett til korrigering:</strong> Du kan be oss rette feilaktige opplysninger.</li>
                    <li><strong>Rett til sletting:</strong> Du kan be oss slette dine data (med unntak av data vi er pålagt å lagre).</li>
                    <li><strong>Rett til dataportabilitet:</strong> Du kan få utlevert dine data i et maskinlesbart format.</li>
                </ul>
                <p className="text-gray-700 mt-2">
                    For å utøve dine rettigheter, kontakt oss på: 
                    <a href="mailto:bodiscgolf1@gmail.com" className="text-blue-600 hover:underline ml-1">bodiscgolf1@gmail.com</a>
                </p>

                <h2 className="text-2xl font-semibold mt-6 mb-2">4. Klage</h2>
                <p className="text-gray-700">Hvis du mener vi ikke overholder personvernlovgivningen, kan du klage til Datatilsynet:</p>
                <p className="text-gray-700">
                    <a href="https://www.datatilsynet.no/om-datatilsynet/kontakt-oss/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                        https://www.datatilsynet.no/om-datatilsynet/kontakt-oss/
                    </a>
                </p>
            </div>
        </div>
    );
};

export default Personvern;