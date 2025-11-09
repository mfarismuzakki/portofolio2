#!/bin/bash

# IslamHub Mobile - Sync Root to www/
# This script copies files from root to www/ for Capacitor build

echo "🔄 Syncing root to www/ for Capacitor build..."
echo "================================================"

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Create www directory if doesn't exist
mkdir -p www

# Copy files
echo -e "${YELLOW}📁 Copying files...${NC}"

# Copy HTML
cp index.html www/
cp clear-cache.html www/
echo "  ✓ HTML files"

# Copy manifest and service worker
cp manifest.json www/
cp sw.js www/
echo "  ✓ Manifest & Service Worker"

# Copy CSS
rm -rf www/css
cp -r css www/
echo "  ✓ CSS files"

# Copy JS
rm -rf www/js
cp -r js www/
echo "  ✓ JS files"

# Copy assets (excluding audio folder)
mkdir -p www/assets
cp -r assets/icons www/assets/ 2>/dev/null || true
cp -r assets/sounds www/assets/ 2>/dev/null || true
echo "  ✓ Assets (audio excluded)"

# Copy capacitor config to www
cp capacitor.config.json www/
echo "  ✓ Capacitor config"

npx cap sync android

