import Reveal from './Reveal';
import RichText from './RichText';
import { InstagramIcon, TelegramIcon } from './BrandIcons';
import { useLanguage } from '../i18n/useLanguage';

/**
 * Oxirgi chaqiriq — saytdagi yagona to'liq rangli yuza.
 *
 * Butun sayt qorong'i va suyak rangda bo'lgani uchun, oxirida bir varaq
 * tekis marjon «shu yerga bosing» degan ishorani o'zi beradi. Gradient emas,
 * tekis rang: u arzon ko'rinmaydi va bosma ishdagi rangli varaqqa o'xshaydi.
 *
 * Telegram va telefon `site.json`da bo'sh — to'ldirilmaguncha tugmalari
 * ko'rinmaydi. Ishlamaydigan tugma qo'yish ishonchni yo'qotadi.
 */
export default function Contact() {
  const { tr, site } = useLanguage();
  const { contact, contacts, brand } = site;

  return (
    <section id="contact" className="relative px-5 py-20 sm:px-8 sm:py-28">
      <div className="mx-auto max-w-[78rem]">
        <Reveal className="relative overflow-hidden rounded-[30px] bg-coral px-6 py-14 text-center sm:px-10 sm:py-20">
          {/* Marjon yuzaga chuqurlik beradigan sezilmas soya */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0"
            style={{ backgroundImage: 'radial-gradient(70% 60% at 50% 0%, rgb(255 255 255 / 0.14), transparent 70%)' }}
          />

          <div className="relative">
            <p className="eyebrow bg-white/20 text-white shadow-none ring-1 ring-white/35">{tr(contact.eyebrow)}</p>

            <h2 className="font-display mx-auto mt-6 max-w-[36rem] text-[2rem] leading-[1.08] font-bold tracking-[-0.03em] text-white sm:text-[3rem]">
              <RichText text={tr(contact.title)} />
            </h2>

            <p className="mx-auto mt-5 max-w-[34rem] text-[15px] leading-[1.75] text-white/85 sm:text-[16.5px]">
              {tr(contact.text)}
            </p>

            <div className="mt-9 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
              <a
                href={contacts.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-dark w-full sm:w-auto"
              >
                <InstagramIcon size={18} />
                {tr(contact.instagram)}
              </a>

              {contacts.telegramUrl ? (
                <a
                  href={contacts.telegramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn w-full bg-white/15 text-white ring-1 ring-white/35 hover:bg-white/25 sm:w-auto"
                >
                  <TelegramIcon size={18} />
                  {tr(contact.telegram)}
                </a>
              ) : null}
            </div>

            <p className="mt-8 text-[13px] text-white/70">
              @{contacts.instagram} · {tr(brand.tagline)}
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
