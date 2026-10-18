import { useState } from 'react';
import { Plus } from 'lucide-react';
import SectionHead from './SectionHead';
import Reveal from './Reveal';
import { useLanguage } from '../i18n/useLanguage';
import { sectionIndex } from '../lib/sectionIndex';
import faq from '../data/faq.json';

/**
 * Ko'p so'raladigan savollar.
 *
 * Ochilish `grid-template-rows: 0fr → 1fr` bilan qilingan (`.faq-answer`):
 * `max-height` bilan qilinsa javob uzunligini oldindan bilish kerak bo'ladi
 * va uch tilda uzunlik har xil. `<details>` ishlatilmadi — bir vaqtda faqat
 * bitta javob ochiq turishini xohlaymiz.
 */
export default function Faq() {
  const { tr, site } = useLanguage();
  const [open, setOpen] = useState(faq[0].id);

  return (
    <section
      id="faq"
      className="relative z-[2] -mt-6 overflow-hidden rounded-t-[34px] bg-void px-5 py-20 sm:px-8 sm:py-28 lg:rounded-t-[54px]"
    >
      <div className="mx-auto max-w-[78rem]">
        <div className="grid gap-10 lg:grid-cols-[23rem_1fr] lg:gap-16">
          {/* Katta ekranda sarlavha chapda yopishib turadi */}
          <div className="lg:sticky lg:top-28 lg:self-start">
            <SectionHead eyebrow={tr(site.faqSection.eyebrow)} title={tr(site.faqSection.title)} index={sectionIndex('faq')} />
          </div>

          <ul>
            {faq.map((item, index) => {
              const isOpen = open === item.id;
              return (
                <Reveal
                  as="li"
                  key={item.id}
                  delay={index * 50}
                  className={`faq-item border-b border-cream/10 ${isOpen ? 'is-open' : ''} ${index === 0 ? 'border-t' : ''}`}
                >
                  <h3>
                    <button
                      type="button"
                      onClick={() => setOpen(isOpen ? '' : item.id)}
                      aria-expanded={isOpen}
                      aria-controls={`faq-${item.id}`}
                      className="flex w-full items-start gap-4 py-5 text-left"
                    >
                      <span
                        className={`font-display flex-1 text-[1.02rem] leading-snug font-semibold transition-colors duration-300 sm:text-[1.14rem] ${
                          isOpen ? 'text-cream' : 'text-cream/75'
                        }`}
                      >
                        {tr(item.q)}
                      </span>
                      <span
                        aria-hidden="true"
                        className={`mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-full transition-[transform,background-color,color] duration-400 ${
                          isOpen ? 'rotate-45 bg-coral text-white' : 'bg-cream/8 text-mute'
                        }`}
                      >
                        <Plus size={15} strokeWidth={2.6} />
                      </span>
                    </button>
                  </h3>

                  <div id={`faq-${item.id}`} className="faq-answer" role="region">
                    <div>
                      <p className="max-w-[44rem] pr-10 pb-6 text-[14.5px] leading-[1.75] text-mute">{tr(item.a)}</p>
                    </div>
                  </div>
                </Reveal>
              );
            })}
          </ul>
        </div>
      </div>
    </section>
  );
}
