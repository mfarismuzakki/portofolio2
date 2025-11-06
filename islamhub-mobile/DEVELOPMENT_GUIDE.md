# IslamHub Mobile - Development & Testing Guide

## 📱 Overview

IslamHub Mobile adalah aplikasi native Android yang dibangun menggunakan Capacitor. Aplikasi ini menyediakan berbagai fitur islami termasuk Al-Quran, Adzan, Dzikir, Qibla, Sholat, dan lainnya.

## 🛠️ Teknologi Stack

- **Framework**: Capacitor 6.2.0
- **Platform**: Android (API Level 22+)
- **Frontend**: Vanilla JavaScript, HTML5, CSS3
- **Native Features**: 
  - Status Bar
  - Splash Screen
  - Haptics
  - Network
  - Share

## 📋 Prerequisites

Sebelum memulai development, pastikan Anda telah menginstall:

1. **Node.js** (v16 atau lebih tinggi)
   ```bash
   node --version
   npm --version
   ```

2. **Android Studio** (terbaru)
   - Download dari: https://developer.android.com/studio
   - Install Android SDK
   - Install Android SDK Platform Tools
   - Setup Android Virtual Device (AVD) atau koneksikan device fisik

3. **Java Development Kit (JDK)** (v11 atau v17)
   ```bash
   java -version
   ```

4. **Capacitor CLI**
   ```bash
   npm install -g @capacitor/cli
   ```

## 🚀 Setup Development Environment

### 1. Clone dan Install Dependencies

```bash
# Clone repository
git clone <repository-url>
cd islamhub-mobile

# Install dependencies
npm install
```

### 2. Konfigurasi Android Environment Variables

Tambahkan ke `.zshrc` atau `.bashrc`:

```bash
export ANDROID_HOME=$HOME/Library/Android/sdk
export PATH=$PATH:$ANDROID_HOME/tools
export PATH=$PATH:$ANDROID_HOME/tools/bin
export PATH=$PATH:$ANDROID_HOME/platform-tools
export PATH=$PATH:$ANDROID_HOME/emulator
```

Reload shell:
```bash
source ~/.zshrc
```

### 3. Verify Setup

```bash
# Check Java
java -version

# Check Android SDK
adb --version

# Check Capacitor
npx cap --version
```

## 📝 Project Structure

```
islamhub-mobile/
├── android/                 # Native Android project
│   ├── app/
│   │   ├── src/
│   │   └── build.gradle
│   └── build.gradle
├── www/                     # Web assets untuk mobile
│   ├── index.html
│   ├── css/
│   ├── js/
│   └── assets/
├── js/                      # Source JavaScript files
│   ├── app.js              # Main application logic
│   ├── apps/               # Feature modules
│   ├── data/               # Data files
│   └── utils/              # Utility functions
├── css/                     # Source CSS files
├── capacitor.config.json   # Capacitor configuration
└── package.json
```

## 🔧 Development Workflow

### 1. Membuat Perubahan Code

Edit files di folder root (`js/`, `css/`, `index.html`, dll):

```bash
# Edit files
code js/app.js
code css/style.css
```

### 2. Copy Files ke www/

```bash
# Copy semua perubahan ke www/
./build-scripts.sh

# Atau copy manual
cp -r js/ www/
cp -r css/ www/
cp index.html www/
# dst...
```

### 3. Sync ke Native Platform

```bash
# Sync semua perubahan ke Android
npx cap sync android

# Atau update specific files
npx cap copy android
```

### 4. Build dan Run

#### Option A: Android Studio (Recommended untuk debugging)

```bash
# Open di Android Studio
npx cap open android
```

Kemudian:
1. Tunggu Gradle sync selesai
2. Pilih device/emulator
3. Click Run (▶️) atau tekan `Shift + F10`

#### Option B: Command Line

```bash
# Build debug APK
cd android
./gradlew assembleDebug

# Install ke connected device
./gradlew installDebug

# Build dan install sekaligus
./gradlew installDebug --stacktrace
```

APK hasil build ada di:
```
android/app/build/outputs/apk/debug/app-debug.apk
```

## 🧪 Testing

### 1. Testing di Emulator

**Membuat AVD (Android Virtual Device):**

1. Buka Android Studio
2. Tools > Device Manager
3. Create Device
4. Pilih device (e.g., Pixel 5)
5. Pilih system image (e.g., API 33)
6. Finish

**Run di Emulator:**

```bash
# List available emulators
emulator -list-avds

# Start emulator
emulator -avd <avd_name>

# Atau via Android Studio
npx cap open android
# Kemudian pilih emulator dan Run
```

### 2. Testing di Device Fisik

**Setup USB Debugging:**

1. Buka Settings di Android device
2. About Phone > Tap Build Number 7x (Developer Mode)
3. Developer Options > Enable USB Debugging
4. Hubungkan device ke komputer via USB
5. Accept USB Debugging prompt di device

**Verify Connection:**

```bash
adb devices
# Harus muncul device Anda
```

**Install ke Device:**

```bash
cd android
./gradlew installDebug
```

### 3. Testing Features

#### Status Bar
- Launch app
- Verify status bar berwarna hijau (#1a472a)
- Verify status bar icons readable

#### Splash Screen
- Launch app
- Verify splash screen muncul
- Verify splash screen menghilang setelah 500ms

#### Haptics
- Tap navigasi button
- Verify haptic feedback (light vibration)
- Tap app item di dropdown
- Verify haptic feedback (medium vibration)

#### Network Status
- Disable WiFi/data
- Verify notification "Tidak ada koneksi internet"
- Enable WiFi/data
- Verify notification "Koneksi tersambung kembali"

#### Share Feature
- Tap tombol share
- Verify share dialog muncul
- Share ke app lain (WhatsApp, dll)
- Verify content shared correctly

### 4. Testing Performance

```bash
# Monitor logcat
adb logcat | grep IslamHub

# Monitor memory usage
adb shell dumpsys meminfo com.islamhub.app

# Monitor battery usage
adb shell dumpsys batterystats com.islamhub.app
```

## 🐛 Debugging

### Logcat Debugging

```bash
# Basic logcat
adb logcat

# Filter by app
adb logcat | grep IslamHub

# Clear and watch
adb logcat -c && adb logcat | grep -i "islam\|capacitor"

# Save to file
adb logcat > logcat.txt
```

### Chrome DevTools

1. Open Chrome
2. Navigate to `chrome://inspect`
3. Find your device/app
4. Click "Inspect"
5. Use Console, Network, etc.

### Android Studio Debugger

1. Open project di Android Studio
2. Set breakpoints di Java/Kotlin files
3. Click Debug (🐛) instead of Run
4. App akan pause di breakpoints

### Common Issues

#### Issue: Gradle Build Failed

```bash
# Clean build
cd android
./gradlew clean

# Rebuild
./gradlew build --stacktrace
```

#### Issue: Device Not Detected

```bash
# Restart adb server
adb kill-server
adb start-server

# Check connection
adb devices
```

#### Issue: Capacitor Plugin Not Working

```bash
# Verify plugin installation
npm list @capacitor/status-bar
npm list @capacitor/splash-screen
# etc...

# Reinstall if needed
npm install @capacitor/status-bar --save

# Sync again
npx cap sync android
```

#### Issue: WebView Console Not Showing

Enable WebView debugging di `MainActivity.java`:

```java
import android.webkit.WebView;

public class MainActivity extends BridgeActivity {
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        WebView.setWebContentsDebuggingEnabled(true);
    }
}
```

## 📦 Building Release APK

### 1. Generate Keystore

```bash
keytool -genkey -v -keystore islamhub-release.keystore \
  -alias islamhub -keyalg RSA -keysize 2048 -validity 10000
```

### 2. Configure Signing

Create `android/keystore.properties`:

```properties
storePassword=your_store_password
keyPassword=your_key_password
keyAlias=islamhub
storeFile=../islamhub-release.keystore
```

### 3. Build Release

```bash
cd android
./gradlew assembleRelease
```

Release APK di:
```
android/app/build/outputs/apk/release/app-release.apk
```

### 4. Build AAB (untuk Play Store)

```bash
cd android
./gradlew bundleRelease
```

AAB file di:
```
android/app/build/outputs/bundle/release/app-release.aab
```

## 🔄 Update Workflow

### Quick Update (Code Only)

```bash
# 1. Edit files
code js/app.js

# 2. Copy ke www
cp -r js/ www/

# 3. Copy ke Android (tidak perlu full sync)
npx cap copy android

# 4. Rebuild dan install
cd android && ./gradlew installDebug
```

### Full Update (termasuk native changes)

```bash
# 1. Edit files (termasuk capacitor.config.json)
code capacitor.config.json

# 2. Copy ke www
./build-scripts.sh

# 3. Full sync
npx cap sync android

# 4. Rebuild
cd android && ./gradlew installDebug
```

## 📊 Performance Optimization

### 1. Minify Resources

Enable minification di `android/app/build.gradle`:

```gradle
buildTypes {
    release {
        minifyEnabled true
        shrinkResources true
        proguardFiles getDefaultProguardFile('proguard-android-optimize.txt'), 'proguard-rules.pro'
    }
}
```

### 2. Optimize Images

```bash
# Install imagemin
npm install -g imagemin-cli

# Optimize images
imagemin www/assets/icons/* --out-dir=www/assets/icons/optimized
```

### 3. Enable Gzip

Di `capacitor.config.json`:

```json
{
  "server": {
    "androidScheme": "https",
    "allowNavigation": ["*"],
    "cleartext": true
  }
}
```

## 🔐 Security Best Practices

1. **Don't commit sensitive data**
   - Add `keystore.properties` ke `.gitignore`
   - Don't commit keystore files

2. **Use HTTPS**
   - Configure androidScheme: "https"

3. **Validate all inputs**
   - Sanitize user inputs
   - Validate API responses

4. **Secure local storage**
   - Encrypt sensitive data
   - Use Capacitor Preferences plugin

## 📱 Distribution

### Google Play Store

1. Build release AAB
2. Login to [Google Play Console](https://play.google.com/console)
3. Create app listing
4. Upload AAB
5. Fill store listing details
6. Submit for review

### Direct Distribution (APK)

1. Build release APK
2. Upload to website/cloud storage
3. Share download link
4. Users need to enable "Install from Unknown Sources"

## 🤝 Contributing

1. Create feature branch
2. Make changes
3. Test thoroughly
4. Commit dengan clear messages
5. Create pull request

## 📞 Support

Jika ada issues:
1. Check logs: `adb logcat`
2. Check Chrome DevTools
3. Search existing issues
4. Create new issue dengan detail:
   - OS version
   - Android version
   - Device model
   - Steps to reproduce
   - Error messages

## 📚 Resources

- [Capacitor Documentation](https://capacitorjs.com/docs)
- [Android Developer Guide](https://developer.android.com/guide)
- [Android Studio User Guide](https://developer.android.com/studio/intro)
- [Capacitor Plugins](https://capacitorjs.com/docs/plugins)

---

**Last Updated**: November 2025
**Version**: 1.0.0
