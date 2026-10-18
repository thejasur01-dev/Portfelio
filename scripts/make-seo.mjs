/**
 * `index.html` ichidagi strukturaviy ma'lumotni (JSON-LD) qayta yozadi.
 *
 *   node scripts/make-seo.mjs
 *
 * Nega skript: savollar `src/data/faq.json`da turadi va admin panelda
 * o'zgaradi. Agar JSON-LD qo'lda yozilsa, savol o'zgarganda Google'ga eski
 * matn ko'rinib qoladi. Shuning uchun u yig'ishdan oldin avtomatik yoziladi
 * (`npm run build` buni o'zi bajaradi).
 */
import { readFileSync, writeFileSync } from 'node:fs';

const here = (rel) => new URL(rel, import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1');

const site = JSON.parse(readFileSync(here('../src/data/site.json'), 'utf8'));
const faq = JSON.parse(readFileSync(here('../src/data/faq.json'), 'utf8'));
const portfolio = JSON.parse(readFileSync(here('../src/data/portfolio.json'), 'utf8'));
const settings = JSON.parse(readFileSync(here('../src/data/settings.json'), 'utf8'));

// Domen admin paneldagi «Sozlamalar» bo'limidan olinadi
const ORIGIN = (settings.origin || 'https://voyla.uz').replace(/\/+$/, '');
const live = portfolio.filter((item) => !item.hidden);

/** JSON ichidagi `<` va `&` brauzerni chalg'itmasligi uchun */
const safe = (data) => JSON.stringify(data, null, 2).replace(/</g, '\\u003c').replace(/&/g, '\\u0026');

const organization = {
  '@context': 'https://schema.org',
  '@type': 'ProfessionalService',
  '@id': `${ORIGIN}/#studio`,
  name: site.brand.name,
  description: site.brand.tagline.uz,
  url: `${ORIGIN}/`,
  image: `${ORIGIN}/og-cover.jpg`,
  sameAs: [site.contacts.instagramUrl, site.contacts.telegramUrl].filter(Boolean),
  areaServed: { '@type': 'Country', name: 'Uzbekistan' },
  knowsLanguage: ['uz', 'ru', 'en'],
  serviceType: 'Web design',
  // Faqat haqiqiy raqamlar: nechta sayt qurilgani portfolio faylidan olinadi
  slogan: site.hero.titleAccent.uz,
};

const faqPage = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faq.map((item) => ({
    '@type': 'Question',
    name: item.q.uz,
    acceptedAnswer: { '@type': 'Answer', text: item.a.uz },
  })),
};

// Havolasi bor loyihalar — Google ularni bir-biriga bog'langan ishlar deb ko'radi
const works = {
  '@context': 'https://schema.org',
  '@type': 'ItemList',
  name: site.work.title.uz,
  numberOfItems: live.filter((item) => item.url).length,
  itemListElement: live
    .filter((item) => item.url)
    .map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name || `@${item.instagram}`,
      url: item.url,
    })),
};

const blocks = [organization, faqPage, works]
  .map((data) => `    <script type="application/ld+json">\n${safe(data)}\n    </script>`)
  .join('\n');

const path = here('../index.html');
let html = readFileSync(path, 'utf8');

/**
 * Meta teglar ham shu yerda yangilanadi.
 *
 * Sabab: sarlavha, tavsif va domen admin panelda o'zgaradi, lekin ular
 * `index.html` ichida statik yozilgan — qidiruv tizimlari va Telegram
 * sahifani JavaScript'siz o'qiydi. Demak ularni yig'ishdan oldin fayldagi
 * o'rniga yozib qo'yish kerak.
 */
const meta = site.meta?.uz ?? {};
const replaceAttr = (pattern, value) => {
  html = html.replace(pattern, (match) => match.replace(/(content|href)="[^"]*"/, `$1="${value}"`));
};

if (meta.title) html = html.replace(/<title>[^<]*<\/title>/, `<title>${meta.title}</title>`);
if (meta.description) {
  replaceAttr(/<meta\s+name="description"[\s\S]*?\/>/, meta.description);
  replaceAttr(/<meta\s+property="og:description"[\s\S]*?\/>/, meta.description);
}
if (meta.title) replaceAttr(/<meta\s+property="og:title"[\s\S]*?\/>/, meta.title);
replaceAttr(/<link\s+rel="canonical"[\s\S]*?\/>/, `${ORIGIN}/`);
replaceAttr(/<meta\s+property="og:url"[\s\S]*?\/>/, `${ORIGIN}/`);
replaceAttr(/<meta\s+property="og:image"[\s\S]*?\/>/, `${ORIGIN}/og-cover.jpg`);
const start = '<!-- seo:start';
const end = '<!-- seo:end -->';

const from = html.indexOf(start);
const to = html.indexOf(end);
if (from === -1 || to === -1) {
  throw new Error('index.html ichida `seo:start` / `seo:end` belgilari topilmadi');
}

const head = html.slice(0, from);
const marker = html.slice(from, html.indexOf('-->', from) + 3);
const tail = html.slice(to);

writeFileSync(path, `${head}${marker}\n${blocks}\n    ${tail}`, 'utf8');
console.log(
  `index.html: meta va JSON-LD yangilandi — ${ORIGIN}, ${faq.length} savol, ${works.numberOfItems} havolali loyiha`,
);
