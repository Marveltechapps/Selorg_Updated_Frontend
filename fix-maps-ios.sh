#!/bin/bash

# Script to fix react-native-maps iOS setup
# This script reinstalls CocoaPods and ensures proper configuration

echo "=========================================="
echo "Fixing react-native-maps iOS Setup"
echo "=========================================="
echo ""

cd ios

echo "Step 1: Cleaning Pods..."
rm -rf Pods
rm -rf Podfile.lock
rm -rf build

echo "Step 2: Installing CocoaPods dependencies..."
pod install

echo ""
echo "Step 3: Verifying Google Maps configuration..."
echo "Checking AppDelegate.swift..."
if grep -q "GMSServices.provideAPIKey" Frontend/AppDelegate.swift; then
    echo "✓ Google Maps API key found in AppDelegate.swift"
else
    echo "✗ Google Maps API key NOT found in AppDelegate.swift"
fi

echo ""
echo "Checking Info.plist..."
if grep -q "GMSApiKey" Frontend/Info.plist; then
    echo "✓ Google Maps API key found in Info.plist"
else
    echo "✗ Google Maps API key NOT found in Info.plist"
fi

echo ""
echo "Checking Podfile..."
if grep -q "react-native-maps.*Google" Podfile; then
    echo "✓ react-native-maps with Google subspec found in Podfile"
else
    echo "✗ react-native-maps Google subspec NOT found in Podfile"
fi

echo ""
echo "=========================================="
echo "Setup Complete!"
echo "=========================================="
echo ""
echo "Next steps:"
echo "1. Open Xcode: open Frontend.xcworkspace"
echo "2. Clean build folder: Product → Clean Build Folder (Shift+Cmd+K)"
echo "3. Build and run the app"
echo ""
echo "If you still see errors:"
echo "- Make sure you're opening .xcworkspace, NOT .xcodeproj"
echo "- Check that Google Maps API key is valid"
echo "- Verify internet connection for map tiles"
echo ""

cd ..
