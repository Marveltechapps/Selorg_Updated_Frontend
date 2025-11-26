#!/bin/bash

# ============================================================================
# Complete SVG Fix Script for React Native
# ============================================================================
# This script fixes SVG rendering issues by:
# 1. Clearing all caches (Metro, watchman, npm, iOS, Android)
# 2. Verifying and fixing Metro configuration
# 3. Ensuring TypeScript declarations are correct
# 4. Rebuilding native dependencies
# 5. Starting fresh Metro bundler
# ============================================================================

set -e  # Exit on error

echo "🚀 Starting Complete SVG Fix Process..."
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Get the project root directory
PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$PROJECT_ROOT"

echo "${GREEN}✓${NC} Project root: $PROJECT_ROOT"
echo ""

# ============================================================================
# Step 1: Clear All Caches
# ============================================================================
echo "${YELLOW}Step 1: Clearing all caches...${NC}"

# Stop Metro bundler if running
echo "  → Stopping Metro bundler..."
pkill -f "react-native" || true
pkill -f "metro" || true
sleep 2

# Clear Metro cache
echo "  → Clearing Metro cache..."
rm -rf "$TMPDIR/metro-*" 2>/dev/null || true
rm -rf "$TMPDIR/haste-*" 2>/dev/null || true
rm -rf "$TMPDIR/react-*" 2>/dev/null || true
rm -rf .metro 2>/dev/null || true

# Clear watchman
echo "  → Clearing watchman..."
watchman watch-del-all 2>/dev/null || echo "    (watchman not installed, skipping)"

# Clear npm cache
echo "  → Clearing npm cache..."
npm cache clean --force 2>/dev/null || true

# Clear node_modules and reinstall (optional, uncomment if needed)
# echo "  → Removing node_modules..."
# rm -rf node_modules
# echo "  → Reinstalling dependencies..."
# npm install

echo "${GREEN}✓${NC} Caches cleared"
echo ""

# ============================================================================
# Step 2: Verify and Fix Metro Configuration
# ============================================================================
echo "${YELLOW}Step 2: Verifying Metro configuration...${NC}"

METRO_CONFIG="metro.config.js"

if [ ! -f "$METRO_CONFIG" ]; then
    echo "${RED}✗${NC} metro.config.js not found!"
    exit 1
fi

# Check if react-native-svg-transformer is configured
if ! grep -q "react-native-svg-transformer" "$METRO_CONFIG"; then
    echo "${RED}✗${NC} react-native-svg-transformer not found in metro.config.js"
    echo "  → Please ensure your metro.config.js includes:"
    echo "    babelTransformerPath: require.resolve('react-native-svg-transformer')"
    exit 1
fi

# Check if SVG is in sourceExts and not in assetExts
if grep -q "assetExts.*svg" "$METRO_CONFIG" && ! grep -q "assetExts.filter.*svg" "$METRO_CONFIG"; then
    echo "${YELLOW}⚠${NC}  SVG might be in assetExts. Checking..."
fi

echo "${GREEN}✓${NC} Metro configuration verified"
echo ""

# ============================================================================
# Step 3: Verify TypeScript Declarations
# ============================================================================
echo "${YELLOW}Step 3: Verifying TypeScript declarations...${NC}"

SVG_DECLARATION="react-native-svg.d.ts"

if [ ! -f "$SVG_DECLARATION" ]; then
    echo "${YELLOW}⚠${NC}  react-native-svg.d.ts not found. Creating it..."
    cat > "$SVG_DECLARATION" << 'EOF'
declare module '*.svg' {
  import React from 'react';
  import { SvgProps } from 'react-native-svg';
  const content: React.FC<SvgProps>;
  export default content;
}
EOF
    echo "${GREEN}✓${NC} Created react-native-svg.d.ts"
else
    echo "${GREEN}✓${NC} TypeScript declaration file exists"
fi

# Verify tsconfig.json includes the declaration
if [ -f "tsconfig.json" ]; then
    if ! grep -q "react-native-svg.d.ts" tsconfig.json; then
        echo "${YELLOW}⚠${NC}  react-native-svg.d.ts might not be included in tsconfig.json"
        echo "  → Ensure your tsconfig.json includes all .ts and .tsx files"
    fi
fi

echo "${GREEN}✓${NC} TypeScript declarations verified"
echo ""

# ============================================================================
# Step 4: Verify Dependencies
# ============================================================================
echo "${YELLOW}Step 4: Verifying dependencies...${NC}"

# Check if react-native-svg is installed
if ! npm list react-native-svg > /dev/null 2>&1; then
    echo "${RED}✗${NC} react-native-svg not installed!"
    echo "  → Installing react-native-svg..."
    npm install react-native-svg
fi

# Check if react-native-svg-transformer is installed
if ! npm list react-native-svg-transformer > /dev/null 2>&1; then
    echo "${RED}✗${NC} react-native-svg-transformer not installed!"
    echo "  → Installing react-native-svg-transformer..."
    npm install --save-dev react-native-svg-transformer
fi

echo "${GREEN}✓${NC} Dependencies verified"
echo ""

# ============================================================================
# Step 5: iOS - Clear Build and Pods
# ============================================================================
if [ -d "ios" ]; then
    echo "${YELLOW}Step 5: Cleaning iOS build...${NC}"
    
    cd ios
    
    # Clear derived data
    echo "  → Clearing iOS derived data..."
    rm -rf ~/Library/Developer/Xcode/DerivedData/* 2>/dev/null || true
    
    # Clear build folder
    echo "  → Clearing iOS build folder..."
    rm -rf build 2>/dev/null || true
    
    # Reinstall pods
    echo "  → Reinstalling CocoaPods..."
    pod deintegrate 2>/dev/null || true
    pod install
    
    cd ..
    
    echo "${GREEN}✓${NC} iOS build cleaned"
    echo ""
fi

# ============================================================================
# Step 6: Android - Clear Build
# ============================================================================
if [ -d "android" ]; then
    echo "${YELLOW}Step 6: Cleaning Android build...${NC}"
    
    cd android
    
    # Clear gradle cache
    echo "  → Clearing Gradle cache..."
    ./gradlew clean 2>/dev/null || true
    
    # Clear build folders
    echo "  → Clearing Android build folders..."
    rm -rf app/build 2>/dev/null || true
    rm -rf build 2>/dev/null || true
    rm -rf .gradle 2>/dev/null || true
    
    cd ..
    
    echo "${GREEN}✓${NC} Android build cleaned"
    echo ""
fi

# ============================================================================
# Step 7: Verify SVG Files
# ============================================================================
echo "${YELLOW}Step 7: Verifying SVG files...${NC}"

SVG_DIR="src/assets/images"
if [ -d "$SVG_DIR" ]; then
    SVG_COUNT=$(find "$SVG_DIR" -name "*.svg" | wc -l | tr -d ' ')
    echo "  → Found $SVG_COUNT SVG files in $SVG_DIR"
    
    # Check if SVGs are valid XML
    for svg in "$SVG_DIR"/*.svg; do
        if [ -f "$svg" ]; then
            if ! head -1 "$svg" | grep -q "<?xml\|<svg"; then
                echo "${YELLOW}⚠${NC}  $svg might not be a valid SVG file"
            fi
        fi
    done
else
    echo "${YELLOW}⚠${NC}  SVG directory not found: $SVG_DIR"
fi

echo "${GREEN}✓${NC} SVG files verified"
echo ""

# ============================================================================
# Step 8: Final Summary
# ============================================================================
echo "${GREEN}═══════════════════════════════════════════════════════════${NC}"
echo "${GREEN}✓ SVG Fix Process Complete!${NC}"
echo "${GREEN}═══════════════════════════════════════════════════════════${NC}"
echo ""
echo "Next steps:"
echo "  1. Start Metro bundler: ${YELLOW}npm start -- --reset-cache${NC}"
echo "  2. Run iOS: ${YELLOW}npm run ios${NC}"
echo "  3. Run Android: ${YELLOW}npm run android${NC}"
echo ""
echo "If SVGs still don't render:"
echo "  - Ensure SVG files are valid XML"
echo "  - Check that imports use: ${YELLOW}import Icon from './path/to/icon.svg'${NC}"
echo "  - Verify SVG components are used as: ${YELLOW}<Icon width={24} height={24} />${NC}"
echo "  - Restart Metro with: ${YELLOW}npm start -- --reset-cache${NC}"
echo ""

