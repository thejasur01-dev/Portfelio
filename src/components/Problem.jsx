import { ArrowRight } from 'lucide-react';
import SectionHead from './SectionHead';
import Reveal from './Reveal';
import { useLanguage } from '../i18n/useLanguage';

/**
 * «Instagram sotadi, sayt ishontiradi» — oldin/keyin qatorlari.
 *
 * Qatorlar bir xil turmaydi: toq raqamlilari o'ngga suriladi. Shu kichik
 * nosimmetriya ro'yxatni jadvalga o'xshatmaydi va ko'zni pastga tortadi.
 *
 * Telefonda ikki ustun emas, ustma-ust: avval muammo (xira, chizilgan),
 * keyin yechim (yorqin). 2 ustunli jadval 320px ekranda o'qilmaydi.
 */
export default function Problem() {
  const { tr, site } = useLanguage();
  const { problem } = site;

  return (
    <section id="problem" className="relative overflow-hidden px-5 py-20 sm:px-8 sm:py-28">
      <div className="mx-auto max-w-[78rem]">
        <SectionHead eyebrow={tr(problem.eyebrow)} title={tr(problem.title)} index="01" />

        <ul className="mt-12 sm:mt-16">
          {problem.rows.map((row, index) => (
            <Reveal
              as="li"
              key={row.id}
              delay={index * 80}
              className={`mb-3 sm:mb-4 lg:max-w-[52rem] ${index % 2 ? 'lg:ml-auto' : ''}`}
            >
              <div className="card relative overflow-hidden rounded-[22px] p-6 sm:p-7 lg:flex lg:items-center lg:gap-7">
                {/* Fondagi ulkan raqam — bezak, o'qilishi shart emas */}
                <span
                  aria-hidden="true"
                  className="font-display stroke absolute -top-4 right-4 text-[4.4rem] leading-none font-bold opacity-50 sm:text-[5.5rem]"
                >
                  {String(index + 1).padStart(2, '0')}
                </span>

                <p className="relative flex items-start gap-3 text-[14.5px] leading-snug text-faint lg:flex-1">
                  <span aria-hidden="true" className="mt-[9px] h-px w-5 shrink-0 bg-coral/60" />
                  <span className="line-through decoration-coral/45">{tr(row.before)}</span>
                </p>

                <span aria-hidden="true" className="my-4 block lg:my-0">
                  <ArrowRight size={18} className="text-coral max-lg:rotate-90" />
                </span>

                <p className="font-display relative text-[1.05rem] leading-snug font-semibold text-cream sm:text-[1.2rem] lg:flex-1">
                  {tr(row.after)}
                </p>
              </div>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}
