# IslamHub: Indonesian + English (brief for the implementer)

You are adding a second language (English) to IslamHub, a static PWA in `islamhub/`
(plain HTML, CSS and ES modules; no build step, no framework). Indonesian stays the
default. Work in small, reviewable steps and never change app behaviour while translating.

## 1. Requirements

- Default language **Indonesian (`id`)**. English (`en`) is opt-in.
- A switch in **Pengaturan Tampilan** (settings sheet, `renderSettingsList()` in `js/app.js`):
  "Bahasa / Language" with two options. Store the choice in `localStorage['islamhub_lang']`.
- On change: set `<html lang>`, re-render static text and the current app without a reload
  (call the existing render path for the active app, e.g. `islamHub.switchApp(current)`).
- Arabic is never translated. Qur'an Arabic, du'a Arabic, Asmaul Husna Arabic,
  transliteration (latin) stay exactly as they are.
- Works offline: dictionaries are plain ES modules, picked up by the precache
  (run `python islamhub/tools/build_precache.py` after adding files).

## 2. Architecture to build first (one commit)

```
islamhub/js/i18n/index.js   t(key, vars), getLang(), setLang(lang), onLangChange(fn), applyStaticI18n(root)
islamhub/js/i18n/id.js      export default { 'home.greeting': 'Assalamu’alaikum', ... }
islamhub/js/i18n/en.js      export default { 'home.greeting': 'Assalamu’alaikum', ... }
```

- Keys are flat and namespaced by app: `common.*`, `nav.*`, `home.*`, `adzan.*`, `alquran.*`,
  `dzikir.*`, `hadits.*`, `sirah.*`, `sholat.*`, `haji.*`, `streaming.*`, `qibla.*`, `kalender.*`,
  `zakat.*`, `waris.*`, `asmaul.*`, `fiqh.*`, `tanyajawab.*`, `settings.*`, `footer.*`.
- `t('waris.result.heirsCount', { n: 4 })` with `{n}` placeholders. Missing key in `en` falls
  back to `id`; missing in both returns the key (so gaps are visible, never blank).
- Static HTML in `index.html`: mark text with `data-i18n="key"` (and `data-i18n-attr="placeholder:key;aria-label:key"`
  for attributes). `applyStaticI18n(document)` fills them on load and on change.
- Dates and numbers: replace hard-coded `'id-ID'` (22 places) with a helper
  `locale()` returning `'id-ID'` or `'en-GB'`. Rupiah stays `Rp` in both languages.
- Hijri month names, prayer names and other Islamic terms follow the glossary below, not a
  literal translation.

## 3. Glossary (use these English forms everywhere)

| Indonesian | English |
|---|---|
| Sholat | Prayer (salah) |
| Subuh, Syuruq, Dzuhur, Ashar, Maghrib, Isya | Fajr, Sunrise, Dhuhr, Asr, Maghrib, Isha |
| Adzan | Adhan |
| Dzikir, Doa | Dhikr, Du'a |
| Hadits | Hadith |
| Sirah, Sahabat, Sahabiyah | Seerah, Companions, Female Companions |
| Kiblat | Qibla |
| Kajian | Islamic lectures |
| Waris / Kalkulator Waris | Inheritance / Inheritance Calculator (Fara'id) |
| Ahli waris, ashabul furudh, asabah, dzawil arham, hajb, 'awl, radd | heirs, fixed-share heirs (ashab al-furud), residuary heirs ('asabah), distant kindred (dhawu al-arham), exclusion (hajb), 'awl, radd |
| Tirkah | Estate (tarikah) |
| Manasik | Hajj & Umrah rites |
| Juz, Halaman, Ayat, Surat | Juz, Page, Verse (ayah), Surah |
| Mushaf Standar Indonesia | Indonesian Standard Mushaf |
| Tafsir | Tafsir |
| 'Alaihissalam, radhiyallahu 'anhu, ﷺ | keep as written (do not translate honorifics) |
| Ustadz, Syaikh | keep as written |

## 4. Scope in phases

### Phase 1: interface text (do this first, fully)
Everything the app itself says: titles, buttons, labels, tabs, placeholders, empty states,
toasts (`_notify`, `showToast`: 78 calls), `alert`/`confirm` (11), `aria-label`/`title` (~130),
settings, footer, the Lainnya sheet (`DROPDOWN_APP_CONFIG` in `js/app.js`).

Files, largest first (each line is one session/commit):

| File | Notes |
|---|---|
| `index.html` | static shell, home, sholat and waris markup |
| `js/app.js` | nav, settings sheet, dropdown config, update prompt |
| `js/home.js` | home cards |
| `js/apps/alquran/alquran-app.js` (+ `offline-manager.js`) | reader, settings, modals |
| `js/apps/adzan/adzan-app.js` | prayer times, mosque display mode |
| `js/apps/dzikir/dzikir-app.js` | |
| `js/apps/sirah/sirah-app.js` | |
| `js/apps/tanyajawab/tanyajawab-app.js` | the AI answers stay in the language the user asks in |
| `js/apps/kalkulator/waris-app.js` + `waris-engine.js` | engine `condition`/`reason`/`notes` strings must become keys with `{vars}`; do not change any fraction logic; run `node islamhub/tools/test_waris_engine.mjs` (must print `all 29 passed`) |
| `js/apps/streaming/streaming-app.js` | channel names stay as is |
| `js/apps/haji/*.js`, `js/apps/sholat/*.js` (incl. arena games), `js/utils/arena.js`, `js/utils/game-kit.js` | |
| `js/apps/zakat`, `qibla`, `kalender`, `hadits`, `asmaul`, `fiqh` | |

### Phase 2: content written for the app (draft, then human review)
Text that is the app's own explanation, not a primary source: Fiqh answers (`js/data/fiqh`),
Sirah biographies (`js/data/sirah`), du'a titles/benefits (`js/data/dzikir`), Asmaul Husna
meanings and explanations (`js/data/asmaul`), sholat guides (`js/data/sholat`), haji data,
Tanya Jawab seeds, prayer-step tips in `peraga-3d.js`.

- Do **not** replace the Indonesian fields. Add English siblings with an `_en` suffix
  (`title_en`, `answer_en`, `biography_en`, `meaning_en`, `benefit_en`, `tip_en`...).
- Add one helper `pick(obj, field)` that returns `obj[field + '_en']` when the language is
  English and that field exists, otherwise `obj[field]`. Use it where the data is rendered.
- Religious rulings must keep their meaning exactly. Keep every reference (QS, HR, book and
  scholar names) unchanged. Mark the batch "needs review" in the commit message: a qualified
  person (the app's sharia reviewer) checks it before release.

### Phase 3: primary sources (do NOT machine-translate)
- **Qur'an translation and tafsir** (`js/data/alquran/pages/*.json`, Kemenag Indonesian):
  English must come from an established translation, e.g. Saheeh International. Check the
  licence before bundling (Tanzil's translation files allow non-commercial use with
  attribution and no modification; quran.com's API has its own terms). Store as separate
  files (`js/data/alquran/en/PageNNN.json`) so the Indonesian files are untouched.
- **Hadith text** (`js/data/hadits`, `hadith-collection.js`): use an existing English
  rendering (e.g. sunnah.com, check its terms) or keep the Indonesian text with a note
  "translation available in Indonesian only". Never invent wording for a hadith.
- If no licensed source is set up yet, show the Indonesian translation with a small label
  "Indonesian translation (Kemenag)" in English mode.

## 5. Rules while editing

- Code, identifiers and comments in English. Do not reformat files or rename things.
- Do not touch: `sw.js` logic, `precache-manifest.js` (generated), `css/components/sakinah-theme.css`
  and `sakinah-arabic.css` (generated), anything inside `vendor/`, Arabic strings, audio URLs.
- Keep Indonesian text byte-identical in `id.js` (copy it from the source, do not "improve" it).
- After each step: `node --check <changed files>`, `python islamhub/tools/build_precache.py`,
  then open every touched app in both languages at 360 px width. English is usually ~15-30%
  longer: check buttons, chips and headers still fit (no clipped or wrapped labels).
- Nothing in English mode may show a raw key, `undefined`, or a mixed half-Indonesian screen
  inside Phase 1 scope.

## 6. Done when

- Switching language in settings changes every Phase 1 string immediately, survives reload,
  and works offline.
- `node islamhub/tools/test_waris_engine.mjs` prints `all 29 passed`.
- Indonesian mode looks exactly as before (compare screenshots of all 16 apps).
