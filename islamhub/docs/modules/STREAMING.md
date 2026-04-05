# IslamHub — Modul Streaming Kajian

---

## 1. Gambaran Umum

`StreamingApp` adalah modul untuk mendengarkan radio streaming Islam dan menonton kajian video. Menyediakan:
- **Radio streaming** (audio): 2 stasiun dengan retry/reconnect otomatis
- **Video streaming**: 3 channel YouTube kajian + 2 Live Haramain (Makkah & Madinah)
- **Retry system**: Exponential backoff dengan cache-busting pada URL
- **Cross-page audio**: Radio terus berbunyi saat user berpindah ke app lain

**File**: `js/apps/streaming/streaming-app.js`  
**Global instance**: `window.streamingApp`  
**Audio element**: `#radioPlayer` (persistent di `#bottom-dock`)

---

## 2. Constructor & State

```javascript
constructor() {  // Tidak menerima globalState (standalone)
    this.currentStream = null;      // Index stasiun yang aktif (0, 1, ...) atau null
    this.retryCount = 0;
    this.maxRetries = 8;
    this.retryBaseDelay = 3000;     // ms (dasar untuk exponential backoff)
    this.isRetrying = false;
    this.retryTimer = null;
    this.stalledTimer = null;
    this.waitingTimer = null;
    this.radioStations = [...];     // Array stasiun radio
    this.liveHaramain = [...];      // Array live stream Haramain
    this.videoChannels = [...];     // Array channel video
}
```

---

## 3. Daftar Stasiun & Channel

### 3.1 Radio Stations (`this.radioStations`)

```javascript
[
    {
        name: 'Radio Rodja',
        description: 'Kajian Ahlus Sunnah',
        url: 'https://streaming.radiorodja.com/rodja-low.mp3',
        icon: 'fa-broadcast-tower',
    },
    {
        name: 'Radio Tarbiyyah',
        description: 'Kajian Islami Tarbiyyah',
        url: 'https://streaming.radiotarbiyah.com/tarbiyah.mp3',
        icon: 'fa-broadcast-tower',
    },
]
```

### 3.2 Live Haramain (`this.liveHaramain`)

```javascript
[
    {
        name: 'Live Makkah',
        url: 'https://www.youtube.com/embed/{videoId}?autoplay=1&rel=0',
        thumbnail: 'assets/images/makkah-thumb.jpg',
    },
    {
        name: 'Live Madinah',
        url: 'https://www.youtube.com/embed/{videoId}?autoplay=1&rel=0',
        thumbnail: 'assets/images/madinah-thumb.jpg',
    },
]
```

### 3.3 Video Channels (`this.videoChannels`)

```javascript
[
    {
        name: 'Khalid Basalamah TV',
        url: 'https://www.youtube.com/embed/live_stream?channel={channelId}&autoplay=1',
        description: 'Ustadz Khalid Basalamah',
    },
    {
        name: 'Syafiq Riza Basalamah TV',
        url: '...',
        description: 'Ustadz Syafiq Riza Basalamah',
    },
    {
        name: 'Rodja TV',
        url: '...',
        description: 'TV Ahlus Sunnah',
    },
]
```

---

## 4. Radio Streaming

### 4.1 `startRadio(idx, station, radioPlayer, btnRadio, radioStatus)`

```javascript
startRadio(idx, station, radioPlayer, btnRadio = null, radioStatus = null) {
    // 1. Reset retry state
    this.resetRetryState();
    
    // 2. Update UI (null-safe — bisa NULL jika dipanggil dari Display Mode)
    if (btnRadio) btnRadio.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
    if (radioStatus) radioStatus.textContent = 'Menghubungkan...';
    
    // 3. Set stream state sebelum play (penting untuk _globalPlayerUpdate)
    this.currentStream = idx;
    
    // 4. Setup audio source
    radioPlayer.pause();
    radioPlayer.src = station.url;
    radioPlayer.load();
    
    // 5. Attach event handlers (sekali saja, via flag)
    if (!radioPlayer._streamingHandlersAttached) {
        this._attachStreamingHandlers(radioPlayer, btnRadio, radioStatus);
        radioPlayer._streamingHandlersAttached = true;
    }
    
    // 6. Play
    radioPlayer.play().catch(err => this.scheduleRetry('play-error'));
    
    // 7. Trigger global player update
    if (window.islamHub) window.islamHub._globalPlayerUpdate();
}
```

**Penting: Null-safe untuk Display Mode calls**

Saat `startRadio()` dipanggil dari `AdzanApp._dmToggleRadio()`, parameter `btnRadio` dan `radioStatus` adalah `null` (tombol ada di panel DM, bukan di page Kajian). Setiap akses ke parameter ini harus diawali dengan `if (btnRadio)` / `if (radioStatus)`.

### 4.2 `stopRadio(idx)`

```javascript
stopRadio(idx) {
    const radioPlayer = document.getElementById('radioPlayer');
    radioPlayer.pause();
    radioPlayer.src = '';
    
    this.currentStream = null;
    this.resetRetryState();
    
    // Update global player (akan menyembunyikan player bar)
    if (window.islamHub) window.islamHub._globalPlayerUpdate();
}
```

---

## 5. Retry & Reconnect System

### 5.1 Exponential Backoff

```javascript
scheduleRetry(reason) {
    if (this.retryCount >= this.maxRetries) {
        this._showErrorState(`Gagal terhubung setelah ${this.maxRetries} percobaan`);
        this.currentStream = null;
        return;
    }
    
    const delay = Math.min(
        this.retryBaseDelay * Math.pow(2, this.retryCount),  // Exponential
        30000   // Max 30 detik
    );
    this.retryCount++;
    this.isRetrying = true;
    
    this.retryTimer = setTimeout(() => this.retryStream(), delay);
}
```

Tabel delay retry:
| Percobaan ke- | Delay (ms) | Delay (detik) |
|---|---|---|
| 1 | 3,000 | 3s |
| 2 | 6,000 | 6s |
| 3 | 12,000 | 12s |
| 4 | 24,000 | 24s |
| 5+ | 30,000 | 30s (max) |
| 8 | — | Berhenti |

### 5.2 `retryStream()`

```javascript
retryStream() {
    if (this.currentStream === null) return;  // Sudah di-stop user
    
    const stationUrl = this.radioStations[this.currentStream].url;
    const radioPlayer = document.getElementById('radioPlayer');
    
    // Cache-busting (paksa server tidak return cached 304)
    const bustUrl = `${stationUrl}?_t=${Date.now()}`;
    
    // Full reset cycle: pause → src='' → load → src=newUrl → load → play
    radioPlayer.pause();
    radioPlayer.src = '';
    radioPlayer.load();        // Flush buffer
    
    setTimeout(() => {
        radioPlayer.src = bustUrl;
        radioPlayer.load();
        radioPlayer.play().catch(e => this.scheduleRetry('retry-play-error'));
    }, 100);
}
```

### 5.3 Event Triggers ke Retry

Event-event yang bisa memicu `scheduleRetry()`:

| Event | Grace period | Alasan |
|---|---|---|
| `error` | Langsung | URL error, CORS, network error |
| `stalled` | 8 detik | Browser stuck ambil data |
| `waiting` | 10 detik | Buffer underrun |
| `ended` | Langsung | Stream habis (live stream tidak boleh `ended`) |

```javascript
radioPlayer.addEventListener('stalled', () => {
    this.stalledTimer = setTimeout(() => this.scheduleRetry('stalled'), 8000);
});

radioPlayer.addEventListener('playing', () => {
    // Stream berhasil → reset semua counters
    clearTimeout(this.stalledTimer);
    clearTimeout(this.waitingTimer);
    this.resetRetryState();
    this._showPlayingState();
});
```

### 5.4 Offline → Online Reconnect

```javascript
reconnectOnOnline() {
    const handler = () => {
        if (this.currentStream !== null) {
            this.retryStream();         // Langsung coba reconnect
        }
        window.removeEventListener('online', handler);  // One-time
    };
    window.addEventListener('online', handler);
}
```

---

## 6. Signal Status UI

`updateSignalStatus(status)` memperbarui elemen `#radioSignalIndicator` di halaman Kajian:

| Status | Teks | Warna |
|---|---|---|
| `connecting` | Menghubungkan... | Abu-abu |
| `playing` | Siaran Langsung ● | Hijau blink |
| `retrying` | Mencoba ulang... | Kuning |
| `error` | Gagal terhubung | Merah |
| `stopped` | (kosong) | — |

---

## 7. Video Streaming

### 7.1 Membuka Video

```javascript
openVideoStream(url, name) {
    const modal = document.getElementById('videoModal');
    const iframe = document.getElementById('videoIframe');
    
    iframe.src = url;     // YouTube embed URL dengan autoplay=1
    modal.querySelector('.video-title').textContent = name;
    modal.style.display = 'flex';
    
    // Lock orientation landscape (jika Capacitor)
    if (window.islamHub?.isNative) {
        Capacitor.Plugins.ScreenOrientation?.lock({ orientation: 'landscape' });
    }
}
```

### 7.2 Menutup Video

```javascript
closeVideoStream() {
    const modal = document.getElementById('videoModal');
    const iframe = document.getElementById('videoIframe');
    
    iframe.src = '';      // Stop video (remove src = halt playback)
    modal.style.display = 'none';
    
    // Unlock orientation
    if (window.islamHub?.isNative) {
        Capacitor.Plugins.ScreenOrientation?.unlock();
    }
}
```

### 7.3 Video Modal DOM

```html
<div id="videoModal" class="video-modal" style="display:none">
  <div class="video-modal-header">
    <span class="video-title">Kajian Live</span>
    <button class="video-close">✕</button>
  </div>
  <div class="video-embed-wrapper">
    <iframe id="videoIframe" 
      allow="autoplay; fullscreen" 
      allowfullscreen />
  </div>
</div>
```

---

## 8. `destroy()` — Lifecycle

```javascript
destroy() {
    // Bersihkan timer
    this.resetRetryState();         // Clear retryTimer, stalledTimer, waitingTimer
    
    // TIDAK stop audio — radio harus terus berbunyi saat navigasi ke app lain
    // Audio dikontrol oleh IslamHubApp._globalPlayerUpdate()
}
```

---

## 9. Guard: Duplicate Event Handlers

Event handlers pada `radioPlayer` hanya boleh dipasang sekali, karena `StreamingApp.destroy()` tidak menghapus mereka (design intent: handlers harus tetap aktif untuk retry across navigation).

```javascript
if (!radioPlayer._streamingHandlersAttached) {
    this._attachStreamingHandlers(radioPlayer, btnRadio, radioStatus);
    radioPlayer._streamingHandlersAttached = true;
}
```

Flag `_streamingHandlersAttached` adalah custom property langsung di DOM element.

---

## 10. Menambah Stasiun Radio Baru

1. Tambah entry di array `this.radioStations` di constructor:
   ```javascript
   {
       name: 'Radio Baru',
       description: 'Deskripsi singkat',
       url: 'https://streaming.radiobaru.com/stream.mp3',
       icon: 'fa-broadcast-tower',
   }
   ```
2. Re-render halaman streaming via `this.render()` (atau reload static HTML)
3. Tidak ada perubahan lain yang diperlukan — loop render otomatis menggunakan panjang array

**Penting untuk URL:**
- Harus HTTPS (tidak boleh HTTP di web)
- Harus MP3/HLS stream (bukan playlist M3U8 multi-bitrate — kecuali ditambahkan HLS.js)
- Pastikan CORS headers tersedia dari server stream

---

## 11. Menambah Channel Video

1. Tambah entry di `this.videoChannels` atau `this.liveHaramain`
2. URL harus berformat YouTube embed: `https://www.youtube.com/embed/{videoId}?autoplay=1&rel=0`
3. Untuk live channel: gunakan `live_stream?channel={channelId}` atau video ID statis yang selalu live

---

## 12. Troubleshooting

| Masalah | Kemungkinan Penyebab | Solusi |
|---|---|---|
| Radio langsung error | URL stream salah/mati | Cek URL manual di browser |
| Radio tersambung tapi tidak ada suara | AutoPlay policy browser | Pastikan user tap tombol play (bukan autoplay) |
| Radio crash di Display Mode | Null access pada btnRadio | Pastikan semua akses ke `btnRadio` ada null guard `if (btnRadio)` |
| Retry looping terus-menerus | Jaringan intermittent | Normal behavior, berhenti sendiri setelah 8 kali |
| Video iframe tidak muncul | YouTube embed blocked | Cek X-Frame-Options atau gunakan URL embed resmi |
