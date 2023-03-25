import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import Backend from 'i18next-http-backend';
import LanguageDetector from 'i18next-browser-languagedetector';

import translationEN_US from "../public/assets/locales/en-us/translation.json";

const fallbackLng = ['en'];
// as we add new languages, we can itemize them here.
const availableLanguages = ['en'];//, 'ar', 'fr'];

const resources = {
    en: {
      translation: translationEN_US
    },
    "en-us": {
        translation: translationEN_US
    }
};
  
  i18n
  .use(Backend) // load translations using http (default                                               public/assets/locals/en/translations)
  .use(LanguageDetector) // detect user language
  .use(initReactI18next) // pass the i18n instance to react-i18next.
  .init({
    resources,
    fallbackLng, // fallback language is english.

    detection: {
      checkWhitelist: true, // options for language detection
    },

    debug: false,

    whitelist: availableLanguages,

    interpolation: {
      escapeValue: false, // no need for react. it escapes by default
    },
  });

export default i18n;
