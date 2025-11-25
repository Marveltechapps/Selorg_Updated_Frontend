#!/bin/bash

# Fix NetInfo Native Module Linking
# This script will clean, reinstall, and rebuild the native modules

set -e

echo "🔧 Fixing NetInfo Native Module Linking..."
echo ""

# Navigate to project root
cd "$(dirname "$0")"

# Step 1: Clean npm cache and node_modules
echo "📦 Step 1: Cleaning npm cache and node_modules..."
rm -rf node_modules
rm -f package-lock.json
npm cache clean --force

# Step 2: Reinstall dependencies
echo "📦 Step 2: Reinstalling npm dependencies..."
npm install

# Step 3: Clean iOS build
echo "🍎 Step 3: Cleaning iOS build..."
cd ios
rm -rf build
rm -rf Pods
rm -f Podfile.lock
export LANG=en_US.UTF-8
pod deintegrate || true
pod install
cd ..

# Step 4: Clean Android build
echo "🤖 Step 4: Cleaning Android build..."
cd android
./gradlew clean || true
cd ..

# Step 5: Clean Metro bundler cache
echo "🧹 Step 5: Cleaning Metro bundler cache..."
rm -rf $TMPDIR/react-*
rm -rf $TMPDIR/metro-*

echo ""
echo "✅ Cleanup complete!"
echo ""
echo "📝 Next steps:"
echo "1. For iOS: Run 'cd ios && xcodebuild clean' (optional, but recommended)"
echo "2. Start Metro: 'npm start -- --reset-cache'"
echo "3. Rebuild the app:"
echo "   - iOS: 'npm run ios' or open Xcode and build"
echo "   - Android: 'npm run android'"
echo ""
echo "⚠️  Important: Make sure to rebuild the app completely, not just reload!"


