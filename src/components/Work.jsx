import { useMemo, useState } from 'react';
import { ArrowUpRight, Clock3 } from 'lucide-react';
import SectionHead from './SectionHead';
import Reveal from './Reveal';
import { useLanguage } from '../i18n/useLanguage';
import portfolio from '../data/portfolio.json';

const STEP = 9;

/**
 * ISHLAR — saytning YORUG' bo'limi.
 *
 * Nega yorug': shu paytgacha hamma narsa qorong'i edi; mijoz saytlarining
 * ekran suratlari esa ochiq va pastel. Qog'oz rangidagi fonda ular haqiqiy
 * bosma katalogdagidek ko'rinadi va bo'lim butun saytdagi eng kuchli joyga
 * aylanadi. Ayni paytda bu rang almashinuvi «sayt bir xil» hissini yo'qotadi.
 */

/** Ekran surati bo'lmasa — ism harfi bilan karta */
function Placeholder({ label }) {
  return (
    <span aria-hidden="true" className="grid h-full w-full place-items-center bg-gradient-to-br from-paper-2 to-[#d9ccbd]">
      <span className="font-display text-[3rem] font-semibold text-espresso/20">{label}</span>
    </span>
  );
}

/** Bitta loyiha kartasi */
function Card({ item }) {
  const { tr, site } = useLanguage();
  const { work } = site;
  const title = item.name || `@${item.instagram}`;
  const meta = [item.role, item.city].filter(Boolean).join(' · ');

  // Havola bo'lmasa karta bosilmaydi — soxta havola qo'ymaymiz
  const Tag = item.url ? 'a' : 'div';
  const linkProps = item.url ? { href: item.url, target: '_blank', rel: 'noopener noreferrer' } : {};

  return (
    <Tag
      {...linkProps}
      className={`card-paper group flex h-full flex-col rounded-[24px] p-2.5 transition-transform duration-500 ${
        item.url ? 'hover:-translate-y-2' : ''
      }`}
    >
      {/* Ekran: hover'da surat sekin pastga suriladi — saytning davomi ko'rinadi */}
      <div className="relative h-[270px] overflow-hidden rounded-[18px] bg-paper-2 sm:h-[300px]">
        {item.image ? (
          <img
            src={item.image}
            alt={title}
            width={420}
            height={909}
            loading="lazy"
            decoding="async"
            className="absolute inset-x-0 top-0 h-auto w-full transition-transform duration-[2600ms] ease-linear group-hover:-translate-y-[55%]"
          />
        ) : (
          <Placeholder label={title.replace('@', '').charAt(0).toUpperCase()} />
        )}

        {item.featured ? (
          <span className="absolute top-3 left-3 rounded-full bg-coral px-2.5 py-1 text-[10px] font-bold tracking-[0.12em] text-white uppercase">
            {tr(work.featured)}
          </span>
        ) : null}
      </div>

      <div className="flex flex-1 flex-col px-2.5 pt-4 pb-1.5">
        <h3 className="font-display text-[1.05rem] leading-tight font-semibold text-espresso">{title}</h3>
        {meta ? <p className="mt-1.5 text-[12.5px] leading-snug text-espresso-mute">{meta}</p> : null}

        {item.tags.length > 0 ? (
          <ul className="mt-3.5 flex flex-wrap gap-1.5">
            {item.tags.map((tag) => (
              <li key={tag} className="rounded-md bg-espresso/6 px-2 py-1 text-[10.5px] text-espresso-mute">
                {tr(work.tags[tag])}
              </li>
            ))}
          </ul>
        ) : null}

        <p
          className={`mt-auto flex items-center gap-1.5 pt-5 text-[12.5px] font-bold ${
            item.url ? 'text-[#b02a78]' : 'text-espresso-mute'
          }`}
        >
          {item.url ? (
            <>
              {tr(work.open)}
              <ArrowUpRight
                size={14}
                className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              />
            </>
          ) : (
            <>
              <Clock3 size={13} />
              {tr(work.soon)}
            </>
          )}
        </p>
      </div>
    </Tag>
  );
}

export default function Work() {
  const { tr, site } = useLanguage();
  const { work } = site;
  const [tag, setTag] = useState('all');
  const [city, setCity] = useState('all');
  const [limit, setLimit] = useState(STEP);

  // Ko'rsatiladigan loyihalar: avval «asosiy», keyin havolasi borlari
  const all = useMemo(
    () =>
      portfolio
        .filter((item) => !item.hidden)
        .sort((a, b) => Number(b.featured) - Number(a.featured) || Number(Boolean(b.url)) - Number(Boolean(a.url))),
    [],
  );

  // Chiplar tartibi: ko'p uchraydigan belgi oldinda
  const tags = useMemo(() => {
    const counts = new Map();
    all.forEach((item) => item.tags.forEach((id) => counts.set(id, (counts.get(id) ?? 0) + 1)));
    return [...counts.entries()].sort((a, b) => b[1] - a[1]).map(([id]) => id);
  }, [all]);

  const cities = useMemo(
    () => [...new Set(all.map((item) => item.city).filter(Boolean))].sort((a, b) => a.localeCompare(b, 'uz')),
    [all],
  );

  const filtered = useMemo(
    () => all.filter((item) => (tag === 'all' || item.tags.includes(tag)) && (city === 'all' || item.city === city)),
    [all, tag, city],
  );

  /** Filtr o'zgarganda ro'yxat boshidan ko'rsatiladi */
  const pickTag = (value) => {
    setTag(value);
    setLimit(STEP);
  };

  const pickCity = (value) => {
    setCity(value);
    setLimit(STEP);
  };

  const shown = filtered.slice(0, limit);

  return (
    <section id="work" className="section-light -mt-6 px-5 py-20 sm:px-8 sm:py-28">
      <div className="mx-auto max-w-[78rem]">
        <SectionHead eyebrow={tr(work.eyebrow)} title={tr(work.title)} text={tr(work.text)} index="02" tone="light" />

        {/* ---------- Filtrlar ---------- */}
        <Reveal delay={180} className="mt-10 sm:mt-12">
          {/* Telefonda chiplar yonma-yon suriladi — o'ralib ketib joy egallamasligi uchun */}
          <div className="no-scrollbar -mx-5 flex gap-2 overflow-x-auto px-5 pb-1 sm:mx-0 sm:flex-wrap sm:px-0">
            {['all', ...tags].map((id) => {
              const active = tag === id;
              return (
                <button
                  key={id}
                  type="button"
                  onClick={() => pickTag(id)}
                  aria-pressed={active}
                  className={`shrink-0 rounded-full px-4 py-2 text-[13px] font-semibold transition-colors duration-300 ${
                    active
                      ? 'bg-espresso text-paper'
                      : 'text-espresso-mute ring-1 ring-espresso/15 hover:bg-espresso/5 hover:text-espresso'
                  }`}
                >
                  {id === 'all' ? tr(work.all) : tr(work.tags[id])}
                </button>
              );
            })}
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-3">
            <label className="relative">
              <span className="sr-only">{tr(work.cityLabel)}</span>
              <select
                value={city}
                onChange={(event) => pickCity(event.target.value)}
                className="min-h-10 appearance-none rounded-full bg-transparent py-2 pr-9 pl-4 text-[13px] font-semibold text-espresso ring-1 ring-espresso/15"
              >
                <option value="all">{tr(work.cityLabel)}</option>
                {cities.map((name) => (
                  <option key={name} value={name}>
                    {name}
                  </option>
                ))}
              </select>
              <span
                aria-hidden="true"
                className="pointer-events-none absolute top-1/2 right-4 -translate-y-1/2 text-espresso-mute"
              >
                ▾
              </span>
            </label>

            <p aria-live="polite" className="text-[12.5px] text-espresso-mute">
              {filtered.length} / {all.length}
            </p>
          </div>
        </Reveal>

        {/* ---------- To'r ---------- */}
        <ul className="mt-7 grid gap-4 sm:mt-9 sm:grid-cols-2 lg:grid-cols-3 lg:gap-5">
          {shown.map((item, index) => (
            <Reveal as="li" key={item.id} delay={(index % 3) * 70}>
              <Card item={item} />
            </Reveal>
          ))}
        </ul>

        {limit < filtered.length ? (
          <div className="mt-10 flex justify-center">
            <button type="button" onClick={() => setLimit((value) => value + STEP)} className="btn btn-dark">
              {tr(work.more)}
              <span className="opacity-60">+{Math.min(STEP, filtered.length - limit)}</span>
            </button>
          </div>
        ) : null}
      </div>
    </section>
  );
}
