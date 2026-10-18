import { useContext } from 'react';
import { LanguageContext } from './context';

/**
 * Har qanday komponentdan tilga kirish:
 *
 *   const { lang, setLang, tr, site } = useLanguage();
 *   <h1>{tr(site.hero.titleTop)}</h1>
 */
export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLanguage <LanguageProvider> ichida ishlatilishi kerak');
  return ctx;
}

export default useLanguage;
