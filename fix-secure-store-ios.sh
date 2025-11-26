#!/bin/bash

# Fix expo-secure-store iOS Native Module Error
# This script ensures expo-secure-store is properly installed and linked

set -e

cd /Users/muthuramanveerashekar/Desktop/NewToday

echo "🔧 Fixing expo-secure-store iOS Native Module Issue..."
echo ""

# Step 1: Verify package is installed
echo "📦 Step 1: Verifying expo-secure-store installation..."
if npm list expo-secure-store > /dev/null 2>&1; then
    echo "✅ expo-secure-store is installed"
    npm list expo-secure-store
else
    echo "❌ expo-secure-store is NOT installed. Installing..."
    npx expo install expo-secure-store
fi

echo ""
echo "🔧 Step 2: Updating Expo configuration..."

# Step 3: Clean iOS build
echo ""
echo "🧹 Step 3: Cleaning iOS build directories..."
cd ios
rm -rf build
rm -rf DerivedData
rm -rf Pods
rm -f Podfile.lock

echo ""
echo "📦 Step 4: Reinstalling CocoaPods dependencies..."
pod deintegrate 2>/dev/null || true
pod install --repo-update

echo ""
echo "🔨 Step 5: Verifying Expo modules autolinking..."
cd ..
npx expo-doctor

echo ""
echo "✅ Fix complete! Next steps:"
echo ""
echo "1. Rebuild the iOS app:"
echo "   npx expo run:ios"
echo ""
echo "2. Or clean and rebuild:"
echo "   cd ios"
echo "   xcodebuild clean -workspace SELORG.xcworkspace -scheme SELORG"
echo "   cd .."
echo "   npx expo run:ios"
echo ""

