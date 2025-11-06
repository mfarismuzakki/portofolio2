# 🧪 Quick Testing Guide

## Checklist Testing Sebelum Release

### ✅ Pre-build Checks

- [ ] Semua file sudah disync ke `www/`
- [ ] `capacitor.config.json` sudah benar
- [ ] Version number updated di `package.json`
- [ ] No console errors di web version

### ✅ Build Process

```bash
# 1. Copy files
./build-scripts.sh

# 2. Sync to Android
npx cap sync android

# 3. Build
cd android && ./gradlew assembleDebug
```

### ✅ Native Features Testing

#### Status Bar
```
Test: Launch app
Expected: Status bar hijau (#1a472a), icons putih
Status: [ ]
```

#### Splash Screen
```
Test: Launch app
Expected: Logo muncul 500ms lalu fade out
Status: [ ]
```

#### Haptic Feedback
```
Test: Tap navigation buttons
Expected: Light vibration
Status: [ ]

Test: Tap app items di dropdown
Expected: Medium vibration
Status: [ ]

Test: Long press items
Expected: Heavy vibration (jika ada)
Status: [ ]
```

#### Network Status
```
Test: Disable WiFi/mobile data
Expected: "Tidak ada koneksi internet" notification
Status: [ ]

Test: Enable WiFi/mobile data
Expected: "Koneksi tersambung kembali" notification
Status: [ ]
```

#### Share Feature
```
Test: Tap share button di home
Expected: Share dialog muncul
Status: [ ]

Test: Share ke WhatsApp
Expected: Content & link shared correctly
Status: [ ]
```

### ✅ App Features Testing

#### Home Screen
```
Test: Widget waktu sholat muncul
Expected: Countdown dan waktu sholat akurat
Status: [ ]

Test: Hadith ticker berjalan
Expected: Hadith text scrolling smooth
Status: [ ]

Test: Floating widget visibility
Expected: Widget show/hide sesuai screen
Status: [ ]
```

#### Al-Quran
```
Test: Buka surah list
Expected: 114 surah loaded
Status: [ ]

Test: Buka surah detail
Expected: Ayat loaded dengan terjemahan
Status: [ ]

Test: Play audio
Expected: Audio playing smoothly
Status: [ ]

Test: Bookmark ayat
Expected: Bookmark saved & retrievable
Status: [ ]

Test: Search ayat
Expected: Search results accurate
Status: [ ]
```

#### Adzan
```
Test: Set lokasi
Expected: Coordinates updated
Status: [ ]

Test: Get prayer times
Expected: 5 waktu sholat muncul
Status: [ ]

Test: Play adzan audio
Expected: Adzan playing correctly
Status: [ ]

Test: Countdown timer
Expected: Timer counting down accurate
Status: [ ]
```

#### Dzikir
```
Test: Buka dzikir pagi
Expected: List dzikir loaded
Status: [ ]

Test: Play audio
Expected: Audio playing
Status: [ ]

Test: Tasbih counter
Expected: Counter increment/decrement works
Status: [ ]

Test: Reset counter
Expected: Counter reset to 0
Status: [ ]
```

#### Qibla
```
Test: Kompas loading
Expected: Kompas visual muncul
Status: [ ]

Test: Rotate device
Expected: Kompas rotate sesuai orientasi
Status: [ ]

Test: Permission GPS
Expected: Location permission requested
Status: [ ]

Test: Arah kiblat
Expected: Arrow pointing to Kaaba direction
Status: [ ]
```

#### Sholat
```
Test: Buka bacaan sholat
Expected: Niat & bacaan loaded
Status: [ ]

Test: Play audio bacaan
Expected: Audio playing
Status: [ ]

Test: Sholat sunnah
Expected: List sholat sunnah complete
Status: [ ]
```

#### Sirah
```
Test: Buka kisah Nabi
Expected: Timeline & content loaded
Status: [ ]

Test: Buka sahabat
Expected: List sahabat muncul
Status: [ ]

Test: Read content
Expected: Content readable & formatted
Status: [ ]
```

#### Waris
```
Test: Input ahli waris
Expected: Form working correctly
Status: [ ]

Test: Calculate
Expected: Pembagian calculated accurately
Status: [ ]

Test: Reset form
Expected: Form cleared
Status: [ ]
```

### ✅ UI/UX Testing

#### Navigation
```
Test: Bottom nav tap
Expected: Switch app smoothly
Status: [ ]

Test: More apps dropdown
Expected: Opens/closes correctly
Status: [ ]

Test: Back button (hardware)
Expected: Navigate back or exit app
Status: [ ]
```

#### Responsive Design
```
Test: Portrait mode
Expected: Layout optimized
Status: [ ]

Test: Landscape mode
Expected: Layout adapted
Status: [ ]

Test: Different screen sizes
Expected: Responsive di semua ukuran
Status: [ ]
```

#### Animations
```
Test: Page transitions
Expected: Smooth fade in/out
Status: [ ]

Test: Loading states
Expected: Loading indicator shown
Status: [ ]

Test: Button press effects
Expected: Visual feedback on tap
Status: [ ]
```

### ✅ Performance Testing

#### Load Times
```
Test: App startup
Expected: < 2 seconds
Actual: _____ seconds
Status: [ ]

Test: Switch between apps
Expected: < 500ms
Actual: _____ ms
Status: [ ]

Test: Load Al-Quran surah
Expected: < 1 second
Actual: _____ seconds
Status: [ ]
```

#### Memory Usage
```bash
# Check memory
adb shell dumpsys meminfo com.islamhub.app

Test: Memory usage idle
Expected: < 100MB
Actual: _____ MB
Status: [ ]

Test: Memory usage active
Expected: < 200MB
Actual: _____ MB
Status: [ ]
```

#### Battery Usage
```
Test: 1 hour normal usage
Expected: < 10% battery drain
Actual: _____ %
Status: [ ]
```

### ✅ Error Handling

```
Test: No internet (load Quran data)
Expected: Offline data or error message
Status: [ ]

Test: GPS disabled (Qibla)
Expected: Request enable GPS
Status: [ ]

Test: Audio file missing
Expected: Error message, no crash
Status: [ ]

Test: Invalid input (Waris)
Expected: Validation message
Status: [ ]
```

### ✅ Data Persistence

```
Test: Close & reopen app
Expected: Last screen restored
Status: [ ]

Test: Bookmarks saved
Expected: Bookmarks still there
Status: [ ]

Test: Settings saved
Expected: Settings persisted
Status: [ ]

Test: Clear cache
Expected: Data cleared, app still works
Status: [ ]
```

### ✅ Permissions

```
Test: Location permission (first launch)
Expected: Permission dialog shown
Status: [ ]

Test: Location permission denied
Expected: Fallback to manual location
Status: [ ]

Test: Notification permission
Expected: Can enable/disable notifications
Status: [ ]
```

## 🐛 Common Issues & Solutions

### Issue: App crashes on launch
```bash
# Check logcat
adb logcat | grep AndroidRuntime

# Solution: Check MainActivity.java, verify plugins
```

### Issue: Native features not working
```bash
# Verify plugin installation
npm list @capacitor/status-bar

# Reinstall and sync
npm install @capacitor/status-bar --save
npx cap sync android
```

### Issue: Audio not playing
```bash
# Check audio files exist in www/assets/audio/
# Check Howler.js loaded
# Check audio permissions in AndroidManifest.xml
```

### Issue: GPS not working
```bash
# Check location permissions in AndroidManifest.xml
# Verify Google Play Services on device
# Test with different location source
```

## 📊 Test Report Template

```markdown
# Test Report - IslamHub v1.0.0

**Date**: YYYY-MM-DD
**Tester**: [Name]
**Device**: [Model] - Android [Version]
**Build**: [Debug/Release]

## Summary
- Total Tests: __
- Passed: __
- Failed: __
- Blocked: __

## Failed Tests
1. [Test name] - [Reason] - [Severity: High/Medium/Low]
2. ...

## Notes
- [Any additional observations]

## Recommendation
[ ] Ready for release
[ ] Needs fixes
[ ] Needs more testing
```

## 📱 Test Devices Matrix

Idealnya test di:

| Device Type | Screen Size | Android Version | Priority |
|-------------|-------------|-----------------|----------|
| Phone Small | < 5.5" | 5.1 (API 22) | Medium |
| Phone Medium | 5.5" - 6.5" | 8.0 (API 26) | High |
| Phone Large | > 6.5" | 11.0 (API 30) | High |
| Tablet | 7" - 10" | 10.0 (API 29) | Low |
| Flagship | Any | 13.0+ (API 33) | High |

## ⚡ Quick Test Commands

```bash
# Install and launch
cd android && ./gradlew installDebug && adb shell am start -n com.islamhub.app/.MainActivity

# Watch logs
adb logcat | grep -i "islam\|capacitor\|error"

# Take screenshot
adb shell screencap -p /sdcard/screenshot.png && adb pull /sdcard/screenshot.png

# Record video
adb shell screenrecord /sdcard/demo.mp4
# Stop with Ctrl+C
adb pull /sdcard/demo.mp4

# Check APK size
ls -lh android/app/build/outputs/apk/debug/app-debug.apk

# Uninstall
adb uninstall com.islamhub.app
```

## ✅ Final Checklist

Sebelum release:

- [ ] All critical features tested
- [ ] No crashes or ANRs
- [ ] Performance acceptable
- [ ] UI/UX smooth
- [ ] Tested on multiple devices/versions
- [ ] Documentation complete
- [ ] Release notes prepared
- [ ] APK signed
- [ ] Privacy policy ready (if needed)
- [ ] Store listing prepared (if Play Store)

---

**Happy Testing! 🚀**
