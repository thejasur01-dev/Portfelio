import { useMemo } from 'react';
import portfolio from '../data/portfolio.json';

/**
 * Mijozlar saytlarining ekranlaridan qurilgan «devor».
 *
 * Ustunlar sekin yuqoriga/pastga siljiydi. Halqa uzilmasligi uchun har bir
 * ustun ro'yxati IKKI MARTA chizdiriladi va animatsiya -50% ga suriladi —
 * ya'ni ikkinchi nusxa birinchisining aynan o'rniga kelganda qaytadan boshlanadi.
 *
 * Rasmlar faqat bezak, shuning uchun `aria-hidden`: ekran o'quvchi 46 ta
 * rasm nomini o'qib bermasligi kerak.
 */
export default function SiteWall({ columns = 3, className = '' }) {
  const lanes = useMemo(() => {
    const shots = portfolio.filter((item) => item.image && !item.hidden);
    const result = Array.from({ length: columns }, () => []);
    shots.forEach((item, index) => {
      result[index % columns].push(item);
    });
    return result;
  }, [columns]);

  return (
    <div aria-hidden="true" className={`pointer-events-none relative overflow-hidden ${className}`}>
      <div className="grid h-full grid-flow-col gap-3 sm:gap-4" style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}>
        {lanes.map((lane, index) => (
          <div key={index} className="overflow-hidden">
            <div className={index % 2 === 1 ? 'stream-rev' : 'stream'} style={{ animationDuration: `${44 + index * 9}s` }}>
              {[...lane, ...lane].map((item, copy) => (
                <div key={`${item.id}-${copy}`} className="mb-3 overflow-hidden rounded-xl ring-1 ring-cream/10 sm:mb-4 sm:rounded-2xl">
                  <img
                    src={item.image}
                    alt=""
                    loading={copy === 0 && index === 0 ? 'eager' : 'lazy'}
                    decoding="async"
                    className="block w-full"
                  />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Yuqori va pastki chetlarni fonga eritamiz */}
      <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-void to-transparent sm:h-32" />
      <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-void to-transparent sm:h-32" />
    </div>
  );
}
