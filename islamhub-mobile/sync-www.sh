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

# Copy assets
rm -rf www/assets
cp -r assets www/
echo "  ✓ Assets"

# Copy capacitor config to www
cp capacitor.config.json www/
echo "  ✓ Capacitor config"

echo ""
echo -e "${GREEN}✅ Sync complete!${NC}"
echo ""
echo "📱 Next steps:"
echo "   1. npx cap sync           - Sync to native projects"
echo "   2. npx cap open android   - Open Android Studio"
echo ""
