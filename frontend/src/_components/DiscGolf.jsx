//Author: Laurent Zogaj

/*
En enkel komponent for å vise generell informasjon om DiscGolf.
*/

import React from 'react';
import { useTranslation } from 'react-i18next';

const DiscGolfInfo = () => {
  const { t } = useTranslation();
  return (
    <div className="min-h-screen bg-white py-8">
      <div className="max-w-4xl mx-auto p-8">
        <h1 className="text-3xl font-bold text-center mb-6">{t("Hva er DiscGolf?")}</h1>
        <section className="space-y-6">
          <div>
            <p className="text-gray-700">
              {t("DiscGolf, også kjent som frisbeegolf, er en sport der man kaster en disc (frisbee) mot en metallkurv. Målet er å fullføre hver bane med færrest mulig kast – akkurat som i vanlig golf. Sporten er enkel å lære, rimelig å komme i gang med, og kan spilles av alle aldre.")}
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-semibold mb-2">{t("Spillets gang")}</h2>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li>{t("Spillet starter fra et utslagssted, og det kastes videre fra der disken lander.")}</li>
              <li>{t("Hullet er fullført når disken havner i kurven eller henger i kjettingene.")}</li>
              <li>{t("Hvis disken havner utenfor banen (OB), får man ett straffekast og kaster videre fra der den gikk ut.")}</li>
              <li>{t("Man skal vise hensyn på banen og følge god oppførsel, inkludert å rydde opp etter seg.")}</li>
              <li>
                {t("Det brukes ulike typer disker:")}{" "}
                <strong>{t("drivere")}</strong> {t("for lange kast,")}{" "}
                <strong>{t("midrange")}</strong> {t("for mellomdistanse og")}{" "}
                <strong>{t("puttere")}</strong> {t("for korte, presise kast mot kurven.")} 
              </li>
            </ul>
          </div>

          <div>
            <h2 className="text-2xl font-semibold mb-2">{t("Poengsystem")}</h2>
            <ul className="list-disc pl-6 text-gray-700 space-y-1">
              <li><strong>{t("Birdie")}:</strong> {t("Ett kast under par (-1)")}</li>
              <li><strong>{t("Par")}:</strong> {t("Forventet antall kast (0)")}</li>
              <li><strong>{t("Bogey")}:</strong> {t("Ett kast over par (+1)")}</li>
              <li><strong>{t("Eagle / Albatross")}:</strong> {t("To eller tre kast under par (-2, -3)")}</li>
              <li><strong>{t("Trippel-/Dobbelbogey")}:</strong> {t("Flere kast over par (+2, +3 osv.)")}</li>
            </ul>
          </div>

          <div>
            <h2 className="text-2xl font-semibold mb-2">{t("Vil du lære mer?")}</h2>
            <p className="text-gray-700">
              {t("For en full oversikt over reglene kan du lese mer hos:")}
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
                  {t("Wikipedia – Diskgolf")}
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