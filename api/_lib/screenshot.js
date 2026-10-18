/**
 * Berilgan sayt manzilining birinchi ekranini surat qilib oladi.
 *
 * Nega tashqi xizmat: surat olish uchun brauzer kerak. Brauzerni Vercel'ning
 * serverless funksiyasiga sig'dirish mumkin, lekin u ~50 MB joy oladi, sekin
 * ishga tushadi va tez-tez buziladi. Bitta surat uchun bu juda qimmat.
 *
 * TELEFON ko'rinishi olinadi, kompyuternikimas: portfoliodagi qolgan 46 ta
 * surat telefon ekranidan olingan. Aralashib ketsa to'r tartibsiz ko'rinadi.
 *
 * Ikkita xizmat ketma-ket sinaladi:
 *   1. microlink — telefon ko'rinishini to'g'ri beradi (asosiysi)
 *   2. thum.io   — faqat kompyuter ko'rinishi, lekin hech yo'qdan yaxshi
 *
 * Surat shu yerda siqilmaydi: u panelga qaytariladi, brauzer uni 420px
 * kenglikdagi webp'ga aylantiradi va shundan keyingina saqlanadi. Shunday
 * qilinganining sababi — Vercel funksiyasida rasm qayta ishlaydigan kutubxona
 * (sharp) yo'q, brauzerda esa bu bepul.
 */
const SOURCES = [
  {
    name: 'microlink',
    build: (url) =>
      `https://api.microlink.io/?url=${encodeURIComponent(url)}` +
      '&screenshot=true&meta=false&embed=screenshot.url' +
      '&viewport.width=390&viewport.height=844&viewport.isMobile=true&viewport.deviceScaleFactor=2',
    wait: 0,
  },
  {
    name: 'thum.io',
    build: (url) => `https://image.thum.io/get/width/840/noanimate/${url}`,
    wait: 0,
  },
  {
    name: 'mshots',
    build: (url) => `https://s.wordpress.com/mshots/v1/${encodeURIComponent(url)}?w=840`,
    // mshots birinchi so'rovda suratni tayyorlay boshlaydi va kulrang
    // «kutib turing» rasmini qaytaradi — ikkinchi urinishdan oldin kutamiz
    wait: 4000,
  },
];

// «Kutib turing» rasmi juda kichik bo'ladi; haqiqiy ekran surati bunchalik
// yengil bo'lmaydi, shuning uchun hajmi bo'yicha ajratamiz.
const MIN_BYTES = 9000;

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function tryOnce(source, url, timeoutMs) {
  const stop = new AbortController();
  const timer = setTimeout(() => stop.abort(), timeoutMs);

  try {
    const response = await fetch(source.build(url), {
      signal: stop.signal,
      headers: { 'User-Agent': 'Mozilla/5.0 (compatible; voyla-admin/1.0)' },
    });
    if (!response.ok) return null;

    const type = (response.headers.get('content-type') ?? '').split(';')[0];
    if (!type.startsWith('image/')) return null;

    const buffer = Buffer.from(await response.arrayBuffer());
    if (buffer.length < MIN_BYTES) return null;

    return { buffer, type, source: source.name };
  } catch {
    return null;
  } finally {
    clearTimeout(timer);
  }
}

/**
 * @param {string} url — mijoz saytining manzili
 * @param {number} budgetMs — hammasiga ajratilgan vaqt
 */
export async function grabScreenshot(url, budgetMs = 22_000) {
  const clean = String(url ?? '').trim();
  if (!/^https?:\/\/\S+$/i.test(clean)) {
    throw new Error('Sayt havolasi to‘g‘ri yozilmagan (https:// bilan boshlanishi kerak)');
  }

  const deadline = Date.now() + budgetMs;

  for (const source of SOURCES) {
    for (let attempt = 1; attempt <= 2; attempt += 1) {
      const left = deadline - Date.now();
      if (left < 3000) break;

      const result = await tryOnce(source, clean, Math.min(left, 13_000));
      if (result) return result;

      if (attempt === 1 && source.wait && deadline - Date.now() > source.wait + 3000) {
        await sleep(source.wait);
      }
    }
  }

  throw new Error('Surat olinmadi. Sayt ochilmayotgan bo‘lishi mumkin — suratni qo‘lda yuklang.');
}

export default grabScreenshot;
