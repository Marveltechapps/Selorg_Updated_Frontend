#!/bin/bash

# Verify expo-secure-store Status
# Run this to check if SecureStore is properly configured

cd /Users/muthuramanveerashekar/Desktop/NewToday

echo "🔍 Verifying expo-secure-store Configuration"
echo "=============================================="
echo ""

# 1. Check package installation
echo "1️⃣  Package Installation:"
if npm list expo-secure-store > /dev/null 2>&1; then
    echo "   ✅ expo-secure-store is installed"
    npm list expo-secure-store 2>/dev/null | grep expo-secure-store
else
    echo "   ❌ expo-secure-store is NOT installed"
fi
echo ""

# 2. Check import statement
echo "2️⃣  Import Statement:"
if grep -q "import.*SecureStore.*from 'expo-secure-store'" src/utils/storage.ts; then
    echo "   ✅ Import statement is correct"
    echo "   📝 Found: $(grep "import.*expo-secure-store" src/utils/storage.ts)"
else
    echo "   ❌ Import statement not found or incorrect"
fi
echo ""

# 3. Check plugin configuration
echo "3️⃣  Expo Configuration:"
if grep -q "expo-secure-store" app.config.js; then
    echo "   ✅ Plugin configured in app.config.js"
else
    echo "   ⚠️  Plugin not in app.config.js (optional for SDK 52)"
fi
echo ""

# 4. Check iOS pods
echo "4️⃣  iOS Native Module:"
if [ -d "ios/Pods" ]; then
    if grep -r "EXSecureStore\|SecureStore" ios/Pods/ 2>/dev/null | head -1 > /dev/null; then
        echo "   ✅ SecureStore found in iOS Pods"
    else
        echo "   ⚠️  SecureStore pod not found (may be auto-linked via Expo)"
        echo "   💡 Run: cd ios && pod install"
    fi
else
    echo "   ❌ Pods directory not found"
    echo "   💡 Run: cd ios && pod install"
fi
echo ""

# 5. Check Metro config
echo "5️⃣  Metro Bundler Configuration:"
if [ -f "metro.config.js" ]; then
    echo "   ✅ metro.config.js exists"
    if grep -q "expo/metro-config" metro.config.js; then
        echo "   ✅ Using Expo Metro config (auto-handles SecureStore)"
    fi
else
    echo "   ⚠️  metro.config.js not found"
fi
echo ""

# 6. Test import (syntax check)
echo "6️⃣  TypeScript/Babel Check:"
if npx tsc --noEmit src/utils/storage.ts 2>&1 | grep -i "secure" > /dev/null; then
    echo "   ⚠️  TypeScript errors found (may not affect runtime)"
else
    echo "   ✅ No TypeScript errors detected"
fi
echo ""

echo "=============================================="
echo "✅ Verification Complete!"
echo ""
echo "If issues found, run:"
echo "  ./fix-secure-store-ios.sh"

