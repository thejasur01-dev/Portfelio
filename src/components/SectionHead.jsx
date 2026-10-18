import Reveal from './Reveal';
import RichText from './RichText';

/**
 * Bo'lim sarlavhasi.
 *
 * `tone="light"` — qog'oz rangli bo'limlar uchun (matn qora bo'ladi).
 * `index` berilsa, yon tomonda faqat konturi chizilgan katta raqam turadi.
 */
export default function SectionHead({ eyebrow, title, text, index, tone = 'dark', align = 'left', className = '' }) {
  const light = tone === 'light';
  const centered = align === 'center';

  return (
    <div className={`${centered ? 'mx-auto max-w-[46rem] text-center' : 'max-w-[46rem]'} ${className}`}>
      <Reveal className={`flex flex-wrap items-center gap-4 ${centered ? 'justify-center' : ''}`}>
        {index ? (
          <span
            aria-hidden="true"
            className={`font-display text-[2.4rem] leading-none font-bold sm:text-[3.2rem] ${light ? 'stroke-dark' : 'stroke'}`}
          >
            {index}
          </span>
        ) : null}
        <span className={`eyebrow ${light ? 'eyebrow-dark' : ''}`}>{eyebrow}</span>
      </Reveal>

      <Reveal
        as="h2"
        delay={80}
        className={`font-display mt-5 text-[1.9rem] leading-[1.1] font-semibold tracking-[-0.03em] sm:text-[2.6rem] lg:text-[3rem] ${
          light ? 'text-espresso' : 'text-cream'
        }`}
      >
        <RichText text={title} />
      </Reveal>

      {text ? (
        <Reveal
          as="p"
          delay={150}
          className={`mt-5 max-w-[38rem] text-[15px] leading-[1.75] sm:text-[16px] ${
            light ? 'text-espresso-mute' : 'text-mute'
          } ${centered ? 'mx-auto' : ''}`}
        >
          {text}
        </Reveal>
      ) : null}
    </div>
  );
}
