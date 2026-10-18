import { useCallback, useEffect, useMemo, useState } from 'react';
import { LanguageContext } from './context';
import site from '../data/site.json';

const STORAGE_KEY = 'voyla:lang';

// Faqat shu fayl ichida — tashqariga `languages` kontekst orqali beriladi
const LANGUAGES = [
  { id: 'uz', label: 'UZ', title: "O'zbekcha" },
  { id: 'ru', label: 'RU', title: 'Русский' },
  { id: 'en', label: 'EN', title: 'English' },
];

const IDS = LANGUAGES.map((item) => item.id);
const DEFAULT = 'uz';

/** Saqlangan tanlov → brauzer tili → o'zbekcha */
function detect() {
  if (typeof window === 'undefined') return DEFAULT;
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved && IDS.includes(saved)) return saved;
  } catch {
    // Maxfiy rejimda localStorage bo'lmasligi mumkin — muammo emas.
  }
  const browser = navigator.language?.toLowerCase() ?? '';
  if (browser.startsWith('ru')) return 'ru';
  if (browser.startsWith('en')) return 'en';
  return DEFAULT;
}

/**
 * Uch til uchun kontekst.
 *
 * `tr(value)` — matn tanlaydigan yordamchi. Ma'lumot JSON'da shunday yotadi:
 *   { uz: '…', ru: '…', en: '…' }
 * Agar biror til kiritilmagan bo'lsa, o'zbekchasiga qaytadi — sayt hech
 * qachon bo'sh joy ko'rsatmaydi.
 */
export function LanguageProvider({ children }) {
  const [lang, setLangState] = useState(detect);

  const setLang = useCallback((next) => {
    if (!IDS.includes(next)) return;
    setLangState(next);
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // Eslab qola olmadik — til baribir almashadi.
    }
  }, []);

  useEffect(() => {
    document.documentElement.lang = lang;
    const meta = site.meta?.[lang];
    if (meta) {
      document.title = meta.title;
      document.querySelector('meta[name="description"]')?.setAttribute('content', meta.description);
    }
  }, [lang]);

  const value = useMemo(() => {
    const tr = (input) => {
      if (input == null) return '';
      if (typeof input === 'string') return input;
      return input[lang] ?? input[DEFAULT] ?? '';
    };
    return { lang, setLang, languages: LANGUAGES, tr, site };
  }, [lang, setLang]);

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}
