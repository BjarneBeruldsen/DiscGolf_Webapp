//Author: Laurent Zogaj

/*
Denne filen håndterer oversettelser.
Den skal automatisk "Switche" over til engelsk basert på systemspråk.
Vi har ikke implementert en knapp for dette, dessverre så enten via å sette engelsk til nummer 1 språkvalg i nettleseren eller kjøre den koden her nede i konsollet. 
Det er visse sider som ikke er 100% oversatt, det bør ha blitt markert at det ikke er, hvis ikke beklger jeg det. 
*/

//Inspo hentet fra: https://medium.com/@thelearning-curve/making-your-mern-stack-app-multilingual-with-i18next-cf30f4c77210 og https://www.i18next.com/


import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import HttpApi from 'i18next-http-backend';
import LanguageDetector from 'i18next-browser-languagedetector';

i18n
  .use(HttpApi)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    supportedLngs: ['no', 'en'],
    fallbackLng: 'no',
    detection: {
      order: ['path', 'cookie', 'localStorage', 'navigator', '/'],
      caches: ['cookie'],
    },
    backend: {
      loadPath: '/_locales/{{lng}}/translation.json',
    },
    interpolation: {
      escapeValue: false
    }
  });

//Gjør det mulig å teste oversettelsen direkte i console i nettleseren
//Bruk: i18n.changeLanguage('en') for å teste og i18n.changeLanguage('no') for norsk
//Spurte copilot om dette
window.i18n = i18n;

export default i18n;