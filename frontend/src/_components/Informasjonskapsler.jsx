//Author: Laurent Zogaj

import React from 'react';

const Informasjonskapsler = () => {
    return (
        <div className="p-6 max-w-3xl mx-auto">
            <h1 className="text-3xl font-bold mb-4">Informasjonskapsler</h1>
            <p>Vi bruker informasjonskapsler (cookies) for å forbedre din brukeropplevelse.</p>

                {/* Inspo hentet herifra: https://cookieinformation.com/no/kunnskapsbase/blog-nb/cookie-banner-tekst/ */}

            <h2 className="text-2xl font-semibold mt-6 mb-2">1. Hva er informasjonskapsler?</h2>
            <p>Informasjonskapsler er små tekstfiler eller binære data som lagres på enheten din når du besøker en nettside.</p>

            <h2 className="text-2xl font-semibold mt-6 mb-2">2. Hvilke typer informasjonskapsler bruker vi?</h2>
            <ul className="list-disc pl-6">
                <li><strong>Nødvendige informasjonskapsler:</strong> Sikrer at nettsiden fungerer som den skal.</li>
                <li><strong>Analyse-informasjonskapsler:</strong> Hjelper oss med å forstå hvordan brukere navigerer på siden.</li>
                <li><strong>Markedsførings-informasjonskapsler:</strong> Brukes til målrettet reklame.</li>
            </ul>

            <h2 className="text-2xl font-semibold mt-6 mb-2">3. Hvordan administrerer jeg informasjonskapsler?</h2>
            <p>Du kan administrere informasjonskapsler i nettleseren din og slette dem når som helst.</p>

            {/* 
            <h2 className="text-2xl font-semibold mt-6 mb-2">4. Trekk tilbake samtykke</h2>
            <button
                onClick={() => {
                    localStorage.removeItem("samtykkeForInformasjonskapsler");
                    document.cookie = "samtykkeForInformasjonskapsler=; path=/; max-age=0"; //Har ikke fått testet dette godt nok enda, må testes mer og legge til en cookie banner som er koblet til denne funksjonen, på et vis.
                    window.location.reload(); 
                }}
                className="bg-red-500 px-4 py-2 mt-2 text-white"
            >
                Trekk tilbake samtykke
            </button>
            */}
        </div>
    );
};

export default Informasjonskapsler;