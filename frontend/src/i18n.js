//Author: Laurent Zogaj

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
window.i18n = i18n;

export default i18n;