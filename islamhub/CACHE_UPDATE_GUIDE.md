# IslamHub - Cache Update System Guide

## Overview
Sistem manajemen cache yang terintegrasi dengan homepage untuk memastikan user selalu mendapatkan versi terbaru dari aplikasi.

## Fitur

### 1. Automatic Update Detection
- Sistem otomatis mendeteksi versi baru saat aplikasi dimuat
- Membandingkan versi di localStorage dengan versi aplikasi saat ini (1.2.0)
- Menampilkan notifikasi popup jika ada update

### 2. Update Notification Popup
- Muncul di bagian atas halaman dengan animasi slide-down
- Berisi informasi:
  - Icon loading dengan animasi spin
  - Judul: "Update Tersedia!"
  - Pesan: informasi tentang fitur baru
  - 2 tombol aksi:
    - **Update Sekarang**: Clear cache dan reload
    - **Nanti Saja**: Tutup notifikasi

### 3. Manual Clear Cache Button
- Tersedia di footer aplikasi
- Berguna untuk troubleshooting atau force refresh
- Proses:
  1. Unregister semua service workers
  2. Hapus semua cache storage
  3. Clear localStorage (kecuali settings & location)
  4. Clear sessionStorage
  5. Clear IndexedDB (jika ada)
  6. Reload halaman

## Implementasi

### File yang Dimodifikasi

1. **index.html**
   - Tambahkan HTML untuk update notification popup
   - Tambahkan clear cache button di footer
   - Versioning CSS/JS dengan ?v=1.2.0

2. **css/components/footer.css**
   - Styling untuk clear cache button
   - Styling untuk update notification popup
   - Animasi dan responsive design

3. **js/app.js**
   - Method `setupCacheManagement()` - Setup event listeners
   - Method `checkForUpdates()` - Deteksi versi baru
   - Method `clearAllCache()` - Hapus semua cache
   - Method `showUpdateNotification()` - Tampilkan popup
   - Method `hideUpdateNotification()` - Sembunyikan popup
   - Method `showCacheLoadingOverlay()` - Loading overlay

4. **sw.js**
   - Version: 1.2.0-20251103
   - Aggressive cache clearing strategy

## Cara Kerja

### Flow Update Detection:
```
1. User buka app
2. app.js init()
3. setupCacheManagement() dipanggil
4. checkForUpdates() cek localStorage
5. Jika versi berbeda → showUpdateNotification()
6. User klik "Update Sekarang" → clearAllCache()
7. Page reload dengan versi baru
8. Version disimpan ke localStorage
```

### Flow Manual Clear Cache:
```
1. User klik button "Clear Cache" di footer
2. clearAllCache() dijalankan
3. Loading overlay muncul
4. Hapus service workers, caches, storage
5. Tampilkan success message
6. Auto reload setelah 1.5 detik
```

## Version Management

### Current Version: 1.2.0

**Update version di:**
1. `js/app.js` - Constant `APP_VERSION` = '1.2.0'
2. `sw.js` - Constant `CACHE_VERSION` = '1.2.0-20251103'
3. `index.html` - Query params CSS/JS `?v=1.2.0`

### Version Format:
- App: `1.2.0` (Semantic Versioning)
- Service Worker: `1.2.0-20251103` (Version + Timestamp)

## User Experience

### Update Notification
- Non-intrusive: muncul di top, tidak block content
- Clear call-to-action
- Bisa ditunda jika user sedang membaca
- Auto-dismiss dengan "Nanti Saja"

### Clear Cache Process
- Loading indicator yang jelas
- Success message sebelum reload
- Preserve user settings (location, preferences)
- Seamless reload experience

## Testing

### Test Update Flow:
1. Set `APP_VERSION` ke versi berbeda di app.js
2. Load app → Notifikasi muncul
3. Klik "Update Sekarang" → Cache cleared & reload
4. Load lagi → Tidak ada notifikasi (versi sama)

### Test Manual Clear:
1. Klik button "Clear Cache" di footer
2. Verify loading overlay muncul
3. Verify cache dihapus (DevTools → Application → Cache Storage)
4. Verify service worker unregistered
5. Verify page reload

## Cara Update untuk Developer

### Step-by-Step:
1. **Update kode** (CSS, JS, HTML, data, dll)

2. **Increment version numbers:**
   ```javascript
   // sw.js
   const CACHE_VERSION = '1.2.1-20251104'; // Update version & tanggal
   
   // app.js
   const APP_VERSION = '1.2.1';
   ```

3. **Update query parameters:**
   ```html
   <!-- index.html -->
   <link rel="stylesheet" href="css/style-modular.css?v=1.2.1">
   <script type="module" src="js/app.js?v=1.2.1"></script>
   ```

4. **Commit dan push ke server**

5. **Inform users** via social media atau dalam update notification message

## Troubleshooting

### Notifikasi Tidak Muncul
- Cek localStorage `islamhub_app_version`
- Cek console untuk error
- Verify `setupCacheManagement()` dipanggil di init()

### Clear Cache Gagal
- Cek console untuk error messages
- Verify service worker permissions
- Test di incognito/private mode

### Update Tidak Terdeteksi
- Increment version number
- Hard refresh (Cmd+Shift+R / Ctrl+Shift+R)
- Manual clear cache dari DevTools

## Best Practices

1. **Selalu update version** setiap push ke production
2. **Test di multiple browsers** (Chrome, Firefox, Safari)
3. **Komunikasikan update** di notifikasi popup
4. **Preserve user data** saat clear cache
5. **Monitor error logs** untuk cache issues

## Future Improvements

- [ ] Release notes dalam popup
- [ ] Offline update queueing
- [ ] Granular cache control per feature
- [ ] Update analytics tracking
- [ ] Scheduled background sync
