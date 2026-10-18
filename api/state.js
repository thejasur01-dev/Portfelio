import { guard } from './_lib/auth.js';
import { explain } from './_lib/explain.js';
import { readJson } from './_lib/github.js';

// Admin panel tahrirlaydigan fayllar
const FILES = ['site', 'packages', 'faq', 'portfolio', 'reviews', 'settings'];

export default async function handler(req, res) {
  if (!guard(req, res)) return undefined;

  try {
    // Repozitoriydan o'qiymiz, sayt yig'masidan emas: shunda endigina
    // saqlangan o'zgarish ham darhol ko'rinadi (sayt hali yangilanmagan bo'lsa ham)
    const entries = await Promise.all(FILES.map(async (name) => [name, await readJson(`src/data/${name}.json`)]));
    const files = Object.fromEntries(entries);

    // Panel internetda turibdi: qisqa parol haqiqiy xavf, shuni aytib turamiz
    const weak = (process.env.ADMIN_PASSWORD ?? '').length < 10;

    return res.status(200).json({ files, login: process.env.ADMIN_LOGIN ?? '', mode: 'cloud', weak });
  } catch (error) {
    return res.status(500).json({ error: explain(error) });
  }
}
