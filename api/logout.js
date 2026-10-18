import { setCookie } from './_lib/auth.js';

export default function handler(req, res) {
  setCookie(res, '', 0);
  return res.status(200).json({ ok: true });
}
