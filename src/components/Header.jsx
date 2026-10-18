import { useEffect, useState } from 'react';
import { Menu, X } from 'lucide-react';
import { InstagramIcon, VoylaMark } from './BrandIcons';
import { useLanguage } from '../i18n/useLanguage';
import settings from '../data/settings.json';

// Menyuda faqat sozlamalarda yoqilgan bo'limlar turadi — aks holda havola
// mavjud bo'lmagan joyga olib borardi.
const SECTIONS = ['work', 'features', 'process', 'pricing', 'faq'].filter((id) => settings.sections?.[id]);

/**
 * UZ / RU / EN almashtirgich.
 *
 * Uchta til bo'lgani uchun suriladigan «tanlov» kengligi ham uchga bo'linadi:
 * `translateX(index * 100%)` ishlaydi, chunki har bir tugma bir xil kenglikda.
 */
function LangSwitch() {
  const { lang, setLang, languages, tr, site } = useLanguage();
  const index = languages.findIndex((item) => item.id === lang);

  return (
    <div role="group" aria-label={tr(site.ui.language)} className="relative flex rounded-xl bg-cream/8 p-1 ring-1 ring-cream/12">
      <span
        aria-hidden="true"
        className="absolute top-1 bottom-1 left-1 w-[calc((100%-0.5rem)/3)] rounded-lg bg-cream transition-transform duration-300 ease-out"
        style={{ transform: `translateX(${index * 100}%)` }}
      />
      {languages.map((item) => {
        const active = item.id === lang;
        return (
          <button
            key={item.id}
            type="button"
            onClick={() => setLang(item.id)}
            aria-pressed={active}
            title={item.title}
            className={`relative z-10 w-9 py-1.5 text-[11.5px] font-bold tracking-[0.06em] transition-colors duration-300 ${
              active ? 'text-ink' : 'text-mute hover:text-cream'
            }`}
          >
            {item.label}
          </button>
        );
      })}
    </div>
  );
}

/** Shapka: logotip, bo'limlar, til va buyurtma tugmasi */
export default function Header() {
  const { tr, site } = useLanguage();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    document.documentElement.style.overflow = open ? 'hidden' : '';
    const onKey = (event) => event.key === 'Escape' && setOpen(false);
    window.addEventListener('keydown', onKey);
    return () => {
      document.documentElement.style.overflow = '';
      window.removeEventListener('keydown', onKey);
    };
  }, [open]);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-[background-color,box-shadow] duration-500 ${
        open
          ? 'bg-void' // backdrop-filter'siz: aks holda u fixed menyuga ramka bo'lib, uni shapka balandligiga qisib qo'yadi
          : scrolled
            ? 'bg-void/85 shadow-[0_1px_0_rgb(246_241_251/0.08)] backdrop-blur-xl'
            : 'bg-transparent'
      }`}
      style={{ paddingTop: 'env(safe-area-inset-top, 0px)' }}
    >
      <div className="mx-auto flex h-16 max-w-[78rem] items-center gap-3 px-5 sm:h-[76px] sm:px-8">
        <a href="#top" className="text-[1.45rem] text-cream sm:text-[1.6rem]" aria-label={site.brand.name}>
          <VoylaMark />
        </a>

        <nav aria-label={tr(site.nav.work)} className="ml-auto hidden items-center gap-1 lg:flex">
          {SECTIONS.map((id) => (
            <a key={id} href={`#${id}`} className="rounded-lg px-3 py-2 text-[13.5px] text-mute transition-colors hover:text-cream">
              {tr(site.nav[id])}
            </a>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-2 lg:ml-5">
          <LangSwitch />
          <a
            href={site.contacts.instagramUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden h-10 items-center gap-2 rounded-xl bg-coral px-4 text-[13.5px] font-bold text-white transition-colors hover:bg-[#ff6e63] sm:inline-flex"
          >
            {tr(site.ui.order)}
          </a>
          <button
            type="button"
            onClick={() => setOpen((value) => !value)}
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? tr(site.ui.close) : tr(site.ui.menu)}
            className="grid h-10 w-10 place-items-center rounded-xl bg-cream/8 text-cream ring-1 ring-cream/12 lg:hidden"
          >
            {open ? <X size={19} /> : <Menu size={19} />}
          </button>
        </div>
      </div>

      {/* ---------- Butun ekranli menyu ---------- */}
      <div
        id="mobile-menu"
        inert={!open}
        className={`fixed inset-x-0 top-[calc(4rem+env(safe-area-inset-top,0px))] bottom-0 overflow-y-auto bg-void px-6 pt-4 pb-10 transition-[opacity,visibility] duration-300 sm:top-[calc(76px+env(safe-area-inset-top,0px))] lg:hidden ${
          open ? 'visible opacity-100' : 'invisible opacity-0'
        }`}
      >
        <nav aria-label={tr(site.ui.menu)} className="mx-auto max-w-lg border-t border-cream/10">
          {[...SECTIONS, ...(settings.sections?.contact ? ['contact'] : [])].map((id, index) => (
            <a key={id} href={`#${id}`} onClick={() => setOpen(false)} className="flex items-center justify-between border-b border-cream/10 py-4">
              <span className="font-display text-[1.5rem] text-cream">{tr(site.nav[id])}</span>
              <span className="text-[12px] text-coral">0{index + 1}</span>
            </a>
          ))}
        </nav>
        <a
          href={site.contacts.instagramUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn-coral mx-auto mt-8 flex max-w-lg"
        >
          <InstagramIcon size={18} />
          {tr(site.contact.instagram)}
        </a>
      </div>
    </header>
  );
}
