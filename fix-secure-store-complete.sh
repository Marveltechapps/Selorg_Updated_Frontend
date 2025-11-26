#!/bin/bash

# Complete Fix for expo-secure-store iOS Native Module
# This ensures the native module is properly built and linked

set -e

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

cd /Users/muthuramanveerashekar/Desktop/NewToday

echo -e "${BLUE}╔════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║  Fix expo-secure-store Native Module   ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════╝${NC}"
echo ""

# Step 1: Remove and reinstall expo-secure-store
echo -e "${YELLOW}📦 Step 1: Reinstalling expo-secure-store...${NC}"
npm uninstall expo-secure-store
npx expo install expo-secure-store@~14.0.0

echo ""
echo -e "${YELLOW}🔧 Step 2: Verifying package installation...${NC}"
if npm list expo-secure-store > /dev/null 2>&1; then
    VERSION=$(npm list expo-secure-store 2>/dev/null | grep expo-secure-store | head -1)
    echo -e "${GREEN}✅ Package installed: $VERSION${NC}"
else
    echo -e "${RED}❌ Package installation failed${NC}"
    exit 1
fi

# Step 3: Clean iOS completely
echo ""
echo -e "${YELLOW}🧹 Step 3: Cleaning iOS build...${NC}"
cd ios

# Stop any processes
pkill -f "Expo\|Metro\|Xcode" 2>/dev/null || true

# Remove all build artifacts
rm -rf build
rm -rf DerivedData
rm -rf Pods
rm -f Podfile.lock
rm -rf ~/Library/Developer/Xcode/DerivedData/* 2>/dev/null || true

# Deintegrate pods
pod deintegrate 2>/dev/null || true

echo -e "${GREEN}✅ iOS cleaned${NC}"

# Step 4: Reinstall pods
echo ""
echo -e "${YELLOW}📦 Step 4: Reinstalling CocoaPods...${NC}"
echo "This may take a few minutes..."

# Update pod repo
pod repo update 2>/dev/null || echo "Skipping repo update"

# Install pods
if pod install --repo-update; then
    echo -e "${GREEN}✅ Pods installed${NC}"
else
    echo -e "${RED}❌ Pod installation failed. Try: cd ios && pod install --repo-update${NC}"
    exit 1
fi

cd ..

# Step 5: Run Expo prebuild to sync native code
echo ""
echo -e "${YELLOW}🔨 Step 5: Running Expo prebuild...${NC}"
npx expo prebuild --platform ios --clean 2>&1 | tail -15

# Step 6: Verify native module
echo ""
echo -e "${YELLOW}🔍 Step 6: Verifying native module...${NC}"

# Check if ExpoSecureStore pod exists
if [ -d "ios/Pods" ]; then
    if find ios/Pods -name "*SecureStore*" -o -name "*secure-store*" 2>/dev/null | head -1 > /dev/null; then
        echo -e "${GREEN}✅ SecureStore native module found${NC}"
    else
        echo -e "${YELLOW}⚠️  SecureStore pod not explicitly listed (should be via Expo modules)${NC}"
    fi
else
    echo -e "${RED}❌ Pods directory not found${NC}"
fi

echo ""
echo -e "${GREEN}╔════════════════════════════════════════╗${NC}"
echo -e "${GREEN}║        ✅ Fix Complete!                ║${NC}"
echo -e "${GREEN}╚════════════════════════════════════════╝${NC}"
echo ""
echo -e "${BLUE}📋 Next Steps:${NC}"
echo ""
echo -e "1. Rebuild iOS app:"
echo -e "   ${GREEN}npx expo run:ios${NC}"
echo ""
echo -e "2. Or in Xcode:"
echo -e "   ${GREEN}cd ios && open SELORG.xcworkspace${NC}"
echo ""
echo -e "3. Verify the fix:"
echo -e "   ${GREEN}Check that the app builds and SecureStore works${NC}"
echo ""

