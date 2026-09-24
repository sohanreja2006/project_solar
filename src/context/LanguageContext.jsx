import { createContext, useContext, useState, useEffect } from 'react';
import { translations } from '../translations/translations';

const LanguageContext = createContext();

export function LanguageProvider({ children }) {
  const [lang, setLangState] = useState(() => {
    try {
      const saved = localStorage.getItem('loom_solar_lang');
      if (saved && ['en', 'bn', 'hi'].includes(saved)) return saved;
    } catch (e) {
      // ignore
    }
    return 'en';
  });

  const setLang = (newLang) => {
    if (!['en', 'bn', 'hi'].includes(newLang)) return;
    setLangState(newLang);
    try {
      localStorage.setItem('loom_solar_lang', newLang);
    } catch (e) {
      // ignore
    }
  };

  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  const t = translations[lang] || translations.en;

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
