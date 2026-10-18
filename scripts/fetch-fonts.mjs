/**
 * Shriftlarni o'zimizga ko'chirib oladi.
 *
 *   node scripts/fetch-fonts.mjs      (npm run fonts)
 *
 * Nega: Google Fonts'ga har safar ulanish vaqt oladi, ba'zi internetlarda esa
 * umuman ochilmaydi — o'shanda sayt tizim shriftiga tushib, butunlay boshqa
 * (va juda oddiy) ko'rinadi. Shriftlar `public/fonts/` da yotsa bunday bo'lmaydi.
 *
 * Kirillcha subset ALOHIDA olinadi — rus tilidagi yarmi boshqa shriftga
 * tushib qolmasligi uchun.
 */
import { writeFile, mkdir } from 'node:fs/promises';
import { join } from 'node:path';

const here = (rel) => decodeURIComponent(new URL(rel, import.meta.url).pathname).replace(/^\/([A-Za-z]:)/, '$1');
const OUT = here('../public/fonts');
await mkdir(OUT, { recursive: true });

// woff2 olish uchun zamonaviy brauzer sifatida so'raymiz
const UA =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0 Safari/537.36';

const FAMILIES = [
  { css: 'Unbounded:wght@500;600;700', slug: 'unbounded' },
  { css: 'Manrope:wght@400;500;600;700', slug: 'manrope' },
  { css: 'Playfair+Display:ital,wght@1,400;1,500;1,600', slug: 'playfair' },
];

// Faqat kerakli yozuvlar: lotin, kengaytirilgan lotin va kirill
const KEEP = ['latin', 'latin-ext', 'cyrillic', 'cyrillic-ext'];

let css = `/* Shriftlar — \`node scripts/fetch-fonts.mjs\` yozadi, qo'lda tahrirlanmaydi. */\n`;
let count = 0;

for (const family of FAMILIES) {
  const url = `https://fonts.googleapis.com/css2?family=${family.css}&display=swap`;
  const source = await fetch(url, { headers: { 'User-Agent': UA } }).then((response) => response.text());

  // Google CSS'i `/* latin */` izohi bilan har bir subsetni ajratib beradi
  const blocks = source.split('/*').filter((block) => block.includes('@font-face'));

  for (const block of blocks) {
    const subset = block.slice(0, block.indexOf('*/')).trim();
    if (!KEEP.includes(subset)) continue;

    const remote = block.match(/url\((https:[^)]+\.woff2)\)/)?.[1];
    const weight = block.match(/font-weight:\s*(\d+)/)?.[1] ?? '400';
    const style = /font-style:\s*italic/.test(block) ? 'italic' : 'normal';
    const range = block.match(/unicode-range:\s*([^;]+);/)?.[1] ?? '';
    const name = block.match(/font-family:\s*'([^']+)'/)?.[1] ?? family.slug;
    if (!remote) continue;

    const file = `${family.slug}-${weight}-${style}-${subset}.woff2`;
    const data = Buffer.from(await fetch(remote, { headers: { 'User-Agent': UA } }).then((r) => r.arrayBuffer()));
    await writeFile(join(OUT, file), data);
    count += 1;

    css +=
      `\n@font-face {\n` +
      `  font-family: '${name}';\n` +
      `  font-style: ${style};\n` +
      `  font-weight: ${weight};\n` +
      `  font-display: swap;\n` +
      `  src: url('/fonts/${file}') format('woff2');\n` +
      (range ? `  unicode-range: ${range};\n` : '') +
      `}\n`;
  }
}

await writeFile(here('../src/fonts.css'), css, 'utf8');
console.log(`${count} ta shrift fayli public/fonts/ ga olindi, src/fonts.css yozildi`);
