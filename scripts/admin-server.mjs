/**
 * Admin panel serveri.
 *
 *   npm run admin        → http://localhost:4455
 *   (yoki papkadagi «ADMIN PANEL.bat» faylini ikki marta bosasiz)
 *
 * Nega shunday qilingan:
 *   Sayt ma'lumoti `src/data/*.json` fayllarida yotadi. Bu server o'sha
 *   fayllarni brauzerdan tahrirlash imkonini beradi — ma'lumotlar bazasi,
 *   oylik to'lov kerak emas. Siz kompyuterda panelni ochasiz, o'zgartirasiz,
 *   «Saytni yig'ish» tugmasini bosasiz va `dist` papkasini Netlify'ga
 *   tashlaysiz — odatdagidek.
 *
 *   Server FAQAT shu kompyuterdan ochiladi (127.0.0.1). Internetdan hech kim
 *   kira olmaydi. Shunga qaramay kirish uchun login va parol so'raladi —
 *   kompyuterni boshqa odam ochib qolsa, sayt matnini o'zgartira olmaydi.
 *
 *   Parol `admin/auth.json` da OCHIQ EMAS: tasodifiy tuz bilan scrypt orqali
 *   yopilgan. Uni «Sozlamalar» bo'limidan almashtirasiz. Bu fayl `src/` dan
 *   tashqarida yotadi, shuning uchun saytga hech qachon chiqmaydi.
 *
 * Har saqlashdan oldin eski nusxa `.admin-backups/` ga olinadi.
 */
import { createServer } from 'node:http';
import { readFileSync, writeFileSync, existsSync, mkdirSync, readdirSync, unlinkSync, statSync } from 'node:fs';
import { join, extname, normalize } from 'node:path';
import { spawn } from 'node:child_process';
import { randomBytes, scryptSync, timingSafeEqual } from 'node:crypto';

const here = (rel) => decodeURIComponent(new URL(rel, import.meta.url).pathname).replace(/^\/([A-Za-z]:)/, '$1');
const ROOT = here('../');
const DATA = join(ROOT, 'src/data');
const ADMIN = join(ROOT, 'admin');
const WORK = join(ROOT, 'public/work');
const BACKUPS = join(ROOT, '.admin-backups');
const AUTH = join(ADMIN, 'auth.json');
const PORT = 4455;

// Tahrirlash mumkin bo'lgan fayllar. Boshqa hech qanday fayl yozilmaydi.
const FILES = ['site', 'packages', 'faq', 'portfolio', 'settings'];

const TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.webp': 'image/webp',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.svg': 'image/svg+xml',
};

const send = (res, code, body, type = 'application/json; charset=utf-8', headers = {}) => {
  res.writeHead(code, { 'Content-Type': type, 'Cache-Control': 'no-store', ...headers });
  res.end(body);
};

const json = (res, code, data, headers) => send(res, code, JSON.stringify(data), undefined, headers);

const readData = (name) => JSON.parse(readFileSync(join(DATA, `${name}.json`), 'utf8'));

// ------------------------------------------------------------------ kirish
/**
 * Ochiq seanslar. Server qayta ishga tushsa ro'yxat bo'shaydi va qaytadan
 * kirish so'raladi — bu kutilgan narsa, panel kun bo'yi ochiq turmaydi.
 */
const sessions = new Map();
const DAY = 24 * 60 * 60 * 1000;

const readAuth = () => JSON.parse(readFileSync(AUTH, 'utf8'));

/** Parolni tekshirish. Solishtirish `timingSafeEqual` bilan. */
function verify(login, password) {
  const auth = readAuth();
  if (String(login) !== auth.login) return false;
  const given = scryptSync(String(password), auth.salt, 64);
  const stored = Buffer.from(auth.hash, 'hex');
  return given.length === stored.length && timingSafeEqual(given, stored);
}

function setPassword(login, password) {
  const salt = randomBytes(16).toString('hex');
  const hash = scryptSync(String(password), salt, 64).toString('hex');
  const auth = readAuth();
  writeFileSync(AUTH, `${JSON.stringify({ ...auth, login: String(login), salt, hash }, null, 2)}\n`, 'utf8');
}

const tokenOf = (req) => (req.headers.cookie ?? '').match(/(?:^|;\s*)voyla_admin=([^;]+)/)?.[1] ?? '';

function signedIn(req) {
  const token = tokenOf(req);
  const until = sessions.get(token);
  if (!until) return false;
  if (until < Date.now()) {
    sessions.delete(token);
    return false;
  }
  return true;
}

// ------------------------------------------------------------------ fayllar
/** Eski nusxani saqlab qo'yamiz — xato bo'lsa qaytarib olish uchun */
function backup(name) {
  mkdirSync(BACKUPS, { recursive: true });
  const source = join(DATA, `${name}.json`);
  if (!existsSync(source)) return;

  const stamp = new Date().toISOString().replace(/[:.]/g, '-');
  writeFileSync(join(BACKUPS, `${name}.${stamp}.json`), readFileSync(source));

  // Faqat oxirgi 20 nusxani qoldiramiz
  const old = readdirSync(BACKUPS)
    .filter((file) => file.startsWith(`${name}.`))
    .sort()
    .slice(0, -20);
  old.forEach((file) => unlinkSync(join(BACKUPS, file)));
}

const body = (req) =>
  new Promise((resolve, reject) => {
    const chunks = [];
    let size = 0;
    req.on('data', (chunk) => {
      size += chunk.length;
      // 8 MB dan katta so'rov kutilmaydi — bu xato yoki noto'g'ri so'rov
      if (size > 8_000_000) reject(new Error('so‘rov juda katta'));
      chunks.push(chunk);
    });
    req.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')));
    req.on('error', reject);
  });

/** `npm run build` ni ishga tushiradi va chiqishini qaytaradi */
function build() {
  return new Promise((resolve) => {
    const npm = process.platform === 'win32' ? 'npm.cmd' : 'npm';
    const child = spawn(npm, ['run', 'build'], { cwd: ROOT, shell: process.platform === 'win32' });
    let out = '';
    child.stdout.on('data', (data) => (out += data));
    child.stderr.on('data', (data) => (out += data));
    child.on('close', (code) => resolve({ ok: code === 0, output: out.slice(-4000) }));
    child.on('error', (error) => resolve({ ok: false, output: error.message }));
  });
}

const serveFile = (res, file) => {
  if (!existsSync(file) || !statSync(file).isFile()) return send(res, 404, 'topilmadi', 'text/plain; charset=utf-8');
  return send(res, 200, readFileSync(file), TYPES[extname(file)] ?? 'application/octet-stream');
};

const server = createServer(async (req, res) => {
  const url = new URL(req.url, `http://localhost:${PORT}`);
  const path = decodeURIComponent(url.pathname);

  try {
    // ---------- Kirish ----------
    if (path === '/api/login' && req.method === 'POST') {
      const payload = JSON.parse(await body(req));
      if (!verify(payload.login, payload.password)) {
        // Parolni ketma-ket terib ko'rishni sekinlashtiramiz
        await new Promise((resolve) => setTimeout(resolve, 600));
        return json(res, 401, { error: 'Login yoki parol noto‘g‘ri' });
      }
      const token = randomBytes(24).toString('hex');
      sessions.set(token, Date.now() + DAY);
      return json(res, 200, { ok: true, login: readAuth().login }, {
        'Set-Cookie': `voyla_admin=${token}; HttpOnly; Path=/; Max-Age=${DAY / 1000}; SameSite=Strict`,
      });
    }

    if (path === '/api/logout' && req.method === 'POST') {
      sessions.delete(tokenOf(req));
      return json(res, 200, { ok: true }, { 'Set-Cookie': 'voyla_admin=; HttpOnly; Path=/; Max-Age=0; SameSite=Strict' });
    }

    if (path === '/api/me') {
      return signedIn(req) ? json(res, 200, { ok: true, login: readAuth().login }) : json(res, 401, { error: 'kirilmagan' });
    }

    // ---------- Qolgan hamma API faqat kirgandan keyin ----------
    if (path.startsWith('/api/') && !signedIn(req)) {
      return json(res, 401, { error: 'kirilmagan' });
    }

    if (path === '/api/state') {
      const state = {};
      FILES.forEach((name) => (state[name] = readData(name)));
      return json(res, 200, { files: state, cwd: ROOT, login: readAuth().login });
    }

    if (path === '/api/save' && req.method === 'POST') {
      const payload = JSON.parse(await body(req));
      if (!FILES.includes(payload.file)) return json(res, 400, { error: 'bunday fayl yo‘q' });
      if (payload.data === undefined) return json(res, 400, { error: 'ma‘lumot yo‘q' });

      backup(payload.file);
      writeFileSync(join(DATA, `${payload.file}.json`), `${JSON.stringify(payload.data, null, 2)}\n`, 'utf8');
      return json(res, 200, { ok: true, savedAt: new Date().toISOString() });
    }

    /** Login va parolni almashtirish */
    if (path === '/api/account' && req.method === 'POST') {
      const payload = JSON.parse(await body(req));
      const login = String(payload.login ?? '').trim();
      const password = String(payload.password ?? '');
      if (login.length < 2) return json(res, 400, { error: 'Login juda qisqa' });
      if (password.length < 1) return json(res, 400, { error: 'Parol bo‘sh bo‘lmasin' });

      setPassword(login, password);
      // Eski seanslar bekor qilinadi — parol almashgandan keyin qayta kiriladi
      sessions.clear();
      return json(res, 200, { ok: true }, { 'Set-Cookie': 'voyla_admin=; HttpOnly; Path=/; Max-Age=0; SameSite=Strict' });
    }

    if (path === '/api/build' && req.method === 'POST') {
      return json(res, 200, await build());
    }

    // ---------- Rasmlar ----------
    if (path.startsWith('/work/')) {
      const file = normalize(join(WORK, path.slice('/work/'.length)));
      if (!file.startsWith(normalize(WORK))) return send(res, 403, 'mumkin emas', 'text/plain');
      return serveFile(res, file);
    }

    // ---------- Panelning o'zi ----------
    // `auth.json` hech qachon berilmaydi — u shu papkada yotadi
    if (path.endsWith('auth.json')) return send(res, 403, 'mumkin emas', 'text/plain');

    const file = normalize(join(ADMIN, path === '/' ? 'index.html' : path));
    if (!file.startsWith(normalize(ADMIN))) return send(res, 403, 'mumkin emas', 'text/plain');
    return serveFile(res, file);
  } catch (error) {
    return json(res, 500, { error: error.message });
  }
});

server.listen(PORT, '127.0.0.1', () => {
  const address = `http://localhost:${PORT}`;
  console.log(`\n  Voyla admin paneli: ${address}`);
  console.log(`  Login: ${readAuth().login}`);
  console.log('  To‘xtatish uchun: Ctrl + C\n');

  // Brauzerni o'zi ochib beradi (sinov paytida VOYLA_NO_OPEN=1 bilan o'chiriladi)
  if (process.env.VOYLA_NO_OPEN) return;
  const open = process.platform === 'win32' ? ['cmd', ['/c', 'start', '', address]] : ['open', [address]];
  spawn(open[0], open[1], { stdio: 'ignore', detached: true }).unref();
});
