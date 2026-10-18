import { explain } from './_lib/explain.js';
import { guard, readBody } from './_lib/auth.js';
import { grabScreenshot } from './_lib/screenshot.js';

/**
 * Sayt havolasidan ekran surati oladi va uni panelga QAYTARADI.
 *
 * Bu yerda saqlanmaydi: panel suratni brauzerda 420px kenglikdagi webp'ga
 * aylantiradi (600 KB → ~20 KB) va shundan keyin odatdagi surat yuklash
 * yo'li bilan saqlaydi. Natijada repozitoriyga faqat yengil fayl tushadi va
 * u qolgan 46 ta surat bilan bir xil o'lchamda bo'ladi.
 */
export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'faqat POST' });
  if (!guard(req, res)) return undefined;

  try {
    const { url } = await readBody(req);
    const { buffer, type, source } = await grabScreenshot(url, 22_000);

    return res.status(200).json({
      ok: true,
      source,
      dataUrl: `data:${type};base64,${buffer.toString('base64')}`,
    });
  } catch (error) {
    return res.status(500).json({ error: explain(error) });
  }
}
