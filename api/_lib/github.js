/**
 * GitHub bilan ishlash.
 *
 * Nega aynan GitHub ma'lumot ombori bo'lib xizmat qiladi:
 *   Vercel'dagi fayllar faqat o'qish uchun — u yerga yozib bo'lmaydi.
 *   Ma'lumotlar bazasi olish esa oylik to'lov va yana bitta xizmat demak.
 *   Bizning ma'lumotimiz allaqachon repozitoriyda yotibdi, shuning uchun
 *   admin panel o'zgarishni to'g'ridan-to'g'ri repozitoriyga commit qiladi.
 *   Vercel buni ko'radi va saytni o'zi qayta yig'adi.
 *
 * Shuning uchun saqlaganingizdan keyin sayt darhol emas, bir-ikki daqiqada
 * yangilanadi — bu narx emas, almashuv: hech qanday qo'shimcha xizmat yo'q.
 */
const API = 'https://api.github.com';

const need = (name) => {
  const value = process.env[name];
  if (!value) throw new Error(`Vercel sozlamalarida «${name}» yo‘q`);
  return value;
};

const repo = () => need('GITHUB_REPO'); // masalan: thejasur01-dev/Portfelio
const branch = () => process.env.GITHUB_BRANCH || 'main';

async function gh(path, options = {}) {
  const response = await fetch(`${API}${path}`, {
    ...options,
    headers: {
      Authorization: `Bearer ${need('GITHUB_TOKEN')}`,
      Accept: 'application/vnd.github+json',
      'X-GitHub-Api-Version': '2022-11-28',
      'Content-Type': 'application/json',
      'User-Agent': 'voyla-admin',
      ...options.headers,
    },
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`GitHub ${response.status}: ${text.slice(0, 300)}`);
  }
  return response.json();
}

/** Repozitoriydagi JSON faylni o'qiydi */
export async function readJson(path) {
  const data = await gh(`/repos/${repo()}/contents/${encodeURI(path)}?ref=${branch()}`);
  return JSON.parse(Buffer.from(data.content, 'base64').toString('utf8'));
}

/**
 * Bir nechta faylni BITTA commit bilan yozadi.
 *
 * Har faylni alohida yozish ham mumkin edi, lekin unda har bir fayl alohida
 * commit bo'lib, Vercel saytni necha marta qayta yig'ardi. Bitta commit —
 * bitta qayta yig'ish.
 *
 * @param {{path: string, base64: string}[]} files
 */
export async function commitFiles(files, message) {
  if (files.length === 0) return null;

  const ref = await gh(`/repos/${repo()}/git/ref/heads/${branch()}`);
  const headSha = ref.object.sha;
  const headCommit = await gh(`/repos/${repo()}/git/commits/${headSha}`);

  const tree = [];
  for (const file of files) {
    const blob = await gh(`/repos/${repo()}/git/blobs`, {
      method: 'POST',
      body: JSON.stringify({ content: file.base64, encoding: 'base64' }),
    });
    tree.push({ path: file.path, mode: '100644', type: 'blob', sha: blob.sha });
  }

  const newTree = await gh(`/repos/${repo()}/git/trees`, {
    method: 'POST',
    body: JSON.stringify({ base_tree: headCommit.tree.sha, tree }),
  });

  const commit = await gh(`/repos/${repo()}/git/commits`, {
    method: 'POST',
    body: JSON.stringify({ message, tree: newTree.sha, parents: [headSha] }),
  });

  await gh(`/repos/${repo()}/git/refs/heads/${branch()}`, {
    method: 'PATCH',
    body: JSON.stringify({ sha: commit.sha }),
  });

  return commit.sha;
}

/** Faylni o'chiradi (surat olib tashlanganda) */
export async function deleteFile(path, message) {
  const current = await gh(`/repos/${repo()}/contents/${encodeURI(path)}?ref=${branch()}`).catch(() => null);
  if (!current) return false;

  await gh(`/repos/${repo()}/contents/${encodeURI(path)}`, {
    method: 'DELETE',
    body: JSON.stringify({ message, sha: current.sha, branch: branch() }),
  });
  return true;
}
