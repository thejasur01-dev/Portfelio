import { Check } from 'lucide-react';
import SectionHead from './SectionHead';
import Reveal from './Reveal';
import { InstagramIcon } from './BrandIcons';
import { useLanguage } from '../i18n/useLanguage';
import { sectionIndex } from '../lib/sectionIndex';
import packages from '../data/packages.json';

/**
 * Paketlar — ikkinchi YORUG' bo'lim.
 *
 * O'rtadagi «Pro» kartasi qorong'i va kattaroq: narx sahifasida ko'z avval
 * qayerga tushishini biz tanlaymiz. Qolgan ikkitasi oq, shuning uchun
 * farq bir qarashda ko'rinadi.
 *
 * `price` bo'sh bo'lsa — o'ylab topilgan raqam qo'yilmaydi, o'rniga
 * «narxni kelishamiz» yoziladi. Haqiqiy narxlarni admin panel orqali
 * kiritasiz, shundan keyin kartada raqam ko'rinadi.
 */
export default function Pricing() {
  const { tr, site } = useLanguage();
  const { pricing, contacts } = site;

  return (
    <section id="pricing" className="section-light -mt-6 px-5 py-20 sm:px-8 sm:py-28">
      <div className="mx-auto max-w-[78rem]">
        <SectionHead eyebrow={tr(pricing.eyebrow)} title={tr(pricing.title)} index={sectionIndex('pricing')} tone="light" />

        <ul className="mt-12 grid items-stretch gap-4 sm:mt-14 lg:grid-cols-3 lg:gap-5">
          {packages.map((plan, index) => {
            const hot = plan.popular;

            return (
              <Reveal as="li" key={plan.id} delay={index * 90} className={hot ? 'lg:-my-4' : ''}>
                <div
                  className={`relative flex h-full flex-col rounded-[26px] p-6 sm:p-8 ${
                    hot ? 'bg-espresso text-paper shadow-lift' : 'card-paper'
                  }`}
                >
                  {hot ? (
                    <span className="absolute -top-3 left-7 rounded-full bg-coral px-3 py-1 text-[10.5px] font-bold tracking-[0.12em] text-white uppercase">
                      {tr(pricing.popular)}
                    </span>
                  ) : null}

                  <h3
                    className={`font-display text-[1.7rem] leading-none font-bold tracking-[-0.02em] ${
                      hot ? 'grad' : 'text-espresso'
                    }`}
                  >
                    {tr(plan.name)}
                  </h3>
                  <p className={`mt-3 text-[13.5px] leading-snug ${hot ? 'text-paper/65' : 'text-espresso-mute'}`}>
                    {tr(plan.for)}
                  </p>

                  <div className="mt-7">
                    {plan.price ? (
                      <span
                        className={`font-display text-[2.1rem] leading-none font-bold tracking-[-0.02em] ${
                          hot ? 'text-paper' : 'text-espresso'
                        }`}
                      >
                        {plan.price}
                      </span>
                    ) : (
                      <span
                        className={`font-display text-[1.3rem] leading-tight font-semibold ${
                          hot ? 'text-paper' : 'text-espresso'
                        }`}
                      >
                        {tr(plan.priceNote)}
                      </span>
                    )}
                  </div>
                  <p className={`mt-2 text-[12.5px] ${hot ? 'text-paper/55' : 'text-espresso-mute'}`}>{tr(plan.days)}</p>

                  <div className={`my-7 ${hot ? 'hairline' : 'hairline-dark'}`} />

                  <ul className="flex flex-col gap-3">
                    {plan.items.map((item, itemIndex) => (
                      <li
                        key={itemIndex}
                        className={`flex items-start gap-2.5 text-[14px] leading-snug ${
                          hot ? 'text-paper/90' : 'text-espresso/85'
                        }`}
                      >
                        <Check size={15} strokeWidth={2.6} className={`mt-px shrink-0 ${hot ? 'text-coral' : 'text-coral-deep'}`} />
                        {tr(item)}
                      </li>
                    ))}
                  </ul>

                  <a
                    href={contacts.instagramUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`btn mt-9 w-full ${hot ? 'btn-coral' : 'btn-outline-dark'}`}
                  >
                    <InstagramIcon size={17} />
                    {tr(pricing.cta)}
                  </a>
                </div>
              </Reveal>
            );
          })}
        </ul>

        <Reveal delay={140} className="mt-8">
          <p className="max-w-[46rem] text-[13.5px] leading-[1.75] text-espresso-mute">{tr(pricing.note)}</p>
        </Reveal>
      </div>
    </section>
  );
}
