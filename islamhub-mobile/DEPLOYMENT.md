# IslamHub Mobile - Deployment Guide

## Struktur Project

IslamHub Mobile menggunakan **single codebase** untuk web dan mobile app native:

- **Web Deployment**: Folder `www/` dapat di-deploy langsung ke web hosting
- **Mobile Native**: Build Android/iOS menggunakan Capacitor dari folder `www/`

## Web Deployment

### Cara 1: Deploy Folder www/ Langsung

1. Copy seluruh isi folder `www/` ke web hosting Anda
2. Pastikan file `index.html`, `sw.js`, dan `manifest.json` ada di root
3. Struktur harus seperti ini:
   ```
   public_html/
   ├── index.html
   ├── sw.js
   ├── manifest.json
   ├── css/
   ├── js/
   ├── assets/
   └── ...
   ```

### Cara 2: Deploy ke Subfolder

Jika ingin deploy ke subfolder (misal: `https://domain.com/islamhub-mobile/`):

1. Copy folder `www/` ke subfolder yang diinginkan
2. Service Worker akan otomatis detect base path
3. Tidak perlu ubah konfigurasi apapun!

### Cara 3: Deploy ke GitHub Pages

```bash
# 1. Copy www ke root atau buat branch gh-pages
cd islamhub-mobile
git checkout -b gh-pages

# 2. Copy www content to root
cp -r www/* .

# 3. Push to GitHub
git add .
git commit -m "Deploy to GitHub Pages"
git push origin gh-pages

# 4. Enable GitHub Pages di Settings > Pages
# Pilih branch: gh-pages, folder: / (root)
```

## Mobile Native Build

### Android

```bash
# Sync files to Android project
npm run sync:android

# Open in Android Studio
npm run open:android

# Or build directly
npm run build:android
```

### iOS

```bash
# Sync files to iOS project
npm run sync:ios

# Open in Xcode
npm run open:ios

# Or build directly
npm run build:ios
```

## Single Maintenance

Keuntungan struktur ini:
- ✅ Edit sekali di folder `www/`
- ✅ Deploy web langsung dari `www/`
- ✅ Sync ke mobile dengan `npm run sync`
- ✅ Tidak perlu maintain 2 codebase terpisah

## Fitur yang Sama di Web & Mobile

1. **Al-Quran Digital** - Text sudah included, tidak perlu download
2. **Waktu Adzan** - Real-time dengan notifikasi
3. **Dzikir & Doa**
4. **Qibla Finder**
5. **Kalkulator Waris**
6. **Tata Cara Sholat**
7. **Sirah Nabi**

## Perbedaan Web vs Native

### Web (PWA)
- ✅ Install via browser
- ✅ Notifikasi via Service Worker
- ⚠️ Terbatas permission

### Native App
- ✅ Full native integration
- ✅ Better notification (Local Notifications)
- ✅ Better performance
- ✅ App store distribution

## Notes

- File `capacitor.js` akan otomatis di-load di native app, di web akan 404 (normal)
- Service Worker path otomatis detect base path
- Manifest.json sudah dikonfigurasi untuk PWA

## Update Process

1. Edit file di `www/`
2. Test di browser (web version)
3. Jika OK, sync ke mobile: `npm run sync`
4. Test di Android/iOS
5. Deploy web: Copy `www/` ke hosting
6. Build & release mobile app

Dengan cara ini, Anda hanya perlu maintain **1 codebase** untuk **2 platform**!
