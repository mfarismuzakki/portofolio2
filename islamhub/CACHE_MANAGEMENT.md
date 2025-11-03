# 🔄 Cache Management - IslamHub

## Masalah Cache

Jika pengguna mengalami masalah seperti:
- Menu Al-Quran atau fitur lain tidak muncul
- Versi lama aplikasi masih tampil
- Perubahan tidak terlihat setelah update

## Solusi

### 1. **Automatic Cache Busting** (Sudah Diimplementasikan)
- Semua file CSS dan JS menggunakan versioning (`?v=1.2.0`)
- Service Worker otomatis menghapus cache lama
- Browser dipaksa untuk fetch file terbaru

### 2. **Manual Clear Cache** (Untuk Pengguna)

#### Opsi A: Gunakan Halaman Clear Cache
Suruh pengguna buka:
```
https://mfarismuzakki.id/islamhub/clear-cache.html
```

Lalu klik tombol "Bersihkan Cache & Reload"

#### Opsi B: Hard Reload di Browser

**Chrome/Edge:**
- Windows: `Ctrl + Shift + R` atau `Ctrl + F5`
- Mac: `Cmd + Shift + R`

**Firefox:**
- Windows: `Ctrl + Shift + R` atau `Ctrl + F5`
- Mac: `Cmd + Shift + R`

**Safari:**
- Mac: `Cmd + Option + E` (hapus cache), lalu `Cmd + R`

#### Opsi C: Clear Cache Manual
1. Buka DevTools (F12)
2. Pilih tab "Application" atau "Storage"
3. Clear Storage:
   - Service Workers → Unregister
   - Cache Storage → Delete all
   - Local Storage → Clear
   - Session Storage → Clear
4. Reload halaman (Ctrl+R atau Cmd+R)

### 3. **Force Update via Service Worker**
Service Worker versi baru (`1.2.0-20251103`) akan:
- Otomatis menghapus cache lama
- Download file terbaru
- Prompt user untuk reload jika ada update

## Update Version (Untuk Developer)

Setiap kali push update, ubah version di 3 tempat:

### 1. `index.html`
```html
<link rel="stylesheet" href="css/style-modular.css?v=1.2.0">
<script type="module" src="js/app.js?v=1.2.0"></script>
<script>
  navigator.serviceWorker.register('/islamhub/sw.js?v=1.2.0', ...)
</script>
```

### 2. `sw.js`
```javascript
const CACHE_VERSION = '1.2.0-20251103'; // Update timestamp
```

### 3. `manifest.json` (optional)
```json
{
  "version": "1.2.0"
}
```

## Versioning Format

```
MAJOR.MINOR.PATCH-YYYYMMDD

Contoh: 1.2.0-20251103
- 1 = Major version (breaking changes)
- 2 = Minor version (new features)
- 0 = Patch version (bug fixes)
- 20251103 = Tanggal update (3 Nov 2025)
```

## Testing

Setelah deploy, test dengan:
1. Buka aplikasi di browser baru (incognito/private)
2. Periksa console untuk log Service Worker
3. Periksa Network tab bahwa file di-fetch dari server (bukan cache)
4. Test fitur yang baru di-update

## Tips untuk Pengguna

Bagikan link ini ke pengguna yang mengalami masalah cache:
```
https://mfarismuzakki.id/islamhub/clear-cache.html
```

Atau suruh mereka:
1. Tekan `Ctrl+Shift+R` (Windows) atau `Cmd+Shift+R` (Mac)
2. Jika masih bermasalah, buka link clear-cache di atas
