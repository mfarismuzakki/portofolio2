#!/bin/bash

# IslamHub Mobile Build Scripts

echo "🚀 IslamHub Mobile Build Helper"
echo "================================"
echo ""
echo "Pilih opsi:"
echo "1. Sync ke native projects"
echo "2. Open Android Studio"
echo "3. Open Xcode (Mac only)"
echo "4. Run Android emulator"
echo "5. Run iOS simulator"
echo "6. Full clean & rebuild"
echo ""
read -p "Pilihan (1-6): " choice

case $choice in
  1)
    echo "📦 Syncing to native projects..."
    npx cap sync
    echo "✅ Sync complete!"
    ;;
  2)
    echo "📱 Opening Android Studio..."
    npx cap open android
    ;;
  3)
    echo "🍎 Opening Xcode..."
    npx cap open ios
    ;;
  4)
    echo "📱 Running on Android..."
    npx cap run android
    ;;
  5)
    echo "🍎 Running on iOS..."
    npx cap run ios
    ;;
  6)
    echo "🧹 Cleaning..."
    rm -rf android/app/build
    rm -rf ios/App/build
    echo "📦 Syncing..."
    npx cap sync
    echo "✅ Clean & rebuild complete!"
    ;;
  *)
    echo "❌ Invalid option"
    ;;
esac
