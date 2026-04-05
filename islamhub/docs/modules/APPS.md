# IslamHub — Modul Aplikasi (Dzikir, Sholat, Waris, Qibla, Sirah)

---

## 1. Dzikir & Doa

**File**: `js/apps/dzikir/dzikir-app.js`  
**Data**: `js/data/dzikir/doa-collection.js` (global `doaCategories`)  
**Global instance**: `window.dzikirApp`

### 1.1 State

```javascript
constructor(globalState, mainApp) {
    this.audioManager = new AudioManager(); // Caching audio IndexedDB
    this.categories = [];                   // Dari doaCategories global
    this.favorites = [];                    // ID doa favorit (dari localStorage)
    this.currentFilter = 'semua';           // Filter tab aktif
    this.searchQuery = '';
    this.currentPlaylist = [];              // Daftar doa untuk playlist
    this.currentPlaylistIdx = 0;
    this.tasbihCount = 0;                   // Counter tasbih
    this.tasbihTarget = 33;                 // Target default
}
```

### 1.2 Struktur Data Doa

```javascript
// doaCategories (global dari doa-collection.js)
[
    {
        id: 'pagi',
        name: 'Dzikir Pagi',
        icon: 'fa-sun',
        doas: [
            {
                id: 'doa_001',
                title: 'Doa Membaca Bismillah',
                arabic: 'بِسْمِ اللَّهِ',
                transliteration: 'Bismillāh',
                translation: 'Dengan nama Allah...',
                reference: 'HR. Tirmidzi no. 3381',
                audio: '/dzikir/doa_001.mp3',  // Relative ke AudioManager baseUrl
                count: 1,       // Berapa kali dianjurkan dibaca
            }
        ]
    },
    ...
]
```

### 1.3 Filter & Kategori

| Filter key | Tampilkan |
|---|---|
| `semua` | Semua doa |
| `pagi` | Dzikir Pagi |
| `sore` | Dzikir Sore |
| `harian` | Doa Harian |
| `khusus` | Doa Khusus |
| `favorit` | Doa yang dilabel favorit user |

**Rekomendasi berbasis waktu:**  
Saat `currentFilter = 'semua'`, tampilkan banner rekomendasi:
- 04:00–07:00 → "Waktunya Dzikir Pagi"
- 15:00–17:00 → "Waktunya Dzikir Sore"

### 1.4 Doa Modal

Klik doa → modal terbuka dengan:
```
[Judul Doa]
[Teks Arab − font besar]
[Transliterasi latin]
[Terjemahan Indonesia]
[Referensi hadits/quran]
─────────────────────
[▶ Play]  [♥ Favorit]  [📋 Copy]  [🔁 Playlist]
```

### 1.5 Audio Playback

```javascript
async playDoa(doa) {
    const url = await this.audioManager.getAudioUrl(doa.audio);
    // getAudioUrl() return: blob URL jika cached, else CDN URL + background cache
    const audio = new Audio(url);
    audio.play();
}
```

### 1.6 Tasbih Counter

Komponen counter digital sederhana:
- Tap area → `this.tasbihCount++`
- Reset → `this.tasbihCount = 0`
- Progress bar menuju target
- Target bisa diset: 33, 99, atau custom
- Haptic feedback via `window.islamHub.triggerHaptic()`

### 1.7 Playlist

```javascript
addToPlaylist(doa) {
    this.currentPlaylist.push(doa);
}

playPlaylist() {
    // Mainkan doa berurutan
    this._playPlaylistItem(0);
}

_playPlaylistItem(idx) {
    const doa = this.currentPlaylist[idx];
    audio.onended = () => {
        if (idx + 1 < this.currentPlaylist.length) {
            this._playPlaylistItem(idx + 1);
        }
    };
}
```

---

## 2. Panduan Sholat

**File**: `js/apps/sholat/sholat-app.js`  
**Data**: Lazy-loaded `sholat-data.js`, `bacaan-sholat.js`, `sunnah-sholat.js`  
**Global instance**: `window.sholatApp`

### 2.1 Tabs & Struktur

```
SholatApp
├── Tab: Rukun Sholat   ← sholat-data.js (rukunData)
├── Tab: Syarat Sholat  ← sholat-data.js (syaratData) 
├── Tab: Bacaan Sholat  ← bacaan-sholat.js (bacaanData)
├── Tab: Sunnah Sholat  ← sunnah-sholat.js (sunnahData)
└── Tab: Favorit        ← item yang di-bookmark user
```

### 2.2 Lazy Loading Data

```javascript
async loadData() {
    const [sholat, bacaan, sunnah] = await Promise.all([
        import('../../data/sholat/sholat-data.js'),
        import('../../data/sholat/bacaan-sholat.js'),
        import('../../data/sholat/sunnah-sholat.js'),
    ]);
    this.rukunData   = sholat.rukunData;
    this.syaratData  = sholat.syaratData;
    this.bacaanData  = bacaan.bacaanData;
    this.sunnahData  = sunnah.sunnahData;
}
```

### 2.3 Item Display

Setiap item menampilkan:
- Nama (Indonesia)
- Teks Arab (jika ada)
- Transliterasi latin (jika ada)
- Keterangan/penjelasan
- Referensi dalil
- Tombol favorit

### 2.4 Search & Filter

```javascript
filterContent(query, type = null) {
    return this.activeTabData.filter(item =>
        item.name.toLowerCase().includes(query) ||
        item.description?.toLowerCase().includes(query) ||
        item.latin?.toLowerCase().includes(query)
    ).filter(item => type ? item.type === type : true);
}
```

---

## 3. Kalkulator Waris

**File**: `js/apps/kalkulator/waris-app.js`  
**Data**: Semua inline di file JS (tirkah, dalil, contoh kasus)  
**Global instance**: `window.warisApp`  
**HTML**: Sebagian besar struktur HTML sudah ada di `index.html` (statis)

### 3.1 State

```javascript
constructor() {
    this.tirkah = {
        total: 0,       // Total harta
        funeral: 0,     // Biaya penguburan
        debt: 0,        // Hutang
        wasiat: 0,       // Wasiat (maks 1/3 harta bersih)
    };
    this.heirs = {
        suami: 0,       // 0 = tidak ada, 1 = ada
        istri: 0,       // 0-4 (jumlah istri)
        father: 0,
        mother: 0,
        son: 0,
        daughter: 0,
        // ... lebih banyak ahli waris
    };
    this.results = null;        // Hasil kalkulasi
    this.favorites = [];        // Tersimpan dari localStorage
    this.currentStep = 1;       // Wizard step 1/2/3
    this.currentExample = null; // Contoh kasus aktif
}
```

### 3.2 Wizard Steps

**Step 1: Tirkah (Harta Peninggalan)**
```
[ Total Harta ] → input angka (rupiah)
[ Biaya Penguburan ] → input angka  
[ Hutang ] → input angka
[ Wasiat ] → input angka (dibatasi max 1/3 sisa)
─────────
Harta bersih = Total - Biaya - Hutang - Wasiat
[Lanjut →]
```

**Step 2: Ahli Waris**
```
Suami/Istri: toggle + jumlah istri
Ayah, Ibu: toggle
Anak Laki / Perempuan: counter angka
Saudara laki/perempuan: counter
Kakek, Nenek, dst.
─────────
[← Kembali] [Hitung →]
```

**Step 3: Hasil Kalkulasi**
```
Harta bersih: Rp xxx.xxx.xxx

[Nama Ahli Waris] | [Bagian Fraksi] | [Dalil] | [Nominal Rp]
─ Suami            │   1/2           │  QS...  │  Rp xxx
─ Ibu              │   1/6           │  QS...  │  Rp xxx
─ Anak Laki (3)    │   Asabah        │  Ijma'  │  Rp xxx (masing-masing)

[Info Awl/Radd jika berlaku]
[💾 Simpan] [🖨️ Cetak/Share]
```

### 3.3 Metode Kalkulasi

**Normal case:** Sum semua bagian = 1/1, bagian = fraksi × harta bersih

**Awl (Kekurangan):** Jika total bagian > harta (sum numerator > denominator)
```
Contoh: Suami (1/2) + 2 Saudari (2/3) = 3/6 + 4/6 = 7/6 > 1
→ Scale down proportionally: masing-masing bagian × (6/7)
```

**Radd (Kelebihan):** Jika total bagian < harta (ada sisa)
```
Sisa dikembalikan proporsional ke ahli waris dzawil furudh
(kecuali ada suami/istri = mereka tidak dapat Radd)
```

**Asabah:** Sisa setelah dzawil furudh dibagi ke asabah (umumnya anak laki)

### 3.4 Contoh Kasus Preset

| Nama | Kasus |
|---|---|
| Umariyah | Suami + Ibu + Ayah (1/6 masing-masing Awl) |
| Awl | Kasus yang memerlukan pengurangan proporsional |
| Radd | Kasus yang memerlukan penambahan (sisa dikembalikan) |
| Asabah | Hanya asabah (anak laki), tanpa dzawil furudh |

### 3.5 Simpan ke Favorit

```json
localStorage['warisFavorites'] = [
    {
        id: "timestamp",
        label: "Nama Kasus",
        tirkah: {...},
        heirs: {...},
        results: {...}
    }
]
```

---

## 4. Penunjuk Arah Kiblat

**File**: `js/apps/qibla/qibla-app.js`  
**Global instance**: `window.qiblaApp`

### 4.1 State

```javascript
constructor() {
    this.KAABA = { lat: 21.4225, lon: 39.8262 };  // Koordinat Ka'bah
    this.userLat = null;
    this.userLon = null;
    this.qiblaAngle = null;       // Arah kiblat relatif North (0-360°)
    this.compassHeading = 0;      // Heading kompas device (0-360°)
    this.smoothedHeading = 0;     // Heading setelah smoothing filter
    this.alpha = 0.8;             // Smoothing factor (high = lebih halus tapi lambat)
    this.permissionGranted = false;
    this.locationGranted = false;
}
```

### 4.2 Kalkulasi Arah Kiblat

```javascript
calculateQiblaAngle(userLat, userLon) {
    const lat1 = userLat * Math.PI / 180;
    const lat2 = this.KAABA.lat * Math.PI / 180;
    const dLon = (this.KAABA.lon - userLon) * Math.PI / 180;
    
    const y = Math.sin(dLon) * Math.cos(lat2);
    const x = Math.cos(lat1) * Math.sin(lat2) - 
               Math.sin(lat1) * Math.cos(lat2) * Math.cos(dLon);
    
    const bearing = Math.atan2(y, x) * 180 / Math.PI;
    return (bearing + 360) % 360;  // Normalize ke 0-360°
}
```

### 4.3 Kompas Rotation

```javascript
handleDeviceOrientation(event) {
    let heading;
    
    // iOS: event.webkitCompassHeading (sudah true north, tidak perlu alpha)
    if (event.webkitCompassHeading !== undefined) {
        heading = event.webkitCompassHeading;
    } else if (event.absolute) {
        heading = 360 - event.alpha;    // Android absolute mode
    } else {
        heading = 360 - event.alpha;    // Android fallback
    }
    
    // Smoothing filter (exponential moving average)
    this.smoothedHeading = this.alpha * this.smoothedHeading + (1 - this.alpha) * heading;
    
    // Putar jarum kompas
    const needleAngle = (this.qiblaAngle - this.smoothedHeading + 360) % 360;
    document.querySelector('.qibla-needle').style.transform = `rotate(${needleAngle}deg)`;
    
    // Haptic feedback saat jarum mendekati kiblat (±5°)
    if (Math.abs(needleAngle) < 5 || Math.abs(needleAngle - 360) < 5) {
        window.islamHub?.triggerHaptic();
    }
}
```

### 4.4 Permission Flow

```
init()
  │
  ├── GPS: navigator.geolocation.getCurrentPosition()
  │   └── Sukses → calculateQiblaAngle()
  │       └── Tampilkan "Kiblat: XXX° dari Utara"
  │
  └── Kompas: deviceorientationabsolute (preferred) → deviceorientation
      └── iOS: requestPermission() dulu (DeviceOrientationEvent.requestPermission())
```

### 4.5 UI Kompas

```html
<div class="qibla-compass">
  <div class="compass-rose">         <!-- Gambar kompas N/S/E/W -->
    <div class="compass-needle-wrapper">
      <div class="qibla-needle">    <!-- Jarum yang berputar menuju kiblat -->
        <div class="needle-north" />
        <div class="needle-south" />
      </div>
    </div>
  </div>
  <div class="qibla-degree-display">{N}°</div>
  <div class="qibla-location-name">{Kota, Negara}</div>
</div>
```

---

## 5. Panduan Sirah

**File**: `js/apps/sirah/sirah-app.js`  
**Data**: 11 file JS lazy-loaded  
**Global instance**: `window.sirahApp`

### 5.1 Sumber Data (11 File)

```javascript
async loadData() {
    const parts = await Promise.all([
        import('../../data/sirah/nabi-part1.js'),    // nabiPart1Data
        import('../../data/sirah/nabi-part2.js'),    // nabiPart2Data
        import('../../data/sirah/nabi-part3.js'),    // nabiPart3Data
        import('../../data/sirah/nabi-part4.js'),    // nabiPart4Data
        import('../../data/sirah/nabi-part5.js'),    // nabiPart5Data
        import('../../data/sirah/nabi-database.js'), // nabiDatabase
        import('../../data/sirah/sahabat-khulafa.js'),
        import('../../data/sirah/sahabat-asharah.js'),     // Asharah Mubasysyarah
        import('../../data/sirah/sahabat-muhajirin-anshar.js'),
        import('../../data/sirah/sahabat-terkenal.js'),
        import('../../data/sirah/sahabiyat.js'),           // Sahabiyat (wanita)
    ]);
    
    // Gabungkan semua data ke satu array
    this.allData = parts.flatMap(module => Object.values(module)[0]);
}
```

### 5.2 Struktur Data Sirah

```javascript
{
    id: 'nabi_001',
    name: 'Muhammad SAW',
    arabicName: 'محمد صلى الله عليه وسلم',
    category: 'nabi',           // 'nabi' | 'sahabat'
    subcategory: 'rasul',       // 'rasul' | 'khulafa' | 'asharah' | dll
    thumbnail: 'assets/images/sirah/nabi.jpg',
    biodata: {
        lahir: '570 M',
        wafat: '632 M',
        asal: 'Makkah',
        nasab: 'Muhammad bin Abdullah bin Abdul Muthallib...',
        laqab: 'Al-Amin',
    },
    events: [
        {
            year: 610,
            title: 'Turunnya Wahyu Pertama',
            description: '...',
            reference: 'HR. Bukhari no. 3',
        }
    ],
    hikmah: [
        'Sabar dalam menghadapi cobaan...',
    ],
    references: [
        { title: 'Sirah Nabawiyyah - Ibnu Hisyam', page: '...' }
    ]
}
```

### 5.3 Filter System

| Filter | Kategori | Tampilkan |
|---|---|---|
| `semua` | Semua | Semua tokoh |
| `nabi` | Nabi & Rasul | `category === 'nabi'` |
| `sahabat` | Sahabat | `category === 'sahabat'` |
| `favorit` | Favorit | ID ada di `localStorage['sirahFavorites']` |

```javascript
getFilteredData(filter, search) {
    let data = this.allData;
    
    if (filter !== 'semua') {
        if (filter === 'favorit') {
            data = data.filter(item => this.favorites.includes(item.id));
        } else {
            data = data.filter(item => item.category === filter);
        }
    }
    
    if (search) {
        data = data.filter(item =>
            item.name.toLowerCase().includes(search) ||
            item.arabicName?.includes(search)
        );
    }
    
    return data;
}
```

### 5.4 Detail Modal — 4 Tabs

```
[Biodata] [Peristiwa] [Hikmah] [Referensi]
─────────────────────────────────────────
Biodata:
  Nama Arab, lahir, wafat, asal, nasab, laqab

Peristiwa:
  Timeline kronologis event penting
  (tahun - judul - deskripsi - referensi)

Hikmah:
  Pelajaran dan hikmah dari kisah tokoh

Referensi:
  Sumber kitab/hadits
─────────────────────────────────────────
[📋 Salin] [♥ Favorit] [📤 Bagikan]
```

### 5.5 Interaksi Setelah Inisialisasi

**Reset ke main page** saat tab Sirah di-tap ulang:
```javascript
// Di IslamHubApp.switchApp():
if (appName === 'sirah' && this.currentApp === 'sirah') {
    window.sirahApp.resetToMainPage();  // Kembali ke daftar, tutup modal
}
```

---

## 6. Modal & Shared UI Patterns

Pola yang digunakan di semua "modul kecil":

### Modal buka/tutup
```javascript
openModal(item) {
    const modal = this.container.querySelector('.item-modal');
    modal.innerHTML = this._buildModalContent(item);
    modal.classList.add('active');
    
    // Tutup via klik backdrop atau tombol X
    modal.addEventListener('click', (e) => {
        if (e.target === modal) this.closeModal();
    });
}

closeModal() {
    this.container.querySelector('.item-modal').classList.remove('active');
}
```

### Copy to clipboard
```javascript
copyToClipboard(text) {
    navigator.clipboard?.writeText(text)
        ?? this._fallbackCopy(text);       // Fallback: execCommand (deprecated)
    this.showToast('Disalin!');
}
```

### Share
```javascript
shareItem(title, text) {
    if (navigator.share) {
        navigator.share({ title, text, url: window.location.href });
    } else {
        this.copyToClipboard(text);
    }
}
```

### Toast notification
```javascript
showToast(message, duration = 2000) {
    const toast = document.createElement('div');
    toast.className = 'islamhub-toast';
    toast.textContent = message;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), duration);
}
```
