# IslamHub — Panduan Data

---

## 1. localStorage — Semua Keys

Semua data persisten user (preferensi, state, cache) disimpan di `localStorage`. Berikut daftar lengkap:

### 1.1 Core App State

| Key | Type | Value | Digunakan oleh |
|---|---|---|---|
| `islamhub_last_active_app` | `string` | `'home'`, `'adzan'`, `'alquran'`, dll. | `IslamHubApp` — restore app terakhir dibuka |

### 1.2 Adzan

| Key | Type | Default | Keterangan |
|---|---|---|---|
| `islamhub_adzan_location` | JSON | `null` | `{ lat, lon, city, country, timezone }` |
| `islamhub_prayer_times` | JSON | `null` | Cache times hari ini: `{ date, times, hijriDate, method }` |
| `islamhub_adzan_notifications_enabled` | `string` | `'0'` | `'1'` = aktif, `'0'` = mati |
| `islamhub_adzan_method` | `string` | `'11'` | ID metode hisab (lihat tabel di ADZAN.md) |
| `adzan-display-mode` | `string` | tidak ada | `'1'` = restore display mode saat reload |
| `adm-settings` | JSON | lihat default | Preferensi Display Mode (theme, bg, fontSize, dll.) |

**Default `adm-settings`:**
```json
{
  "theme": "default",
  "bgStyle": "haram",
  "showSunnah": true,
  "showImsak": true,
  "showSyuruq": false,
  "showArabic": true,
  "fontSize": "md",
  "masjidName": "Masjid",
  "adzanSound": "beep",
  "adzanFullAudio": false,
  "adzanFile": null
}
```

### 1.3 Al-Qur'an

| Key | Type | Default | Keterangan |
|---|---|---|---|
| `alquran_bookmarks` | JSON array | `[]` | `[ { page, surah, ayah, ts } ]` |
| `alquran_verse_bookmarks` | JSON array | `[]` | `[ { surahNum, ayahNum, text, ts } ]` |
| `alquran_history` | JSON array | `[]` | Riwayat max 20: `[ { page, surah, title, ts } ]` |
| `alquran_settings` | JSON | default | Font, tema, preferensi |
| `alquran_last_page` | `string` | `'1'` | Nomor halaman terakhir (mode halaman) |
| `alquran_last_read` | JSON | `null` | `{ surahName, ayahNum, page, ts }` — mode surah |
| `alquran_view_mode` | `string` | `'page'` | `'page'` atau `'surah'` |

**Default `alquran_settings`:**
```json
{
  "arabicFont": "uthmanic",
  "arabicFontSize": "md",
  "autoPlayNext": false,
  "autoRepeat": false,
  "showTranslation": false,
  "showTransliteration": false,
  "readingTheme": "dark",
  "autoSave": true
}
```

### 1.4 Kalkulator Waris

| Key | Type | Default | Keterangan |
|---|---|---|---|
| `warisFavorites` | JSON array | `[]` | `[ { id, label, tirkah, heirs, results } ]` |

### 1.5 Dzikir & Doa

| Key | Type | Default | Keterangan |
|---|---|---|---|
| `dzikirFavorites` | JSON array | `[]` | Array ID doa favorit (`doa.id`) |

### 1.6 Sirah

| Key | Type | Default | Keterangan |
|---|---|---|---|
| `sirahFavorites` | JSON array | `[]` | Array ID tokoh favorit (`item.id`) |

### 1.7 Audio Cache

| Key | Type | Keterangan |
|---|---|---|
| `islamhub_downloaded_audio` | JSON array | Path file audio yang sudah di-download ke IndexedDB |

---

## 2. IndexedDB — Audio Cache

**Database name**: `IslamHubAudioCache`  
**Object store**: `audio`  
**Key format**: `islamhub_audio_` + path dengan semua non-alphanumeric diganti `_`

Contoh:
```
Path: /dzikir/doa_001.mp3
Key:  islamhub_audio__dzikir_doa_001_mp3
```

**Data structure per entry:**
```json
{
  "key": "islamhub_audio__dzikir_doa_001_mp3",
  "blob": Blob,        // Data audio biner
  "url": "string",     // Base URL sumber
  "timestamp": 1234567890
}
```

**Dikelola oleh**: `js/utils/audio-manager.js`  
**Digunakan oleh**: `DzikirApp`, `AlQuranApp` (offline mode)

---

## 3. Global JavaScript Variables (Data Files)

File data ini dimuat via `<script>` tag di `index.html` **sebelum** `app.js`, sehingga tersedia sebagai global variable:

### 3.1 Al-Qur'an Data

| Variable | File | Isi |
|---|---|---|
| `QURAN_SURAHS` | `js/data/alquran/quran-data.js` | Array 114 objek info surah |
| `QURAN_JUZ` | `js/data/alquran/quran-data.js` | Array 30 objek info juz |
| `QURAN_VERSES` | `js/data/alquran/quran-data.js` | Objek `{ "surah:ayah": verseData }` |

**Format `QURAN_SURAHS[N]`:**
```javascript
{
    number: 1,
    name: "Al-Fatihah",
    arabicName: "الفاتحة",
    translation: "Pembuka",
    totalVerses: 7,
    revelationType: "Makkiyah",   // atau "Madaniyah"
    startPage: 1
}
```

**Format `QURAN_VERSES`:**
```javascript
{
    "1:1": {
        arabic: "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ",
        transliteration: "Bismillāhir-raḥmānir-raḥīm",
        translation: "Dengan nama Allah Yang Maha Pengasih, Maha Penyayang",
        juz: 1,
        page: 1,
        sajda: false
    },
    ...
}
```

### 3.2 Hadith Data

| Variable | File | Isi |
|---|---|---|
| `hadithCollection` | `js/data/hadith-collection.js` | Array hadits untuk ticker home/DM |

**Format:**
```javascript
{
    id: "h001",
    arabic: "...",
    translation: "...",
    narrator: "...",
    reference: "HR. Bukhari no. 1",
    category: "niat"
}
```

### 3.3 Sunnah Prayers Data

| Variable | File | Isi |
|---|---|---|
| `sunnahPrayers` | `js/data/sunnah-prayers.js` | Array sholat sunnah |

---

## 4. External APIs

### 4.1 Prayer Times API

**Provider**: AlAdhan  
**Endpoint**: `https://api.aladhan.com/v1/timings/{timestamp}`

**Parameters:**
```
latitude     = {float}
longitude    = {float}
method       = {1-23}          // Lihat tabel metode di ADZAN.md
timezonestring = {tz string}   // e.g. "Asia/Jakarta"
```

**Response struktur:**
```json
{
  "code": 200,
  "status": "OK",
  "data": {
    "timings": {
      "Fajr": "04:15",
      "Sunrise": "05:38",
      "Dhuhr": "11:52",
      "Asr": "15:12",
      "Maghrib": "17:55",
      "Isha": "19:07",
      "Imsak": "04:05",
      "Midnight": "23:47"
    },
    "date": {
      "readable": "13 Mar 2026",
      "hijri": { "date": "13-09-1447", "month": {...}, ... }
    }
  }
}
```

**Rate limits**: Tidak ada rate limit yang diketahui (public API), namun caching harian diperlukan.

---

### 4.2 Geocoding API

**Provider**: Nominatim (OpenStreetMap)  
**Endpoint Search**: `https://nominatim.openstreetmap.org/search`

```
q         = {text query}
format    = json
limit     = 5
addressdetails = 1
```

**Endpoint Reverse**: `https://nominatim.openstreetmap.org/reverse`

```
lat       = {float}
lon       = {float}
format    = json
```

**Response reverse geocode:**
```json
{
  "address": {
    "city": "Jakarta",
    "country": "Indonesia",
    "country_code": "id"
  }
}
```

**Usage policy**: Harus sertakan `User-Agent` header + tidak lebih dari 1 request/detik.

---

### 4.3 Timezone API

**Provider**: TimezoneDB  
**Endpoint**: `https://api.timezonedb.com/v2.1/get-time-zone`

```
key       = {API_KEY}          // Dalam source code
format    = json
by        = position
lat       = {float}
lng       = {float}
```

**Response:**
```json
{
  "status": "OK",
  "zoneName": "Asia/Jakarta",
  "gmtOffset": 25200,           // detik dari UTC (25200 = +7 jam)
  "abbreviation": "WIB"
}
```

---

### 4.4 Audio CDN

**Provider**: cdn.islamic.network  
**Base URL**: `https://cdn.islamic.network/quran/`

| Path Pattern | Deskripsi |
|---|---|
| `audio/128/{reciter}/{surah}_{ayah}.mp3` | Audio per-ayat, 128kbps |
| `audio-surah/128/{reciter}/{surah}.mp3` | Audio per-surah (muratal), 128kbps |

**Reciter IDs yang digunakan:**
- `ar.alafasy` — Mishary Rashid Al-Afasy

---

### 4.5 IslamHub Asset Server

**Base URL**: `https://mfarismuzakki.id/islamhub`  
**Digunakan oleh**: `AudioManager` untuk download audio dzikir

```javascript
// AudioManager.getAudioUrl(path):
const remoteUrl = `${this.baseUrl}${path}`;
```

---

## 5. Service Worker Cache Strategy

### 5.1 Cache Version

```javascript
const CACHE_VERSION = '1.4.4-20260222-settings';
const CACHE_NAME = `islamhub-v${CACHE_VERSION}`;
```

### 5.2 Cache Strategy

| Resource | Strategy | Penjelasan |
|---|---|---|
| `.html`, `index` | Network First | Selalu ambil terbaru, fallback ke cache |
| `.js`, `.css`, `/js/` | Network First | Selalu ambil terbaru (code updates) |
| Images (`.png`, `.jpg`, `.svg`, `.ico`) | Cache First | Statis, jarang berubah |
| Fonts (`.woff`, `.woff2`, `.ttf`) | Cache First | Statis |
| Other | Network First | Default safe strategy |

### 5.3 Cache Cleanup

Saat Service Worker aktif (setelah update):
```javascript
self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(keys =>
            Promise.all(
                keys
                    .filter(key => key !== CACHE_NAME)   // Hapus cache lama
                    .map(key => caches.delete(key))
            )
        )
    );
    self.clients.claim();
});
```

---

## 6. App Data Flow Diagram

```
User Action
    │
    ▼
App Controller (XxxApp)
    │
    ├── Read: localStorage (sync, instant)
    │
    ├── Read: global JS variables (QURAN_SURAHS, hadithCollection, etc.)
    │         → Load saat page load, tersedia langsung
    │
    ├── Read: dynamic import JS data (sirah, sholat, bacaan)
    │         → Lazy load pertama kali dibutuhkan
    │
    ├── Read: fetch page JSONs (js/data/alquran/pages/page_N.json)
    │         → Network atau SW cache
    │
    └── Read: external API (AlAdhan, Nominatim, TimezoneDB)
              → Network, cache manual di localStorage per hari
              → Fallback: data terakhir dari localStorage jika offline
```
