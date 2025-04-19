//Author: Laurent Zogaj

import React from 'react';
import { useTranslation } from 'react-i18next';

/* Inspo hentet herifra: https://gdprcontrol.no/personvernerklaring-mal/ */

const Personvern = () => {
    const { t } = useTranslation();
    return (
        <div className="min-h-screen bg-white py-8">
            <div className="max-w-4xl mx-auto p-8">
                <h1 className="text-3xl font-bold text-center mb-6">{t("Personvernserklæring")}</h1>
                <p className="text-sm text-gray-700 text-center mb-6">
                    <strong>{t("Sist oppdatert")}:</strong> 19.04.2025
                </p>
                <p className="text-gray-700 mb-4">
                    <strong>DiscGolf</strong> {t("er behandlingsansvarlig for behandlingen av personopplysninger som beskrevet i denne erklæringen.")}  
                    {t(" Denne personvernerklæringen gjelder for:")} 
                    <a
                        href="https://disk-applikasjon-39f504b7af19.herokuapp.com/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline ml-1"
                    >
                        https://disk-applikasjon-39f504b7af19.herokuapp.com/
                    </a>.
                </p>
                <h2 className="text-2xl font-semibold mt-6 mb-2">{t("1. Hvilke personopplysninger vi samler inn")}</h2>
                <p className="text-gray-700">{t("Vi behandler følgende kategorier av personopplysninger:")}</p>
                <ul className="list-disc pl-6 mt-2 text-gray-700 space-y-1">
                    <li><strong>{t("Grunnleggende informasjon")}:</strong> {t("Brukernavn")}</li>
                    <li><strong>{t("Kontaktinformasjon")}:</strong> {t("Navn, bosted og telefonnummer (hvis oppgitt frivillig av bruker)")}</li>
                    <li><strong>{t("Konto og profilinformasjon")}:</strong> {t("Passord, kontoinnstillinger")}</li>
                    <li>
                        <strong>{t("Informasjonskapsler")}:</strong> {t("Se vår")}
                        <a href="/informasjonskapsler" className="text-blue-600 hover:underline ml-1">
                            {t("informasjonskapsler-side")}
                        </a>.
                    </li>
                </ul>
                <h2 className="text-2xl font-semibold mt-6 mb-2">{t("2. Hvordan vi bruker personopplysningene")}</h2>
                <p className="text-gray-700">{t("Vi bruker dine opplysninger til:")}</p>
                <ul className="list-disc pl-6 mt-2 text-gray-700 space-y-1">
                    <li>{t("Å administrere kontoen din og gi deg tilgang til tjenesten.")}</li>
                    <li>{t("Å ivareta sikkerheten og beskytte brukerne våre mot svindel.")}</li>
                </ul>
                <p className="text-gray-700 mt-2">
                    <strong>{t("Vi deler ikke dine personopplysninger med tredjeparter, med mindre det er nødvendig for å oppfylle en avtale med deg, eller vi er lovpålagt å gjøre det.")}</strong>
                </p>
                <h2 className="text-2xl font-semibold mt-6 mb-2">{t("3. Dine rettigheter")}</h2>
                <p className="text-gray-700">{t("Du har følgende rettigheter når det gjelder dine personopplysninger:")}</p>
                <ul className="list-disc pl-6 mt-2 text-gray-700 space-y-1">
                    <li><strong>{t("Rett til innsyn")}:</strong> {t("Du kan be om en kopi av dine opplysninger.")}</li>
                    <li><strong>{t("Rett til korrigering")}:</strong> {t("Du kan be oss rette feilaktige opplysninger.")}</li>
                    <li><strong>{t("Rett til sletting")}:</strong> {t("Du kan be oss slette dine data (med unntak av data vi er pålagt å lagre).")}</li>
                    <li><strong>{t("Rett til dataportabilitet")}:</strong> {t("Du kan få utlevert dine data i et maskinlesbart format.")}</li>
                </ul>
                <p className="text-gray-700 mt-2">
                    {t("Har du spørsmål eller bekymringer angående rettighetene dine?")}
                    <a href="/KontaktOss" className="text-blue-600 hover:underline ml-1">{t("Kontakt oss")}</a>.
                </p>
                <h2 className="text-2xl font-semibold mt-6 mb-2">{t("4. Klage")}</h2>
                <p className="text-gray-700">{t("Hvis du mener vi ikke overholder personvernlovgivningen, kan du klage til Datatilsynet:")}</p>
                <p className="text-gray-700">
                    <a
                        href="https://www.datatilsynet.no/om-datatilsynet/kontakt-oss/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline"
                    >
                        https://www.datatilsynet.no/om-datatilsynet/kontakt-oss/
                    </a>
                </p>
                <h2 className="text-2xl font-semibold mt-6 mb-2">{t("5. Rettslig grunnlag og lovgivning")}</h2>
                <p className="text-gray-700">
                    {t("Behandlingen av personopplysninger hos oss skjer i henhold til")} <strong>{t("personopplysningsloven")}</strong> {t("og")} <strong>GDPR</strong>. {t("Du kan lese mer om lovverket og dine rettigheter på Datatilsynets nettsider:")}
                </p>
                <p className="text-gray-700 mt-2">
                    <a
                        href="https://www.datatilsynet.no/regelverk-og-verktoy/lover-og-regler/om-personopplysningsloven-og-nar-den-gjelder/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline"
                    >
                        {t("Om personopplysningsloven og når den gjelder")}
                    </a>
                </p>
                <h2 className="text-2xl font-semibold mt-6 mb-2">{t("6. Ønsker du å slette dine data?")}</h2>
                <p className="text-gray-700 mt-2">
                    {t("Du kan enkelt slette din konto og alle tilknyttede data ved å")}
                    <a href="/Innlogging" className="text-blue-600 hover:underline ml-1">{t("logge inn")}</a>, 
                    {t("deretter gå til Medlemskap → Brukerinnstillinger →")} <strong>{t("Slett meg")}</strong>.
                </p>
            </div>
        </div>
    );
};

export default Personvern;