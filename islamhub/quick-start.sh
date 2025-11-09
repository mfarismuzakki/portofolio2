#!/bin/bash

# IslamHub Mobile - Quick Start Script
# This script helps you quickly build and run the app

set -e  # Exit on error

echo "🕌 IslamHub Mobile - Quick Start"
echo "================================"
echo ""

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_success() {
    echo -e "${GREEN}✓ $1${NC}"
}

print_info() {
    echo -e "${BLUE}ℹ $1${NC}"
}

print_error() {
    echo -e "${RED}✗ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠ $1${NC}"
}

# Check if running from correct directory
if [ ! -f "capacitor.config.json" ]; then
    print_error "Please run this script from the project root directory"
    exit 1
fi

# Menu
echo "Select an option:"
echo "1. Full Build (copy + sync + install)"
echo "2. Quick Update (copy + install only)"
echo "3. Sync to Android"
echo "4. Install to Device"
echo "5. Open in Android Studio"
echo "6. Run Logcat"
echo "7. Clean Build"
echo "8. Build Release APK"
echo "9. Exit"
echo ""
read -p "Enter option (1-9): " option

case $option in
    1)
        print_info "Starting full build process..."
        
        # Copy files
        print_info "Copying files to www/..."
        ./build-scripts.sh
        print_success "Files copied"
        
        # Sync to Android
        print_info "Syncing to Android..."
        npx cap sync android
        print_success "Sync complete"
        
        # Build and install
        print_info "Building and installing to device..."
        cd android
        ./gradlew installDebug --stacktrace
        print_success "App installed on device"
        
        print_success "Full build complete! 🎉"
        ;;
        
    2)
        print_info "Quick update..."
        
        # Copy files
        print_info "Copying files to www/..."
        ./build-scripts.sh
        print_success "Files copied"
        
        # Copy to Android (without full sync)
        print_info "Copying to Android..."
        npx cap copy android
        print_success "Copy complete"
        
        # Install
        print_info "Installing to device..."
        cd android
        ./gradlew installDebug
        print_success "App installed on device"
        
        print_success "Quick update complete! 🎉"
        ;;
        
    3)
        print_info "Syncing to Android..."
        npx cap sync android
        print_success "Sync complete!"
        ;;
        
    4)
        print_info "Installing to device..."
        cd android
        ./gradlew installDebug
        print_success "App installed!"
        ;;
        
    5)
        print_info "Opening in Android Studio..."
        npx cap open android
        ;;
        
    6)
        print_info "Starting logcat (Press Ctrl+C to stop)..."
        echo ""
        adb logcat | grep -i "islam\|capacitor\|error\|androidruntime"
        ;;
        
    7)
        print_info "Cleaning build..."
        cd android
        ./gradlew clean
        print_success "Clean complete!"
        
        read -p "Do you want to rebuild? (y/n): " rebuild
        if [ "$rebuild" = "y" ]; then
            print_info "Rebuilding..."
            ./gradlew assembleDebug
            print_success "Rebuild complete!"
        fi
        ;;
        
    8)
        print_warning "Building release APK..."
        print_warning "Make sure you have configured signing in android/app/build.gradle"
        echo ""
        read -p "Continue? (y/n): " continue
        
        if [ "$continue" = "y" ]; then
            # Copy files
            print_info "Copying files to www/..."
            ./build-scripts.sh
            print_success "Files copied"
            
            # Sync
            print_info "Syncing to Android..."
            npx cap sync android
            print_success "Sync complete"
            
            # Build release
            print_info "Building release APK..."
            cd android
            ./gradlew assembleRelease
            
            if [ $? -eq 0 ]; then
                print_success "Release APK built successfully!"
                print_info "APK location: android/app/build/outputs/apk/release/"
                
                # Open folder
                open app/build/outputs/apk/release/ 2>/dev/null || \
                xdg-open app/build/outputs/apk/release/ 2>/dev/null || \
                echo "Check: $(pwd)/app/build/outputs/apk/release/"
            else
                print_error "Build failed. Check errors above."
            fi
        fi
        ;;
        
    9)
        print_info "Exiting..."
        exit 0
        ;;
        
    *)
        print_error "Invalid option"
        exit 1
        ;;
esac

echo ""
print_success "Done! 🚀"
