import Header from './components/Header';
import Hero from './components/Hero';
import Ticker from './components/Ticker';
import Problem from './components/Problem';
import Work from './components/Work';
import Features from './components/Features';
import Process from './components/Process';
import Pricing from './components/Pricing';
import Faq from './components/Faq';
import Contact from './components/Contact';
import Footer from './components/Footer';
import StickyCTA from './components/StickyCTA';
import { useLanguage } from './i18n/useLanguage';
import settings from './data/settings.json';

/**
 * Qaysi bo'lim ko'rinishi `src/data/settings.json` da turadi va admin
 * paneldagi «Sozlamalar» bo'limidan belgilanadi. Shuning uchun bo'limni
 * yashirish uchun kod o'zgartirish kerak emas.
 */
export default function App() {
  const { tr, site } = useLanguage();
  const { stats } = site;
  const labels = tr(site.hero.statsLabel);
  const show = settings.sections ?? {};

  // Birinchi lenta raqamlardan quriladi — admin panelda raqam o'zgarsa,
  // lentadagi yozuv ham o'zi o'zgaradi (ikki joyda yozib yurish shart emas).
  const firstTicker = [
    `${stats.sites} ${labels[0]}`,
    `${stats.cities} ${labels[1]}`,
    `${stats.days} ${labels[2]}`,
    ...tr(site.ticker),
  ];

  // Tab bosilganda sakrab o'tiladigan joy: ko'rinib turgan birinchi bo'lim
  const firstVisible = ['work', 'features', 'pricing', 'contact'].find((id) => show[id]) ?? 'top';

  return (
    <>
      {/* Klaviatura bilan yurganlar uchun — Tab bosilganda birinchi chiqadi */}
      <a
        href={`#${firstVisible}`}
        className="sr-only focus-visible:not-sr-only focus-visible:fixed focus-visible:top-4 focus-visible:left-4 focus-visible:z-[70] focus-visible:rounded-xl focus-visible:bg-cream focus-visible:px-4 focus-visible:py-2.5 focus-visible:text-[13px] focus-visible:font-bold focus-visible:text-ink"
      >
        {tr(site.hero.secondary)}
      </a>

      {/* Butun sahifa ustidagi plyonka donasi */}
      {settings.grain === false ? null : <div className="grain" aria-hidden="true" />}

      <Header />

      <main>
        <Hero />
        {settings.tickers === false ? null : <Ticker items={firstTicker} tone="coral" />}
        {show.problem ? <Problem /> : null}
        {show.work ? <Work /> : null}
        {show.features ? <Features /> : null}
        {settings.tickers === false ? null : <Ticker items={tr(site.ticker2)} tone="paper" tilt={1.3} slow />}
        {show.process ? <Process /> : null}
        {show.pricing ? <Pricing /> : null}
        {show.faq ? <Faq /> : null}
        {show.contact ? <Contact /> : null}
      </main>

      <Footer />
      {settings.stickyCta === false ? null : <StickyCTA />}
    </>
  );
}
