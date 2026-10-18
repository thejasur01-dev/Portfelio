/**
 * Portfolio ma'lumotini va rasmlarini tayyorlaydi.
 *
 *   node scripts/make-portfolio.mjs
 *
 * Nima qiladi:
 *  1. C:/Loyihalar ichidagi har bir `Stomvizitka-backup-*` papkadan mijoz
 *     ma'lumotini o'qiydi (ism, kasb, shahar, Instagram) va saytda qanday
 *     bo'limlar bo'lganini aniqlaydi (video, xarita, prays, natija, otziv, kurs).
 *  2. Oldindan olingan ekran suratlarini kichraytirib `public/work/` ga qo'yadi.
 *  3. Hammasini `src/data/portfolio.json` ga yozadi.
 *
 * MUHIM: agar `src/data/portfolio.json` allaqachon mavjud bo'lsa, undagi
 * `url` (Netlify havolasi) va `featured` qiymatlari SAQLANADI — ya'ni admin
 * panelda qo'lda kiritilgan havolalar skript qayta ishga tushganda yo'qolmaydi.
 */
import { readdirSync, existsSync, readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';
import sharp from 'sharp';

const BACKUPS = 'C:/Loyihalar';
const SHOTS = 'C:/Users/Jasur/AppData/Local/Temp/claude/c--Loyihalar-Stomvizitka/352fcb9c-ccdc-41b7-9703-f88a1880642d/scratchpad/pw/portfolio-shots';
const here = (rel) => new URL(rel, import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1');
const DATA = here('../src/data/portfolio.json');
const WORK = here('../public/work');

mkdirSync(WORK, { recursive: true });

/** Avval kiritilgan havolalarni yo'qotmaymiz */
const previous = existsSync(DATA) ? JSON.parse(readFileSync(DATA, 'utf8')) : [];
const keep = new Map(previous.map((item) => [item.id, item]));

const pick = (text, pattern) => (text.match(pattern)?.[1] ?? '').trim();

/** Apostroflar har xil yoziladi (' ' ʻ) — solishtirishdan oldin tenglashtiramiz */
const normalize = (text) => text.toLowerCase().replace(/[‘’ʻ'`]/g, '');

/** Tanilgan shaharlar. Ro'yxatdagi tartib muhim: avval aniqrog'i tekshiriladi. */
const CITIES = [
  'Toshkent',
  'Samarqand',
  'Buxoro',
  'Andijon',
  'Farg‘ona',
  'Namangan',
  'Qarshi',
  'Nukus',
  'Jizzax',
  'Guliston',
  'Navoiy',
  'Termiz',
  'Denov',
  'Qo‘qon',
  'Boysun',
  'Urganch',
  'Xiva',
  'Marhamat',
];

// Zaxiralar + hozir ustida ishlanayotgan loyiha (u ham tayyor sayt).
// Hozirgisining rasmi `_hozirgi-phone.png` nomi bilan olingan.
const folders = [...readdirSync(BACKUPS).filter((name) => name.startsWith('Stomvizitka-backup-')), 'Stomvizitka'];
const projects = [];

for (const folder of folders) {
  const id = folder === 'Stomvizitka' ? '_hozirgi' : folder.replace('Stomvizitka-backup-', '');
  const root = join(BACKUPS, folder);
  const contentPath = join(root, 'src/data/content.js');
  if (!existsSync(contentPath)) continue;

  const content = readFileSync(contentPath, 'utf8');
  const name = pick(content, /name:\s*\{\s*uz:\s*'([^']+)'/);
  const surname = pick(content, /surname:\s*\{\s*uz:\s*'([^']+)'/);
  const role = pick(content, /role:\s*\{\s*uz:\s*'([^']+)'/);
  const instagram = pick(content, /instagram(?:Url)?:\s*'([^']+)'/).replace(/.*instagram\.com\//, '');

  // Shahar: `city` maydonida yoki kasb satrida («Kosmetolog · Toshkent») bo'lishi
  // mumkin. Ikkalasini ham tanilgan shaharlar ro'yxati bo'yicha qidiramiz —
  // aks holda «Estetik kosmetologiya» kabi qiymatlar shahar bo'lib qoladi.
  const haystack = normalize(
    `${pick(content, /city:\s*\{\s*uz:\s*'([^']+)'/)} ${pick(content, /city:\s*'([^']+)'/)} ${role} ${pick(content, /street:\s*'([^']+)'/)}`,
  );
  const city = CITIES.find((known) => haystack.includes(normalize(known))) ?? '';

  // Saytda qanday bo'limlar bo'lgan
  const componentsDir = join(root, 'src/components');
  const components = existsSync(componentsDir)
    ? readdirSync(componentsDir, { recursive: true }).filter((f) => String(f).endsWith('.jsx')).join(',')
    : '';
  const publicDir = join(root, 'public');
  const hasVideo = existsSync(publicDir) && readdirSync(publicDir).some((f) => f.endsWith('.mp4'));

  const tags = [];
  if (hasVideo) tags.push('video');
  if (/MiniMap|ClinicMap|Location/.test(components)) tags.push('map');
  if (/Price/.test(components)) tags.push('price');
  if (/Works|Results|Gallery/.test(components)) tags.push('before-after');
  if (/Review/.test(components)) tags.push('reviews');
  if (/Training/.test(components)) tags.push('course');

  // Rasm
  const shot = join(SHOTS, `${id}-phone.png`);
  let image = '';
  if (existsSync(shot)) {
    await sharp(shot).resize({ width: 420 }).webp({ quality: 72 }).toFile(join(WORK, `${id}.webp`));
    image = `/work/${id}.webp`;
  }

  const old = keep.get(id) ?? {};
  projects.push({
    id,
    // Eski saytlarda ism boshqa ko'rinishda saqlangan — topilmasa bo'sh qoldiramiz,
    // kartada uning o'rniga Instagram useri ko'rsatiladi (bu ham haqiqiy ma'lumot).
    name: [name, surname].filter(Boolean).join(' '),
    role,
    city: city || '',
    instagram,
    tags,
    image,
    url: old.url ?? '',
    featured: old.featured ?? false,
    hidden: old.hidden ?? false,
  });
}

projects.sort((a, b) => a.name.localeCompare(b.name, 'uz'));
writeFileSync(DATA, `${JSON.stringify(projects, null, 2)}\n`, 'utf8');

const withImage = projects.filter((p) => p.image).length;
const withUrl = projects.filter((p) => p.url).length;
console.log(`portfolio.json: ${projects.length} ta loyiha | rasmli: ${withImage} | havolali: ${withUrl}`);
