# IslamHub — Modul Adzan & Display Mode

---

## 1. Gambaran Umum

`AdzanApp` adalah modul paling kompleks di IslamHub. Bertugas menampilkan:
- Waktu sholat 5 waktu (+ Imsak, Syuruq, Sunnah) sesuai lokasi user
- Countdown sholat berikutnya (live, update per detik)
- Notifikasi sholat (5 menit sebelum waktu, via web + Android native)
- **Display Mode**: Panel fullscreen masjid (jam digital, grid sholat, radio, muratal, settings)

**File**: `js/apps/adzan/adzan-app.js`  
**Data files**: `js/data/sunnah-prayers.js`, `js/data/hadith-collection.js`  
**Global instance**: `window.adzanApp`

---

## 2. Constructor State

```javascript
constructor(globalState, mainApp) {
    this.lat = null;           // Koordinat user
    this.lon = null;
    this.city = null;
    this.country = null;
    this.timezone = 'Asia/Jakarta';
    this.gmtOffset = 7;        // Offset UTC dalam jam
    this.prayerTimes = {};     // Objek { Subuh, Dhuha, Dzuhur, Ashar, Maghrib, Isya }
    this.nextPrayer = null;    // { name, time }
    this.method = 11;          // Metode hisab (default: KEMENAG)
    this.notificationEnabled = false;
    this.notificationTimeouts = [];  // Array `setTimeout` IDs
    this.displayModeActive = false;
    this._dmCurrentMuratal = null;   // Nomor surah yang sedang diputar di DM
    this._dmMuratalRepeat = false;   // Toggle repeat muratal di DM
    this.hijriData = null;     // Data tanggal Hijriyah
    this.countdown = 0;        // Detik tersisa ke sholat berikutnya
    this._displayModePersist = false; // Apakah DM harus restore setelah refresh
}
```

---

## 3. Pengambilan Waktu Sholat

### 3.1 API Endpoint

```
GET https://api.aladhan.com/v1/timings/{unix_timestamp}
  ?latitude={lat}
  &longitude={lon}
  &method={methodId}
  &timezonestring={timezone}
```

**Parameter method:**
| ID | Nama | Digunakan |
|---|---|---|
| 11 | KEMENAG (Indonesia) | Default |
| 3 | MWL (Muslim World League) | Tersedia |
| 2 | ISNA (North America) | Tersedia |
| 5 | Egyptian General Authority | Tersedia |
| 4 | Umm al-Qura (Makkah) | Tersedia |
| 1 | University of Islamic Sciences, Karachi | Tersedia |

**Pemetaan nama bahasa Arab → Indonesia:**
```
Fajr → Subuh
Sunrise → Syuruq
Dhuhr → Dzuhur
Asr → Ashar
Maghrib → Maghrib
Isha → Isya
Imsak → Imsak
```

### 3.2 Timezone Resolution

Urutan prioritas:
1. **TimezoneDB API**: `https://api.timezonedb.com/v2.1/get-time-zone?key=...&format=json&by=position&lat=...&lng=...`
2. **Estimasi dari longitude**: `gmtOffset = Math.round(lon / 15)` → mapkan ke timezone string standar
3. **Default**: `'Asia/Jakarta'` (WIB, UTC+7)

### 3.3 Caching

Prayer times di-cache di `localStorage`:
- Key: `islamhub_prayer_times`
- Format: `{ date, location, times, method, hijriDate }`
- Validasi: cek tanggal, jika hari berbeda → refetch

---

## 4. Sistem Lokasi

```
init() → loadSavedLocation()
    │
    ├── Lokasi tersimpan ada? → gunakan langsung
    │
    └── Tidak ada → promptLocationSetup()
            │
            ├── Mode: Cari Kota (Nominatim search)
            │     Input teks → debounce 500ms → 
            │     GET https://nominatim.openstreetmap.org/search?q={query}&format=json&limit=5&addressdetails=1
            │     → User pilih dari dropdown hasil
            │
            └── Mode: Gunakan GPS
                  Capacitor.Plugins.Geolocation.getCurrentPosition()
                  ATAU navigator.geolocation.getCurrentPosition()
                  → reverse geocode (Nominatim)
                  → simpan ke localStorage 'islamhub_adzan_location'
```

**Format data lokasi tersimpan:**
```json
{
  "lat": -6.2088,
  "lon": 106.8456,
  "city": "Jakarta",
  "country": "Indonesia",
  "timezone": "Asia/Jakarta"
}
```

---

## 5. Sistem Notifikasi

### 5.1 Web Notifications

```javascript
// 5 menit sebelum setiap waktu sholat:
scheduleNotifications() {
    this.prayerNames.forEach(name => {
        const prayerMs = this.prayerTimes[name]; // epoch ms
        const notifMs  = prayerMs - (5 * 60 * 1000);
        const delayMs  = notifMs - Date.now();
        if (delayMs > 0) {
            const id = setTimeout(() => {
                // Coba Web Notification API
                new Notification(`Waktu ${name} 5 menit lagi`, { ... });
                // Fallback: kirim ke Service Worker
                navigator.serviceWorker.controller.postMessage({
                    type: 'SHOW_NOTIFICATION', title: ..., body: ...
                });
            }, delayMs);
            this.notificationTimeouts.push(id);
        }
    });
}
```

### 5.2 Native Android (Capacitor)

```javascript
// Dipanggil dari mobile-helper.js atau langsung AdzanApp
Capacitor.Plugins.LocalNotifications.schedule({
    notifications: [{
        id: prayerIndex + 1,
        title: `Waktu ${prayerName}`,
        body: `Sholat ${prayerName} 5 menit lagi`,
        schedule: { at: new Date(notifTime) },
        channelId: 'adzan',
        sound: 'beep.wav',
        extra: { prayer: prayerName }
    }]
});
```

### 5.3 Fallback Polling

Jika notifikasi tidak bisa terjadwal (permission denied), sistem pakai polling tiap 60 detik:
```javascript
setInterval(() => this.checkPrayerTimeNow(), 60 * 1000);
```

---

## 6. Sholat Sunnah

- Data dari `js/data/sunnah-prayers.js` (global `sunnahPrayers`)
- Ditampilkan di panel kecil bawah info sholat
- Filter berdasarkan waktu relative terhadap sholat wajib:
  - Qabliyah Subuh → sebelum Subuh
  - Qabliyah Dzuhur → sebelum Dzuhur
  - Ba'diyah Maghrib → setelah Maghrib, dst.
- Sunnah tidak tetap (Dhuha, Tahajud, dll.) ditampilkan sesuai waktu berlaku

---

## 7. Display Mode — Arsitektur Lengkap

### 7.1 Membuka Display Mode

```javascript
openDisplayMode() {
    this.displayModeActive = true;
    localStorage.setItem('adzan-display-mode', '1');
    
    // Buat overlay fullscreen
    const overlay = document.createElement('div');
    overlay.id = 'adzanDisplayMode';
    overlay.className = 'adm-overlay';
    document.body.appendChild(overlay);
    
    overlay.innerHTML = this._buildDisplayModeDOM();
    this._startDisplayModeClock();     // Jam digital real-time
    this._buildDisplayModePrayerGrid(); // Grid waktu sholat dengan highlight
    this._startAudioBar();             // Polling audio state setiap 1 detik
    this._startAdhanTicker();          // Hadith ticker carousel
    this._checkAdzanTrigger();         // Cek suara adzan jika waktu sholat
}
```

**Restore setelah refresh:** Saat `AdzanApp.init()`:
```javascript
if (localStorage.getItem('adzan-display-mode') === '1') {
    // Tunggu data prayer times siap → openDisplayMode()
    this._displayModePersist = true;
}
```

### 7.2 Struktur DOM Display Mode

```
#adzanDisplayMode (overlay fullscreen, z-index tinggi)
├── .adm-bg-layer                    ← Background image (Haramain, Nabawi, dll)
├── .adm-clock-section
│   ├── #admClock                    ← Jam digital HH:MM:SS
│   ├── #admDate                     ← Tanggal & hari
│   └── #admHijriDate                ← Tanggal Hijriyah
├── .adm-prayer-grid-wrapper
│   └── #admPrayerGrid               ← Kolom waktu sholat (5 + Imsak + Syuruq)
│       └── tiap kolom memiliki class .adm-next-prayer jika waktu berikutnya
├── .adm-next-prayer-info
│   └── #admCountdown                ← "Menuju Ashar: 02:15:33"
├── .adm-ticker-bar
│   └── #admTickerContent            ← Hadith carousel
├── .adm-controls
│   ├── #admRadioBtn                 ← Tombol buka radio/muratal panel
│   ├── #admSettingsBtn              ← Tombol buka settings panel
│   └── #admCloseBtn                 ← Tutup display mode
├── #admAudioBar                     ← Audio status bar (hidden by default)
│   ├── .adm-audio-icon              ← Icon jenis audio
│   ├── .adm-audio-title             ← Nama stasiun/surah
│   └── .adm-audio-stop              ← Tombol stop
├── #admRadioPanel (hidden)          ← Panel radio & muratal
│   ├── .adm-panel-tabs              ← Tab "Radio" | "Muratal Surah"
│   ├── #admRadioTabContent          ← Daftar stasiun radio
│   └── #admMuratalTabContent        ← Daftar surah + search + repeat toggle
└── #admSettingsPanel (hidden)       ← Panel pengaturan tampilan
    ├── theme selector (7 topik warna)
    ├── background selector (7 gambar)
    ├── show/hide toggles
    ├── font size selector
    ├── masjid name input
    └── adzan sound selector
```

### 7.3 Settings Display Mode

Settings disimpan di `localStorage['adm-settings']` sebagai JSON:

```json
{
  "theme": "default",       // default | cyan | green | blue | maroon | white | dark
  "bgStyle": "haram",       // haram | nabawi | aqsa | istanbul | dark | emerald | ramadan
  "showSunnah": true,       // Tampilkan sholat sunnah di grid
  "showImsak": true,        // Tampilkan Imsak
  "showSyuruq": false,      // Tampilkan Syuruq
  "showArabic": true,       // Tampilkan nama Arab di grid
  "fontSize": "md",         // sm | md | lg
  "masjidName": "Masjid",   // Nama identitas
  "adzanSound": "beep",     // beep | full-zayla | full-mulla | full-mishary
  "adzanFullAudio": false,  // true = putar adzan penuh saat masuk waktu
  "adzanFile": null         // Nama file adzan custom
}
```

**Theming via data attribute:**
```javascript
overlay.setAttribute('data-adm-theme', 'cyan');  // Mengubah CSS vars
overlay.setAttribute('data-adm-bg', 'nabawi');    // Mengubah background image
```

**Background images** ada di `assets/images/bg-{bgStyle}.jpg` (haram, nabawi, aqsa, istanbul, dark, emerald, ramadan).

---

## 8. Radio Panel — Tab Radio

Menampilkan daftar stasiun radio dari `window.streamingApp.radioStations[]`:

```javascript
_dmToggleRadio(stationIdx) {
    // Jika station ini sedang aktif → stop
    if (streamingApp.currentStream === stationIdx) {
        streamingApp.stopRadio(stationIdx);
        return;
    }
    
    // Tampilkan spinner di tombol
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
    
    // PENTING: Daftarkan 'playing' event listener SEBELUM startRadio()
    // agar spinner bertahan sampai audio benar-benar streaming (bukan hanya saat
    // play() promise resolve, yang terlalu dini saat buffering).
    radioPlayer.addEventListener('playing', () => {
        this._dmUpdateRadioBtnStates();  // Spinner → stop icon
        this._updateAudioBar();
        window.islamHub._globalPlayerUpdate();
    }, { once: true });
    
    // Delegate ke StreamingApp (null untuk btnRadio & radioStatus param)
    streamingApp.startRadio(idx, station, radioPlayer, null, null);
}
```

**Penting:** `startRadio()` dipanggil dengan `btnRadio=null` dan `radioStatus=null` karena tombol ada di panel DM, bukan di halaman Kajian. `StreamingApp.startRadio()` sudah null-safe untuk ini.

---

## 9. Muratal Panel — Tab Muratal Surah

```javascript
_buildDMRadioList() { // (sama function, tab berbeda)
    // Header dengan toggle repeat
    <button id="admMuratalRepeat">Ulangi: Mati</button>
    
    // Search input
    <input type="text" id="admMuratalSearch" placeholder="Cari surah...">
    
    // List 114 surah dari QURAN_SURAHS global
    QURAN_SURAHS.forEach(surah => {
        <button class="adm-muratal-btn" data-surah-num="{N}">
            {N}. {surahName}
        </button>
    });
}

// Saat diklik:
_dmPlayMuratal(surahNum, surahName) {
    const radioPlayer = document.getElementById('radioPlayer');
    radioPlayer.dataset.mode = 'muratal';  // Flag untuk _getAudioState()
    radioPlayer.src = `https://cdn.islamic.network/quran/audio-surah/128/ar.alafasy/${surahNum}.mp3`;
    
    // PENTING: Gunakan event 'playing' bukan .then() dari play() promise.
    // play() resolve sesaat setelah dipanggil meski audio masih buffering —
    // sehingga spinner akan hilang terlalu cepat sebelum audio benar-benar play.
    // Event 'playing' hanya fired saat audio benar-benar streaming.
    radioPlayer.addEventListener('playing', () => {
        this._dmCurrentMuratal = surahNum;
        this._dmUpdateMuratalBtnStates();    // Spinner → stop icon
        this._updateAudioBar();              // Tampilkan audio bar di DM
        window.islamHub?._globalPlayerUpdate(); // Tampilkan #quranAudioPlayer bar
    }, { once: true });
    
    radioPlayer.play();
    
    // Repeat handler (via onended)
    radioPlayer.addEventListener('ended', () => {
        if (this._dmMuratalRepeat) {
            radioPlayer.play();  // Putar ulang
        } else {
            this._dmStopMuratal();
        }
    }, { once: true });
}

_dmStopMuratal() {
    radioPlayer.pause();
    radioPlayer.src = '';
    radioPlayer.removeAttribute('data-mode');  // Hapus flag
    this._dmCurrentMuratal = null;
    window.islamHub?._globalPlayerUpdate();    // Sembunyikan global player bar
}
```

---

## 10. Audio Bar Polling

```javascript
_startAudioBar() {
    this._audioBarInterval = setInterval(() => {
        const state = this._getAudioState();
        
        if (state) {
            this._renderAudioBar(state);    // Update #admAudioBar
            this._dmUpdateMuratalBtnStates(); // Update highlight tombol surah
            this._dmUpdateRadioBtnStates();   // Update highlight tombol radio
        } else {
            document.getElementById('admAudioBar').hidden = true;
        }
    }, 1000);
}
```

---

## 11. Adzan Sound System

Dijalankan di dalam countdown interval (setiap 1 detik):

```javascript
_checkAdzanTrigger() {
    const now = new Date();
    
    // Cek apakah jam:menit ini sama dengan salah satu waktu sholat
    const matchedPrayer = this.prayerNames.find(name => {
        const prayerTime = this.prayerTimes[name];
        return now.getHours() === prayerTime.hours && 
               now.getMinutes() === prayerTime.minutes &&
               now.getSeconds() < 5;  // Window 5 detik pertama
    });
    
    if (matchedPrayer && !this._adzanPlayed) {
        this._adzanPlayed = true; // Prevent double-trigger
        
        if (settings.adzanSound === 'beep') {
            // Putar pendek beep
            const audio = new Audio('assets/audio/beep.mp3');
            audio.play();
        } else if (settings.adzanFullAudio) {
            // Putar adzan penuh via radioPlayer
            const adzanFiles = {
                'full-zayla':   'adzan_zayla.mp3',
                'full-mulla':   'adzan_mulla.mp3',
                'full-mishary': 'adzan_mishary.mp3',
            };
            const radioPlayer = document.getElementById('radioPlayer');
            radioPlayer.src = `assets/audio/${adzanFiles[settings.adzanSound]}`;
            radioPlayer.play();
        }
        
        // Tampilkan alert overlay
        this._showAdzanAlert(matchedPrayer);
    }
    
    // Reset flag setelah lewat menit pertama
    if (now.getSeconds() >= 60) this._adzanPlayed = false;
}
```

Audio unlock: karena browser memblokir `autoplay`, system track user interaction pertama dan men-unlock audio:
```javascript
document.addEventListener('click', () => { this._audioUnlocked = true; }, { once: true });
```

---

## 12. localStorage Keys (Adzan)

| Key | Value | Keterangan |
|---|---|---|
| `islamhub_adzan_location` | JSON `{lat, lon, city, country, timezone}` | Lokasi tersimpan |
| `islamhub_prayer_times` | JSON `{date, times, hijriDate, method}` | Cache prayer times hari ini |
| `islamhub_adzan_notifications_enabled` | `'1'` atau `'0'` | Status notifikasi |
| `adzan-display-mode` | `'1'` | Flag restore display mode |
| `adm-settings` | JSON settings | Preferensi tampilan display mode |
| `islamhub_adzan_method` | `'11'` (string angka) | Metode hisab |

---

## 13. Menambahkan Fitur ke Display Mode

**Menambah theme baru:**
1. Tambah opsi di `_buildSettingsPanel()` → `<label data-theme="namatema">...`
2. Tambah CSS rule di `css/components/adzan.css`:
   ```css
   #adzanDisplayMode[data-adm-theme="namatema"] {
       --adm-accent: #xxxxxx;
       --adm-text: #xxxxxx;
   }
   ```

**Menambah background baru:**
1. Simpan gambar di `assets/images/bg-namabg.jpg`
2. Tambah opsi di `_buildSettingsPanel()`
3. Tambah CSS:
   ```css
   #adzanDisplayMode[data-adm-bg="namabg"] .adm-bg-layer {
       background-image: url('../assets/images/bg-namabg.jpg');
   }
   ```

**Menambah stasiun muratal (reciter):**
Satu-satunya reciter yang tersedia saat ini adalah `ar.alafasy`. Untuk menambah reciter, ubah URL CDN di `_dmPlayMuratal()` dan tambah selector di settings panel.
