import { CalendarCheck, Languages, MessageCircle, Palette, Smartphone, Tag, Zap } from 'lucide-react';
import SectionHead from './SectionHead';
import Reveal from './Reveal';
import { useLanguage } from '../i18n/useLanguage';

const ICONS = {
  iphone: Smartphone,
  lang: Languages,
  speed: Zap,
  price: Tag,
  contact: MessageCircle,
  booking: CalendarCheck,
  design: Palette,
};

/**
 * Nima kiradi — oltita karta.
 *
 * To'r ataylab bir xil emas: uchta karta ikki ustunni oladi, shuning uchun
 * har qatorda «keng + tor» juftligi hosil bo'ladi va juftlik tomoni navbat
 * bilan almashadi. Uchta keng karta tanlanganining sababi oddiy hisob:
 * 3 keng (2 katak) + 3 tor (1 katak) = 9 katak, ya'ni 3 ustunga rosa bo'linadi.
 * Ikkita keng karta bo'lsa to'rda bo'sh joy qolib ketardi.
 *
 * Kartalar har xil rangda EMAS — faqat bittasi suyak oq, qolgani qorong'i.
 * Rang-barang kartalar ko'zga tashlanadi, lekin arzon ko'rinadi; bitta teskari
 * karta esa to'rni jonlantirishga yetadi va bo'limning eng muhim gapini
 * o'zi ajratib turadi.
 */
const WIDE = new Set([0, 3, 4]);
const INVERTED = 0;

export default function Features() {
  const { tr, site } = useLanguage();
  const { features } = site;

  return (
    <section
      id="features"
      className="relative z-[2] -mt-6 overflow-hidden rounded-t-[34px] bg-void px-5 py-20 sm:px-8 sm:py-28 lg:rounded-t-[54px]"
    >
      <div className="mx-auto max-w-[78rem]">
        <SectionHead eyebrow={tr(features.eyebrow)} title={tr(features.title)} index="03" />

        <ul className="mt-12 grid gap-4 sm:mt-14 sm:grid-cols-2 lg:grid-cols-3">
          {features.items.map((item, index) => {
            const Icon = ICONS[item.id];
            const wide = WIDE.has(index);
            const light = index === INVERTED;

            return (
              <Reveal as="li" key={item.id} delay={(index % 3) * 80} className={wide ? 'lg:col-span-2' : ''}>
                <div
                  className={`relative flex h-full flex-col rounded-[24px] p-6 sm:p-7 ${
                    light ? 'bg-paper text-espresso' : 'card'
                  }`}
                >
                  <span
                    aria-hidden="true"
                    className={`font-display absolute top-5 right-6 text-[2rem] leading-none font-bold ${
                      light ? 'stroke-dark' : 'stroke'
                    }`}
                  >
                    {String(index + 1).padStart(2, '0')}
                  </span>

                  <span
                    aria-hidden="true"
                    className={`grid h-12 w-12 place-items-center rounded-2xl ${
                      light ? 'bg-coral text-white' : 'bg-coral/12 text-coral ring-1 ring-coral/25'
                    }`}
                  >
                    {Icon ? <Icon size={21} strokeWidth={1.8} /> : null}
                  </span>

                  <h3
                    className={`font-display mt-5 leading-tight font-semibold ${
                      wide ? 'text-[1.25rem] sm:text-[1.6rem]' : 'text-[1.12rem]'
                    } ${light ? 'text-espresso' : 'text-cream'}`}
                  >
                    {tr(item.title)}
                  </h3>
                  <p
                    className={`mt-3 text-[14.5px] leading-[1.7] ${wide ? 'sm:max-w-[34rem]' : ''} ${
                      light ? 'text-espresso-mute' : 'text-mute'
                    }`}
                  >
                    {tr(item.text)}
                  </p>
                </div>
              </Reveal>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
