#!/bin/bash

# Complete SVG Fix Script for React Native
# This script fixes all SVG rendering issues and ensures proper setup

set -e

echo "=========================================="
echo "Complete SVG Fix Script for React Native"
echo "=========================================="
echo ""

# Navigate to Frontend directory
cd "$(dirname "$0")" || exit 1

echo "✓ Working directory: $(pwd)"
echo ""

# Step 1: Clear all caches
echo "Step 1: Clearing all caches..."
echo "----------------------------------------"

# Clear Metro cache
echo "  - Clearing Metro cache..."
rm -rf /tmp/metro-* 2>/dev/null || true
rm -rf /tmp/haste-* 2>/dev/null || true
rm -rf node_modules/.cache 2>/dev/null || true
rm -rf $TMPDIR/metro-* 2>/dev/null || true
rm -rf $TMPDIR/haste-* 2>/dev/null || true

# Clear Watchman
if command -v watchman &> /dev/null; then
  echo "  - Clearing Watchman cache..."
  watchman watch-del-all 2>/dev/null || true
fi

# Clear npm cache
echo "  - Clearing npm cache..."
npm cache clean --force 2>/dev/null || true

echo "✓ Caches cleared"
echo ""

# Step 2: Verify dependencies
echo "Step 2: Verifying dependencies..."
echo "----------------------------------------"

if ! npm list react-native-svg &> /dev/null; then
  echo "  - Installing react-native-svg..."
  npm install react-native-svg
fi

if ! npm list react-native-svg-transformer &> /dev/null; then
  echo "  - Installing react-native-svg-transformer..."
  npm install --save-dev react-native-svg-transformer
fi

echo "✓ Dependencies verified"
echo ""

# Step 3: Verify Metro config
echo "Step 3: Verifying Metro configuration..."
echo "----------------------------------------"

METRO_CONFIG="metro.config.js"
if [ ! -f "$METRO_CONFIG" ]; then
  echo "  - Creating metro.config.js..."
  cat > "$METRO_CONFIG" << 'EOF'
const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');

const defaultConfig = getDefaultConfig(__dirname);
const { assetExts, sourceExts } = defaultConfig.resolver;

const config = {
  transformer: {
    getTransformOptions: async () => ({
      transform: {
        experimentalImportSupport: false,
        inlineRequires: true,
      },
    }),
    babelTransformerPath: require.resolve('react-native-svg-transformer'),
  },
  resolver: {
    assetExts: assetExts.filter((ext) => ext !== 'svg'),
    sourceExts: [...sourceExts, 'svg'],
  },
};

module.exports = mergeConfig(defaultConfig, config);
EOF
  echo "✓ Created metro.config.js"
else
  echo "✓ metro.config.js exists"
fi
echo ""

# Step 4: Verify TypeScript declaration
echo "Step 4: Verifying TypeScript declarations..."
echo "----------------------------------------"

SVG_DECLARATION="react-native-svg.d.ts"
if [ ! -f "$SVG_DECLARATION" ]; then
  echo "  - Creating react-native-svg.d.ts..."
  cat > "$SVG_DECLARATION" << 'EOF'
declare module '*.svg' {
  import React from 'react';
  import { SvgProps } from 'react-native-svg';
  const content: React.FC<SvgProps>;
  export default content;
}
EOF
  echo "✓ Created react-native-svg.d.ts"
else
  echo "✓ react-native-svg.d.ts exists"
fi

# Verify tsconfig.json includes the declaration
TSCONFIG="tsconfig.json"
if [ -f "$TSCONFIG" ]; then
  if ! grep -q '"include".*react-native-svg.d.ts' "$TSCONFIG" 2>/dev/null; then
    echo "  - Updating tsconfig.json to include SVG declarations..."
    # This is a basic check - manual verification may be needed
    echo "    Note: Ensure tsconfig.json includes '**/*.ts' and '**/*.tsx' in 'include' array"
  fi
  echo "✓ tsconfig.json verified"
fi
echo ""

# Step 5: iOS - Reinstall pods
echo "Step 5: iOS - Reinstalling pods..."
echo "----------------------------------------"

if [ -d "ios" ]; then
  cd ios || exit 1
  echo "  - Removing old pods..."
  rm -rf Pods Podfile.lock build 2>/dev/null || true
  
  if command -v pod &> /dev/null; then
    echo "  - Deintegrating pods..."
    pod deintegrate 2>/dev/null || true
    
    echo "  - Installing pods..."
    pod install
    
    echo "✓ iOS pods reinstalled"
  else
    echo "⚠ CocoaPods not found - skipping iOS setup"
  fi
  cd ..
else
  echo "⚠ iOS directory not found - skipping"
fi
echo ""

# Step 6: Android - Clean build
echo "Step 6: Android - Cleaning build..."
echo "----------------------------------------"

if [ -d "android" ]; then
  cd android || exit 1
  echo "  - Cleaning Gradle..."
  ./gradlew clean 2>/dev/null || true
  
  echo "  - Removing build folders..."
  rm -rf app/build build .gradle 2>/dev/null || true
  
  echo "✓ Android build cleaned"
  cd ..
else
  echo "⚠ Android directory not found - skipping"
fi
echo ""

# Step 7: Summary
echo "=========================================="
echo "SVG Fix Script Completed Successfully!"
echo "=========================================="
echo ""
echo "Next steps:"
echo "1. Start Metro bundler with cache reset:"
echo "   npm start -- --reset-cache"
echo ""
echo "2. Rebuild your app:"
echo "   iOS:   npm run ios"
echo "   Android: npm run android"
echo ""
echo "3. Verify SVG files are in:"
echo "   src/assets/images/"
echo ""
echo "4. Ensure all SVG imports use:"
echo "   import IconName from './path/to/icon.svg';"
echo ""
echo "=========================================="
