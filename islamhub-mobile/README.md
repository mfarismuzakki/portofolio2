# 🕌 IslamHub Mobile

<div align="center">

![IslamHub Logo](www/assets/icons/icon-192x192.png)

**Islamic Applications Hub - All-in-one Islamic companion app**

[![Platform](https://img.shields.io/badge/Platform-Android-green.svg)](https://developer.android.com)
[![Capacitor](https://img.shields.io/badge/Capacitor-6.2.0-blue.svg)](https://capacitorjs.com)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

[Features](#-features) • [Download](#-download) • [Development](#-development) • [Contributing](#-contributing)

</div>

---

## 📖 Tentang IslamHub

IslamHub adalah aplikasi mobile Android yang menyediakan berbagai fitur islami dalam satu platform terintegrasi. Aplikasi ini dirancang dengan antarmuka yang user-friendly dan performa yang optimal untuk membantu Muslim dalam beribadah sehari-hari.

## ✨ Features

### 📿 Al-Quran Digital
- **30 Juz lengkap** dengan terjemahan Bahasa Indonesia
- **Audio murotal** dari berbagai qari terkenal
- Pencarian ayat by juz, surah, atau kata kunci
- Bookmark ayat favorit
- Mode malam untuk membaca nyaman

### 🕌 Adzan & Waktu Sholat
- Jadwal sholat 5 waktu akurat berdasarkan lokasi
- Notifikasi adzan otomatis
- Countdown waktu sholat berikutnya
- Widget floating untuk cek waktu cepat
- Dukungan berbagai metode perhitungan

### 🤲 Dzikir & Doa
- Koleksi dzikir pagi dan petang
- Doa harian lengkap dengan audio
- Tasbih digital counter
- Wirid setelah sholat
- Doa pilihan dari Al-Quran dan Hadits

### 🧭 Kiblat Finder
- Kompas kiblat digital
- Deteksi arah kiblat berdasarkan GPS
- Visual 3D untuk akurasi tinggi
- Indikator jarak ke Ka'bah

### 🙏 Panduan Sholat
- Bacaan sholat lengkap dengan latin dan audio
- Panduan gerakan sholat
- Sholat sunnah (Dhuha, Tahajud, Witir, dll)
- Niat sholat fardhu dan sunnah

### 📚 Sirah Nabawiyah
- Kisah kehidupan Nabi Muhammad ﷺ
- Biografi para sahabat
- Sahabiyat (wanita sahabat Nabi)
- Ashabul Mubashsharun bil Jannah

### 🧮 Kalkulator Waris
- Hitung pembagian warisan sesuai syariat
- Support berbagai kombinasi ahli waris
- Penjelasan hukum waris
- Hasil perhitungan detail

## 📱 Screenshots

<div align="center">

| Home | Al-Quran | Adzan | Dzikir |
|:----:|:--------:|:-----:|:------:|
| ![Home](screenshots/home.png) | ![Quran](screenshots/quran.png) | ![Adzan](screenshots/adzan.png) | ![Dzikir](screenshots/dzikir.png) |

| Qibla | Sholat | Sirah | Waris |
|:-----:|:------:|:-----:|:-----:|
| ![Qibla](screenshots/qibla.png) | ![Sholat](screenshots/sholat.png) | ![Sirah](screenshots/sirah.png) | ![Waris](screenshots/waris.png) |

</div>

## 📥 Download

### Android (APK)

[![Download APK](https://img.shields.io/badge/Download-APK-green.svg?style=for-the-badge&logo=android)](releases/islamhub-v1.0.0.apk)

**Minimum Requirements:**
- Android 5.1 (API 22) or higher
- 50 MB free storage
- Internet connection (untuk fitur online)

### Google Play Store

*Coming soon...*

## 🚀 Development

### Quick Start

```bash
# Clone repository
git clone https://github.com/yourusername/islamhub-mobile.git
cd islamhub-mobile

# Install dependencies
npm install

# Copy files to www
./build-scripts.sh

# Sync to Android
npx cap sync android

# Open in Android Studio
npx cap open android
```

### Prerequisites

- Node.js (v16+)
- Android Studio
- JDK 11 or 17
- Android SDK

📖 **Untuk panduan lengkap, lihat [DEVELOPMENT_GUIDE.md](DEVELOPMENT_GUIDE.md)**

## 🏗️ Tech Stack

- **Framework**: Capacitor 6.2.0
- **Platform**: Android (Native)
- **UI**: Vanilla JavaScript, HTML5, CSS3
- **Audio**: Howler.js
- **Storage**: LocalStorage + IndexedDB
- **API**: RESTful APIs untuk data islami

### Native Plugins

- `@capacitor/status-bar` - Status bar styling
- `@capacitor/splash-screen` - Splash screen management
- `@capacitor/haptics` - Haptic feedback
- `@capacitor/network` - Network status monitoring
- `@capacitor/share` - Native share functionality

## 📂 Project Structure

```
islamhub-mobile/
├── android/              # Native Android project
├── www/                  # Web assets (production)
├── js/                   # Source JavaScript
│   ├── app.js           # Main app logic
│   ├── apps/            # Feature modules
│   ├── data/            # JSON data files
│   └── utils/           # Utilities
├── css/                  # Source stylesheets
├── assets/               # Images, icons, audio
└── capacitor.config.json # Capacitor config
```

## 🤝 Contributing

Kontribusi sangat diterima! Berikut cara berkontribusi:

1. Fork repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

### Development Guidelines

- Follow existing code style
- Write clear commit messages
- Test thoroughly before PR
- Update documentation if needed

## 🧪 Testing

```bash
# Run on emulator
npx cap run android

# Run on connected device
cd android && ./gradlew installDebug

# Debug with Chrome DevTools
# Navigate to chrome://inspect
```

## 🐛 Bug Reports

Jika menemukan bug, silakan [buat issue](https://github.com/yourusername/islamhub-mobile/issues) dengan detail:

- Device model dan Android version
- Steps to reproduce
- Expected vs actual behavior
- Screenshots/logs jika ada

## 📜 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

### Data Sources

- Al-Quran data: [Quran.com API](https://quran.com)
- Adzan times: [Aladhan API](https://aladhan.com/prayer-times-api)
- Hadith: Various authenticated sources
- Audio: Licensed Qari recordings

### Libraries & Tools

- [Capacitor](https://capacitorjs.com) - Cross-platform native runtime
- [Howler.js](https://howlerjs.com) - Audio library
- Android Studio - IDE
- Icons: Custom designed

### Special Thanks

- Islamic scholars for guidance on religious content
- Beta testers for valuable feedback
- Open source community

## 📞 Contact & Support

- **Email**: support@islamhub.app
- **Website**: https://islamhub.app
- **Issues**: [GitHub Issues](https://github.com/yourusername/islamhub-mobile/issues)

## 🗺️ Roadmap

### v1.1.0 (Coming Soon)
- [ ] Tafsir Al-Quran
- [ ] Hadith search feature
- [ ] Prayer tracker with statistics
- [ ] Dark mode full support
- [ ] Widget untuk home screen

### v1.2.0
- [ ] Social features (share achievements)
- [ ] Reminder system (dzikir, sholat)
- [ ] Offline mode improvements
- [ ] Customizable themes
- [ ] Multiple language support

### v2.0.0
- [ ] iOS version
- [ ] Community features
- [ ] AI-powered Islamic Q&A
- [ ] Live streaming kajian
- [ ] Masjid finder with maps

## 💝 Support the Project

If you find IslamHub useful, please consider:

- ⭐ Starring this repository
- 📢 Sharing with friends and family
- 🐛 Reporting bugs
- 💡 Suggesting new features
- 🤝 Contributing code

---

<div align="center">

*"Read in the name of your Lord who created"* - Al-Alaq 96:1

[⬆ Back to Top](#-islamhub-mobile)

</div>
