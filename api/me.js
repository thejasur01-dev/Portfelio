import { readToken } from './_lib/auth.js';

export default function handler(req, res) {
  if (!readToken(req)) return res.status(401).json({ error: 'kirilmagan' });
  return res.status(200).json({ ok: true, login: process.env.ADMIN_LOGIN ?? '', mode: 'cloud' });
}
