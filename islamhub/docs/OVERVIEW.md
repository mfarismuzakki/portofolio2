# IslamHub — Dokumen Teknis: Gambaran Umum

> **Versi SW:** `1.4.4-20260222-settings`  
> **Build path:** `portofolio2/islamhub/`  
> **Deploy path:** `portofolio2/islamhub/www/`  
> **Tanggal dokumen:** April 2026

---

## 1. Apa Itu IslamHub

IslamHub adalah **platform super-app Islam** berbasis web (PWA) yang bisa diinstal ke Android melalui Capacitor. Semua aplikasinya terintegrasi dalam satu halaman (`index.html`) dengan arsitektur Single Page Application (SPA).

**Status aplikasi saat ini:**

| App | Status | Keterangan |
|---|---|---|
| Waktu Adzan | LIVE | Real-time prayer times + Display Mode Masjid |
| Al-Qur'an | UJICOBA | Mushaf digital 604 halaman + audio per ayat / per surah |
| Dzikir & Doa | LIVE | Koleksi dzikir & doa harian dengan audio |
| Kalkulator Waris | LIVE | Hitung warisan sesuai syariat Islam |
| Tata Cara Sholat | LIVE | Panduan rukun, bacaan, dan sunnah sholat |
| Streaming Kajian | LIVE | Radio Islam + video kajian live 24/7 |
| Arah Kiblat | UJICOBA | Kompas kiblat berbasis GPS |
| Sirah Nabi | UJICOBA | Kisah nabi, rasul, dan sahabat |
| Tanya Jawab Islam | SEGERA | Belum diimplementasi |

---

## 2. Tech Stack

| Kategori | Teknologi |
|---|---|
| Frontend | Vanilla JavaScript ES6 (class-based, module import) |
| HTML | Single-file SPA (`index.html`) |
| CSS | Modular CSS (`style-modular.css` aggregates semua CSS) |
| Fonts | Google Fonts (Orbitron, Rajdhani, Amiri Quran, Scheherazade New, Noto Naskh Arabic) |
| Icons | Font Awesome 6.4.0 |
| PWA | Service Worker (`sw.js`), `manifest.json` |
| Mobile | Capacitor (Android native wrapper) |
| Audio caching | IndexedDB (via `audio-manager.js`) |
| State persistence | `localStorage` |
| Geolocation | Browser Geolocation API + Capacitor Geolocation plugin |
| Prayer times API | [aladhan.com](https://aladhan.com/prayer-times-api) |
| Geocoding | [nominatim.openstreetmap.org](https://nominatim.openstreetmap.org) |
| Timezone | [timezonedb.com](https://timezonedb.com) (fallback: kalkulasi dari longitude) |
| Quran audio | [cdn.islamic.network](https://cdn.islamic.network) (Mishary Rashid Alafasy, 128kbps) |
| Dzikir audio | `https://mfarismuzakki.id/islamhub` (server khusus) |

---

## 3. Struktur Direktori

```
islamhub/
├── index.html              # SPA utama (semua app containers ada di sini)
├── sw.js                   # Service Worker (PWA caching)
├── manifest.json           # PWA manifest
├── package.json            # Node deps (untuk Capacitor)
├── capacitor.config.json   # Konfigurasi Capacitor (Android)
├── sync-www.sh             # Script sync source → www/
├── build-scripts.sh        # Build helper
│
├── js/
│   ├── app.js              # IslamHubApp — Main controller / orchestrator
│   ├── mobile-helper.js    # MobileHelper — Capacitor native features
│   ├── apps/               # Per-module app controllers
│   │   ├── adzan/adzan-app.js
│   │   ├── alquran/alquran-app.js
│   │   ├── streaming/streaming-app.js
│   │   ├── dzikir/dzikir-app.js
│   │   ├── sholat/sholat-app.js
│   │   ├── kalkulator/waris-app.js
│   │   ├── qibla/qibla-app.js
│   │   └── sirah/sirah-app.js
│   ├── data/               # Data statis (JS global objects)
│   │   ├── alquran/        # quran-data.js, quran-verses.js, pages/
│   │   ├── dzikir/         # doa-collection.js
│   │   ├── sholat/         # sholat-data.js, bacaan-sholat.js, sunnah-sholat.js
│   │   ├── sirah/          # nabi-part1..5.js, sahabat-*.js, sirah-data.js
│   │   ├── hadith-collection.js
│   │   └── sunnah-prayers.js
│   └── utils/
│       └── audio-manager.js  # IndexedDB audio cache manager
│
├── css/
│   ├── style-modular.css   # Entry point — @import semua komponen CSS
│   ├── style.css           # (legacy, tidak dipakai)
│   └── components/
│       ├── variables.css   # CSS custom properties (--primary, --text-*, dll)
│       ├── base.css        # Global reset & typography
│       ├── adzan.css       # Adzan + Display Mode styles
│       ├── alquran.css     # Al-Quran + Muratal styles
│       ├── streaming.css   # Streaming radio/video styles
│       ├── dzikir.css      # Dzikir & Doa styles
│       ├── sholat.css      # Tata Cara Sholat styles
│       ├── waris.css       # Kalkulator Waris styles
│       ├── qibla.css       # Kompas Kiblat styles
│       ├── sirah.css       # Sirah styles
│       ├── home.css        # Home page styles
│       ├── navigation.css  # Bottom nav + dock styles
│       ├── floating-widget.css  # Floating prayer widget styles
│       ├── hadith-ticker.css    # Hadith ticker styles
│       ├── loading.css     # Loading overlay styles
│       ├── animations.css  # Shared keyframe animations
│       ├── footer.css      # Footer styles
│       ├── responsive.css  # Media queries
│       └── ...             # (dll)
│
├── assets/
│   ├── images/             # Foto masjid untuk Display Mode background
│   ├── icons/              # App icons PWA (webp, 48–512px)
│   ├── logo/               # Radio station logos, YouTube channel logos
│   └── audio/              # (kosong di source; dzikir audio di-serve dari server)
│
└── www/                    # Build output (deploy ke GitHub Pages / native)
    └── ...                 # Mirror dari source, di-update via sync-www.sh
```

---

## 4. Deployment & Source Control

- **Source directory:** `islamhub/` (edit di sini)
- **Build/deploy directory:** `islamhub/www/` (commit ke repo, di-serve di GitHub Pages)
- **Sync command:** `./sync-www.sh` — menyalin semua file ke `www/`
- **Update SW version** setiap push: ubah `CACHE_VERSION` di `sw.js`

**Cara sync manual (PowerShell):**
```powershell
cd "islamhub"; `
@("js/apps/adzan/adzan-app.js","js/apps/alquran/alquran-app.js","...") | 
  ForEach-Object { Copy-Item $_ "www/$_" }
```

---

## 5. Konvensi Kode

| Konvensi | Detail |
|---|---|
| App controller | ES6 `class`, diekspor via `export default`, diinstansiasi di `app.js` |
| Global access | Semua instance app disimpan sebagai `window.XxxApp` (mis. `window.streamingApp`) |
| State persistence | `localStorage` dengan prefix `islamhub_` atau per-modul (mis. `adzan_...`, `alquran_...`) |
| Dynamic import | App di-lazy load via `import()` saat pertama kali dibuka |
| Data global | Data statis dimuat via `<script>` tag global di `index.html`, bukan ES6 import (untuk kompatibilitas Capacitor) |
| CSS naming | BEM-like: `komponen-element` (mis. `.adm-prayer-grid`, `.alq-muratal-item`) |
| Audio elements | Dua `<audio>` persistent di `#bottom-dock`: `#quranAudioElement` + `#radioPlayer` |

---

## 6. Alur Inisialisasi Aplikasi

```
index.html loaded
      │
      ▼
window.islamHub = new IslamHubApp()
      │
      ├── initializeNativeFeatures()   ← Capacitor: StatusBar, SplashScreen, Network, Haptics
      ├── setupNavigation()            ← Bottom nav + More Apps dropdown
      ├── setupMobileMenu()
      ├── loadStateFromLocalStorage()
      ├── loadApp('adzan')             ← Adzan diload duluan untuk floating widget
      ├── initializeHadithTicker()     ← Ticker carousel di home page
      ├── hideLoading()
      ├── initializeHomeWidget()
      ├── restoreLastActiveApp()       ← Dari localStorage
      ├── setupFloatingWidgetToggle()
      ├── registerServiceWorker()      ← PWA
      ├── setupInstallButton()
      ├── setupShareButton()
      ├── setupCacheManagement()
      ├── setupClearDataButton()
      └── _initGlobalPlayer()          ← Global audio player interval
```

---

## 7. External APIs

| API | Endpoint | Digunakan oleh |
|---|---|---|
| Prayer Times | `https://api.aladhan.com/v1/timings/{timestamp}?latitude=...&longitude=...&method={N}` | AdzanApp |
| Geocoding (search) | `https://nominatim.openstreetmap.org/search?format=json&q=...` | AdzanApp |
| Geocoding (reverse) | `https://nominatim.openstreetmap.org/reverse?format=json&lat=...&lon=...` | AdzanApp |
| Timezone | `https://api.timezonedb.com/v2.1/get-time-zone?key=demo&...` | AdzanApp (fallback ke estimasi) |
| Quran audio surah | `https://cdn.islamic.network/quran/audio-surah/128/ar.alafasy/{N}.mp3` | AlQuranApp, AdzanApp (muratal) |
| Dzikir audio | `https://mfarismuzakki.id/islamhub/assets/audio/dzikir/...` | DzikirApp (via AudioManager) |
| Radio Rodja | `https://radioislamindonesia.com/rodja-low.mp3` | StreamingApp |
| Radio Tarbiyyah | `https://radioislamindonesia.com/tarbiyah.mp3` | StreamingApp |
| YouTube embed | `https://www.youtube.com/embed/{videoId}` | StreamingApp (video modal) |

---

## 8. LocalStorage Keys Index

Lihat [DATA_GUIDE.md](DATA_GUIDE.md) untuk daftar lengkap semua key localStorage yang digunakan.

---

## 9. Document Index

| File | Isi |
|---|---|
| [OVERVIEW.md](OVERVIEW.md) | Gambaran umum (file ini) |
| [ARCHITECTURE.md](ARCHITECTURE.md) | Arsitektur sistem, audio engine, navigation, global state |
| [modules/ADZAN.md](modules/ADZAN.md) | Modul Waktu Adzan + Display Mode Masjid (detail penuh) |
| [modules/ALQURAN.md](modules/ALQURAN.md) | Modul Al-Qur'an digital + Muratal |
| [modules/STREAMING.md](modules/STREAMING.md) | Modul Streaming Kajian (radio + video) |
| [modules/APPS.md](modules/APPS.md) | Modul lainnya: Dzikir, Waris, Qibla, Sholat, Sirah |
| [DATA_GUIDE.md](DATA_GUIDE.md) | Struktur data, localStorage keys, API payloads |
| [MAINTENANCE.md](MAINTENANCE.md) | Panduan development, deployment, menambah fitur, bug fixing |
