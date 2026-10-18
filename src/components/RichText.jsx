/**
 * Matndagi *yulduzcha ichidagi so'z* ni qiya serif shriftga aylantiradi.
 *
 *   "Mijoz Instagram'da *narx* so'raydi."
 *
 * Nega shunday: sarlavhaning bitta so'zini boshqa shaklga o'tkazish uni
 * jonlantiradi. Yulduzcha ishlatilgani sabab — admin panelda matn oddiy
 * maydonda yoziladi, HTML yozish shart emas.
 */
export default function RichText({ text }) {
  const parts = String(text ?? '').split(/(\*[^*]+\*)/g);

  return (
    <>
      {parts.map((part, index) =>
        part.length > 2 && part.startsWith('*') && part.endsWith('*') ? (
          <em key={index} className="ital">
            {part.slice(1, -1)}
          </em>
        ) : (
          part
        ),
      )}
    </>
  );
}
