# IslamHub — Modul Al-Qur'an

---

## 1. Gambaran Umum

`AlQuranApp` adalah modul pembacaan Al-Qur'an digital lengkap. Mendukung:
- Mode Halaman (mushaf 604 halaman) dan Mode Surah (per-surah penuh)
- Audio per-ayat + Audio per-surah (muratal)
- Quick navigation (Daftar Surah, Buka Halaman, Muratal, Tersimpan, Offline, Pengaturan)
- Bookmarks halaman + bookmarks per-ayat
- Reading themes 5 pilihan + Arabic fonts 6 pilihan
- Mode Offline (audio ter-cache di IndexedDB)

**File**: `js/apps/alquran/alquran-app.js`  
**Data files**: `js/data/alquran/quran-data.js`, `js/data/alquran/pages/` (604 file JSON)  
**Global instance**: `window.alquranApp`

---

## 2. Constructor State

```javascript
constructor(globalState, mainApp) {
    this.currentPage = 1;
    this.totalPages = 604;
    this.readMode = 'page';        // 'page' | 'surah'
    this.viewMode = 'reading';     // 'reading' | 'translation'
    this.currentSurah = 1;
    this.currentAyah = 1;

    this.settings = {
        arabicFont: 'uthmanic',         // Font Arab
        arabicFontSize: 'md',           // sm | md | lg | xl
        autoPlayNext: false,            // Auto-play ayat berikutnya
        autoRepeat: false,              // Ulangi ayat
        showTranslation: false,         // Tampilkan terjemahan
        showTransliteration: false,     // Tampilkan latin
        readingTheme: 'dark',           // dark | black | sepia | gray | white
        autoSave: true,                 // Auto-simpan posisi
    };

    this.bookmarks = [];           // Array: { page, surah, ayah, timestamp }
    this.verseBookmarks = [];      // Array: { surahNum, ayahNum, text, timestamp }
    this.history = [];             // Array: { page, surah, title, timestamp } max 20
    this._muratalState = {
        surahNumber: null,
        surahName: null,
        repeat: 1,                 // 1 | 3 | 5 | 0 (infinite)
        count: 0,                  // Sudah berapa kali diputar
        isPlaying: false,
    };
}
```

---

## 3. Data Source

### 3.1 Global Variables (dimuat via `<script>` di `index.html`)

```javascript
QURAN_SURAHS[114]   // Array surah info
QURAN_JUZ[30]       // Array juz info  
QURAN_VERSES        // Object { "1:1": { arabic, transliteration, translation, ... } }
```

**Format `QURAN_SURAHS[i]`:**
```json
{
  "number": 1,
  "name": "Al-Fatihah",
  "arabicName": "الفاتحة",
  "translation": "Pembuka",
  "totalVerses": 7,
  "revelationType": "Makkiyah",
  "startPage": 1
}
```

### 3.2 Page-Based Data

File JSON per-halaman: `js/data/alquran/pages/page_{N}.json`  
Dimuat secara lazy saat halaman dibuka:
```javascript
const data = await fetch(`js/data/alquran/pages/page_${pageNum}.json`);
```

Format:
```json
[
  {
    "surah": 1,
    "ayah": 1,
    "arabic": "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ",
    "translation": "Dengan nama Allah Yang Maha Pengasih, Maha Penyayang",
    "transliteration": "Bismillāhir-raḥmānir-raḥīm",
    "juz": 1
  }
]
```

---

## 4. Home / Quick Navigation

Saat render pertama, tampilkan halaman home dengan 6 tombol cepat:

| Tombol | Aksi |
|---|---|
| Daftar Surat | `_showSurahList()` — tampilkan 114 surah |
| Buka Halaman | `_showPageJump()` — dialog input nomor halaman |
| Muratal | `_showMuratalPage()` — halaman muratal per-surah |
| Tersimpan | `_showSaved()` — bookmarks + verse bookmarks |
| Mode Offline | `_showOfflineMode()` — manajemen cache audio |
| Pengaturan | `_showSettings()` — font, tema, preferensi |

**"Lanjutkan Bacaan" card** muncul di home jika ada history:
- Ambil dari `localStorage['alquran_last_read']`
- Format: `{ surahName, ayahNum, page, timestamp }`
- Klik → langsung buka halaman/surah tersebut

---

## 5. Mode Baca — Page Mode

### 5.1 Navigasi Halaman

```
currentPage bertambah/berkurang
      │
      ▼
_loadPage(pageNum)
  → fetch page_{pageNum}.json
  → render ayat-ayat
  → update header (nomor halaman, nama surah, juz)
  → save ke history
  → update lastPage di localStorage
```

### 5.2 Render Ayat

Setiap ayat ditampilkan dengan:
```html
<div class="verse-container" data-surah="{N}" data-ayah="{M}">
  <div class="verse-arabic" style="font-family: {font}; font-size: {size}">
    {arabic text}
  </div>
  <div class="verse-number">{N}:{M}</div>
  [if showTranslation]:
  <div class="verse-translation">{translation}</div>
  [if showTransliteration]:
  <div class="verse-transliteration">{transliteration}</div>
  
  <div class="verse-actions">
    <button class="btn-play-verse" />     ← Play audio ayat ini
    <button class="btn-bookmark-verse" /> ← Simpan bookmark
    <button class="btn-copy-verse" />     ← Copy teks
    <button class="btn-share-verse" />    ← Share
  </div>
</div>
```

### 5.3 Arabic Fonts

| Value | Font Name | Import |
|---|---|---|
| `uthmanic` | Uthmanic Hafs | Google Fonts / lokal |
| `amiri` | Amiri | Google Fonts |
| `scheherazade` | Scheherazade New | Google Fonts |
| `naskh` | Noto Naskh Arabic | Google Fonts |
| `kufi` | Reem Kufi | Google Fonts |
| `noto-naskh` | Noto Naskh | Google Fonts |

Font size classes: `.alq-arabic-sm`, `.alq-arabic-md`, `.alq-arabic-lg`, `.alq-arabic-xl`

### 5.4 Reading Themes

Tipe ini diaplikasikan sebagai class pada container `.alq-reader`:

| Theme | Background | Text | Kelas |
|---|---|---|---|
| `dark` | `#1a1f2e` | `#f0e6c8` | `.theme-dark` |
| `black` | `#000000` | `#ffffff` | `.theme-black` |
| `sepia` | `#f5e6c8` | `#3a2a1a` | `.theme-sepia` |
| `gray` | `#2d2d2d` | `#ffffff` | `.theme-gray` |
| `white` | `#ffffff` | `#1a1a1a` | `.theme-white` |

---

## 6. Mode Baca — Surah Mode

Menampilkan seluruh ayat surah sekaligus (tanpa pagination). Cocok untuk membaca dari awal sampai akhir surah.

```javascript
async _loadSurah(surahNum) {
    const surahInfo = QURAN_SURAHS[surahNum - 1];
    // Muat semua ayat dari QURAN_VERSES untuk surah ini
    const verses = Object.entries(QURAN_VERSES)
        .filter(([key]) => key.startsWith(`${surahNum}:`))
        .map(([key, val]) => ({ ...val, key }));
    
    this._renderSurahView(surahInfo, verses);
}
```

---

## 7. Audio per-Ayat

**CDN:**
```
https://cdn.islamic.network/quran/audio/128/ar.alafasy/{surahNum}_{ayahNum}.mp3
```

Contoh ayat Al-Fatihah 1: `...audio/128/ar.alafasy/1_1.mp3`

```javascript
playVerseAudio(surahNum, ayahNum) {
    const quranAudio = document.getElementById('quranAudioElement');
    
    // Update UI player bar
    document.getElementById('quranAudioPlayer').style.display = 'flex';
    document.getElementById('quranAudioPlayer').dataset.mode = 'quran';
    
    quranAudio.src = `https://cdn.islamic.network/quran/audio/128/ar.alafasy/${surahNum}_${ayahNum}.mp3`;
    quranAudio.play();
    
    // Auto-play next (jika setting aktif)
    quranAudio.onended = () => {
        if (this.settings.autoPlayNext) {
            this.playVerseAudio(surahNum, ayahNum + 1);  // Ayat berikutnya
        }
        if (this.settings.autoRepeat) {
            quranAudio.play();  // Ulangi ayat sama
        }
    };
}
```

---

## 8. Halaman Muratal

Diakses via tombol "Muratal" di home quick-nav.

### 8.1 Render Muratal Page

```html
<div class="alq-muratal-page">
  <!-- Header -->
  <div class="alq-muratal-header">
    <button class="alq-muratal-back">← Kembali</button>
    <h2>Muratal Al-Qur'an</h2>
  </div>
  
  <!-- Now Playing (muncul saat ada surah aktif) -->
  <div class="alq-muratal-now" [hidden saat tidak ada audio]>
    <span class="alq-muratal-now-name">Al-Fatihah</span>
    <span class="alq-muratal-now-count">Diputar 2× dari 3×</span>
    <button id="alqMuratalStop">■ Stop</button>
  </div>
  
  <!-- Repeat Selector -->
  <div class="alq-muratal-repeat">
    <span>Ulangi:</span>
    <button data-repeat="1"  class="active">1×</button>
    <button data-repeat="3">3×</button>
    <button data-repeat="5">5×</button>
    <button data-repeat="0">∞</button>
  </div>
  
  <!-- Search -->
  <input type="search" id="alqMuratalSearch" placeholder="Cari surah..." />
  
  <!-- Lista 114 Surah -->
  <div class="alq-muratal-list">
    QURAN_SURAHS.map(surah → tombol dengan nama surah)
  </div>
</div>
```

### 8.2 Logika Repeat

```javascript
playMuratalSurah(surahNum, surahName) {
    this._muratalState = {
        surahNumber: surahNum,
        surahName,
        repeat: this._selectedRepeat,   // 1 | 3 | 5 | 0
        count: 0,
        isPlaying: true,
    };
    
    const audio = document.getElementById('quranAudioElement');
    audio.src = `https://cdn.islamic.network/quran/audio-surah/128/ar.alafasy/${surahNum}.mp3`;
    audio.play();
    
    // Show player bar
    document.getElementById('quranAudioPlayer').style.display = 'flex';
    document.getElementById('quranAudioPlayer').dataset.mode = 'quran';
    
    audio.onended = () => {
        const s = this._muratalState;
        s.count++;
        
        if (s.repeat === 0) {       // Infinite
            audio.play();
        } else if (s.count < s.repeat) {  // Belum habis
            audio.play();
        } else {
            this.stopMuratal();     // Selesai
        }
        
        this._updateMuratalNowPlaying();  // Update UI "Diputar N× dari M×"
    };
}

stopMuratal(updateUI = true) {
    const audio = document.getElementById('quranAudioElement');
    audio.pause();
    audio.src = '';
    
    this._muratalState.isPlaying = false;
    
    if (updateUI) {
        document.getElementById('quranAudioPlayer').style.display = 'none';
        this._updateMuratalNowPlaying();
    }
}
```

---

## 9. Bookmarks

### 9.1 Page Bookmarks

```javascript
addBookmark(pageNum, surahName, ayahNum) {
    const bookmark = { page: pageNum, surah: surahName, ayah: ayahNum, ts: Date.now() };
    this.bookmarks.push(bookmark);
    localStorage.setItem('alquran_bookmarks', JSON.stringify(this.bookmarks));
}
```

### 9.2 Verse Bookmarks

```javascript
addVerseBookmark(surahNum, ayahNum, arabicText) {
    const bookmark = { surahNum, ayahNum, text: arabicText, ts: Date.now() };
    this.verseBookmarks.push(bookmark);
    localStorage.setItem('alquran_verse_bookmarks', JSON.stringify(this.verseBookmarks));
}
```

---

## 10. Mode Offline

`AudioManager` (`js/utils/audio-manager.js`) menangani caching audio di IndexedDB:

```javascript
// Saat audio diputar:
const audioUrl = await this.audioManager.getAudioUrl(path);
// Jika sudah ter-cache → return blob URL lokal
// Jika belum → return CDN URL + mulai download di background

// Check offline availability:
const isOffline = await this.audioManager.isCached(path);
```

Halaman "Mode Offline" di AlQuranApp menampilkan:
- Daftar surah yang sudah ter-cache
- Estimasi space yang dipakai
- Tombol hapus cache per surah
- Tombol download semua surah

---

## 11. localStorage Keys (Al-Quran)

| Key | Value | Keterangan |
|---|---|---|
| `alquran_bookmarks` | JSON array | Bookmark per-halaman |
| `alquran_verse_bookmarks` | JSON array | Bookmark per-ayat |
| `alquran_history` | JSON array (max 20) | Riwayat halaman/surah dibuka |
| `alquran_settings` | JSON settings | Font, tema, preferensi |
| `alquran_last_page` | `string` angka | Halaman terakhir (mode page) |
| `alquran_last_read` | JSON `{surahName, ayahNum, page}` | Posisi terakhir baca (mode surah) |
| `alquran_view_mode` | `'page'` atau `'surah'` | Mode terakhir digunakan |
| `islamhub_downloaded_audio` | JSON array path | Daftar audio sudah di-cache |

---

## 12. Interaksi dengan Modul Lain

**Dari AdzanApp Display Mode:**
```javascript
// Untuk stop audio quran dari display mode:
if (window.alquranApp) {
    window.alquranApp.stopMuratal(false);   // false = jangan update UI
    window.alquranApp._stopAudio();         // Stop audio per-ayat
}
```

**Dari IslamHubApp (global player control):**
```javascript
// Global player bar mengontrol quranAudioElement melalui DOM langsung
// (tidak memanggil method AlQuranApp)
quranAudioElement.paused ? quranAudioElement.play() : quranAudioElement.pause();
```

**Reset saat tab di-tap ulang:**
```javascript
// Di IslamHubApp.switchApp():
if (appName === 'alquran' && this.currentApp === 'alquran') {
    window.alquranApp.resetToHome();
}
```

---

## 13. Menambahkan Reciter Baru

1. Cari reciter identifier di `https://api.alquran.cloud/v1/edition/format/audio`
2. Di `alquran-app.js`, ubah CDN URL:
   ```javascript
   // Verse audio:
   `https://cdn.islamic.network/quran/audio/128/{reciterId}/${surahNum}_${ayahNum}.mp3`
   // Surah audio (muratal):
   `https://cdn.islamic.network/quran/audio-surah/128/{reciterId}/${surahNum}.mp3`
   ```
3. Tambah selector reciter di Settings page (jika multi-reciter diperlukan)
