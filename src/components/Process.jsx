import SectionHead from './SectionHead';
import Reveal from './Reveal';
import { useLanguage } from '../i18n/useLanguage';
import { sectionIndex } from '../lib/sectionIndex';

/**
 * Jarayon — to'rt qadam.
 *
 * Qadam raqamlari ulkan va faqat konturi chizilgan (`.stroke`): ular
 * bezak vazifasini bajaradi va bo'limni boshqa ro'yxatlardan ajratib turadi.
 *
 * Chiziq `::before` emas, alohida `div` bilan chizilgan — eski Safari'da
 * `background` bilan chizilgan ingichka chiziqlar ba'zan yo'qolib qoladi.
 */
export default function Process() {
  const { tr, site } = useLanguage();
  const { process: flow, stats } = site;

  return (
    <section id="process" className="relative overflow-hidden px-5 py-20 sm:px-8 sm:py-28">
      <div className="mx-auto max-w-[78rem]">
        <SectionHead eyebrow={tr(flow.eyebrow)} title={tr(flow.title)} index={sectionIndex('process')} />

        <div className="relative mt-12 sm:mt-16">
          {/* Qadamlarni bog'lab turadigan chiziq */}
          <div
            aria-hidden="true"
            className="absolute top-3 left-[23px] h-[calc(100%-1.5rem)] w-px bg-gradient-to-b from-coral/50 via-cream/15 to-transparent lg:top-[26px] lg:left-0 lg:h-px lg:w-full lg:bg-gradient-to-r"
          />

          <ol className="grid gap-10 lg:grid-cols-4 lg:gap-7">
            {flow.steps.map((step, index) => (
              <Reveal as="li" key={step.id} delay={index * 110} className="relative pl-[64px] lg:pl-0">
                <span
                  aria-hidden="true"
                  className="font-display stroke absolute top-0 left-0 text-[3rem] leading-[0.85] font-bold lg:static lg:mb-5 lg:block lg:text-[4.6rem]"
                >
                  {index + 1}
                </span>

                <h3 className="font-display text-[1.2rem] leading-tight font-semibold text-cream lg:text-[1.35rem]">
                  {tr(step.title)}
                </h3>
                <p className="mt-2.5 text-[14.5px] leading-[1.7] text-mute">{tr(step.text)}</p>
              </Reveal>
            ))}
          </ol>
        </div>

        <Reveal delay={120} className="mt-14">
          {/* Bir oz qiya qo'yilgan yorliq — stol ustiga tashlangan stikerday */}
          <p
            className="inline-flex max-w-[30rem] flex-wrap items-baseline gap-x-3 gap-y-1 rounded-2xl bg-paper px-6 py-5 text-[14px] leading-snug text-espresso shadow-lift"
            style={{ transform: 'rotate(-1.4deg)' }}
          >
            <span className="font-display text-[2.2rem] leading-none font-bold">{stats.days}</span>
            {tr(flow.note)}
          </p>
        </Reveal>
      </div>
    </section>
  );
}
