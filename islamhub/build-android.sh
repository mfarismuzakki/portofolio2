#!/bin/bash

# Quick Build Script for IslamHub Mobile
# Run this before building Android app

set -e  # Exit on error

echo "🚀 IslamHub Mobile - Quick Build"
echo "================================"

# Step 1: Sync root to www
echo ""
echo "📦 Step 1: Syncing root to www/..."
./sync-www.sh

# Step 2: Sync Capacitor
echo ""
echo "⚡ Step 2: Syncing Capacitor..."
npx cap sync android

echo ""
echo "✅ Build preparation complete!"
echo ""
echo "Next steps:"
echo "  1. Open Android Studio: npx cap open android"
echo "  2. Build & Run in Android Studio"
echo ""
