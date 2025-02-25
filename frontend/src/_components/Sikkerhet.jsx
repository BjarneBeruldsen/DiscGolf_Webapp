//Author: Laurent Zogaj

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
              Vi tar sikkerhet på alvor og implementerer robuste tiltak for å beskytte både brukerdata og systemet vårt. 
            </p>
            <ul className="list-disc pl-6 space-y-2 text-gray-700">
              <li>
                <strong>Kontinuerlig overvåkning:</strong> Alle aktiviteter logges og overvåkes for å oppdage uvanlige mønstre eller sikkerhetstrusler.
              </li>
              <li>
                <strong>Beskyttelse av data:</strong> Vi anvender sikre standarder for kryptering og lagring for å forhindre uautorisert tilgang.
              </li>
              <li>
                <strong>Sikre forbindelser:</strong> All trafikk til og fra tjenesten skjer via sikre protokoller for å beskytte mot datalekkasjer.
              </li>
              <li>
                <strong>Tilgangskontroll:</strong> Strenge regler for autentisering og autorisasjon sikrer at kun autoriserte brukere har tilgang til sensitiv informasjon.
              </li>
              <li>
                <strong>Forebygging av angrep:</strong> Systemet er beskyttet mot vanlige angrep som brute-force, injeksjonsangrep og forsøk på uautorisert tilgang.
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