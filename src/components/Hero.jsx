import { ArrowUpRight } from 'lucide-react';
import SiteWall from './SiteWall';
import SpinBadge from './SpinBadge';
import RichText from './RichText';
import { InstagramIcon } from './BrandIcons';
import { useLanguage } from '../i18n/useLanguage';

/**
 * Birinchi ekran.
 *
 * Asosiy g'oya: hech qanday chizilgan illyustratsiya yo'q — o'ng tomonda
 * HAQIQIY mijoz saytlarining ekranlari sekin suriladi. Dalil birinchi
 * ekranda ko'rinadi, matn esa faqat uni izohlaydi.
 *
 * Fon ataylab tekis va rangsiz — bo'limning butun rangi mijoz saytlarining
 * ekran suratlaridan keladi. Orqa fonga rang qo'shsak, ular bilan raqobat
 * boshlanadi va ikkalasi ham yutqazadi.
 *
 * Telefonda devor matndan KEYIN turadi va pastga qarab kesiladi — shu bilan
 * sahifaning davomi borligi o'zidan ko'rinadi.
 */
export default function Hero() {
  const { tr, site } = useLanguage();
  const { hero, stats, contacts } = site;
  const labels = tr(hero.statsLabel);
  const numbers = [stats.sites, stats.cities, stats.days];

  return (
    <section
      id="top"
      className="hero-shell relative flex items-center overflow-hidden pt-[88px] pb-0 sm:pt-28 lg:pt-20 lg:pb-16"
    >
      {/* Fon tekis: rangli dog' yo'q, faqat sezilmas yorug'lik */}
      <div aria-hidden="true" className="aura absolute inset-0 -z-10" />

      {/* Katta ekranda devor o'ng chetda turadi */}
      <div aria-hidden="true" className="absolute inset-y-0 right-0 hidden w-[46%] lg:block xl:w-[44%]">
        <SiteWall columns={3} className="h-full" />
        {/* Chap chetini fonga eritamiz, aks holda devor «yopishtirilgan» ko'rinadi */}
        <div className="absolute inset-y-0 left-0 w-40 bg-gradient-to-r from-void via-void/70 to-transparent" />
        {/* Shapka harflari yorqin ekran suratlari ustida qolmasligi uchun */}
        <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-void via-void/80 to-transparent" />
      </div>

      <div className="mx-auto w-full max-w-[78rem] px-5 sm:px-8">
        <div className="max-w-[34rem] lg:max-w-[33rem]">
          <p className="eyebrow slide-in">
            <span aria-hidden="true" className="dot-live h-1.5 w-1.5 rounded-full bg-coral" />
            {tr(hero.eyebrow)}
          </p>

          <h1 className="font-display mt-5 text-[1.95rem] leading-[1.08] font-semibold tracking-[-0.03em] text-cream sm:text-[2.7rem] lg:text-[3.1rem]">
            <span className="slide-in block" style={{ animationDelay: '0.08s' }}>
              <RichText text={tr(hero.titleTop)} />
            </span>
            <span className="grad slide-in mt-1.5 block" style={{ animationDelay: '0.16s' }}>
              <RichText text={tr(hero.titleAccent)} />
            </span>
          </h1>

          <p
            className="slide-in mt-5 max-w-[33rem] text-[15px] leading-[1.75] text-mute sm:text-[16.5px]"
            style={{ animationDelay: '0.24s' }}
          >
            {tr(hero.text)}
          </p>

          <div
            className="slide-in mt-7 flex flex-col gap-3 sm:flex-row sm:items-center"
            style={{ animationDelay: '0.32s' }}
          >
            <a href={contacts.instagramUrl} target="_blank" rel="noopener noreferrer" className="btn btn-coral">
              <InstagramIcon size={18} />
              {tr(hero.primary)}
            </a>
            <a href="#work" className="btn btn-glass">
              {tr(hero.secondary)}
              <ArrowUpRight size={17} />
            </a>
          </div>

          {/* ---------- Raqamlar ---------- */}
          <dl className="slide-in mt-8 flex max-w-[30rem] items-start gap-6 sm:gap-10" style={{ animationDelay: '0.4s' }}>
            {numbers.map((value, index) => (
              <div key={index}>
                <dt className="sr-only">{labels[index]}</dt>
                <dd>
                  <span className="font-display grad block text-[2.1rem] leading-none font-bold tracking-[-0.04em] sm:text-[2.6rem]">
                    {value}
                  </span>
                  <span className="mt-2 block text-[12.5px] leading-snug text-faint">{labels[index]}</span>
                </dd>
              </div>
            ))}
          </dl>
        </div>

        {/* Telefonda devor matn ostida — pastda kesilib, davomi borligini ko'rsatadi */}
        <SiteWall columns={3} className="mt-9 h-[230px] sm:h-[280px] lg:hidden" />
      </div>

      {/* ---------- Pastga ishora: aylanib turadigan yorliq ---------- */}
      <a
        href="#work"
        aria-label={tr(hero.secondary)}
        className="absolute right-[48%] bottom-7 hidden h-[128px] w-[128px] text-mute transition-colors hover:text-cream lg:block"
      >
        <SpinBadge text={tr(hero.badge)} id="hero-badge" className="h-full w-full" />
      </a>
    </section>
  );
}
