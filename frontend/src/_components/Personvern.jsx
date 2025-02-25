//Author: Laurent Zogaj

import React from 'react';

const Personvern = () => {
    return (
        <div className="p-6 max-w-3xl mx-auto">
            <h1 className="text-3xl font-bold mb-4">Personvernserklæring</h1>
            <p className="mb-4">Sist oppdatert: <strong>24.02.2025</strong></p>

            {/* Inspo hentet herifra: https://gdprcontrol.no/personvernerklaring-mal/ */}

            <p className="mb-4">
                <strong>DiscGolfBø</strong> er behandlingsansvarlig for behandlingen av personopplysninger som beskrevet i denne erklæringen.  
                Denne personvernerklæringen gjelder for: 
                <a href="https://disk-applikasjon-39f504b7af19.herokuapp.com/" className="text-blue-600 underline">
                    https://disk-applikasjon-39f504b7af19.herokuapp.com/
                </a>.
            </p>

            <h2 className="text-2xl font-semibold mt-6 mb-2">1. Hvilke personopplysninger vi samler inn</h2>
            <p>Vi behandler følgende kategorier av personopplysninger:</p>
            <ul className="list-disc pl-6">
                <li><strong>Grunnleggende informasjon:</strong> Navn, brukernavn</li>
                <li><strong>Kontaktinformasjon:</strong> E-postadresse</li>
                <li><strong>Konto og profilinformasjon:</strong> Passord, kontoinnstillinger</li>
                <li>
                    <strong>Informasjonskapsler:</strong> Se vår 
                    <a href="/informasjonskapsler" className="text-blue-600 underline"> Informasjonskapsler</a>
                </li>
            </ul>

            <h2 className="text-2xl font-semibold mt-6 mb-2">2. Hvordan vi bruker personopplysningene</h2>
            <p>Vi bruker dine opplysninger til:</p>
            <ul className="list-disc pl-6">
                <li>Å administrere kontoen din og gi deg tilgang til tjenesten.</li>
                <li>Analyse og forbedring av våre tjenester.</li>
                <li>Sikkerhet, for å beskytte brukerne våre mot svindel.</li>
            </ul>
            <p>Vi deler ikke dine personopplysninger med tredjeparter, med mindre det er nødvendig for å oppfylle en avtale med deg eller vi er pålagt dette ved lov.</p>

            <h2 className="text-2xl font-semibold mt-6 mb-2">3. Dine rettigheter</h2>
            <p>Du har følgende rettigheter når det gjelder dine personopplysninger:</p>
            <ul className="list-disc pl-6">
                <li><strong>Rett til innsyn:</strong> Du kan be om en kopi av dine opplysninger.</li>
                <li><strong>Rett til korrigering:</strong> Du kan be oss rette feilaktige opplysninger.</li>
                <li><strong>Rett til sletting:</strong> Du kan be oss slette dine data (med unntak av data vi er pålagt å lagre).</li>
                <li><strong>Rett til dataportabilitet:</strong> Du kan få utlevert dine data i et maskinlesbart format. https://disk-applikasjon-39f504b7af19.herokuapp.com/Personvern</li>
            </ul>
            <p>
              For å utøve dine rettigheter, kontakt oss på: 
              <a href="mailto:DiscgolfBø@gmail.com" className="text-blue-600 underline"> DiscgolfBø@gmail.com</a>
            </p>

            <h2 className="text-2xl font-semibold mt-6 mb-2">4. Klage</h2>
            <p>Hvis du mener vi ikke overholder personvernlovgivningen, kan du klage til Datatilsynet:</p>
            <p>
                <a href="https://www.datatilsynet.no/om-datatilsynet/kontakt-oss/" className="text-blue-600 underline">
                    https://www.datatilsynet.no/om-datatilsynet/kontakt-oss/
                </a>
            </p>
        </div>
    );
};

export default Personvern;