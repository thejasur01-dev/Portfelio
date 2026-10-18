# Voyla — studiya sayti

Bu sayt mijozlar uchun emas, **o'zimiz uchun**: ishlarimiz, paketlar, savol-javob va
buyurtma.

Loyiha papkasi: `C:\Loyihalar\Voyla` (mijoz loyihasi `C:\Loyihalar\Stomvizitka` —
ikkalasi alohida, bir-biriga tegmaydi).

---

## 1. Eng oson yo'l — ikki marta bosish

Papkada uchta fayl bor, buyruq yozish shart emas:

| Fayl | Nima qiladi |
| --- | --- |
| **ADMIN PANEL.bat** | Admin panelni ochadi (brauzer o'zi chiqadi) |
| **SAYTNI KORISH.bat** | Saytni kompyuterda ko'rsatadi |
| **SAYTNI YIGISH.bat** | `dist` papkasini tayyorlaydi va o'sha papkani ochib beradi |

Birinchi marta bosganda kutubxonalar o'rnatiladi — bir necha daqiqa ketadi,
keyingi safar darhol ishga tushadi.

> **Panelga kirish:** login `jasur`, parol `1`.
> Ikkalasini ham «Sozlamalar» bo'limidan almashtirasiz. Parol ochiq
> saqlanmaydi — `admin/auth.json` da scrypt bilan yopilgan va bu fayl saytga
> hech qachon chiqmaydi. Parolni unutsangiz o'sha faylni o'chirasiz, u
> qaytadan `jasur` / `1` bo'lib tiklanadi.

### Terminaldan ishlatish

```bash
npm install          # birinchi marta
npm run dev          # saytni ko'rish
npm run admin        # ADMIN PANEL (http://localhost:4455)
npm run build        # dist/ papkasini tayyorlaydi
npm run lint         # kod tekshiruvi
npm run fonts        # shriftlarni Google'dan qayta ko'chirib oladi
npm run portfolio    # zaxira papkalardan portfolioni qayta yig'adi
npm run brand:assets # belgichalar va og-cover.jpg
```

### Saytga o'zgartirish kiritish tartibi

1. **ADMIN PANEL.bat** — brauzer o'zi ochiladi
2. kerakli joyni o'zgartirasiz → **Saqlash**
3. **Yig'ish** bo'limi → «Saytni yig'ish»
4. `dist` papkasini Netlify oynasiga tashlaysiz

Admin panel to'g'ridan-to'g'ri `src/data/*.json` fayllarini yozadi, har saqlashdan
oldin eski nusxa `.admin-backups/` ga olinadi (oxirgi 20 tasi saqlanadi).

> Admin panel faqat shu kompyuterdan ochiladi (`127.0.0.1`). Internetdan hech kim
> kira olmaydi — shuning uchun parol ham yo'q. Panelni mijozga bermaydi.

---

## 2. Admin paneldagi bo'limlar

| Bo'lim | Nima qilinadi |
| --- | --- |
| **Loyihalar** | 46 ta ishning havolasi, ismi, shahri. Qidiruv va «faqat havolasizlari» filtri bor. «Asosiy» belgilangani portfolioda birinchi turadi, «ko'rsatilmasin» — umuman chiqmaydi |
| **Paketlar** | Start / Pro / Studio: narx, muddat, ichidagi ro'yxat |
| **Savollar** | Savol qo'shish, o'chirish, tartibini almashtirish |
| **Matnlar** | Saytdagi barcha yozuvlar, aloqa ma'lumotlari, raqamlar, yuguruvchi lenta |
| **Sozlamalar** | Domen · qaysi bo'limlar ko'rinishi · lenta/parda/pastdagi tugma · panel logini va paroli |
| **Yig'ish** | `dist` papkasini tayyorlaydi va natijani ko'rsatadi |

«Sozlamalar»dagi belgini olsangiz, o'sha bo'lim saytdan ham, menyudan ham
butunlay yo'qoladi — kod o'zgartirish kerak emas.

Yuqoridagi **TIL** ro'yxati qaysi tilni tahrirlashni tanlaydi. «Hammasi» desangiz
uchala til yonma-yon chiqadi — tarjimani solishtirish uchun qulay.

### Qiya yozuv: `*yulduzcha*`

Sarlavhadagi bitta so'zni yulduzcha ichiga olsangiz, u saytda **qiya serif**
shriftda chiqadi:

```
Mijoz Instagram'da *narx* so'raydi.
```

Bu saytning imzosi — har bir sarlavhada bitta so'z shakl o'zgartiradi. HTML
yozish kerak emas, oddiy matn maydonida ishlaydi.

---

## 3. Hozir to'ldirilmagan joylar

Bular **ataylab bo'sh** qoldirilgan — o'ylab topilgan ma'lumot yozilmadi.
Admin panelda to'ldiriladi:

- [ ] **Loyiha havolalari** — 46 tadan 1 tasida bor (`diyoracosmo.com`). Qolganini
      Netlify'dagi manzillaridan ko'chirib qo'yasiz. Havolasi yo'q karta saytda
      bosilmaydi, «Havola tez orada» deb turadi
- [ ] **Telegram** va **telefon** — `Matnlar → Aloqa`. Bo'sh turganda Telegram
      tugmasi saytda **umuman ko'rinmaydi** (ishlamaydigan tugma qo'ymaymiz)
- [ ] **Paket narxlari** — `Paketlar → Narx`. Bo'sh turganda «narxni kelishamiz»
      yoziladi
- [ ] **Domen** — hozir `voyla.uz`. `Sozlamalar → Sayt manzili` dan
      o'zgartirasiz; yig'ish paytida `index.html` dagi barcha meta teglar
      (canonical, og:url, og:image) o'zi yangilanadi

---

## 4. Dizayn qanday qurilgan

Rang falsafasi: **iliq monoxrom + bitta urg'u.** Fon hech qachon rangli emas —
iliq ko'mir qora yoki suyak oq. Rang faqat bitta joyda: marjon (logotipdagi
nuqta rangi). Rangli dog'lar, kamalak gradientlar va har xil rangdagi kartalar
ataylab olib tashlandi — ular ko'zga tashlanadi, lekin ishonch bermaydi. Sahifa
ustida juda yengil «plyonka donasi» turadi, shundan rang tekis bo'yalgandek
emas, bosma ishdek ko'rinadi.

Takrorlanmaslik **rangdan emas, tuzilmadan** keladi:

```
Birinchi ekran   qorong'i, fon tekis — rang mijoz saytlari devoridan keladi
  ╱ marjon lenta — qiya, yuguruvchi yozuv ╱
Nega sayt kerak  qorong'i, qatorlar navbat bilan o'ngga suriladi
ISHLAR           SUYAK OQ — eng kuchli joy, ekran suratlari shu yerda yarqiraydi
Nima kiradi      qorong'i, oltitadan BITTASI suyak oq — to'rni shu jonlantiradi
  ╱ suyak lenta ╱
Jarayon          qorong'i, ulkan konturli raqamlar + qiya stiker
Narxlar          SUYAK OQ, o'rtadagi paket qora va kattaroq
Savollar         qorong'i
Bog'lanish       bir varaq tekis marjon — saytdagi yagona to'q rangli yuza
```

**Shriftlar:** Unbounded (geometrik) + Playfair Display qiya (serif) + Manrope
(matn). Har sarlavhada bitta so'z serifga o'tadi — saytning imzosi. Uchalasi
ham loyiha ichida yotadi, Google'dan yuklanmaydi.

## 5. Tuzilishi

```
src/
  data/           ← admin panel shu fayllarni yozadi
    site.json         barcha yozuvlar (uz/ru/en)
    packages.json     Start / Pro / Studio
    faq.json          savol-javob
    portfolio.json    46 ta ish + havolalar
    settings.json     domen, qaysi bo'lim ko'rinishi, qo'shimchalar
  components/     ← ko'rinish
  i18n/           ← til almashtirish (uz / ru / en)
  index.css       ← dizayn tizimi (ranglar, tugmalar, animatsiyalar)
  fonts.css       ← `npm run fonts` yozadi, qo'lda tegilmaydi
admin/            ← admin panel (oddiy HTML + JS, yig'ish kerak emas)
  auth.json       ← login va yopilgan parol. `src/` dan tashqarida: saytga chiqmaydi
scripts/
  make-portfolio.mjs    zaxira papkalardan portfolioni yig'adi
  make-brand-assets.mjs belgichalar va og-cover.jpg
  make-seo.mjs          index.html ichidagi JSON-LD (build o'zi chaqiradi)
  fetch-fonts.mjs       shriftlarni public/fonts/ ga ko'chiradi
public/
  work/           ← 45 ta mijoz saytining ekran surati (420px webp)
  fonts/          ← shriftlar
```

### Portfolio qayerdan keldi

`npm run portfolio` — `C:\Loyihalar\Stomvizitka-backup-*` papkalarining har
biridan mijoz ismini, kasbini, shahrini va sayt qanday bo'limlardan iborat
bo'lganini o'qiydi.

**Skript qayta ishga tushganda admin panelda kiritilgan `url`, `featured` va
`hidden` qiymatlari saqlanib qoladi** — ya'ni havolalaringiz yo'qolmaydi.

Yangi mijoz sayti tayyor bo'lgach: zaxira papkasini yarating, ekran suratini
oling, skriptni qayta ishga tushiring va admin paneldan havolasini qo'ying.

---

## 6. Texnik eslatmalar

Bular oldingi loyihalarda **xato chiqargan** joylar — tegmaslik kerak:

- **`@layer base` ichidagi `img { max-width: 100% }`** — qatlamdan tashqariga
  chiqarilsa Tailwind'ning barcha `max-w-*` klasslari ishlamay qoladi
- **`.hero-shell` dagi `@supports not (height: 1svh)`** — `svh` iOS 15.4 dan bor.
  Oddiy takroriy e'lon (`88vh` keyin `88svh`) minifikator tomonidan o'chiriladi,
  shuning uchun fallback `@supports` ichida yozilgan
- **Shapkada menyu ochiqligida `backdrop-filter` yo'q** — aks holda u fixed
  menyuni shapka balandligiga qisib qo'yadi
- **`html { overflow-anchor: none }`** — bo'lim balandligi o'zgarganda Chrome
  sahifani sakratmasligi uchun
- **Rasmlarga `width`/`height`** berilgan, `aspect-ratio` ishlatilmagan (eski Safari)
- **Lentada `overflow-x-clip`**, `overflow-hidden` emas — aks holda qiya lentaning
  uchlari tekis qirqilgandek ko'rinadi
- **Aylanma yorliqda `xlinkHref`**, `href` emas — eski Safari `textPath` ning
  SVG2 ko'rinishidagi `href` atributini tanimaydi va matn yo'qoladi
- **Yig'ish nishoni** `safari14`/`ios14` — `vite.config.js` da
- **Shriftlar o'zimizda** (`public/fonts/`): Google Fonts ochilmagan yoki sekin
  internetda sayt tizim shriftiga tushib, butunlay boshqacha ko'rinib qolardi.
  Uchalasi ham **kirillchani qo'llaydi** — rus tilidagi yarmi boshqa shriftga
  tushib qolmasligi uchun

### Tekshirish

Har o'zgarishdan keyin iPhone SE (320px), iPhone 12, Pixel 7 va kompyuterda
tekshirildi: konsol xatosi yo'q, yon tomonga siljish yo'q, 189 ta rasm yuklanadi,
savollar ochiladi, portfolio filtri ishlaydi (belgi bo'yicha 4 ta, Samarqand
bo'yicha 1 ta), uchala tilda sarlavha va matn almashadi, kirillcha shriftlar
yuklanadi.

---

## 7. Netlify

`netlify.toml`, `public/_headers` va `public/_redirects` tayyor.
`dist` papkasini qo'lda tashlasangiz ham, Git orqali ulasangiz ham ishlaydi.
Bitta sahifali sayt bo'lgani uchun `/*  /index.html  200` qoidasi 404 chiqmasligini
ta'minlaydi.
