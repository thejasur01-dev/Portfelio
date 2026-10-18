import { InstagramIcon, TelegramIcon, VoylaMark } from './BrandIcons';
import { useLanguage } from '../i18n/useLanguage';
import settings from '../data/settings.json';

const SECTIONS = ['work', 'features', 'reviews', 'process', 'pricing', 'faq'].filter((id) => settings.sections?.[id]);

// Chizishdan tashqarida hisoblanadi — har qayta chizilganda o'zgarmasin
const YEAR = new Date().getFullYear();

export default function Footer() {
  const { tr, site } = useLanguage();
  const { brand, footer, contacts, stats } = site;

  return (
    <footer className="border-t border-cream/8 px-5 pt-14 pb-10 sm:px-8">
      <div className="mx-auto max-w-[78rem]">
        <div className="grid gap-10 sm:grid-cols-[1.4fr_1fr_1fr]">
          <div>
            <a href="#top" className="inline-block text-[1.5rem] text-cream" aria-label={brand.name}>
              <VoylaMark />
            </a>
            <p className="mt-4 max-w-[22rem] text-[13.5px] leading-[1.7] text-faint">{tr(brand.tagline)}</p>
            <p className="mt-5 text-[13px] text-faint">
              {stats.sites}+ {tr(site.hero.statsLabel)[0]} · {stats.cities} {tr(site.hero.statsLabel)[1]}
            </p>
          </div>

          <nav aria-label={tr(footer.pages)}>
            <h2 className="text-[11px] font-bold tracking-[0.2em] text-mute uppercase">{tr(footer.pages)}</h2>
            <ul className="mt-4 flex flex-col gap-2.5">
              {SECTIONS.map((id) => (
                <li key={id}>
                  <a href={`#${id}`} className="text-[14px] text-cream/75 transition-colors hover:text-cream">
                    {tr(site.nav[id])}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <h2 className="text-[11px] font-bold tracking-[0.2em] text-mute uppercase">{tr(footer.contacts)}</h2>
            <ul className="mt-4 flex flex-col gap-3">
              <li>
                <a
                  href={contacts.instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2.5 text-[14px] text-cream/75 transition-colors hover:text-cream"
                >
                  <InstagramIcon size={17} />@{contacts.instagram}
                </a>
              </li>
              {contacts.telegramUrl ? (
                <li>
                  <a
                    href={contacts.telegramUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2.5 text-[14px] text-cream/75 transition-colors hover:text-cream"
                  >
                    <TelegramIcon size={17} />
                    {contacts.telegram}
                  </a>
                </li>
              ) : null}
              {contacts.phoneHref ? (
                <li>
                  <a href={contacts.phoneHref} className="text-[14px] text-cream/75 transition-colors hover:text-cream">
                    {contacts.phone}
                  </a>
                </li>
              ) : null}
            </ul>
          </div>
        </div>

        <div className="hairline mt-12" />

        <p className="mt-6 text-[12.5px] text-faint">
          © {YEAR} {brand.name}. {tr(footer.rights)}
        </p>
      </div>
    </footer>
  );
}
