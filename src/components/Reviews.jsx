import { useEffect, useState } from 'react';
import { X, ZoomIn } from 'lucide-react';
import SectionHead from './SectionHead';
import Reveal from './Reveal';
import { useLanguage } from '../i18n/useLanguage';
import { sectionIndex } from '../lib/sectionIndex';
import reviews from '../data/reviews.json';

/**
 * Mijoz fikrlari — yozishmalardan olingan ekran suratlari.
 *
 * Nega surat, matn emas: ko'chirib yozilgan otziv ishonch uyg'otmaydi, uni
 * istagan odam o'ylab topishi mumkin. Haqiqiy yozishma esa ko'rinib turadi.
 *
 * Ro'yxat bo'sh bo'lsa bo'lim umuman chizilmaydi (App shuni tekshiradi) —
 * «tez orada» degan bo'sh joy qolmaydi.
 *
 * Suratlar har xil balandlikda bo'lgani uchun ustunlar `columns` bilan
 * qilingan: shunda ular bir-biriga zich joylashadi va ostida bo'shliq
 * qolmaydi. `break-inside: avoid` bo'lmasa karta ikki ustunga bo'linib ketadi.
 */
export default function Reviews() {
  const { tr, site } = useLanguage();
  const [open, setOpen] = useState(null);
  const shown = reviews.filter((item) => !item.hidden);

  // Kattalashtirilgan surat ochiq turganda Escape bilan yopiladi
  useEffect(() => {
    if (!open) return undefined;
    const onKey = (event) => event.key === 'Escape' && setOpen(null);
    document.documentElement.style.overflow = 'hidden';
    window.addEventListener('keydown', onKey);
    return () => {
      document.documentElement.style.overflow = '';
      window.removeEventListener('keydown', onKey);
    };
  }, [open]);

  if (shown.length === 0) return null;

  return (
    <section id="reviews" className="section-light -mt-6 px-5 py-20 sm:px-8 sm:py-28">
      <div className="mx-auto max-w-[78rem]">
        <SectionHead
          eyebrow={tr(site.reviews.eyebrow)}
          title={tr(site.reviews.title)}
          text={tr(site.reviews.text)}
          index={sectionIndex('reviews')}
          tone="light"
        />

        <div className="mt-12 columns-1 gap-4 sm:mt-14 sm:columns-2 lg:columns-3 lg:gap-5">
          {shown.map((item, index) => (
            <Reveal key={item.id} delay={(index % 3) * 70} className="mb-4 break-inside-avoid lg:mb-5">
              <figure className="card-paper overflow-hidden rounded-[22px] p-2.5">
                <button
                  type="button"
                  onClick={() => setOpen(item)}
                  className="group relative block w-full overflow-hidden rounded-[16px] bg-paper-2"
                  aria-label={tr(site.reviews.open)}
                >
                  <img
                    src={item.image}
                    alt={item.name ? `${tr(site.reviews.eyebrow)}: ${item.name}` : tr(site.reviews.eyebrow)}
                    loading="lazy"
                    decoding="async"
                    className="block w-full"
                  />
                  <span className="absolute right-3 bottom-3 grid h-9 w-9 place-items-center rounded-full bg-espresso/75 text-paper opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                    <ZoomIn size={16} />
                  </span>
                </button>

                {item.name || item.note ? (
                  <figcaption className="px-2 pt-3.5 pb-1">
                    {item.name ? (
                      <p className="font-display text-[14px] font-semibold text-espresso">{item.name}</p>
                    ) : null}
                    {item.note ? <p className="mt-1 text-[12.5px] text-espresso-mute">{item.note}</p> : null}
                  </figcaption>
                ) : null}
              </figure>
            </Reveal>
          ))}
        </div>
      </div>

      {/* ---------- Kattalashtirilgan surat ---------- */}
      {open ? (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={tr(site.reviews.open)}
          onClick={() => setOpen(null)}
          className="fixed inset-0 z-[80] flex items-center justify-center bg-void/92 p-4 sm:p-8"
        >
          <button
            type="button"
            onClick={() => setOpen(null)}
            aria-label={tr(site.reviews.close)}
            className="absolute top-4 right-4 grid h-11 w-11 place-items-center rounded-full bg-cream/10 text-cream ring-1 ring-cream/20"
          >
            <X size={20} />
          </button>

          <img
            src={open.image}
            alt={open.name ?? ''}
            className="max-h-full w-auto max-w-full rounded-2xl object-contain"
            onClick={(event) => event.stopPropagation()}
          />
        </div>
      ) : null}
    </section>
  );
}
