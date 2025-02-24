import React from 'react';

const Sikkerhet = () => {
  return (
    <div className="min-h-screen bg-white py-8">
      <div className="max-w-4xl mx-auto p-8">
        <h1 className="text-3xl font-bold text-center mb-6">Sikkerhet</h1>
        <div className="space-y-6">
          <section>
            <h2 className="text-2xl font-semibold mb-4">Sikkerhetstiltak</h2>
            <p className="text-gray-700">
              Vi tar sikkerhet på alvor og implementerer strenge tiltak for å beskytte data og brukerinformasjon. Våre sikkerhetstiltak inkluderer:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-gray-700">
              <li>
                <strong>Logging og overvåkning:</strong> Vi bruker <span className="font-semibold">Winston</span> for sentralisert logging og overvåkning av potensielle sikkerhetshendelser.
              </li>
              <li>
                <strong>Sikkerhetsheadere:</strong> <span className="font-semibold">Helmet</span> er implementert for å styrke HTTP-headere og beskytte mot vanlige angrep som cross-site scripting (XSS) og clickjacking.
              </li>
              <li>
                <strong>Autentisering og tilgangskontroll:</strong> <span className="font-semibold">Passport.js</span> håndterer sikker brukerautentisering med støtte for OAuth, JWT og strategibasert autentisering.
              </li>
              <li>
                <strong>Sikker hosting:</strong> Applikasjonen kjører på <span className="font-semibold">Heroku</span> med tvungen HTTPS og automatisk oppdatering av sikkerhetsavhengigheter.
              </li>
              <li>
                <strong>Beskyttelse mot angrep:</strong> Vi bruker rate limiting, input-sanitization og andre teknikker for å forhindre brute-force-angrep, SQL-injeksjon og andre vanlige trusler.
              </li>
            </ul>
          </section>
          <section>
            <h2 className="text-2xl font-semibold mb-4">Kontakt Oss</h2>
            <p className="text-gray-700">
              Hvis du har spørsmål eller bekymringer angående sikkerheten på vår nettside, kan du kontakte oss på{' '}
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

export default Sikkerhet;