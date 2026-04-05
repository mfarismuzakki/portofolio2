# IslamHub — Arsitektur Sistem

---

## 1. Single Page Application (SPA) Pattern

IslamHub beroperasi sebagai **SPA** di dalam satu file `index.html`. Setiap "aplikasi" adalah sebuah `<div class="app-component" data-app="{nama}">` yang ditampilkan/disembunyikan via penambahan class `.active`.

**HTML container structure:**
```html
<div class="superapps-container">
  <main class="app-content" id="appContent">
    <div id="home-app"     class="app-component active" data-app="home">...</div>
    <div id="adzan-app"    class="app-component"        data-app="adzan">...</div>
    <div id="alquran-app"  class="app-component"        data-app="alquran">...</div>
    <div id="dzikir-app"   class="app-component"        data-app="dzikir">...</div>
    <div id="waris-app"    class="app-component"        data-app="waris">...</div>  <!-- HTML statis -->
    <div id="qibla-app"    class="app-component"        data-app="qibla">...</div>
    <div id="sholat-app"   class="app-component"        data-app="sholat">...</div><!-- sebagian statis -->
    <div id="sirah-app"    class="app-component"        data-app="sirah">...</div>
    <div id="streaming-app" class="app-component"       data-app="streaming">...</div>
  </main>
  
  <div id="bottom-dock">                    <!-- FIXED, selalu visible -->
    <div id="quranAudioPlayer">...</div>    <!-- Global audio player bar -->
    <nav class="bottom-navigation">...</nav>
  </div>
</div>
```

---

## 2. Modul Controller — Hirarki Class

```
IslamHubApp (app.js)           ← Main orchestrator, window.islamHub
    │
    ├── AdzanApp               ← window.adzanApp
    ├── AlQuranApp             ← window.alquranApp
    ├── StreamingApp           ← window.streamingApp (no globalState dep)
    ├── DzikirApp              ← window.dzikirApp
    ├── WarisApp               ← window.warisApp
    ├── QiblaApp               ← window.qiblaApp
    ├── SholatApp              ← window.sholatApp
    └── SirahApp               ← window.sirahApp
```

Setiap controller menerima `(globalState, mainApp)` kecuali `StreamingApp` yang tidak menerima argumen.

---

## 3. Lazy Loading App Pattern

App hanya dimuat **pertama kali** saat dibuka (lazy). `adzan` dimuat di startup karena dibutuhkan floating widget.

```javascript
// Di IslamHubApp.loadApp(appName)
async loadApp(appName) {
    const appFiles = {
        'adzan':     'adzan-app.js',
        'alquran':   'alquran-app.js',
        'streaming': 'streaming-app.js',
        'dzikir':    'dzikir-app.js',
        'waris':     'waris-app.js',
        'qibla':     'qibla-app.js',
        'sholat':    'sholat-app.js',
        'sirah':     'sirah-app.js',
    };
    
    // Dynamic import dari folder apps/{appName}/
    const module = await import(`./apps/${appName}/${appFiles[appName]}`);
    const AppClass = module.default;
    const app = new AppClass(this.state, this);
    window[`${appName}App`] = app;  // Expose globally
    await app.init();
    
    this.loadedApps.add(appName);
}
```

Setelah dimuat, `loadedApps.has(appName)` = `true` sehingga tidak diload ulang ketika user kembali ke app tersebut.

---

## 4. Navigasi

### Bottom Navigation Bar (selalu visible)
```html
<nav class="bottom-navigation" id="bottomNavigation">
  Beranda | Adzan | Al-Qur'an | Kajian | [Lainnya ▲]
</nav>
```

Tab "Lainnya" membuka **More Apps Dropdown** yang memuat: Dzikir, Sholat, Waris, Qibla, Sirah.

### App Switching Flow
```
User klik nav item
      │
      ▼
islamHub.switchApp(appName)
      │
      ├── Sembunyikan semua .app-component
      ├── Tampilkan #{appName}-app (tambah class .active)
      ├── Update .bottom-nav-item active state
      ├── Jika belum load → loadApp(appName)
      ├── Set body[data-current-app] = appName
      ├── Set localStorage 'islamhub_last_active_app'
      └── Reset scroll position ke top
```

**Special cases:**
- `waris`: jika klik tab saat sudah di waris → `warisApp.showHome()`
- `dzikir` / `sirah`: auto-reset ke main page via `resetToMainPage()`
- `alquran`: hanya reset ke home jika sudah aktif (tab double-tap)

---

## 5. CSS Architecture

Entry point: `css/style-modular.css`

```css
@import 'components/variables.css';
@import 'components/base.css';
@import 'components/animations.css';
@import 'components/loading.css';
@import 'components/home.css';
@import 'components/navigation.css';
@import 'components/floating-widget.css';
@import 'components/hadith-ticker.css';
@import 'components/adzan.css';
@import 'components/alquran.css';
@import 'components/streaming.css';
@import 'components/dzikir.css';
@import 'components/sholat.css';
@import 'components/waris.css';
@import 'components/qibla.css';
@import 'components/sirah.css';
@import 'components/footer.css';
@import 'components/responsive.css';
/* ... */
```

**CSS Custom Properties (variables.css):**
- `--primary`: warna aksen utama (cyan/green)
- `--text-primary`, `--text-secondary`
- `--nav-height`: height bottom nav (diset via ResizeObserver)
- `--dock-height`: height seluruh `#bottom-dock` (nav + audio player)

---

## 6. Sistem Audio — Arsitektur Lengkap

### 6.1 Elemen Audio Persistent

Kedua elemen `<audio>` ini berada di dalam `#bottom-dock` dan **tidak pernah dihapus** dari DOM, bahkan saat user berpindah app. Ini memungkinkan audio terus memutar saat navigasi.

```html
<!-- di dalam #quranAudioPlayer -->
<audio id="quranAudioElement" preload="metadata"></audio>
<audio id="radioPlayer" preload="none"></audio>
```

| Element | Digunakan untuk |
|---|---|
| `#quranAudioElement` | Bacaan Quran per-ayat (AlQuranApp), Muratal per-surah (AlQuranApp) |
| `#radioPlayer` | Radio streaming (StreamingApp), Muratal dari Adzan Display Mode (AdzanApp) |

### 6.2 Global Audio Player Bar (#quranAudioPlayer)

`#quranAudioPlayer` adalah **UI bar** (bukan elemen audio), yang menampilkan kontrol play/pause, progress, dan close. Bar ini di-*multiplex* antara dua mode:

| Mode | `dataset.mode` | Audio source | Dikontrol oleh |
|---|---|---|---|
| Quran | `"quran"` | `#quranAudioElement` | `AlQuranApp` |
| Radio | `"radio"` | `#radioPlayer` | `IslamHubApp._globalPlayerUpdate()` |
| (tidak aktif) | tidak ada | - | disembunyikan |

**Mode switching logic (app.js `_globalPlayerUpdate()`):**
```
setiap 1 detik:
  radioEl = #radioPlayer
  radioActive = (streamingApp.currentStream !== null)
                OR (radioEl.dataset.mode === 'muratal' && radioEl.currentSrc && !radioEl.ended)
  quranActive = quranAudioElement.currentSrc && !quranAudioElement.paused
  
  if radioActive && !quranActive && mode != 'quran':
    → mode = 'radio'
    → show player
    → jika muratal mode: tampilkan nama surah + "Muratal • Alafasy"
    → jika radio mode: tampilkan nama stasiun + deskripsi
    → hide prev/next, show mute btn, show signal dot
  
  elif !radioActive && mode == 'radio':
    → clear mode
    → if !quranActive → hide player
```

**Prioritas quran > radio:** Jika user memutar Quran saat radio sedang on, radio terus berbunyi tapi player bar dikuasai Quran. Radio kembali muncul saat Quran berhenti.

### 6.3 Display Mode Audio Bar

Di **Display Mode** (fullscreen masjid panel), ada audio bar tersendiri `#admAudioBar` di dalam adzan overlay. Bar ini memantau semua sumber audio melalui `_getAudioState()` dengan prioritas:

```
Priority 1a: dm-muratal
  → radioPlayer.dataset.mode === 'muratal'
  → Menampilkan nama surah, icon fa-quran

Priority 1b: radio streaming  
  → streamingApp.currentStream !== null
  → Menampilkan nama stasiun

Priority 2: quran page audio
  → quranAudioElement.currentSrc && di halaman Quran
  → Menampilkan info surah/halaman

Priority 3: quran surah audio
  → fallback quranAudioElement aktif

null: tidak ada audio aktif → sembunyikan bar
```

### 6.4 Radio Streaming — Retry Mechanism

`StreamingApp.startRadio()` menggunakan retry dengan exponential backoff:

```
Error/Stalled/Waiting events on radioPlayer
      │
      ▼
scheduleRetry(reason)
  delay = min(retryBaseDelay * 2^retryCount, 30000ms)
  retryCount++
  max retries = 8
      │
      ▼
retryStream()
  radioPlayer.pause() → src = '' → load()     ← flush buffer
  radioPlayer.src = station.url + '?_t=' + Date.now()  ← cache bust
  radioPlayer.load() → play()
      │
      ▼
'playing' event → resetRetryState()
```

Jika offline dan reconnect: `reconnectOnOnline()` — event listener `'online'` yang dipasang saat retry, dihapus saat koneksi kembali.

### 6.5 Muratal Al-Qur'an

Ada **dua jalur muratal** yang independent:

**A. Muratal dari Display Mode (AdzanApp)**
- Menggunakan `#radioPlayer` dengan `dataset.mode = "muratal"`
- `_dmCurrentMuratal` di-set **di event `playing`**, bukan di `.then()` dari `play()` — ini agar spinner di tombol tidak hilang prematur saat audio masih buffering
- `_globalPlayerUpdate()` deteksi kondisi ini via `radioEl.dataset.mode === 'muratal' && radioEl.currentSrc && !radioEl.ended`
- CDN: `https://cdn.islamic.network/quran/audio-surah/128/ar.alafasy/{N}.mp3`
- Repeat: infinite loop (toggle button)

**B. Muratal dari AlQuranApp**
- Menggunakan `#quranAudioElement` + `#quranAudioPlayer` bar
- State: `this._muratalState = { surahNumber, surahName, repeat, count, isPlaying }`
- Repeat options: 1×, 3×, 5×, ∞ (repeat=0)
- CDN: sama

---

## 7. Floating Prayer Widget

Widget kecil yang muncul di home page dan di corner apps tertentu, menampilkan countdown sholat berikutnya.

- Element: `#floatingPrayerWidget`
- Diperbarui oleh `AdzanApp.updateCountdown()` setiap detik via `updateFloatingWidget()`
- Disembunyikan di app Al-Quran (`body[data-current-app="alquran"]` → hide)
- Toggle via `islamHub.setupFloatingWidgetToggle()`

---

## 8. Service Worker & PWA

**Strategi caching (`sw.js`):**
- `Network First` untuk HTML, JS, CSS (selalu ambil versi terbaru)
- `Cache First` untuk assets statis (gambar, fonts)
- Cache name: `islamhub-v{CACHE_VERSION}`
- Update check: setiap 5 menit
- `skipWaiting()` dan `clients.claim()` untuk update cepat
- Update notification UI: `#updateNotification` muncul saat SW baru terinstall

**PWA install:**
- `beforeinstallprompt` event ditangkap, tombol install disimpan sebagai `this.installPrompt`
- Share: Web Share API dengan fallback ke clipboard

---

## 9. Capacitor (Android Native)

**Plugins digunakan:**
- `StatusBar` — set style dark, background color
- `SplashScreen` — hide setelah 500ms
- `Network` — monitor koneksi, trigger `handleNetworkChange()`
- `Haptics` — feedback sentuhan (tersedia tapi dinonaktifkan untuk navigasi)
- `Geolocation` — GPS untuk lokasi kiblat/adzan
- `LocalNotifications` — Notifikasi waktu sholat (native push notification)
- `App` — `appStateChange` → refresh prayer times saat app aktif kembali
- `Share` — native share sheet

**Deteksi platform:**
```javascript
if (typeof Capacitor !== 'undefined') {
    this.isNative = true;
    document.body.classList.add('capacitor-android'); // atau ios
    document.body.setAttribute('data-platform', 'android');
}
```

---

## 10. Global State Object

```javascript
this.state = {
    user: {
        city: 'Jakarta',
        country: 'Indonesia',
        coordinates: { lat: -6.2088, lon: 106.8456 },
        timezone: 'Asia/Jakarta'
    },
    adzan: {
        times: null,       // prayer times object
        nextPrayer: null,  // { name, time }
        lastFetch: null    // timestamp
    },
    settings: {
        notifications: true,
        sound: true,
        language: 'id'
    }
};
```

State ini diteruskan ke tiap app controller sebagai `globalState`. Namun sebagian besar state per-app disimpan di `localStorage` independen.

---

## 11. Hadith Ticker (Home Page)

- Data dari `js/data/hadith-collection.js` (global `hadithCollection`)
- Carousel: auto-advance setiap beberapa detik
- Kontrol: prev / play-pause / next
- Progress bar animasi CSS

---

## 12. Floating Widget Visibility Rules

```javascript
updateFloatingWidgetVisibility(appName) {
    if (appName === 'home') → show widget
    if (appName === 'adzan') → hide (app sudah menampilkan full info)
    if (appName === 'alquran') → hide (untuk reading experience)
    lainnya → show widget
}
```
