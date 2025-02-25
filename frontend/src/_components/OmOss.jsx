import React from 'react';

const OmOss = () => {
  return (
    <div className="min-h-screen bg-white py-8">
      <div className="max-w-4xl mx-auto p-8">
        <h1 className="text-3xl font-bold mb-6">Om Oss</h1>
        <div className="space-y-6">
         
          <section>
            <h2 className="text-2xl font-semibold mb-4">Hvem er vi?</h2>
            <p className="text-gray-700">
              Vi er Discgolf Bø, en gruppe entusiastiske Studenter fra Bø som har som mål å gjøre discgolf enda mer engasjerende og tilgjengelig for alle.
               Vår lidenskap for sporten og ønsket om å skape en bedre opplevelse for spillere har ført til utviklingen av vår webapplikasjon.
            </p>
          </section>

          
          <section>
            <h2 className="text-2xl font-semibold mb-4">Vår visjon</h2>
            <p className="text-gray-700">
              Vi ønsker å gjøre discgolf til en sosial og konkurransedyktig sport der alle, uavhengig av erfaring, kan delta, lære og ha det gøy.
               Gjennom vår plattform ønsker vi å knytte sammen spillere, klubber og turneringer på en enkel og effektiv måte.
            </p>
          </section>

         
          <section>
            <h2 className="text-2xl font-semibold mb-4">Hva tilbyr vi?</h2>
            <ul className="list-disc pl-6 space-y-2 text-gray-700">
              <li>
                <strong>Spill og lagre opplevelser:</strong> Med vår app kan du enkelt registrere og lagre dine discgolf-runders resultater. 
                Følg fremgangen din over tid og del opplevelsene med venner.
              </li>
              <li>
                <strong>Delta i turneringer:</strong> Bli med i spennende turneringer arrangert av klubber eller andre spillere.
                 Hold deg oppdatert på kommende arrangementer og meld deg på med noen få klikk.
              </li>
              <li>
                <strong>Opprett klubber:</strong> Har du lyst til å starte din egen discgolf-klubb? 
                Gjør det enkelt gjennom vår nettside! Inviter medlemmer, arranger turneringer og bygg et lokalt discgolf-miljø.
              </li>
              <li>
                <strong>Bli med i en klubb:</strong> Søk opp klubber i ditt område og bli medlem for å delta i aktiviteter,
                 turneringer og sosialt samvær med andre discgolf-entusiaster.
              </li>
            </ul>
          </section>

         
          <section>
            <h2 className="text-2xl font-semibold mb-4">Hvorfor velge oss?</h2>
            <p className="text-gray-700">
              Vi er dedikerte til å skape en plattform som er enkel å bruke,
               men samtidig kraftig nok til å møte behovene til både nybegynnere og erfarne spillere. 
              Vårt fokus er på fellesskap, læring og gode opplevelser på banen.
            </p>
          </section>

          
          <section>
            <h2 className="text-2xl font-semibold mb-4">Kontakt oss</h2>
            <p className="text-gray-700">
              Har du spørsmål, tilbakemeldinger eller ønsker å samarbeide med oss? Ta gjerne kontakt på{' '}
              <a href="mailto:DiscgolfBø@gmail.no" className="text-blue-500 hover:underline">
                DiscgolfBø@gmail.no
              </a>
              . 
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default OmOss;