import { checkPassword, makeToken, setCookie, readBody } from './_lib/auth.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'faqat POST' });

  try {
    const { login, password } = await readBody(req);
    if (!checkPassword(login ?? '', password ?? '')) {
      // Parolni ketma-ket terib ko'rishni sekinlashtiramiz
      await new Promise((resolve) => setTimeout(resolve, 700));
      return res.status(401).json({ error: 'Login yoki parol noto‘g‘ri' });
    }

    setCookie(res, makeToken(), 12 * 60 * 60);
    return res.status(200).json({ ok: true, login });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
