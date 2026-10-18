import { randomBytes } from 'node:crypto';
import { guard, readBody } from './_lib/auth.js';
import { commitFiles, deleteFile } from './_lib/github.js';

/**
 * Surat yuklash (mijoz fikrlari va loyiha ekran suratlari uchun).
 *
 * Surat brauzerda kichraytirilib, webp'ga o'girilgan holda keladi — shuning
 * uchun bu yerda hech narsa qayta ishlanmaydi, faqat repozitoriyga yoziladi.
 *
 * Fayl nomini FOYDALANUVCHI BERMAYDI, biz o'zimiz o'ylab topamiz: aks holda
 * nomga `../` yozib, repozitoriyning boshqa joyiga fayl tiqish mumkin bo'lardi.
 */
const FOLDERS = new Set(['reviews', 'work']);

const EXTENSIONS = {
  'image/webp': 'webp',
  'image/jpeg': 'jpg',
  'image/png': 'png',
};

export default async function handler(req, res) {
  if (!guard(req, res)) return undefined;

  try {
    const body = await readBody(req);

    // ---------- O'chirish ----------
    if (req.method === 'DELETE' || body.remove) {
      const path = String(body.remove ?? body.path ?? '').replace(/^\//, '');
      const folder = path.split('/')[1];
      if (!path.startsWith('public/') || !FOLDERS.has(folder)) {
        return res.status(400).json({ error: 'bunday faylni o‘chirib bo‘lmaydi' });
      }
      await deleteFile(path, `Admin: ${path} o‘chirildi`);
      return res.status(200).json({ ok: true });
    }

    // ---------- Yuklash ----------
    if (req.method !== 'POST') return res.status(405).json({ error: 'faqat POST' });

    const folder = String(body.folder ?? 'reviews');
    if (!FOLDERS.has(folder)) return res.status(400).json({ error: 'papka noto‘g‘ri' });

    const match = String(body.dataUrl ?? '').match(/^data:(image\/(?:webp|jpeg|png));base64,(.+)$/);
    if (!match) return res.status(400).json({ error: 'surat o‘qilmadi' });

    const [, mime, base64] = match;
    // 4 MB — Vercel so'rov hajmi chegarasidan pastda
    if (base64.length * 0.75 > 4_000_000) return res.status(413).json({ error: 'surat juda katta' });

    const name = `${Date.now().toString(36)}-${randomBytes(3).toString('hex')}.${EXTENSIONS[mime]}`;
    const path = `public/${folder}/${name}`;

    await commitFiles([{ path, base64 }], `Admin: ${folder} uchun surat qo‘shildi`);

    // Saytda surat shu manzil bilan ko'rinadi
    return res.status(200).json({ ok: true, url: `/${folder}/${name}`, path });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
