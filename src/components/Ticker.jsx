/**
 * Bo'limlar orasidan o'tadigan rangli yuguruvchi lenta.
 *
 * Bu saytning «nafas oladigan» joyi: qorong'i bo'limdan keyingisiga o'tishda
 * ko'z bir zum dam oladi va sayt bir xil bo'lib tuyulmaydi.
 *
 * Lenta bir oz qiya burilgan. O'rovda `overflow-x-clip` ishlatilgan —
 * `overflow-hidden` bo'lsa lentaning qiya uchlari kesilib, tekis qirqilgandek
 * ko'rinadi. Vertikal bo'yicha u erkin chiqib turadi, shuning uchun o'rovga
 * yuqoridan-pastdan bo'shliq berilgan.
 *
 * Matn ikki marta chizdiriladi va -50% ga suriladi — halqa uzilmaydi.
 */
const TONES = {
  coral: 'bg-coral text-[#2b0d08]',
  paper: 'bg-paper text-espresso',
  ink: 'bg-shade text-cream',
};

export default function Ticker({ items, tone = 'coral', slow = false, tilt = -1.6 }) {
  const line = [...items, ...items];

  return (
    <div aria-hidden="true" className="relative z-[3] overflow-x-clip py-6 sm:py-8">
      <div
        className={`${TONES[tone] ?? TONES.coral} w-[108%] py-3 sm:py-3.5`}
        style={{ transform: `translateX(-4%) rotate(${tilt}deg)` }}
      >
        <div className={`ticker ${slow ? 'ticker-slow' : ''}`}>
          {line.map((item, index) => (
            <span
              key={index}
              className="font-display flex items-center gap-5 pr-5 text-[13px] font-semibold tracking-[-0.01em] whitespace-nowrap sm:gap-7 sm:pr-7 sm:text-[17px]"
            >
              {item}
              <span className="text-[0.72em] opacity-55">✦</span>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
