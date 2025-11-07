# Audio Al-Quran untuk IslamHub Mobile

## Struktur Folder

```
assets/audio/alquran/
├── pages/          # Audio per halaman (001.mp3 - 604.mp3)
└── verses/         # Audio per ayat (surah-ayat format)
```

## Audio Per Halaman (Pages)

Format: `001.mp3`, `002.mp3`, ..., `604.mp3`
- 604 file audio (halaman 1-604)
- Qari: Mishary Rashid Alafasy
- Sumber: [everyayah.com](https://everyayah.com)

Download URL pattern:
```
https://everyayah.com/data/Alafasy_128kbps/PageXXX.mp3
```

Contoh:
- Halaman 1: `https://everyayah.com/data/Alafasy_128kbps/Page001.mp3`
- Halaman 50: `https://everyayah.com/data/Alafasy_128kbps/Page050.mp3`

## Audio Per Ayat (Verses)

Format: `001001.mp3` (Surah-Ayat)
- Qari: Mishary Rashid Alafasy
- Sumber: [everyayah.com](https://everyayah.com)

Download URL pattern:
```
https://everyayah.com/data/Alafasy_128kbps/SSSAAA.mp3
```

Contoh:
- Al-Fatihah ayat 1: `001001.mp3` = `https://everyayah.com/data/Alafasy_128kbps/001001.mp3`
- Al-Baqarah ayat 255: `002255.mp3` = `https://everyayah.com/data/Alafasy_128kbps/002255.mp3`

## Download Script

Untuk download semua audio (opsional):

```bash
# Download audio per halaman (604 files, ~2.5GB)
cd www/assets/audio/alquran/pages
for i in {1..604}; do
  page=$(printf "%03d" $i)
  wget "https://everyayah.com/data/Alafasy_128kbps/Page${page}.mp3" -O "${page}.mp3"
done

# Download audio per ayat (~6236 files, ~4GB)
cd ../verses
# Script untuk download per ayat bisa dibuat sesuai kebutuhan
```

## Catatan Penting

1. **Audio tidak included dalam repo** karena ukurannya besar (~6.5GB total)
2. **Audio di-download on-demand** saat user memutar
3. **Audio di-cache** oleh service worker setelah di-download
4. **Offline mode** tersedia setelah audio di-cache

## Fallback

Jika audio lokal tidak tersedia, aplikasi akan:
1. Coba load dari cache
2. Jika tidak ada, download dari CDN (everyayah.com)
3. Cache untuk penggunaan selanjutnya

## Ukuran File

- Audio per halaman: ~4-5MB per file × 604 = ~2.5GB total
- Audio per ayat: ~600KB per file × 6236 = ~4GB total
- **Total jika semua didownload: ~6.5GB**

## Rekomendasi

Untuk mobile app:
- ✅ Audio per ayat: Included (lebih fleksibel)
- ⚠️ Audio per halaman: On-demand download (opsional)
- 💾 Cache management: Otomatis via service worker
