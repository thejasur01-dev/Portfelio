/**
 * Belgichalar va ijtimoiy tarmoq uchun muqova.
 *
 *   node scripts/make-brand-assets.mjs      (npm run brand:assets)
 *
 * Chiqadigan fayllar (public/):
 *   favicon.svg, favicon-32.png, apple-touch-icon.png,
 *   manifest.webmanifest, og-cover.jpg
 *
 * Muqovadagi telefon suratlari — haqiqiy mijoz saytlarining ekranlari
 * (`public/work/`). Ya'ni muqovada chizilgan maket emas, ishning o'zi turadi.
 */
import { writeFile, readFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import sharp from 'sharp';

const path = (rel) => decodeURIComponent(new URL(rel, import.meta.url).pathname).replace(/^\/([A-Za-z]:)/, '$1');
const pub = (file) => path(`../public/${file}`);

const VOID = '#0c0b0b';
const CORAL = '#ff5a4e';
const CREAM = '#f5f2ed';

// ---------------------------------------------------------------- belgi
/**
 * «V» harfi va marjon nuqta. Harf shrift bilan emas, chiziq bilan chizilgan —
 * shunda belgichaning ko'rinishi shrift o'rnatilganiga bog'liq bo'lmaydi.
 */
const mark = `
  <rect width="200" height="200" rx="46" fill="${VOID}"/>
  <path d="M60 58 L100 136 L140 58" fill="none" stroke="${CREAM}" stroke-width="21" stroke-linecap="round" stroke-linejoin="round"/>
  <circle cx="158" cy="150" r="12" fill="${CORAL}"/>`;

const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200">${mark}</svg>\n`;
await writeFile(pub('favicon.svg'), svg);

for (const [file, size] of [
  ['favicon-32.png', 32],
  ['apple-touch-icon.png', 180],
  ['icon-192.png', 192],
  ['icon-512.png', 512],
]) {
  await sharp(Buffer.from(svg)).resize(size, size).png().toFile(pub(file));
}

// ---------------------------------------------------------------- manifest
await writeFile(
  pub('manifest.webmanifest'),
  `${JSON.stringify(
    {
      name: 'Voyla — web-studiya',
      short_name: 'Voyla',
      description: "Go'zallik sohasi uchun saytlar",
      start_url: '/',
      display: 'standalone',
      background_color: VOID,
      theme_color: VOID,
      icons: [
        { src: '/icon-192.png', sizes: '192x192', type: 'image/png' },
        { src: '/icon-512.png', sizes: '512x512', type: 'image/png' },
        { src: '/favicon.svg', sizes: 'any', type: 'image/svg+xml' },
      ],
    },
    null,
    2,
  )}\n`,
);

// ---------------------------------------------------------------- muqova
const portfolio = JSON.parse(await readFile(path('../src/data/portfolio.json'), 'utf8'));
const site = JSON.parse(await readFile(path('../src/data/site.json'), 'utf8'));

/** Burchaklarni yumaloqlash: niqob SVG'ni `dest-in` bilan ustiga qo'yamiz */
const rounded = async (file, width, height) => {
  const mask = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}"><rect width="${width}" height="${height}" rx="22" fill="#fff"/></svg>`;
  return sharp(file)
    .resize({ width, height, position: 'top' })
    .composite([{ input: Buffer.from(mask), blend: 'dest-in' }])
    .png()
    .toBuffer();
};

const picks = portfolio
  .filter((item) => item.image && !item.hidden && existsSync(pub(item.image.replace(/^\//, ''))))
  .sort((a, b) => Number(b.featured) - Number(a.featured) || Number(Boolean(b.url)) - Number(Boolean(a.url)))
  .slice(0, 3);

const SHOT_W = 236;
const SHOT_H = 500;
const tops = [96, 58, 20];
const lefts = [676, 856, 1036];

const layers = [];
for (let index = 0; index < picks.length; index += 1) {
  layers.push({
    input: await rounded(pub(picks[index].image.replace(/^\//, '')), SHOT_W, SHOT_H),
    left: lefts[index],
    top: tops[index],
  });
}

const { sites, cities, days } = site.stats;

/** Sarlavhadagi *yulduzchalar* saytda qiya shrift uchun — rasmda ular kerak emas */
const plain = (text) => text.replace(/\*/g, '');
// Yozuvlar site.json dan olinadi — «kun» yoki «soat» o'zgarsa muqova ham o'zgaradi
const [sitesLabel, citiesLabel, daysLabel] = site.hero.statsLabel.uz;
const font = 'Arial, Helvetica, sans-serif';

const cover = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630">
  <defs>
    <radialGradient id="glow" cx="0.5" cy="0" r="0.8">
      <stop offset="0" stop-color="#f5f2ed" stop-opacity="0.07"/>
      <stop offset="1" stop-color="#f5f2ed" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <rect width="1200" height="630" fill="${VOID}"/>
  <rect width="1200" height="630" fill="url(#glow)"/>

  <text x="72" y="150" font-family="${font}" font-size="84" font-weight="700" letter-spacing="-3" fill="${CREAM}">voyla</text>
  <circle cx="320" cy="140" r="13" fill="${CORAL}"/>

  <text x="72" y="232" font-family="${font}" font-size="30" font-weight="700" fill="${CORAL}">${site.brand.tagline.uz}</text>

  <text x="72" y="330" font-family="${font}" font-size="36" font-weight="700" fill="${CREAM}">${plain(site.hero.titleTop.uz)}</text>
  <text x="72" y="384" font-family="${font}" font-size="36" font-weight="700" fill="${CORAL}">${plain(site.hero.titleAccent.uz)}</text>

  <text x="72" y="500" font-family="${font}" font-size="26" font-weight="700" fill="${CREAM}">${sites} ${sitesLabel}  ·  ${cities} ${citiesLabel}  ·  ${days} ${daysLabel}</text>
  <text x="72" y="548" font-family="${font}" font-size="24" fill="#a09b94">instagram.com/${site.contacts.instagram}</text>
</svg>`;

await sharp(Buffer.from(cover))
  .composite(layers)
  .jpeg({ quality: 86, mozjpeg: true })
  .toFile(pub('og-cover.jpg'));

console.log(`tayyor: favicon.svg, favicon-32.png, apple-touch-icon.png, icon-192/512.png, manifest.webmanifest, og-cover.jpg (${picks.length} ta ekran surati bilan)`);
