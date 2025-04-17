//Author: Laurent Zogaj

import React from 'react';

const DiscGolfInfo = () => {
  return (
    <div className="min-h-screen bg-white py-8">
      <div className="max-w-4xl mx-auto p-8">
        <h1 className="text-3xl font-bold text-center mb-6">Hva er Diskgolf?</h1>
        <section className="space-y-6">
          <div>
            <p className="text-gray-700">
              Diskgolf, også kjent som frisbeegolf, er en sport der man kaster en disc (frisbee) mot en metallkurv. 
              Målet er å fullføre hver bane med færrest mulig kast – akkurat som i vanlig golf.
              Sporten er enkel å lære, rimelig å komme i gang med, og kan spilles av alle aldre.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-semibold mb-2">Spillets gang</h2>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li>Spillet starter fra et utslagssted, og det kastes videre fra der disken lander.</li>
              <li>Hullet er fullført når disken havner i kurven eller henger i kjettingene.</li>
              <li>Hvis disken havner utenfor banen (OB), får man ett straffekast og kaster videre fra der den gikk ut.</li>
              <li>Man skal vise hensyn på banen og følge god oppførsel, inkludert å rydde opp etter seg.</li>
              <li>Det brukes ulike typer disker: <strong>drivere</strong> for lange kast, <strong>midrange</strong> for mellomdistanse og <strong>puttere</strong> for korte, presise kast mot kurven.</li>
            </ul>
          </div>

          <div>
            <h2 className="text-2xl font-semibold mb-2">Poengsystem</h2>
            <ul className="list-disc pl-6 text-gray-700 space-y-1">
              <li><strong>Birdie:</strong> Ett kast under par (-1)</li>
              <li><strong>Par:</strong> Forventet antall kast (0)</li>
              <li><strong>Bogey:</strong> Ett kast over par (+1)</li>
              <li><strong>Eagle / Albatross:</strong> To eller tre kast under par (-2, -3)</li>
              <li><strong>Trippel-/Dobbelbogey:</strong> Flere kast over par (+2, +3 osv.)</li>
            </ul>
          </div>

          <div>
            <h2 className="text-2xl font-semibold mb-2">Vil du lære mer?</h2>
            <p className="text-gray-700">
              For en full oversikt over reglene kan du lese mer hos:
            </p>
            <ul className="list-disc pl-6 text-gray-700">
              <li>
                <a
                  href="https://www.pdga.com/rules"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  PDGA Official Rules & Competition Manual
                </a>
              </li>
              <li>
                <a
                  href="https://no.wikipedia.org/wiki/Diskgolf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  Wikipedia – Diskgolf
                </a>
              </li>
            </ul>
          </div>
        </section>
      </div>
    </div>
  );
};

export default DiscGolfInfo;