# 🎵 Panduan Fitur Audio - Dzikir & Doa IslamHub

## Fitur Audio Sequential Playlist

### Cara Menggunakan

#### 1️⃣ Play Audio dari Detail Doa
- Buka detail doa tertentu
- Klik tombol **▶️ Dengarkan Audio** di header
- Audio akan diputar untuk doa tersebut saja
- Nama doa ditampilkan di atas progress bar

#### 2️⃣ Play Audio Playlist dari Kategori
- Buka kategori doa (misal: "Dzikir Pagi")
- Klik tombol **▶️ Dengarkan Audio** di header kategori
- Sistem akan memutar **semua doa dalam kategori secara berurutan**
- Setiap doa yang sedang diputar akan ditampilkan namanya
- Format: `1. Nama Doa`, `2. Nama Doa`, dst
- Audio otomatis lanjut ke doa berikutnya setelah selesai
- Toast muncul saat semua doa selesai diputar

### Kontrol Audio Player

- **▶️ / ⏸️** : Play / Pause
- **❌** : Tutup player dan stop playback
- **Progress Bar** : Indikator waktu audio
- **Time Display** : Menampilkan current time / duration

### Fitur Otomatis

✅ Auto-advance ke doa berikutnya (playlist mode)  
✅ Skip doa jika audio tidak tersedia  
✅ Reset playlist saat ditutup  
✅ Nama doa yang sedang diputar selalu ditampilkan  
✅ Error handling untuk audio yang gagal dimuat  

## Format Audio yang Didukung

- **Format**: MP3
- **Reciter**: Mishari Rashid Al-Afasy
- **Lokasi**: `islamhub/assets/audio/dzikir/`
- **Naming**: `category-slug_doa-number.mp3`
  - Contoh: `dzikir-pagi_1.mp3`, `dzikir-pagi_2.mp3`

## Struktur File Audio

```
islamhub/assets/audio/dzikir/
├── dzikir-pagi_1.mp3
├── dzikir-pagi_2.mp3
├── dzikir-sore_1.mp3
├── doa-sehari-hari_1.mp3
└── ...
```

## Download Audio

Lihat dokumentasi lengkap di:
- `islamhub/assets/audio/README.md` - Struktur dan format
- `islamhub/assets/audio/MISHARI_ALAFASY_LINKS.md` - Links YouTube & playlists
- `islamhub/assets/audio/PLAYLIST.md` - Curated collection dengan timestamps
- `islamhub/assets/audio/download-audio-helper.sh` - Script otomatis download

## Tips

💡 **Mode Playlist** sangat berguna untuk:
- Mengikuti dzikir pagi/sore secara lengkap
- Belajar bacaan doa dengan audio berkualitas
- Mendengarkan koleksi doa tanpa perlu klik berulang

💡 **Mode Single Doa** cocok untuk:
- Fokus pada satu doa tertentu
- Mengulang-ulang bacaan yang belum hafal
- Verifikasi makhraj dan tajwid

## Update Log

**Versi 1.0** (2025-01-26)
- ✅ Audio player dengan kontrol lengkap
- ✅ Sequential playlist mode untuk kategori
- ✅ Display nama doa yang sedang diputar
- ✅ Auto-advance antar doa
- ✅ Error handling dan skip otomatis
- ✅ Dokumentasi audio lengkap
