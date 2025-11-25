#!/bin/bash

# ============================================
# Complete SVG Fix Script for React Native
# ============================================
# This script fixes SVG rendering issues by:
# 1. Clearing all caches
# 2. Verifying and repairing configurations
# 3. Reinstalling native dependencies
# 4. Ensuring proper TypeScript declarations
# ============================================

set -e  # Exit on error

echo "==========================================="
echo "Complete SVG Fix Script for React Native"
echo "==========================================="
echo ""

# Get the script directory
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd "$SCRIPT_DIR"

echo "✓ Working directory: $(pwd)"
echo ""

# Step 1: Clear all caches
echo "Step 1: Clearing all caches..."
echo "----------------------------------------"
echo "  - Clearing Metro cache..."
rm -rf /tmp/metro-* 2>/dev/null || true
rm -rf /tmp/haste-* 2>/dev/null || true
rm -rf node_modules/.cache 2>/dev/null || true
rm -rf $TMPDIR/metro-* 2>/dev/null || true
rm -rf $TMPDIR/haste-* 2>/dev/null || true

echo "  - Clearing Watchman cache..."
if command -v watchman &> /dev/null; then
    watchman watch-del-all 2>/dev/null || true
fi

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

# Step 3: Verify Metro configuration
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
    # Verify it has the correct configuration
    if ! grep -q "react-native-svg-transformer" "$METRO_CONFIG"; then
        echo "  ⚠️  Warning: metro.config.js may not have SVG transformer configured"
        echo "     Please verify it includes: babelTransformerPath: require.resolve('react-native-svg-transformer')"
    fi
fi
echo ""

# Step 4: Verify TypeScript declarations
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

# Verify tsconfig.json includes SVG declarations
TS_CONFIG="tsconfig.json"
if [ -f "$TS_CONFIG" ]; then
    echo "  - Verifying tsconfig.json..."
    if ! grep -q "\*\\.svg" "$TS_CONFIG" 2>/dev/null; then
        echo "    Note: Ensure tsconfig.json includes '**/*.ts' and '**/*.tsx' in 'include' array"
    fi
    echo "✓ tsconfig.json verified"
else
    echo "  ⚠️  tsconfig.json not found"
fi
echo ""

# Step 5: iOS - Reinstalling pods
echo "Step 5: iOS - Reinstalling pods..."
echo "----------------------------------------"
if [ -d "ios" ]; then
    cd ios
    
    echo "  - Removing old pods..."
    rm -rf Pods Podfile.lock build 2>/dev/null || true
    
    echo "  - Deintegrating pods..."
    if command -v pod &> /dev/null; then
        pod deintegrate 2>/dev/null || true
    fi
    
    echo "  - Installing pods..."
    if command -v pod &> /dev/null; then
        pod install
    else
        echo "  ⚠️  CocoaPods not found. Please install: sudo gem install cocoapods"
    fi
    
    cd ..
    echo "✓ iOS pods reinstalled"
else
    echo "  ⚠️  iOS directory not found, skipping..."
fi
echo ""

# Step 6: Android - Cleaning build
echo "Step 6: Android - Cleaning build..."
echo "----------------------------------------"
if [ -d "android" ]; then
    cd android
    
    echo "  - Cleaning Gradle..."
    if [ -f "gradlew" ]; then
        ./gradlew clean 2>/dev/null || true
    fi
    
    echo "  - Removing build folders..."
    rm -rf app/build build .gradle 2>/dev/null || true
    
    cd ..
    echo "✓ Android build cleaned"
else
    echo "  ⚠️  Android directory not found, skipping..."
fi
echo ""

# Step 7: Final verification
echo "Step 7: Final verification..."
echo "----------------------------------------"
echo "✓ Metro config: $([ -f "$METRO_CONFIG" ] && echo "✓" || echo "✗")"
echo "✓ SVG declaration: $([ -f "$SVG_DECLARATION" ] && echo "✓" || echo "✗")"
echo "✓ react-native-svg: $(npm list react-native-svg 2>/dev/null | grep -q "react-native-svg@" && echo "✓" || echo "✗")"
echo "✓ react-native-svg-transformer: $(npm list react-native-svg-transformer 2>/dev/null | grep -q "react-native-svg-transformer@" && echo "✓" || echo "✗")"
echo ""

echo "==========================================="
echo "SVG Fix Script Completed Successfully!"
echo "==========================================="
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
echo "==========================================="

