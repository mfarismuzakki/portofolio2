# 📿 Dzikir & Doa Harian - Progressive Web App

Aplikasi digital modern untuk dzikir dan doa harian berdasarkan Al-Quran dan Hadist Shahih dengan desain futuristik dan fitur offline-first.

## ✨ Fitur Utama

### 🕌 **Konten Islami Autentik**
- **15 Kategori Lengkap**: Dzikir pagi, petang, setelah sholat, istighfar, doa safar, dan lainnya
- **Hadist Shahih**: Semua doa bersumber dari Bukhari, Muslim, Abu Dawud, Tirmidzi, An-Nasa'i, Ibn Majah
- **Teks Lengkap**: Arab, Latin, terjemahan Indonesia, dan manfaat/keutamaan
- **Referensi Jelas**: Setiap doa dilengkapi sumber hadist yang valid

### 🎯 **Sistem Counter Interaktif**
- Counter otomatis untuk dzikir dengan pengulangan (tasbih, tahmid, takbir)
- Progress bar visual dengan animasi futuristik
- Auto-save progress harian ke local storage
- Tracking streak harian dan statistik personal

### 🌟 **AI-Powered Recommendations**
- Rekomendasi dzikir berdasarkan waktu sholat
- Notifikasi pengingat dzikir pagi dan petang
- Adaptasi konten sesuai pola ibadah pengguna

### 💎 **Desain Futuristik & UX Modern**
- Tema cyberpunk dengan gradien neon dan glassmorphism
- Animasi smooth dan efek visual gaming-style
- Responsive design untuk semua device
- Dark mode dengan accent cyan/magenta

### 📱 **Progressive Web App (PWA)**
- Install sebagai app native di smartphone
- Offline-first: berfungsi tanpa internet
- Service worker untuk caching cerdas
- Push notifications untuk pengingat
- App shortcuts untuk akses cepat

### 🔧 **Fitur Personalisasi**
- Bookmark doa favorit
- Pengaturan ukuran font Arabic
- Customizable notifications
- Data export/import untuk backup

## 🚀 Cara Instalasi

### Method 1: PWA Installation (Recommended)
1. Buka https://your-domain.com/dzikir_doa di browser
2. Klik tombol "Install App" atau "Add to Home Screen"
3. App akan terinstall seperti aplikasi native

### Method 2: Local Development
```bash
# Clone repository
git clone https://github.com/your-username/dzikir-doa-pwa.git
cd dzikir-doa-pwa

# Serve menggunakan web server
# Option 1: Python
python -m http.server 8000

# Option 2: Node.js live-server
npx live-server

# Option 3: PHP
php -S localhost:8000

# Buka http://localhost:8000
```

## 📁 Struktur Project

```
dzikir_doa/
├── index.html              # Main HTML file
├── manifest.json           # PWA manifest
├── sw.js                   # Service Worker
├── css/
│   └── styles.css          # Main stylesheet with futuristic theme
├── js/
│   └── app.js              # Main JavaScript application
├── data/
│   └── doa-collection.js   # Database doa & dzikir shahih
└── icons/                  # PWA icons (berbagai ukuran)
```

## 🎨 Tech Stack

- **Frontend**: Vanilla JavaScript ES6+, CSS3, HTML5
- **Design**: Glassmorphism, Cyberpunk aesthetics, CSS Grid/Flexbox
- **PWA**: Service Worker, Web App Manifest, Background Sync
- **Storage**: LocalStorage for offline data persistence
- **APIs**: Geolocation (untuk rekomendasi waktu), Push Notifications
- **Performance**: Lazy loading, Critical CSS, Resource optimization

## 📚 Database Doa & Dzikir

### Kategori Tersedia:
1. **Dzikir Pagi** (🌅) - Setelah Subuh hingga Syuruq
2. **Dzikir Petang** (🌇) - Setelah Ashar hingga Maghrib  
3. **Doa Sebelum Tidur** (😴) - Sebelum tidur malam
4. **Doa Bangun Tidur** (🌅) - Saat bangun tidur
5. **Doa Safar & Perjalanan** (🧳) - Saat bepergian
6. **Doa Makan & Minum** (🍽️) - Sebelum dan sesudah makan
7. **Doa Istighfar & Taubat** (🤲) - Mohon ampun kapan saja
8. **Doa Setelah Sholat** (🕌) - Dzikir setelah sholat fardhu
9. **Tahlil & Tahmid** (☪️) - La ilaha illallah dan Alhamdulillah
10. **Kafaratul Majlis** (💬) - Penutup pertemuan/majlis
11. **Doa Masuk & Keluar WC** (🚪) - Adab kamar mandi
12. **Doa Wudhu** (💧) - Sebelum dan sesudah wudhu
13. **Doa Masuk & Keluar Masjid** (🕌) - Adab masjid
14. **Doa Naik Kendaraan** (🚗) - Saat naik transportasi
15. **Doa Cuaca** (🌧️) - Saat hujan dan petir
16. **Doa Memohon Rezeki** (💰) - Rezeki halal dan berkah
17. **Doa Menuntut Ilmu** (📚) - Sebelum belajar
18. **Doa untuk Orang Sakit** (🏥) - Ketika sakit

## 🔧 Fitur Developer

### Service Worker Features:
- Static asset caching untuk performa
- Dynamic content caching dengan limit
- Background sync untuk offline actions
- Push notification support
- Cache versioning dan cleanup otomatis

### Local Storage Schema:
```javascript
// Favorites
dzikirDoa_favorites: [
  {
    id: "doa_id",
    title: "Nama Doa",
    arabic: "النص العربي",
    translation: "Terjemahan",
    categoryId: "category_name"
  }
]

// Progress tracking
dzikirDoa_progress: {
  "Mon Jan 01 2024": {
    "doa_id": 33,  // counter value
    "another_doa": 100
  }
}

// Settings
dzikirDoa_settings: {
  notifications: { pagi: true, petang: true },
  darkMode: true,
  arabicFontSize: "medium"
}
```

### API Interface:
```javascript
// Main utilities
doaUtils.getAllCategories()
doaUtils.getCategoryData(categoryId)
doaUtils.searchDoa(query)
doaUtils.getTimeBasedRecommendations(hour)

// App methods
app.navigateToSection(sectionId)
app.openDoaModal(doaObject)
app.toggleFavorite()
app.updateCounter()
```

## 🎯 Performance Optimizations

- **Critical CSS** inline untuk loading cepat
- **Font display: swap** untuk web fonts
- **Lazy loading** untuk gambar dan konten
- **Service Worker** caching strategy
- **Minified assets** untuk production
- **Preload** untuk resources penting

## 🔐 Privacy & Security

- **No data collection**: Semua data disimpan local
- **No external tracking**: Tidak ada analytics third-party
- **Offline-first**: Tidak bergantung server external
- **Open source**: Code dapat diaudit publik

## 🤝 Contributing

1. Fork repository ini
2. Buat branch fitur: `git checkout -b feature/amazing-feature`
3. Commit perubahan: `git commit -m 'Add amazing feature'`
4. Push ke branch: `git push origin feature/amazing-feature`
5. Buat Pull Request

### Guidelines:
- Pastikan semua doa bersumber dari hadist shahih
- Maintain konsistensi UI/UX futuristik
- Test di berbagai device dan browser
- Update dokumentasi jika diperlukan

## 📜 License

MIT License - lihat file [LICENSE](LICENSE) untuk detail lengkap.

## 🙏 Acknowledgments

- **Al-Quran & Hadist Shahih** sebagai sumber utama
- **Font Awesome** untuk icons
- **Google Fonts** untuk typography
- **Para ulama** yang menyusun hadist-hadist shahih

## 📞 Support

Untuk bug report atau feature request:
- GitHub Issues: [Create Issue](https://github.com/your-username/dzikir-doa-pwa/issues)
- Email: your-email@domain.com

---

*"Dan ingatlah kepada Rabbmu dalam hatimu dengan merendah dan takut, dan dengan tidak mengeraskan suara, pada waktu pagi dan petang, dan janganlah kamu termasuk orang-orang yang lalai."* - **QS. Al-A'raf: 205**

**Barakallahu fiikum** 🤲