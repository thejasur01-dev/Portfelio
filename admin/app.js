/* ============================================================
   VOYLA — ADMIN PANEL

   Ma'lumot `src/data/*.json` fayllarida yotadi. Panel ularni o'qiydi,
   siz o'zgartirasiz, «Saqlash» bosganda fayllar qayta yoziladi.

   Muhim qoida: matn kiritilayotganda ro'yxat QAYTA CHIZILMAYDI — aks holda
   har harfda kursor sakrab ketadi. Qayta chizish faqat tartib o'zgarganda,
   qator qo'shilganda yoki filtr almashganda bo'ladi.
   ============================================================ */

const state = {
  files: {},
  dirty: new Set(),
  tab: 'portfolio',
  mode: 'local',
  lang: 'uz',
  search: '',
  onlyMissing: false,
};

const LANGS = [
  ['uz', "O'zbekcha"],
  ['ru', 'Русский'],
  ['en', 'English'],
];

/** Panelda ko'rinadigan nomlar. Ro'yxatda yo'q kalit o'z nomi bilan chiqadi. */
const LABELS = {
  brand: 'Brend',
  name: 'Nom',
  tagline: 'Shior',
  contacts: 'Aloqa',
  instagram: 'Instagram useri',
  instagramUrl: 'Instagram havolasi',
  telegram: 'Telegram useri',
  telegramUrl: 'Telegram havolasi',
  phone: 'Telefon',
  phoneHref: 'Telefon havolasi (tel:…)',
  dmKeyword: 'Kalit so‘z',
  stats: 'Raqamlar',
  sites: 'Nechta sayt',
  cities: 'Nechta shahar',
  days: 'Necha kunda',
  meta: 'Brauzer sarlavhasi (SEO)',
  description: 'Tavsif',
  hero: 'Birinchi ekran',
  eyebrow: 'Ustki yozuv',
  titleTop: 'Sarlavha — birinchi qator',
  titleAccent: 'Sarlavha — rangli qator',
  title: 'Sarlavha',
  text: 'Matn',
  primary: 'Asosiy tugma',
  secondary: 'Ikkinchi tugma',
  statsLabel: 'Raqamlar ostidagi yozuv (har qatorda bitta)',
  problem: 'Nega sayt kerak',
  rows: 'Qatorlar',
  before: 'Oldin (muammo)',
  after: 'Keyin (yechim)',
  work: 'Ishlar bo‘limi',
  all: 'Hammasi tugmasi',
  open: '«Saytni ochish»',
  soon: '«Havola tez orada»',
  more: '«Yana ko‘rsatish»',
  cityLabel: 'Shahar tanlash',
  featured: '«Asosiy» belgisi',
  tags: 'Belgilar',
  features: 'Nima kiradi',
  items: 'Ro‘yxat',
  process: 'Jarayon',
  steps: 'Qadamlar',
  note: 'Izoh',
  pricing: 'Narxlar bo‘limi',
  popular: '«Ko‘p tanlanadi»',
  cta: 'Paket tugmasi',
  faqSection: 'Savollar bo‘limi',
  contact: 'Bog‘lanish bo‘limi',
  footer: 'Pastki qism',
  pages: 'Bo‘limlar',
  rights: 'Huquqlar yozuvi',
  nav: 'Menyu nomlari',
  ui: 'Tugma nomlari',
  menu: 'Menyu',
  close: 'Yopish',
  language: 'Til',
  order: 'Buyurtma',
  faq: 'Savollar',
  for: 'Kimga mos',
  price: 'Narx (raqam yoki bo‘sh)',
  priceNote: 'Narx o‘rniga yoziladigan matn',
  q: 'Savol',
  a: 'Javob',
  role: 'Kasbi',
  city: 'Shahar',
  url: 'Sayt havolasi',
};

const label = (key) => LABELS[key] ?? key;

// ------------------------------------------------------------------ yordamchi
function el(tag, props = {}, children = []) {
  const node = document.createElement(tag);
  Object.entries(props).forEach(([key, value]) => {
    if (key === 'class') node.className = value;
    else if (key === 'text') node.textContent = value;
    else if (key === 'html') node.innerHTML = value;
    else if (key.startsWith('on')) node.addEventListener(key.slice(2), value);
    else if (value !== undefined && value !== null && value !== false) node.setAttribute(key, value);
  });
  (Array.isArray(children) ? children : [children]).filter(Boolean).forEach((child) => node.append(child));
  return node;
}

/** {uz, ru, en} ko'rinishidagi matnmi? */
const isLocalized = (value) =>
  value !== null && typeof value === 'object' && !Array.isArray(value) && 'uz' in value && ('ru' in value || 'en' in value);

const activeLangs = () => (state.lang === 'all' ? LANGS.map(([id]) => id) : [state.lang]);

function markDirty(file) {
  state.dirty.add(file);
  renderStatus();
}

// ------------------------------------------------------------------ maydonlar
/** Uzun matn uchun textarea, qisqasiga oddiy input */
function textInput(value, onChange, long = false) {
  const node = el(long ? 'textarea' : 'input', { type: 'text', rows: long ? 3 : undefined });
  node.value = value ?? '';
  node.addEventListener('input', () => onChange(node.value));
  return node;
}

/** Bitta matn — tanlangan tillar bo'yicha */
function localizedField(key, object, file) {
  const long = LANGS.some(([id]) => typeof object[id] === 'string' && object[id].length > 90);
  const arrays = Array.isArray(object.uz);

  const fields = activeLangs().map((id) => {
    if (arrays) {
      // {uz:[...], ru:[...]} — har qatorda bitta element
      const area = el('textarea', { rows: 3 });
      area.value = (object[id] ?? []).join('\n');
      area.addEventListener('input', () => {
        object[id] = area.value.split('\n').map((line) => line.trim());
        markDirty(file);
      });
      return el('div', {}, [el('label', { text: `${id.toUpperCase()}` }), area]);
    }

    return el('div', {}, [
      el('label', { text: state.lang === 'all' ? id.toUpperCase() : label(key) }),
      textInput(object[id], (value) => {
        object[id] = value;
        markDirty(file);
      }, long),
    ]);
  });

  return el('div', { class: 'row' }, [
    state.lang === 'all' ? el('label', { text: label(key) }) : null,
    el('div', { class: state.lang === 'all' ? 'row three' : 'row' }, fields),
  ]);
}

/** Oddiy matn yoki raqam */
function plainField(key, holder, prop, file) {
  const value = holder[prop];
  const isNumber = typeof value === 'number';
  const node = el('input', { type: isNumber ? 'number' : 'text' });
  node.value = value ?? '';
  node.addEventListener('input', () => {
    holder[prop] = isNumber ? Number(node.value) : node.value;
    markDirty(file);
  });
  return el('div', { class: 'row' }, [el('label', { text: label(key) }), node]);
}

/**
 * Har qanday JSON tugunini maydonlarga aylantiradi.
 * `site.json` shu bilan to'liq tahrirlanadi — alohida forma yozish shart emas.
 */
function renderNode(value, key, holder, file, depth = 0) {
  if (isLocalized(value)) return localizedField(key, value, file);

  if (Array.isArray(value)) {
    return el('div', {}, [
      el('div', { class: 'group-title', text: label(key) }),
      ...value.map((item, index) =>
        el('div', { class: 'list-item' }, [
          el('div', { class: 'list-head' }, [el('strong', { text: `${index + 1}. ${item.id ?? ''}` })]),
          renderNode(item, key, value, file, depth + 1),
        ]),
      ),
    ]);
  }

  if (value !== null && typeof value === 'object') {
    const inner = Object.entries(value)
      .filter(([childKey]) => childKey !== 'id')
      .map(([childKey, childValue]) => renderNode(childValue, childKey, value, file, depth + 1));

    if (depth === 0) return el('div', { class: 'card' }, [el('div', { class: 'group-title', text: label(key) }), ...inner]);
    return el('div', {}, inner);
  }

  if (typeof value === 'boolean') {
    const box = el('input', { type: 'checkbox' });
    box.checked = value;
    box.addEventListener('change', () => {
      holder[key] = box.checked;
      markDirty(file);
    });
    return el('div', { class: 'row' }, [el('label', { class: 'toggle' }, [box, el('span', { text: label(key) })])]);
  }

  return plainField(key, holder, key, file);
}

// ------------------------------------------------------------------ loyihalar
function renderPortfolio() {
  const list = state.files.portfolio;
  const withUrl = list.filter((item) => item.url).length;

  const search = el('input', { type: 'text', placeholder: 'Ism yoki instagram bo‘yicha qidirish' });
  search.value = state.search;
  search.addEventListener('input', () => {
    state.search = search.value;
    render();
  });

  const missing = el('input', { type: 'checkbox' });
  missing.checked = state.onlyMissing;
  missing.addEventListener('change', () => {
    state.onlyMissing = missing.checked;
    render();
  });

  const needle = state.search.trim().toLowerCase();
  const shown = list.filter((item) => {
    const hay = `${item.name} ${item.instagram} ${item.city} ${item.role}`.toLowerCase();
    if (needle && !hay.includes(needle)) return false;
    if (state.onlyMissing && item.url) return false;
    return true;
  });

  const move = (item, step) => {
    const index = list.indexOf(item);
    const next = index + step;
    if (next < 0 || next >= list.length) return;
    list.splice(index, 1);
    list.splice(next, 0, item);
    markDirty('portfolio');
    render();
  };

  /** Yangi loyiha — ro'yxat boshiga qo'shiladi, shunda darhol ko'rinadi */
  const add = () => {
    list.unshift({
      id: newId('loyiha'),
      name: '',
      role: '',
      city: '',
      instagram: '',
      tags: [],
      image: '',
      url: '',
      featured: false,
      hidden: false,
    });
    state.search = '';
    state.onlyMissing = false;
    markDirty('portfolio');
    render();
  };

  const remove = (item) => {
    if (!confirm(`«${item.name || item.instagram || 'bu loyiha'}» o‘chirilsinmi?`)) return;
    list.splice(list.indexOf(item), 1);
    markDirty('portfolio');
    render();
  };

  /** Ekran surati: brauzerda kichraytirilib yuklanadi */
  const setImage = (item) =>
    pickImage(async (file) => {
      try {
        const url = await uploadImage(file, 'work');
        if (!url) return;
        item.image = url;
        markDirty('portfolio');
        render();
      } catch (error) {
        alert(error.message);
      }
    });

  const cards = shown.map((item) => {
    const badge = el('span', {
      class: `badge ${item.url ? 'live' : 'none'}`,
      text: item.url ? 'havola bor' : 'havola yo‘q',
    });

    const url = el('input', { type: 'text', placeholder: 'https://…' });
    url.value = item.url ?? '';
    url.addEventListener('input', () => {
      item.url = url.value.trim();
      badge.className = `badge ${item.url ? 'live' : 'none'}`;
      badge.textContent = item.url ? 'havola bor' : 'havola yo‘q';
      markDirty('portfolio');
    });

    const field = (key) => {
      const node = el('input', { type: 'text' });
      node.value = item[key] ?? '';
      node.addEventListener('input', () => {
        item[key] = node.value;
        markDirty('portfolio');
      });
      return el('div', {}, [el('label', { text: label(key) }), node]);
    };

    const toggle = (key, title) => {
      const box = el('input', { type: 'checkbox' });
      box.checked = Boolean(item[key]);
      box.addEventListener('change', () => {
        item[key] = box.checked;
        markDirty('portfolio');
      });
      return el('label', { class: 'toggle' }, [box, el('span', { text: title })]);
    };

    const thumb = item.image
      ? el('img', { src: item.image.replace('/work/', '/work/'), alt: '', loading: 'lazy' })
      : el('div', { class: 'thumb-empty', text: '—' });

    return el('div', { class: 'card' }, [
      el('div', { class: 'project' }, [
        thumb,
        el('div', {}, [
          el('div', { class: 'list-head' }, [
            el('strong', { text: item.name || (item.instagram ? `@${item.instagram}` : 'yangi loyiha') }),
            badge,
            el('button', { class: 'ghost', text: '↑', title: 'Yuqoriga', onclick: () => move(item, -1) }),
            el('button', { class: 'ghost', text: '↓', title: 'Pastga', onclick: () => move(item, 1) }),
            el('button', { class: 'ghost', text: 'O‘chirish', onclick: () => remove(item) }),
          ]),

          el('div', { class: 'row' }, [el('label', { text: 'Sayt havolasi' }), url]),

          el('div', { class: 'row three' }, [field('name'), field('role'), field('city')]),
          el('div', { class: 'row two' }, [
            field('instagram'),
            el('div', {}, [
              el('label', { text: 'Belgilar' }),
              el('div', { class: 'toggles', style: 'padding-top:8px' }, [
                el('span', { class: 'status', text: item.tags.join(', ') || 'yo‘q' }),
              ]),
            ]),
          ]),

          el('div', { class: 'toggles' }, [
            el('button', {
              class: 'ghost',
              text: item.image ? 'Suratni almashtirish' : 'Surat qo‘shish',
              onclick: () => setImage(item),
            }),
            toggle('featured', 'Asosiy (birinchi turadi)'),
            toggle('hidden', 'Saytda ko‘rsatilmasin'),
          ]),
        ]),
      ]),
    ]);
  });

  return el('div', {}, [
    el('p', {
      class: 'hint',
      text: `${list.length} ta loyiha · ${withUrl} tasida havola bor · ${list.length - withUrl} tasi kutmoqda. Havolani qo‘ysangiz, karta saytda bosiladigan bo‘ladi.`,
    }),
    el('div', { class: 'filters' }, [
      el('button', { class: 'primary', text: '+ Loyiha qo‘shish', onclick: add }),
      search,
      el('label', { class: 'toggle' }, [missing, el('span', { text: 'Faqat havolasizlari' })]),
      el('span', { class: 'status', text: `${shown.length} ta ko‘rsatilmoqda` }),
    ]),
    ...cards,
  ]);
}

// ------------------------------------------------------------------ suratlar
/**
 * Suratni BRAUZERDA kichraytiradi va webp'ga o'giradi.
 *
 * Nega bu yerda: telefondan olingan skrinshot 3–8 MB bo'ladi. Uni shundayligicha
 * yuborsak, internetga chiqarilgan panelning so'rov chegarasiga urilamiz va
 * sayt ham og'irlashadi. Kichraytirilgani ~100–200 KB bo'ladi.
 *
 * `toDataURL('image/webp')` qo'llab-quvvatlanmasa brauzer jim turib png
 * qaytaradi — shuning uchun natija tekshiriladi va kerak bo'lsa jpeg olinadi.
 */
async function shrink(file, maxWidth = 900, quality = 0.82) {
  const bitmap = await createImageBitmap(file);
  const scale = Math.min(1, maxWidth / bitmap.width);

  const canvas = document.createElement('canvas');
  canvas.width = Math.round(bitmap.width * scale);
  canvas.height = Math.round(bitmap.height * scale);
  canvas.getContext('2d').drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  bitmap.close?.();

  const webp = canvas.toDataURL('image/webp', quality);
  return webp.startsWith('data:image/webp') ? webp : canvas.toDataURL('image/jpeg', quality);
}

/** Fayl tanlash oynasini ochadi */
function pickImage(onPick) {
  const input = el('input', { type: 'file', accept: 'image/*', style: 'display:none' });
  input.addEventListener('change', () => {
    if (input.files?.[0]) onPick(input.files[0]);
    input.remove();
  });
  document.body.append(input);
  input.click();
}

/** Suratni serverga yuboradi va saytdagi manzilini qaytaradi */
async function uploadImage(file, folder) {
  const dataUrl = await shrink(file);
  const response = await fetch('/api/upload', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ folder, dataUrl }),
  });

  if (response.status === 401) {
    showGate();
    return null;
  }
  const result = await response.json().catch(() => ({}));
  if (!response.ok || !result.url) throw new Error(result.error ?? 'Surat yuklanmadi');
  return result.url;
}

/** Yangi yozuv uchun qisqa, takrorlanmaydigan id */
const newId = (prefix) => `${prefix}-${Date.now().toString(36)}`;

// ------------------------------------------------------------------ mijoz fikrlari
function renderReviews() {
  const list = state.files.reviews;

  const move = (index, step) => {
    const next = index + step;
    if (next < 0 || next >= list.length) return;
    [list[index], list[next]] = [list[next], list[index]];
    markDirty('reviews');
    render();
  };

  const remove = async (index) => {
    if (!confirm('Shu fikr o‘chirilsinmi?')) return;
    const [gone] = list.splice(index, 1);
    markDirty('reviews');
    render();

    // Surat ham keraksiz bo'lib qoladi — uni ham olib tashlaymiz
    if (gone?.image) {
      await fetch('/api/upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ remove: state.mode === 'cloud' ? `public${gone.image}` : gone.image }),
      }).catch(() => {});
    }
  };

  const add = () =>
    pickImage(async (file) => {
      const status = document.getElementById('status');
      status.className = 'status';
      status.textContent = 'surat yuklanmoqda…';
      try {
        const url = await uploadImage(file, 'reviews');
        if (!url) return;
        list.push({ id: newId('fikr'), image: url, name: '', note: '', hidden: false });
        markDirty('reviews');
        render();
      } catch (error) {
        status.className = 'status dirty';
        status.textContent = error.message;
      }
    });

  const replace = (item) =>
    pickImage(async (file) => {
      try {
        const url = await uploadImage(file, 'reviews');
        if (!url) return;
        item.image = url;
        markDirty('reviews');
        render();
      } catch (error) {
        alert(error.message);
      }
    });

  const field = (item, key, title) => {
    const input = el('input', { type: 'text' });
    input.value = item[key] ?? '';
    input.addEventListener('input', () => {
      item[key] = input.value;
      markDirty('reviews');
    });
    return el('div', {}, [el('label', { text: title }), input]);
  };

  const toggle = (item) => {
    const box = el('input', { type: 'checkbox' });
    box.checked = Boolean(item.hidden);
    box.addEventListener('change', () => {
      item.hidden = box.checked;
      markDirty('reviews');
    });
    return el('label', { class: 'toggle' }, [box, el('span', { text: 'Saytda ko‘rsatilmasin' })]);
  };

  return el('div', {}, [
    el('p', {
      class: 'hint',
      text:
        'Yozishmadan olingan skrinshotni qo‘yasiz. Surat o‘zi kichraytiriladi. ' +
        'Bitta ham fikr bo‘lmasa, bu bo‘lim saytda umuman ko‘rinmaydi.',
    }),

    el('button', { class: 'primary', text: '+ Fikr qo‘shish', onclick: add }),
    el('div', { style: 'height:16px' }),

    ...list.map((item, index) =>
      el('div', { class: 'card' }, [
        el('div', { class: 'project' }, [
          el('img', { src: item.image, alt: '', loading: 'lazy' }),
          el('div', {}, [
            el('div', { class: 'list-head' }, [
              el('strong', { text: item.name || `Fikr ${index + 1}` }),
              el('button', { class: 'ghost', text: '↑', onclick: () => move(index, -1) }),
              el('button', { class: 'ghost', text: '↓', onclick: () => move(index, 1) }),
              el('button', { class: 'ghost', text: 'O‘chirish', onclick: () => remove(index) }),
            ]),
            el('div', { class: 'row two' }, [
              field(item, 'name', 'Kim yozgan (ixtiyoriy)'),
              field(item, 'note', 'Izoh (ixtiyoriy)'),
            ]),
            el('div', { class: 'toggles' }, [
              el('button', { class: 'ghost', text: 'Suratni almashtirish', onclick: () => replace(item) }),
              toggle(item),
            ]),
          ]),
        ]),
      ]),
    ),

    list.length === 0 ? el('p', { class: 'hint', text: 'Hozircha fikr yo‘q.' }) : null,
  ]);
}

// ------------------------------------------------------------------ paketlar
function renderPackages() {
  const list = state.files.packages;

  return el('div', {}, [
    el('p', {
      class: 'hint',
      text: 'Narx bo‘sh qolsa, saytda raqam emas, «narxni kelishamiz» yoziladi. Raqamni shu ko‘rinishda yozing: 1 500 000 so‘m.',
    }),
    ...list.map((plan) =>
      el('div', { class: 'card' }, [
        el('div', { class: 'list-head' }, [
          el('strong', { text: plan.name.uz }),
          plan.popular ? el('span', { class: 'badge live', text: 'ko‘p tanlanadi' }) : null,
        ]),
        ...Object.entries(plan)
          .filter(([key]) => key !== 'id' && key !== 'popular')
          .map(([key, value]) => renderNode(value, key, plan, 'packages', 1)),
      ]),
    ),
  ]);
}

// ------------------------------------------------------------------ savollar
function renderFaq() {
  const list = state.files.faq;

  const move = (index, step) => {
    const next = index + step;
    if (next < 0 || next >= list.length) return;
    [list[index], list[next]] = [list[next], list[index]];
    markDirty('faq');
    render();
  };

  const add = () => {
    list.push({
      id: `savol-${Date.now().toString(36)}`,
      q: { uz: '', ru: '', en: '' },
      a: { uz: '', ru: '', en: '' },
    });
    markDirty('faq');
    render();
  };

  const remove = (index) => {
    if (!confirm('Shu savol o‘chirilsinmi?')) return;
    list.splice(index, 1);
    markDirty('faq');
    render();
  };

  return el('div', {}, [
    el('p', { class: 'hint', text: 'Savollar saytdagi tartibda turadi. Birinchisi sayt ochilganda ochiq bo‘ladi.' }),
    ...list.map((item, index) =>
      el('div', { class: 'card' }, [
        el('div', { class: 'list-head' }, [
          el('strong', { text: `${index + 1}. ${item.q.uz || 'yangi savol'}` }),
          el('button', { class: 'ghost', text: '↑', onclick: () => move(index, -1) }),
          el('button', { class: 'ghost', text: '↓', onclick: () => move(index, 1) }),
          el('button', { class: 'ghost', text: 'O‘chirish', onclick: () => remove(index) }),
        ]),
        localizedField('q', item.q, 'faq'),
        localizedField('a', item.a, 'faq'),
      ]),
    ),
    el('button', { text: '+ Savol qo‘shish', onclick: add }),
  ]);
}

// ------------------------------------------------------------------ matnlar
function renderSite() {
  const site = state.files.site;
  return el('div', {}, [
    el('p', {
      class: 'hint',
      html:
        'Saytdagi barcha yozuvlar shu yerda. Telegram va telefon bo‘sh bo‘lsa — saytda o‘sha tugmalar umuman ko‘rinmaydi.<br>' +
        'Sarlavhadagi bitta so‘zni <b>*yulduzcha ichiga*</b> olsangiz, u saytda qiya yozuvda chiqadi.',
    }),
    ...Object.entries(site).map(([key, value]) => renderNode(value, key, site, 'site', 0)),
  ]);
}


// ------------------------------------------------------------------ sozlamalar
const SECTION_NAMES = {
  problem: 'Nega sayt kerak',
  work: 'Ishlar (portfolio)',
  features: 'Nima kiradi',
  process: 'Jarayon',
  pricing: 'Narxlar',
  faq: 'Savollar',
  contact: 'Bog\u2018lanish',
};

const EXTRA_NAMES = {
  tickers: 'Yuguruvchi lentalar',
  grain: 'Plyonka donasi (fon ustidagi parda)',
  stickyCta: 'Telefonda pastda turadigan tugma',
};

function renderSettings() {
  const settings = state.files.settings;

  /** Yoqish/o'chirish katakchasi */
  const toggle = (holder, key, title) => {
    const box = el('input', { type: 'checkbox' });
    box.checked = holder[key] !== false;
    box.addEventListener('change', () => {
      holder[key] = box.checked;
      markDirty('settings');
    });
    return el('label', { class: 'toggle', style: 'display:flex;margin:0 0 12px' }, [box, el('span', { text: title })]);
  };

  // ---- Login va parol ----
  const loginBox = el('input', { type: 'text', autocomplete: 'username' });
  loginBox.value = state.login ?? '';
  const passBox = el('input', { type: 'password', autocomplete: 'new-password', placeholder: 'yangi parol' });
  const accountMsg = el('p', { class: 'hint', style: 'margin:12px 0 0' });

  const saveAccount = async (button) => {
    button.disabled = true;
    const response = await fetch('/api/account', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ login: loginBox.value, password: passBox.value }),
    });
    const result = await response.json().catch(() => ({}));
    button.disabled = false;

    if (!response.ok) {
      accountMsg.textContent = result.error ?? 'Saqlanmadi';
      accountMsg.style.color = 'var(--coral)';
      return;
    }

    // Parol almashgandan keyin eski seans bekor bo'ladi — qaytadan kiriladi
    accountMsg.textContent = 'O\u2018zgartirildi. Qaytadan kirish so\u2018raladi...';
    accountMsg.style.color = 'var(--ok)';
    setTimeout(showGate, 1200);
  };

  return el('div', {}, [
    el('p', {
      class: 'hint',
      text: 'Saytning qaysi bo\u2018limlari ko\u2018rinishini, domenini va panelga kirish parolini shu yerdan boshqarasiz.',
    }),

    el('div', { class: 'card' }, [
      el('div', { class: 'group-title', text: 'Sayt manzili' }),
      el('p', { class: 'hint', text: 'Google va ijtimoiy tarmoqlar uchun kerak. Netlify havolangizni yoki o\u2018z domeningizni yozing.' }),
      plainField('origin', settings, 'origin', 'settings'),
    ]),

    el('div', { class: 'card' }, [
      el('div', { class: 'group-title', text: 'Qaysi bo\u2018limlar ko\u2018rinsin' }),
      el('p', { class: 'hint', text: 'Belgini olsangiz, o\u2018sha bo\u2018lim saytdan ham, menyudan ham yo\u2018qoladi.' }),
      ...Object.entries(SECTION_NAMES).map(([key, title]) => toggle(settings.sections, key, title)),
    ]),

    el('div', { class: 'card' }, [
      el('div', { class: 'group-title', text: 'Qo\u2018shimcha' }),
      ...Object.entries(EXTRA_NAMES).map(([key, title]) => toggle(settings, key, title)),
    ]),

    el('div', { class: 'card' }, [
      el('div', { class: 'group-title', text: 'Panelga kirish' }),
      el('p', {
        class: 'hint',
        text: 'Parol ochiq saqlanmaydi. Unutib qo\u2018ysangiz — admin/auth.json faylini o\u2018chirasiz, keyin u qaytadan jasur / 1 bo\u2018lib tiklanadi.',
      }),
      el('div', { class: 'row two' }, [
        el('div', {}, [el('label', { text: 'Login' }), loginBox]),
        el('div', {}, [el('label', { text: 'Yangi parol' }), passBox]),
      ]),
      el('button', { class: 'primary', text: 'O\u2018zgartirish', onclick: (event) => saveAccount(event.currentTarget) }),
      accountMsg,
    ]),
  ]);
}

// ------------------------------------------------------------------ yig'ish
/**
 * «Yig'ish» bo'limi.
 *
 * Asosiy tugma — «Saytni internetga chiqarish»: u o'zgarishni GitHub'ga
 * yuboradi, Vercel esa buni ko'rib saytni o'zi qayta yig'adi. Ya'ni
 * kundalik ishda `dist` papkasini hech qayerga tashlash kerak emas.
 *
 * Ikkinchi tugma faqat kompyuterda yig'adi — natijani Netlify'ga qo'lda
 * tashlash yoki saytni internetga chiqarmasdan tekshirish uchun.
 */
function renderBuild() {
  // Internetdagi panelda yig'ish tugmasi kerak emas: saqlash = e'lon qilish.
  if (state.mode === 'cloud') {
    return el('div', { class: 'card' }, [
      el('div', { class: 'group-title', text: 'Sayt qanday yangilanadi' }),
      el('p', {
        class: 'hint',
        html:
          'Bu panel internetda ishlayapti, shuning uchun alohida yig‘ish kerak emas.<br>' +
          '<b>Saqlash</b> bosilganda o‘zgarish GitHub‘ga yoziladi, Vercel esa saytni ' +
          'bir-ikki daqiqada o‘zi qayta yig‘adi. Sahifani biroz kutib yangilang.',
      }),
      el('p', { class: 'hint', text: 'Kompyuterdagi panelda esa bu yerda yig‘ish va yuborish tugmalari turadi.' }),
    ]);
  }

  const log = el('div', { class: 'build-log', text: 'Hali hech narsa qilinmadi.' });
  const message = el('input', { type: 'text', placeholder: 'Nima o‘zgardi? (ixtiyoriy)' });

  const call = async (button, url, payload, working) => {
    const buttons = [...document.querySelectorAll('#view button')];
    buttons.forEach((item) => (item.disabled = true));
    log.style.color = 'var(--mute)';
    log.textContent = working;

    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload ?? {}),
    });

    if (response.status === 401) {
      showGate();
      return;
    }

    const result = await response.json().catch(() => ({ ok: false, output: 'Javob o‘qilmadi' }));
    log.textContent = result.output || '(chiqish bo‘sh)';
    log.style.color = result.ok ? 'var(--ok)' : 'var(--coral)';
    buttons.forEach((item) => (item.disabled = false));
  };

  return el('div', {}, [
    el('div', { class: 'card' }, [
      el('div', { class: 'group-title', text: 'Saytni internetga chiqarish' }),
      el('p', {
        class: 'hint',
        html:
          'Tartibi: <b>1)</b> o‘zgartirasiz · <b>2)</b> «Saqlash» · <b>3)</b> shu tugma.<br>' +
          'O‘zgarish GitHub‘ga yuboriladi, Vercel saytni bir-ikki daqiqada o‘zi yangilaydi.',
      }),
      el('div', { class: 'row' }, [el('label', { text: 'Izoh' }), message]),
      el('button', {
        class: 'primary',
        text: 'Saytni internetga chiqarish',
        onclick: (event) => call(event.currentTarget, '/api/publish', { message: message.value }, 'Yuborilmoqda…'),
      }),
    ]),

    el('div', { class: 'card' }, [
      el('div', { class: 'group-title', text: 'Faqat kompyuterda yig‘ish' }),
      el('p', {
        class: 'hint',
        text: 'Saytni internetga chiqarmasdan tekshirish yoki dist papkasini qo‘lda tashlash uchun.',
      }),
      el('button', {
        text: 'Yig‘ish',
        onclick: (event) => call(event.currentTarget, '/api/build', null, 'Yig‘ilmoqda…'),
      }),
    ]),

    log,
  ]);
}

// ------------------------------------------------------------------ umumiy
const TABS = [
  ['portfolio', 'Loyihalar', renderPortfolio],
  ['packages', 'Paketlar', renderPackages],
  ['reviews', 'Fikrlar', renderReviews],
  ['faq', 'Savollar', renderFaq],
  ['site', 'Matnlar', renderSite],
  ['settings', 'Sozlamalar', renderSettings],
  ['build', 'Yig‘ish', renderBuild],
];

function renderStatus() {
  const status = document.getElementById('status');
  const count = state.dirty.size;
  status.className = `status ${count ? 'dirty' : ''}`;
  status.textContent = count ? `${count} ta bo‘limda saqlanmagan o‘zgarish` : 'hammasi saqlangan';
  document.getElementById('save').disabled = count === 0;
}

function render() {
  const tabs = document.getElementById('tabs');
  tabs.replaceChildren(
    ...TABS.map(([id, title]) =>
      el('button', {
        text: title,
        role: 'tab',
        'aria-selected': String(state.tab === id),
        onclick: () => {
          state.tab = id;
          render();
        },
      }),
    ),
  );

  const view = document.getElementById('view');
  const current = TABS.find(([id]) => id === state.tab);

  // Internetdagi panelda qisqa parol haqiqiy xavf — buni yashirib bo'lmaydi
  const warning = state.weak
    ? el('div', {
        class: 'card',
        style: 'border-color:var(--coral);background:rgba(255,90,78,0.08)',
      }, [
        el('div', { class: 'group-title', style: 'color:var(--coral);margin-top:0', text: 'Parol juda qisqa' }),
        el('p', {
          class: 'hint',
          style: 'margin:0',
          text:
            'Bu panel internetda turibdi. Vercel sozlamalaridagi ADMIN_PASSWORD ni uzunroq qiling ' +
            '(kamida 10 belgi) — aks holda havolani topgan odam saytingizni o‘zgartira oladi.',
        }),
      ])
    : null;

  view.replaceChildren(...[warning, current[2]()].filter(Boolean));
  renderStatus();
}

async function save() {
  const status = document.getElementById('status');
  const files = [...state.dirty].map((file) => ({ file, data: state.files[file] }));
  if (files.length === 0) return;

  status.className = 'status';
  status.textContent = 'saqlanmoqda…';

  const response = await fetch('/api/save', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ files }),
  });

  if (response.status === 401) {
    showGate();
    return;
  }

  if (!response.ok) {
    const result = await response.json().catch(() => ({}));
    status.className = 'status dirty';
    status.textContent = result.error ?? 'Saqlanmadi';
    return;
  }

  state.dirty.clear();
  status.className = 'status ok';
  // Internetdagi panelda saqlash = e'lon qilish: Vercel saytni o'zi yangilaydi
  status.textContent = state.mode === 'cloud' ? 'saqlandi ✓ — sayt yangilanmoqda' : 'saqlandi ✓';
  document.getElementById('save').disabled = true;
}

// ------------------------------------------------------------------ kirish
const gate = document.getElementById('gate');
const loginError = document.getElementById('login-error');

function showGate() {
  gate.hidden = false;
  loginError.textContent = '';
  document.getElementById('password').value = '';
  document.getElementById('login').focus();
}

/** Ma'lumotni yuklab, panelni ko'rsatadi */
async function enter() {
  const response = await fetch('/api/state');
  if (!response.ok) return showGate();

  const data = await response.json();
  state.files = data.files;
  state.login = data.login;
  state.mode = data.mode ?? 'local';
  state.weak = Boolean(data.weak);
  state.dirty.clear();
  gate.hidden = true;
  render();
  return undefined;
}

document.getElementById('login-form').addEventListener('submit', async (event) => {
  event.preventDefault();
  loginError.textContent = '';

  const response = await fetch('/api/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      login: document.getElementById('login').value,
      password: document.getElementById('password').value,
    }),
  });

  if (!response.ok) {
    const result = await response.json().catch(() => ({}));
    loginError.textContent = result.error ?? 'Kirib bo\u2018lmadi';
    return;
  }
  await enter();
});

document.getElementById('logout').addEventListener('click', async () => {
  if (state.dirty.size && !confirm('Saqlanmagan o\u2018zgarish bor. Baribir chiqasizmi?')) return;
  await fetch('/api/logout', { method: 'POST' });
  state.dirty.clear();
  showGate();
});

// ------------------------------------------------------------------ boshlanishi
document.getElementById('save').addEventListener('click', save);
document.getElementById('build').addEventListener('click', () => {
  state.tab = 'build';
  render();
});
document.getElementById('lang').addEventListener('change', (event) => {
  state.lang = event.target.value;
  render();
});

// Ctrl+S — odatdagi saqlash
window.addEventListener('keydown', (event) => {
  if ((event.ctrlKey || event.metaKey) && event.key === 's') {
    event.preventDefault();
    if (state.dirty.size) save();
  }
});

// Saqlanmagan o'zgarish bo'lsa, ogohlantiramiz
window.addEventListener('beforeunload', (event) => {
  if (state.dirty.size) event.preventDefault();
});

window.voylaAdminReady = true;

// Allaqachon kirilganmi? Kirilgan bo'lsa panel darhol ochiladi.
fetch('/api/me')
  .then((response) => (response.ok ? enter() : showGate()))
  .catch(() => showGate());
