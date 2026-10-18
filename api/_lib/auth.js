import { createHmac, createHash, timingSafeEqual } from 'node:crypto';

/**
 * Admin panelga kirish.
 *
 * Panel endi internetda turadi, shuning uchun:
 *   — login va parol Vercel'ning «Environment Variables» bo'limida yotadi,
 *     kodda emas. Ya'ni GitHub'ga chiqmaydi;
 *   — kirgandan keyin brauzerga imzolangan chipta (cookie) beriladi. Uni
 *     o'zgartirib bo'lmaydi: imzo `SESSION_SECRET` bilan qo'yiladi;
 *   — chipta 12 soatdan keyin kuchini yo'qotadi.
 */
const COOKIE = 'voyla_admin';
const LIFETIME = 12 * 60 * 60 * 1000;

const secret = () => process.env.SESSION_SECRET || '';

/** Bir xil uzunlikdagi xeshlarni solishtiramiz — parol uzunligi sezilmasin */
const same = (a, b) => {
  const x = createHash('sha256').update(String(a)).digest();
  const y = createHash('sha256').update(String(b)).digest();
  return timingSafeEqual(x, y);
};

export function checkPassword(login, password) {
  const expectedLogin = process.env.ADMIN_LOGIN;
  const expectedPassword = process.env.ADMIN_PASSWORD;
  if (!expectedLogin || !expectedPassword || !secret()) {
    throw new Error('Vercel sozlamalarida ADMIN_LOGIN, ADMIN_PASSWORD yoki SESSION_SECRET yo‘q');
  }
  return same(login, expectedLogin) && same(password, expectedPassword);
}

export function makeToken() {
  const body = Buffer.from(JSON.stringify({ exp: Date.now() + LIFETIME })).toString('base64url');
  const mac = createHmac('sha256', secret()).update(body).digest('base64url');
  return `${body}.${mac}`;
}

export function readToken(req) {
  const raw = (req.headers.cookie ?? '').match(new RegExp(`(?:^|;\\s*)${COOKIE}=([^;]+)`))?.[1];
  if (!raw || !secret()) return null;

  const [body, mac] = raw.split('.');
  if (!body || !mac) return null;

  const expected = createHmac('sha256', secret()).update(body).digest('base64url');
  const given = Buffer.from(mac);
  const want = Buffer.from(expected);
  if (given.length !== want.length || !timingSafeEqual(given, want)) return null;

  try {
    const payload = JSON.parse(Buffer.from(body, 'base64url').toString('utf8'));
    return payload.exp > Date.now() ? payload : null;
  } catch {
    return null;
  }
}

export const setCookie = (res, value, maxAgeSeconds) => {
  res.setHeader(
    'Set-Cookie',
    `${COOKIE}=${value}; HttpOnly; Secure; Path=/; Max-Age=${maxAgeSeconds}; SameSite=Lax`,
  );
};

/** Kirmagan bo'lsa 401 qaytaradi va `false` beradi */
export function guard(req, res) {
  if (readToken(req)) return true;
  res.status(401).json({ error: 'kirilmagan' });
  return false;
}

/** So'rov tanasi: Vercel uni o'zi JSON qilib bermasa, o'zimiz o'qiymiz */
export async function readBody(req) {
  if (req.body && typeof req.body === 'object') return req.body;
  const chunks = [];
  for await (const chunk of req) chunks.push(chunk);
  const text = Buffer.concat(chunks).toString('utf8');
  return text ? JSON.parse(text) : {};
}
