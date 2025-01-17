import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Import translation files directly
import enTranslation from './public/locales/en/translation.json';
import knTranslation from './public/locales/kn/translation.json';
import hiTranslation from './public/locales/hi/translation.json';

i18n.use(initReactI18next).init({
  fallbackLng: 'en',
  lng: 'en', // default language
  supportedLngs: ['en', 'kn', 'hi'],
  resources: {
    en: { translation: enTranslation },
    kn: { translation: knTranslation },
    hi: { translation: hiTranslation },
  },
  interpolation: { escapeValue: false }, // React already escapes strings
});

export default i18n;

