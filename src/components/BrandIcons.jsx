/**
 * Ijtimoiy tarmoq belgilari va Voyla logotipi.
 * lucide-react'da brend belgilari yo'q — o'zimiz chizamiz, bu yengilroq ham.
 */

const base = (size, className, strokeWidth = 1.9) => ({
  viewBox: '0 0 24 24',
  width: size,
  height: size,
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  'aria-hidden': 'true',
  className,
});

export function InstagramIcon({ size = 20, className = '' }) {
  return (
    <svg {...base(size, className)}>
      <rect x="2" y="2" width="20" height="20" rx="5.5" />
      <circle cx="12" cy="12" r="4.2" />
      <circle cx="17.6" cy="6.4" r="1.1" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function TelegramIcon({ size = 20, className = '' }) {
  return (
    <svg {...base(size, className)}>
      <path d="M21.4 3.6 2.9 10.7c-.9.35-.87 1.63.04 1.94l4.6 1.55 1.8 5.3c.28.83 1.36 1.02 1.9.34l2.4-3 4.5 3.3c.66.48 1.6.12 1.77-.68l3.1-14.6c.17-.8-.62-1.5-1.4-1.2z" />
      <path d="m7.55 14.2 10.6-7.6-6.9 8.5-.15 4" />
    </svg>
  );
}

/**
 * Voyla logotipi — so'z va marjon nuqta.
 * Instagram'dagi belgingiz bilan bir xil mantiq: «voyla» + nuqta.
 */
export function VoylaMark({ className = '' }) {
  return (
    <span className={`inline-flex items-baseline gap-[0.12em] leading-none ${className}`}>
      <span className="font-display font-semibold tracking-[-0.02em]">voyla</span>
      <span className="h-[0.3em] w-[0.3em] shrink-0 self-end rounded-full bg-coral" style={{ marginBottom: '0.08em' }} />
    </span>
  );
}
