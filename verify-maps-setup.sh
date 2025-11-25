#!/bin/bash

# Verification script for react-native-maps setup
# This script checks if everything is properly configured

echo "=========================================="
echo "Verifying react-native-maps Setup"
echo "=========================================="
echo ""

cd "$(dirname "$0")" || exit 1

ERRORS=0

# Check 1: Package installed
echo "1. Checking npm packages..."
if [ -d "node_modules/react-native-maps" ]; then
  echo "   ✓ react-native-maps installed"
else
  echo "   ✗ react-native-maps NOT found"
  ERRORS=$((ERRORS + 1))
fi

if [ -d "node_modules/react-native-maps-directions" ]; then
  echo "   ✓ react-native-maps-directions installed"
else
  echo "   ✗ react-native-maps-directions NOT found"
  ERRORS=$((ERRORS + 1))
fi

if [ -d "node_modules/@react-native-community/geolocation" ]; then
  echo "   ✓ @react-native-community/geolocation installed"
else
  echo "   ✗ @react-native-community/geolocation NOT found"
  ERRORS=$((ERRORS + 1))
fi
echo ""

# Check 2: iOS Pods
echo "2. Checking iOS Pods..."
if [ -f "ios/Podfile.lock" ]; then
  if grep -q "react-native-maps" "ios/Podfile.lock"; then
    echo "   ✓ react-native-maps in Podfile.lock"
    # Check for target support files (actual pod installation indicator)
    if [ -f "ios/Pods/Target Support Files/react-native-maps/react-native-maps.debug.xcconfig" ] || [ -f "ios/Pods/Local Podspecs/react-native-maps.podspec.json" ]; then
      echo "   ✓ react-native-maps pod installed"
    else
      echo "   ⚠ react-native-maps in Podfile.lock but support files missing"
      echo "   Run: cd ios && pod install"
    fi
  else
    echo "   ✗ react-native-maps NOT in Podfile.lock"
    echo "   Run: cd ios && pod install"
    ERRORS=$((ERRORS + 1))
  fi
else
  echo "   ✗ Podfile.lock not found"
  echo "   Run: cd ios && pod install"
  ERRORS=$((ERRORS + 1))
fi
echo ""

# Check 3: Workspace file
echo "3. Checking Xcode workspace..."
if [ -d "ios/Frontend.xcworkspace" ]; then
  echo "   ✓ Workspace file exists"
  echo "   ✓ Use this file to open in Xcode (NOT .xcodeproj)"
else
  echo "   ✗ Workspace file NOT found"
  ERRORS=$((ERRORS + 1))
fi
echo ""

# Check 4: Android configuration
echo "4. Checking Android configuration..."
if grep -q "com.google.android.geo.API_KEY" "android/app/src/main/AndroidManifest.xml"; then
  echo "   ✓ Google Maps API key in AndroidManifest.xml"
else
  echo "   ✗ Google Maps API key NOT found in AndroidManifest.xml"
  ERRORS=$((ERRORS + 1))
fi

if grep -q "ACCESS_FINE_LOCATION" "android/app/src/main/AndroidManifest.xml"; then
  echo "   ✓ Location permissions in AndroidManifest.xml"
else
  echo "   ✗ Location permissions NOT found in AndroidManifest.xml"
  ERRORS=$((ERRORS + 1))
fi
echo ""

# Check 5: iOS configuration
echo "5. Checking iOS configuration..."
if grep -q "GMSServices.provideAPIKey" "ios/Frontend/AppDelegate.swift"; then
  echo "   ✓ Google Maps API key in AppDelegate.swift"
else
  echo "   ✗ Google Maps API key NOT found in AppDelegate.swift"
  ERRORS=$((ERRORS + 1))
fi

if grep -q "import GoogleMaps" "ios/Frontend/AppDelegate.swift"; then
  echo "   ✓ GoogleMaps import in AppDelegate.swift"
else
  echo "   ✗ GoogleMaps import NOT found in AppDelegate.swift"
  ERRORS=$((ERRORS + 1))
fi

if grep -q "NSLocationWhenInUseUsageDescription" "ios/Frontend/Info.plist"; then
  echo "   ✓ Location permission in Info.plist"
else
  echo "   ✗ Location permission NOT found in Info.plist"
  ERRORS=$((ERRORS + 1))
fi
echo ""

# Summary
echo "=========================================="
if [ $ERRORS -eq 0 ]; then
  echo "✓ All checks passed!"
  echo "=========================================="
  echo ""
  echo "Setup looks good. You can now:"
  echo "  npm run ios"
  echo "  npm run android"
  exit 0
else
  echo "✗ Found $ERRORS issue(s)"
  echo "=========================================="
  echo ""
  echo "To fix issues, run:"
  echo "  ./fix-maps-ios.sh"
  echo ""
  echo "Or see MAPS_TROUBLESHOOTING.md for details"
  exit 1
fi

