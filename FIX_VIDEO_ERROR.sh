#!/bin/bash

# React Native Video Fix Script
# This script fixes the "Cannot read property Constants of undefined" error

set -e

echo "🔧 Starting React Native Video Fix..."
echo ""

cd "$(dirname "$0")"

# Step 1: Clean npm cache
echo "📦 Step 1: Cleaning npm cache..."
npm cache clean --force
echo "✅ npm cache cleaned"
echo ""

# Step 2: Remove node_modules
echo "🗑️  Step 2: Removing node_modules and lock files..."
rm -rf node_modules package-lock.json
echo "✅ node_modules removed"
echo ""

# Step 3: Clean iOS
echo "🍎 Step 3: Cleaning iOS build artifacts..."
cd ios
rm -rf build Pods Podfile.lock
echo "✅ iOS build artifacts cleaned"
cd ..
echo ""

# Step 4: Clean Android (optional)
echo "🤖 Step 4: Cleaning Android build artifacts..."
cd android
./gradlew clean 2>/dev/null || echo "⚠️  Gradle clean skipped (not critical)"
rm -rf .gradle build app/build 2>/dev/null || true
cd ..
echo "✅ Android build artifacts cleaned"
echo ""

# Step 5: Reinstall npm packages
echo "📥 Step 5: Installing npm packages..."
npm install
echo "✅ npm packages installed"
echo ""

# Step 6: Update react-native-video to latest version
echo "⬆️  Step 6: Updating react-native-video..."
npm install react-native-video@^6.0.0
echo "✅ react-native-video updated"
echo ""

# Step 7: Install iOS pods
echo "🍎 Step 7: Installing iOS pods..."
cd ios
pod deintegrate 2>/dev/null || echo "⚠️  Pod deintegrate skipped (not critical)"
pod install
echo "✅ iOS pods installed"
cd ..
echo ""

# Step 8: Clear Metro cache
echo "🧹 Step 8: Clearing Metro bundler cache..."
npx react-native start --reset-cache &
METRO_PID=$!
sleep 3
kill $METRO_PID 2>/dev/null || true
echo "✅ Metro cache cleared"
echo ""

echo "✅ Fix complete!"
echo ""
echo "📋 Next steps:"
echo "1. Rebuild your iOS app: npx react-native run-ios"
echo "2. If using Xcode: Product > Clean Build Folder (Cmd+Shift+K)"
echo "3. Restart Metro bundler: npx react-native start --reset-cache"
echo ""
echo "If the error persists, check:"
echo "- Xcode build logs for native module errors"
echo "- Pod installation was successful: cd ios && pod list | grep react-native-video"
echo "- React Native version compatibility with react-native-video@6.x"

