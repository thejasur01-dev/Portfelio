import { guard, readBody } from './_lib/auth.js';
import { commitFiles } from './_lib/github.js';

const ALLOWED = new Set(['site', 'packages', 'faq', 'portfolio', 'reviews', 'settings']);

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'faqat POST' });
  if (!guard(req, res)) return undefined;

  try {
    const body = await readBody(req);

    // Bitta fayl ham, bir nechtasi ham bir xil ko'rinishda qabul qilinadi
    const list = Array.isArray(body.files) ? body.files : [{ file: body.file, data: body.data }];
    const bad = list.find((item) => !ALLOWED.has(item.file) || item.data === undefined);
    if (bad) return res.status(400).json({ error: `«${bad.file}» saqlanmaydi` });

    const payload = list.map((item) => ({
      path: `src/data/${item.file}.json`,
      base64: Buffer.from(`${JSON.stringify(item.data, null, 2)}\n`, 'utf8').toString('base64'),
    }));

    const names = list.map((item) => item.file).join(', ');
    const sha = await commitFiles(payload, `Admin: ${names} yangilandi`);

    return res.status(200).json({ ok: true, commit: sha, savedAt: new Date().toISOString() });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
