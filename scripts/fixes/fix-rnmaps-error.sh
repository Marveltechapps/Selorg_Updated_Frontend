#!/bin/bash

# Fix script for RNMapsAirModule error in React Native iOS
# This script will clean, reinstall pods, and prepare for rebuild

set -e

echo "🔧 Fixing RNMapsAirModule error..."
echo ""

# Navigate to project root
cd "$(dirname "$0")"

# Step 1: Clean React Native cache
echo "📦 Step 1: Cleaning React Native cache..."
rm -rf node_modules/.cache
rm -rf /tmp/metro-*
rm -rf /tmp/haste-*
echo "✅ React Native cache cleaned"
echo ""

# Step 2: Clean iOS build folders
echo "🧹 Step 2: Cleaning iOS build folders..."
cd ios

# Remove Pods
echo "  Removing Pods..."
rm -rf Pods
rm -rf Podfile.lock

# Remove build artifacts
echo "  Removing build artifacts..."
rm -rf build
rm -rf ~/Library/Developer/Xcode/DerivedData/*

# Clean Xcode build
echo "  Cleaning Xcode build..."
xcodebuild clean -workspace Frontend.xcworkspace -scheme Frontend 2>/dev/null || echo "  (Xcode clean skipped - workspace may not be configured yet)"
echo "✅ iOS build folders cleaned"
echo ""

# Step 3: Detect architecture and install pods
echo "📱 Step 3: Installing CocoaPods..."
ARCH=$(uname -m)

# Set UTF-8 encoding to avoid CocoaPods encoding issues
export LANG=en_US.UTF-8
export LC_ALL=en_US.UTF-8

if [ "$ARCH" = "arm64" ]; then
    echo "  Detected Apple Silicon (arm64)"
    echo "  Attempting native pod install first..."
    
    # Try native pod install first (usually works on modern CocoaPods)
    if pod install; then
        echo "✅ Pods installed successfully (native)"
    else
        echo "  Native install failed, trying with x86_64 architecture..."
        # Only use arch -x86_64 if native fails
        if arch -x86_64 pod install; then
            echo "✅ Pods installed successfully (x86_64)"
        else
            echo "❌ Pod installation failed. Trying with repo update..."
            pod install --repo-update || arch -x86_64 pod install --repo-update
        fi
    fi
else
    echo "  Detected Intel architecture"
    echo "  Running: pod install"
    if pod install; then
        echo "✅ Pods installed successfully"
    else
        echo "❌ Pod installation failed. Trying with repo update..."
        pod install --repo-update
    fi
fi
echo ""

# Step 4: Verify installation
echo "🔍 Step 4: Verifying react-native-maps installation..."
if [ -d "Pods/react-native-maps" ] || grep -q "react-native-maps" Podfile.lock; then
    echo "✅ react-native-maps found in Pods"
else
    echo "⚠️  Warning: react-native-maps may not be properly installed"
fi
echo ""

# Step 5: Check workspace
echo "📂 Step 5: Verifying workspace setup..."
if [ -f "Frontend.xcworkspace/contents.xcworkspacedata" ]; then
    echo "✅ Frontend.xcworkspace exists"
    echo "⚠️  IMPORTANT: Make sure to open Frontend.xcworkspace (NOT Frontend.xcodeproj) in Xcode"
else
    echo "⚠️  Warning: Frontend.xcworkspace may not exist"
fi
echo ""

echo "✨ Fix script completed!"
echo ""
echo "📋 Next steps:"
echo "  1. Open Frontend.xcworkspace (NOT .xcodeproj) in Xcode"
echo "  2. Clean Build Folder in Xcode (Cmd+Shift+K)"
echo "  3. Build and run the project (Cmd+R)"
echo "  OR"
echo "  3. Run: npx react-native run-ios"
echo ""
echo "💡 If you still encounter issues:"
echo "  - Make sure you're using Frontend.xcworkspace, not Frontend.xcodeproj"
echo "  - Check that react-native-maps is in your package.json dependencies"
echo "  - Verify Info.plist has location permissions if using location features"
echo ""

