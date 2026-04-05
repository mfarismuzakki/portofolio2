# IslamHub — Panduan Maintenance & Pengembangan

---

## 1. Setup Development

### 1.1 Struktur Direktori Dev vs Build

```
portofolio2/islamhub/         ← Direktori SOURCE (edit di sini)
    index.html
    js/
    css/
    assets/
    sw.js
    manifest.json

portofolio2/islamhub/www/     ← Direktori BUILD (deploy ke Capacitor)
    (identik dengan source, disalin manual)
```

### 1.2 Sync Source ke Build

**Linux/Mac:**
```bash
cd portofolio2/islamhub
chmod +x sync-www.sh
./sync-www.sh
```

**Windows PowerShell:**
```powershell
$src = "portofolio2\islamhub"
$dst = "portofolio2\islamhub\www"
Copy-Item -Path "$src\*" -Destination "$dst" -Recurse -Force -Exclude "www"
```

**PENTING:** Setiap perubahan pada source harus di-sync ke `www/` sebelum build Capacitor.

### 1.3 Build Android (Capacitor)

```bash
cd portofolio2/islamhub/www
npx cap sync android
npx cap open android
# Lalu build dari Android Studio
```

---

## 2. Menambahkan App Baru

### Langkah-langkah:

**1. Buat file app controller:**
```
js/apps/{nama}/  {nama}-app.js
```

Template minimal:
```javascript
export default class NamaApp {
    constructor(globalState, mainApp) {
        this.state = globalState;
        this.mainApp = mainApp;
        this.container = document.getElementById('{nama}-app');
    }
    
    async init() {
        this.container.innerHTML = this._render();
        this._attachEvents();
    }
    
    _render() {
        return `<div class="{nama}-wrapper">...</div>`;
    }
    
    _attachEvents() { ... }
    
    destroy() {
        // Bersihkan timer, event listeners
    }
}
```

**2. Tambah container di `index.html`:**
```html
<div id="{nama}-app" class="app-component" data-app="{nama}"></div>
```

**3. Daftarkan di `IslamHubApp.appFiles` (`js/app.js`):**
```javascript
const appFiles = {
    ...
    '{nama}': '{nama}-app.js',  // Tambah entry ini
};
```

**4. Tambah entry navigasi:**
- Jika merupakan app utama (di bottom nav): tambah `<button>` di `#bottomNavigation`
- Jika di "Lainnya": tambah card di `#moreAppsDropdown`

**5. Tambah CSS:**
```
css/components/{nama}.css
```
Lalu import di `css/style-modular.css`:
```css
@import 'components/{nama}.css';
```

**6. Expose global instance:**
Di `loadApp()`:
```javascript
window[`${appName}App`] = app;   // Otomatis dari pattern existing
```

---

## 3. Menambahkan Stasiun Radio

Di `js/apps/streaming/streaming-app.js`, constructor:

```javascript
this.radioStations = [
    // ... existing ...
    {
        name: 'Nama Stasiun',
        description: 'Deskripsi singkat',
        url: 'https://streaming.url/stream.mp3',
        icon: 'fa-broadcast-tower',
    }
];
```

**Requirements:**
- URL harus HTTPS
- Format MP3 atau AAC stream
- Server harus support CORS (`Access-Control-Allow-Origin: *`)
- Test manual: buka URL di browser, cek apakah bisa play

---

## 4. Menambahkan Reciter Al-Qur'an

**1. Temukan identifier reciter:**
```
GET https://api.alquran.cloud/v1/edition/format/audio
```

**2. Ubah CDN URL di kedua tempat:**

Di `js/apps/alquran/alquran-app.js`:
```javascript
// Verse audio
const url = `https://cdn.islamic.network/quran/audio/128/{NEW_RECITER_ID}/${surahNum}_${ayahNum}.mp3`;

// Surah audio (muratal page)
const url = `https://cdn.islamic.network/quran/audio-surah/128/{NEW_RECITER_ID}/${surahNum}.mp3`;
```

Di `js/apps/adzan/adzan-app.js` (_dmPlayMuratal):
```javascript
radioPlayer.src = `https://cdn.islamic.network/quran/audio-surah/128/{NEW_RECITER_ID}/${surahNum}.mp3`;
```

**Jika ingin multi-reciter:** Tambahkan selector reciter di settings, simpan pilihan ke `alquran_settings.reciter`, dan gunakan variable saat membangun URL.

---

## 5. Mengupdate Service Worker

Jika ada perubahan yang perlu di-bust dari cache lama:

1. Di `sw.js`, ubah `CACHE_VERSION`:
   ```javascript
   const CACHE_VERSION = '1.4.5-YYYYMMDD-description';
   ```

2. Semua cache lama akan dihapus otomatis saat SW baru aktif.

**Kapan harus update CACHE_VERSION:**
- Mengubah struktur HTML yang perlu menggantikan cache lama
- Mengubah lokasi atau nama file CSS/JS
- Bug di JS/CSS yang sudah ter-cache di user

---

## 6. Menambah Konten (Data)

### Menambah Hadith (ticker)
File: `js/data/hadith-collection.js`  
Tambah entry ke array `hadithCollection`:
```javascript
{
    id: "h{N}",
    arabic: "...",
    translation: "...",
    narrator: "...",
    reference: "HR. ...",
    category: "ibadah"  // bebas
}
```

### Menambah Doa/Dzikir
File: `js/data/dzikir/doa-collection.js`  
Tambah item ke array `doas` di kategori yang sesuai, atau buat kategori baru.

### Menambah Data Sirah
File: salah satu dari 11 file di `js/data/sirah/`  
Tambah entry ke array yang di-export.

---

## 7. Debugging Audio

### 7.1 Radio tidak menyala setelah klik

```javascript
// Di browser console:
window.streamingApp.currentStream               // null = tidak ada stream aktif
document.getElementById('radioPlayer').src       // Cek URL loaded
document.getElementById('radioPlayer').error     // Cek error object
```

### 7.2 Audio Display Mode conflict

Penyebab: `radioPlayer.dataset.mode` tidak bersih setelah stop.  
Cek:
```javascript
document.getElementById('radioPlayer').dataset.mode  // Harus undefined saat stop
```

Jika masih `"muratal"` padahal tidak ada audio:
```javascript
delete document.getElementById('radioPlayer').dataset.mode;
```

### 7.3 Global player bar tidak muncul

`_globalPlayerUpdate()` jalan setiap 1 detik tapi bisa salah mode. Cek:
```javascript
// Kondisi radio mode:
window.streamingApp?.currentStream !== null   // Harus true
document.getElementById('quranAudioElement').paused  // Harus true (quran tidak aktif)
document.getElementById('quranAudioPlayer').dataset.mode  // Harus 'radio'
```

### 7.4 Audio bar di Display Mode tidak update

`_startAudioBar()` interval mungkin belum jalan atau sudah dihapus. Cek:
```javascript
window.adzanApp._audioBarInterval  // Harus ada interval ID
```

---

## 8. Debugging Umum

### 8.1 App tidak mau load

```javascript
// Cek apakah app sudah loaded:
window.islamHub.loadedApps.has('adzan')   // true/false

// Paksa reload:
window.islamHub.loadedApps.delete('adzan');
window.islamHub.loadApp('adzan');
```

### 8.2 Prayer times tidak update

```javascript
// Clear cache dulu:
localStorage.removeItem('islamhub_prayer_times');
// Lalu:
window.adzanApp.fetchPrayerTimes();
```

### 8.3 Service Worker stuck di versi lama

Di Chrome DevTools → Application → Service Workers:
- Klik "Update" atau "Skip Waiting"
- Atau klik "Unregister" lalu reload

Programatik:
```javascript
navigator.serviceWorker.getRegistrations().then(regs => {
    regs.forEach(r => r.unregister());
});
```

---

## 9. CSS Naming Conventions

| Prefix | Contoh | Digunakan untuk |
|---|---|---|
| `.adm-` | `.adm-clock`, `.adm-panel` | Adzan Display Mode |
| `.alq-` | `.alq-reader`, `.alq-muratal` | Al-Quran app |
| `.str-` | `.str-radio`, `.str-video` | Streaming app |
| `.qibla-` | `.qibla-compass`, `.qibla-needle` | Qibla app |
| `.waris-` | `.waris-wizard`, `.waris-result` | Waris app |
| `.sirah-` | `.sirah-card`, `.sirah-modal` | Sirah app |
| `.dzikir-` | `.dzikir-card`, `.dzikir-modal` | Dzikir app |
| `.sholat-` | `.sholat-tab`, `.sholat-item` | Sholat app |
| `.islamhub-` | `.islamhub-toast`, `.islamhub-modal` | Shared/global |

**Rules:**
- Semua class spesifik per-app harus ada prefix app-nya
- State classes: `.active`, `.loading`, `.error`, `.hidden` (tanpa prefix)
- JS-only utility: `.js-no-scroll`, `.js-overlay-active`

---

## 10. Code Conventions

### ES6 Class Pattern (Semua App)
```javascript
// Ekspor sebagai default export
export default class NamaApp {
    constructor(globalState, mainApp) { ... }
    
    // Public methods (tidak diawali _)
    init() { ... }
    render() { ... }
    destroy() { ... }
    
    // Private methods (diawali _)
    _buildDOM() { ... }
    _attachEvents() { ... }
    _handleClick(e) { ... }
}
```

### Global Instance Naming
```javascript
window.islamHub       // IslamHubApp (main)
window.adzanApp       // AdzanApp
window.alquranApp     // AlQuranApp
window.streamingApp   // StreamingApp
window.dzikirApp      // DzikirApp
window.warisApp       // WarisApp
window.qiblaApp       // QiblaApp
window.sholatApp      // SholatApp
window.sirahApp       // SirahApp
```

### localStorage Keys Prefix
```
islamhub_           → Core app state
islamhub_adzan_     → Adzan module
islamhub_downloaded_→ Cache tracking
alquran_            → AlQuran module
adm-                → Adzan Display Mode (tanpa islamhub_ prefix, legacy)
warisFavorites      → Waris (camelCase, legacy)
sirahFavorites      → Sirah
dzikirFavorites     → Dzikir
```

---

## 11. Kapasitas & Performa

### Data Size Estimates

| Resource | Ukuran Approx |
|---|---|
| `index.html` | ~60 KB |
| Semua JS (non-data) | ~200 KB total |
| `quran-data.js` (QURAN_VERSES) | ~5 MB (besar!) |
| Pages JSON (604 file) | ~10 MB total |
| Gambar background (7 file) | ~5 MB total |
| Audio surah per-file (CDN) | ~5-15 MB per surah |

### Optimasi Yang Sudah Ada
- Lazy loading semua app JS (hanya load saat dibuka)
- Lazy loading data sirah/sholat/bacaan (hanya saat tab dibuka)
- Page-based loading Al-Qur'an (fetch 1 halaman, bukan semua 604)
- Audio caching IndexedDB (offline mode)
- Service Worker caching untuk assets statis

### Yang Perlu Diperhatikan
- `QURAN_VERSES` dimuat saat page load (5MB global variable) — pertimbangkan lazy load jika performa jadi isu
- Display Mode polling setiap 1 detik — pastikan `destroy()` dipanggil untuk clear interval saat DM ditutup

---

## 12. Urutan Baca Dokumentasi

Untuk pemahaman optimal, baca dalam urutan:

1. [OVERVIEW.md](OVERVIEW.md) — Gambaran besar proyek
2. [ARCHITECTURE.md](ARCHITECTURE.md) — Arsitektur SPA, audio engine, CSS
3. [DATA_GUIDE.md](DATA_GUIDE.md) — Data flow, localStorage, APIs
4. [modules/ADZAN.md](modules/ADZAN.md) — Modul paling kompleks
5. [modules/ALQURAN.md](modules/ALQURAN.md) — Modul Al-Qur'an
6. [modules/STREAMING.md](modules/STREAMING.md) — Radio & video streaming
7. [modules/APPS.md](modules/APPS.md) — Modul-modul lainnya
8. [MAINTENANCE.md](MAINTENANCE.md) — Dokumen ini: workflow & troubleshooting
