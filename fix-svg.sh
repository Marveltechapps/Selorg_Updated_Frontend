#!/bin/bash

echo "🔧 Fixing SVG rendering issues..."

# Step 1: Clear Metro cache
echo "1. Clearing Metro cache..."
rm -rf /tmp/metro-* 2>/dev/null
rm -rf /tmp/haste-* 2>/dev/null
rm -rf node_modules/.cache 2>/dev/null

# Step 2: Clear watchman
echo "2. Clearing Watchman..."
watchman watch-del-all 2>/dev/null || echo "Watchman not installed, skipping..."

# Step 3: iOS - Reinstall pods
if [ -d "ios" ]; then
    echo "3. Reinstalling iOS pods..."
    cd ios
    pod deintegrate 2>/dev/null
    pod install
    cd ..
fi

# Step 4: Android - Clean build
if [ -d "android" ]; then
    echo "4. Cleaning Android build..."
    cd android
    ./gradlew clean 2>/dev/null || echo "Gradle clean failed, continuing..."
    cd ..
fi

# Step 5: Verify dependencies
echo "5. Verifying dependencies..."
npm list react-native-svg react-native-svg-transformer

echo ""
echo "✅ Fix complete! Now run:"
echo "   npm start -- --reset-cache"
echo ""
echo "Then in another terminal:"
echo "   npm run ios    # or npm run android"

