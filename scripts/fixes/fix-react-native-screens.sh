#!/bin/bash

# Fix React Native Screens Linking Issue
# This script fixes the "Screen native module hasn't been linked" error

set -e

echo "🔧 Fixing React Native Screens Linking Issue..."
echo ""

cd "$(dirname "$0")"

# Step 1: Verify react-native-screens is installed
echo "📦 Step 1: Verifying react-native-screens installation..."
if npm list react-native-screens > /dev/null 2>&1; then
    echo "✅ react-native-screens is installed"
    npm list react-native-screens
else
    echo "❌ react-native-screens is not installed. Installing..."
    npm install react-native-screens
fi
echo ""

# Step 2: Clean Metro bundler cache
echo "🧹 Step 2: Cleaning Metro bundler cache..."
rm -rf /tmp/metro-* 2>/dev/null || true
rm -rf /tmp/haste-* 2>/dev/null || true
rm -rf node_modules/.cache 2>/dev/null || true
echo "✅ Metro cache cleaned"
echo ""

# Step 3: Fix iOS - Install CocoaPods
echo "🍎 Step 3: Fixing iOS - Installing CocoaPods..."
if [ -d "ios" ]; then
    cd ios
    export LANG=en_US.UTF-8
    pod install --repo-update
    echo "✅ iOS pods installed successfully"
    cd ..
else
    echo "⚠️  iOS directory not found, skipping iOS setup"
fi
echo ""

# Step 4: Fix Android - Clean build
echo "🤖 Step 4: Fixing Android - Cleaning build..."
if [ -d "android" ]; then
    cd android
    if command -v ./gradlew > /dev/null 2>&1; then
        ./gradlew clean || echo "⚠️  Gradle clean failed (Java may not be installed)"
    else
        echo "⚠️  Gradlew not found or not executable"
    fi
    cd ..
    echo "✅ Android build cleaned"
else
    echo "⚠️  Android directory not found, skipping Android setup"
fi
echo ""

# Step 5: Verify enableScreens() is called
echo "✅ Step 5: Verifying enableScreens() configuration..."
if grep -q "enableScreens" index.js; then
    echo "✅ enableScreens() is properly configured in index.js"
else
    echo "❌ enableScreens() is missing in index.js"
    echo "   Please add: import { enableScreens } from 'react-native-screens';"
    echo "   And call: enableScreens(true);"
fi
echo ""

echo "🎉 Fix script completed!"
echo ""
echo "📋 Next steps:"
echo "   1. Start Metro bundler: npm start -- --reset-cache"
echo "   2. In a new terminal, run:"
echo "      - iOS: npm run ios"
echo "      - Android: npm run android"
echo ""

