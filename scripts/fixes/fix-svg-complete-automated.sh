#!/bin/bash

# Complete SVG Fix Script for React Native
# This script fixes SVG rendering issues by clearing caches, verifying configurations,
# and ensuring all required dependencies are properly set up.

set -e

echo "🚀 Starting Complete SVG Fix for React Native..."
echo "=================================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$PROJECT_ROOT"

# Step 1: Clear all caches
echo ""
echo "${YELLOW}Step 1: Clearing all caches...${NC}"
echo "----------------------------------------"

# Clear Metro bundler cache
echo "Clearing Metro bundler cache..."
rm -rf $TMPDIR/metro-* 2>/dev/null || true
rm -rf $TMPDIR/haste-* 2>/dev/null || true
rm -rf $TMPDIR/react-* 2>/dev/null || true
npx react-native start --reset-cache &
METRO_PID=$!
sleep 2
kill $METRO_PID 2>/dev/null || true
echo "${GREEN}✓ Metro cache cleared${NC}"

# Clear watchman
echo "Clearing Watchman cache..."
watchman watch-del-all 2>/dev/null || echo "Watchman not installed, skipping..."

# Clear npm/yarn cache
echo "Clearing node_modules cache..."
rm -rf node_modules/.cache 2>/dev/null || true

# Clear iOS build cache
echo "Clearing iOS build cache..."
cd ios
rm -rf build 2>/dev/null || true
rm -rf Pods 2>/dev/null || true
rm -rf Podfile.lock 2>/dev/null || true
rm -rf ~/Library/Developer/Xcode/DerivedData/* 2>/dev/null || true
cd ..

# Clear Android build cache
echo "Clearing Android build cache..."
cd android
./gradlew clean 2>/dev/null || echo "Gradle clean skipped (not critical)"
rm -rf .gradle 2>/dev/null || true
rm -rf app/build 2>/dev/null || true
cd ..

echo "${GREEN}✓ All caches cleared${NC}"

# Step 2: Verify and fix Metro config
echo ""
echo "${YELLOW}Step 2: Verifying Metro configuration...${NC}"
echo "----------------------------------------"

METRO_CONFIG="metro.config.js"
if [ ! -f "$METRO_CONFIG" ]; then
    echo "${RED}✗ metro.config.js not found!${NC}"
    exit 1
fi

# Check if react-native-svg-transformer is configured
if ! grep -q "react-native-svg-transformer" "$METRO_CONFIG"; then
    echo "${RED}✗ react-native-svg-transformer not found in metro.config.js${NC}"
    exit 1
fi

# Check if SVG is in sourceExts and not in assetExts
if grep -q "assetExts.*svg" "$METRO_CONFIG" && ! grep -q "assetExts.filter.*svg" "$METRO_CONFIG"; then
    echo "${YELLOW}⚠ SVG might be in assetExts, checking...${NC}"
fi

echo "${GREEN}✓ Metro configuration verified${NC}"

# Step 3: Verify TypeScript declarations
echo ""
echo "${YELLOW}Step 3: Verifying TypeScript declarations...${NC}"
echo "----------------------------------------"

SVG_DTS="react-native-svg.d.ts"
if [ ! -f "$SVG_DTS" ]; then
    echo "${YELLOW}⚠ react-native-svg.d.ts not found, creating...${NC}"
    cat > "$SVG_DTS" << 'EOF'
declare module '*.svg' {
  import React from 'react';
  import { SvgProps } from 'react-native-svg';
  const content: React.FC<SvgProps>;
  export default content;
}
EOF
    echo "${GREEN}✓ Created react-native-svg.d.ts${NC}"
else
    echo "${GREEN}✓ TypeScript declarations exist${NC}"
fi

# Step 4: Verify package.json dependencies
echo ""
echo "${YELLOW}Step 4: Verifying dependencies...${NC}"
echo "----------------------------------------"

if ! grep -q '"react-native-svg"' package.json; then
    echo "${RED}✗ react-native-svg not found in package.json${NC}"
    exit 1
fi

if ! grep -q '"react-native-svg-transformer"' package.json; then
    echo "${RED}✗ react-native-svg-transformer not found in package.json${NC}"
    exit 1
fi

echo "${GREEN}✓ Dependencies verified${NC}"

# Step 5: Reinstall dependencies
echo ""
echo "${YELLOW}Step 5: Reinstalling dependencies...${NC}"
echo "----------------------------------------"

if [ -f "yarn.lock" ]; then
    echo "Using Yarn..."
    yarn install
else
    echo "Using npm..."
    npm install
fi

echo "${GREEN}✓ Dependencies reinstalled${NC}"

# Step 6: iOS setup
echo ""
echo "${YELLOW}Step 6: Setting up iOS...${NC}"
echo "----------------------------------------"

cd ios
if [ -f "Podfile" ]; then
    echo "Installing CocoaPods..."
    pod install --repo-update
    echo "${GREEN}✓ iOS pods installed${NC}"
else
    echo "${YELLOW}⚠ Podfile not found, skipping iOS setup${NC}"
fi
cd ..

# Step 7: Verify Babel config
echo ""
echo "${YELLOW}Step 7: Verifying Babel configuration...${NC}"
echo "----------------------------------------"

BABEL_CONFIG="babel.config.js"
if [ ! -f "$BABEL_CONFIG" ]; then
    echo "${YELLOW}⚠ babel.config.js not found, creating default...${NC}"
    cat > "$BABEL_CONFIG" << 'EOF'
module.exports = {
  presets: ['module:@react-native/babel-preset'],
};
EOF
    echo "${GREEN}✓ Created babel.config.js${NC}"
else
    echo "${GREEN}✓ Babel configuration exists${NC}"
fi

# Step 8: Final verification
echo ""
echo "${YELLOW}Step 8: Final verification...${NC}"
echo "----------------------------------------"

# Check if all required files exist
REQUIRED_FILES=("metro.config.js" "react-native-svg.d.ts" "package.json" "babel.config.js")
for file in "${REQUIRED_FILES[@]}"; do
    if [ -f "$file" ]; then
        echo "${GREEN}✓ $file exists${NC}"
    else
        echo "${RED}✗ $file missing!${NC}"
        exit 1
    fi
done

echo ""
echo "${GREEN}=================================================="
echo "✅ SVG Fix Complete!"
echo "==================================================${NC}"
echo ""
echo "Next steps:"
echo "1. Start Metro bundler: npm start -- --reset-cache"
echo "2. For iOS: cd ios && pod install && cd .. && npm run ios"
echo "3. For Android: npm run android"
echo ""
echo "If SVGs still don't render:"
echo "- Ensure you're importing SVGs as: import Icon from './path/to/icon.svg'"
echo "- Use them as components: <Icon width={24} height={24} />"
echo "- Check that SVG files are valid XML"
echo ""
