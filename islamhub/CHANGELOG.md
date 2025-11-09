# Changelog

All notable changes to IslamHub Mobile will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2025-11-05

### 🎉 Initial Release

First official release of IslamHub Mobile as a native Android application.

### ✨ Added

#### Native Features
- **Status Bar Styling**: Custom green status bar (#1a472a) matching app theme
- **Splash Screen**: Animated splash screen with app logo on launch
- **Haptic Feedback**: Tactile feedback on all interactive elements
  - Light haptics on navigation taps
  - Medium haptics on action buttons
  - Success/error notifications with appropriate haptics
- **Network Monitoring**: Real-time network status detection
  - Offline notification
  - Connection restored notification
  - Network type detection (WiFi/Mobile)
- **Native Share**: Share app via native Android share dialog
  - Share to WhatsApp, Telegram, email, etc.
  - Fallback to clipboard if share not available

#### Core Features
- **Al-Quran Digital**: 30 Juz complete with Indonesian translation
  - Audio recitation from multiple Qaris
  - Verse-by-verse translation
  - Bookmark functionality
  - Search by Juz, Surah, or keywords
  - Night mode for comfortable reading
  
- **Adzan & Prayer Times**: Accurate 5 daily prayer times
  - Auto location detection
  - Manual city selection
  - Multiple calculation methods
  - Prayer countdown timer
  - Adzan audio notifications
  - Floating widget for quick access
  
- **Dzikir & Dua**: Complete collection of daily supplications
  - Morning & evening dzikir
  - Daily duas with audio
  - Digital tasbih counter
  - Post-prayer wirid
  - Selected Quranic and Hadith duas
  
- **Qibla Finder**: Digital compass for prayer direction
  - GPS-based direction detection
  - 3D visual indicator
  - Distance to Kaaba
  - Real-time compass rotation
  
- **Prayer Guide**: Comprehensive Salah instructions
  - Complete prayer recitations (Arabic & Latin)
  - Audio for each recitation
  - Prayer movements guide
  - Sunnah prayers (Dhuha, Tahajud, Witr, etc.)
  - Prayer intentions
  
- **Sirah**: Islamic history and biographies
  - Life of Prophet Muhammad ﷺ
  - Companions (Sahaba) biographies
  - Female companions (Sahabiyat)
  - Ashabul Mubashsharun bil Jannah
  
- **Inheritance Calculator**: Islamic inheritance calculator
  - Support for various heir combinations
  - Shariah-compliant calculations
  - Detailed breakdown of shares
  - Legal explanations

#### UI/UX
- **Bottom Navigation**: Easy access to all features
- **More Apps Dropdown**: Organized feature access
- **Floating Widget**: Quick prayer time widget
- **Smooth Animations**: Page transitions and loading states
- **Responsive Design**: Optimized for all screen sizes
- **Hadith Ticker**: Scrolling hadith display on home screen
- **Loading States**: Visual feedback for all operations

#### Technical
- **PWA to Native**: Converted from Progressive Web App to native Android
- **Capacitor Integration**: Using Capacitor 6.2.0
- **Plugin System**: Modular architecture for easy maintenance
- **Local Storage**: Persistent data across sessions
- **Offline Support**: Core features work without internet
- **Service Worker**: Efficient caching strategy
- **Performance**: Optimized load times and memory usage

### 🔧 Technical Details

#### Capacitor Plugins
- @capacitor/status-bar ^6.0.1
- @capacitor/splash-screen ^6.0.2
- @capacitor/haptics ^6.0.1
- @capacitor/network ^6.0.2
- @capacitor/share ^6.0.2

#### Build Configuration
- Target SDK: 34 (Android 14)
- Min SDK: 22 (Android 5.1)
- Compile SDK: 34
- Build Tools: 34.0.0
- Gradle: 8.2.1
- Android Gradle Plugin: 8.2.1

#### Project Structure
```
islamhub-mobile/
├── android/              # Native Android project
├── www/                  # Production web assets
├── js/                   # Source JavaScript
├── css/                  # Source stylesheets
├── assets/               # Media files
└── capacitor.config.json # Capacitor configuration
```

### 📱 Compatibility
- **Android Version**: 5.1 (Lollipop) and above
- **Min API Level**: 22
- **Target API Level**: 34
- **Architecture**: armeabi-v7a, arm64-v8a, x86, x86_64

### 🐛 Known Issues
- First launch may take slightly longer to initialize native features
- GPS accuracy depends on device hardware and location services
- Audio playback requires internet for streaming (first time)

### 📝 Notes
- First stable release after PWA to native conversion
- All core features tested on Android 8.0 - 14.0
- Optimized for devices with 2GB+ RAM
- Recommended screen size: 5.5" - 6.7"

### 🙏 Credits
- Al-Quran data: Quran.com API
- Prayer times: Aladhan API
- Hadith: Various authenticated sources
- Audio: Licensed Qari recordings
- Icons: Custom designed

---

## [Unreleased]

### 🔮 Planned for v1.1.0
- Tafsir Al-Quran integration
- Hadith search functionality
- Prayer tracker with statistics
- Full dark mode support
- Home screen widgets
- Push notifications for prayer times
- More Qari options for audio
- Customizable adzan sounds

### 🔮 Planned for v1.2.0
- Multiple language support (English, Arabic)
- Social sharing of achievements
- Custom reminder system
- Improved offline mode
- Theme customization
- Export/import settings

### 🔮 Planned for v2.0.0
- iOS version
- Community features
- AI-powered Islamic Q&A
- Live streaming kajian
- Masjid finder with maps
- Qibla direction widget for lock screen

---

## Version History

| Version | Release Date | Highlights |
|---------|--------------|------------|
| 1.0.0   | 2025-11-05  | Initial native Android release |

---

## Migration from PWA

If you were using the PWA version:

### What's New
✅ Native Android experience
✅ Better performance
✅ Haptic feedback
✅ Native share integration
✅ Better offline support
✅ No browser chrome

### What's Changed
- Installation now via APK instead of "Add to Home Screen"
- Better integration with Android system
- Faster startup time
- More reliable background features

### Data Migration
- All bookmarks and settings preserved
- Automatic migration on first launch
- No manual action required

---

## Upgrade Guide

### From PWA to v1.0.0 Native
1. Uninstall PWA version (if installed)
2. Download v1.0.0 APK
3. Enable "Install from Unknown Sources" if needed
4. Install APK
5. Grant necessary permissions (Location, Storage)
6. Enjoy native experience!

---

## Support

For issues, questions, or feedback:
- **Email**: support@islamhub.app
- **GitHub Issues**: [Create an issue](https://github.com/yourusername/islamhub-mobile/issues)
- **Documentation**: [View docs](README.md)

---

**Jazakallahu Khairan for using IslamHub! 🤲**

*May Allah accept our efforts and make this beneficial for the Ummah.*
