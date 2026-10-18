/**
 * Admin panelning sahifasini yig'maga ko'chiradi (`dist/admin/`).
 *
 * Shundan keyin panel internetda ham ochiladi:
 *   https://<sayt>/admin
 *
 * MUHIM: `auth.json` KO'CHIRILMAYDI. U mahalliy paneldagi login va parol
 * xeshini saqlaydi; internetdagi panel esa Vercel sozlamalaridagi
 * ADMIN_LOGIN / ADMIN_PASSWORD ni ishlatadi. Shu sababli bu yerda fayllar
 * ro'yxati aniq yozilgan — butun papkani ko'chirish xavfli bo'lardi.
 */
import { copyFileSync, mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const here = (rel) => decodeURIComponent(new URL(rel, import.meta.url).pathname).replace(/^\/([A-Za-z]:)/, '$1');
const FROM = here('../admin');
const TO = here('../dist/admin');

const FILES = ['index.html', 'app.js'];

mkdirSync(TO, { recursive: true });
FILES.forEach((name) => copyFileSync(join(FROM, name), join(TO, name)));

// Qidiruv tizimlari admin sahifasini ko'rsatmasin
writeFileSync(here('../dist/robots.txt'), 'User-agent: *\nDisallow: /admin\n', 'utf8');

console.log(`admin paneli ko‘chirildi: dist/admin/ (${FILES.join(', ')})`);
