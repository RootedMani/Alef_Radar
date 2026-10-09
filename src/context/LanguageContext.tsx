import React, { createContext, useContext, useEffect, useState } from 'react';
import { fa } from '../locales/fa';
import { en } from '../locales/en';

type Language = 'fa' | 'en';
type TranslationSchema = typeof fa;

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;
  t: TranslationSchema;
  isRtl: boolean;
}

const LanguageContext = createContext<LanguageContextType>({
  language: 'fa',
  setLanguage: () => {},
  toggleLanguage: () => {},
  t: fa,
  isRtl: true,
});

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem('opportunityradar_lang') || localStorage.getItem('language');
    if (saved === 'en' || saved === 'fa') {
      return saved;
    }
    // Default language is Persian as requested by user
    return 'fa';
  });

  const isRtl = language === 'fa';
  const t = isRtl ? fa : (en as TranslationSchema);

  useEffect(() => {
    const root = document.documentElement;
    root.setAttribute('lang', language);
    root.setAttribute('dir', isRtl ? 'rtl' : 'ltr');
    
    if (isRtl) {
      document.body.classList.add('rtl-layout');
      document.body.classList.remove('ltr-layout');
    } else {
      document.body.classList.add('ltr-layout');
      document.body.classList.remove('rtl-layout');
    }

    localStorage.setItem('opportunityradar_lang', language);
    localStorage.setItem('language', language);
  }, [language, isRtl]);

  const setLanguage = (newLang: Language) => {
    setLanguageState(newLang);
  };

  const toggleLanguage = () => {
    setLanguageState((prev) => (prev === 'fa' ? 'en' : 'fa'));
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, toggleLanguage, t, isRtl }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
