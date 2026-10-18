import { ArrowDown } from 'lucide-react';

/**
 * Aylanib turadigan yumaloq yorliq — matn doira bo'ylab yoziladi.
 *
 * `xlinkHref` ishlatilgan (`href` emas): eski Safari'da `textPath` ning
 * SVG2 ko'rinishidagi `href` atributi ishlamaydi va matn yo'qolib qoladi.
 */
export default function SpinBadge({ text, id = 'badge-path', className = '' }) {
  // Matn doira bo'ylab ikki marta yoziladi va aylana uzunligiga ROSA
  // cho'ziladi (`textLength`). Shunday qilinmasa matn tilga qarab goh
  // qisqa qolib bo'shliq ochadi, goh uzun bo'lib o'z ustiga chiqadi.
  const line = `${text} ✦ ${text} ✦`;
  const RADIUS = 52;
  const circumference = 2 * Math.PI * RADIUS;

  return (
    <div className={`relative grid place-items-center ${className}`}>
      <svg viewBox="0 0 140 140" className="spin-slow h-full w-full" aria-hidden="true">
        <defs>
          <path id={id} fill="none" d="M70,70 m-52,0 a52,52 0 1,1 104,0 a52,52 0 1,1 -104,0" />
        </defs>
        <text className="font-display" fontSize="12.5" fontWeight="600" letterSpacing="1.6" fill="currentColor">
          <textPath xlinkHref={`#${id}`} textLength={circumference} lengthAdjust="spacing">
            {line}
          </textPath>
        </text>
      </svg>

      <span className="absolute grid h-12 w-12 place-items-center rounded-full bg-coral text-white">
        <ArrowDown size={18} strokeWidth={2.4} />
      </span>
    </div>
  );
}
