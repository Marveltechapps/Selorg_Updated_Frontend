#!/bin/bash

echo "=== Back-Button Asset Verification ==="
echo ""

echo "1. Checking for back-button files:"
find src -name "*back-button*" -type f 2>/dev/null | grep -v node_modules
echo ""

echo "2. Verifying file exists:"
if [ -f "src/assets/images/back-button.svg" ]; then
  echo "✓ src/assets/images/back-button.svg exists"
  ls -lh src/assets/images/back-button.svg
else
  echo "✗ src/assets/images/back-button.svg NOT FOUND"
fi
echo ""

echo "3. Checking Header.tsx import path:"
grep "back-button" src/components/layout/Header.tsx
echo ""

echo "4. Verifying path resolution:"
echo "From: src/components/layout/Header.tsx"
echo "To:   src/assets/images/back-button.svg"
echo "Expected relative path: ../../assets/images/back-button.svg"
echo ""

echo "5. Checking Metro config:"
if grep -q "svg-transformer" metro.config.js; then
  echo "✓ SVG transformer configured"
else
  echo "✗ SVG transformer NOT configured"
fi
echo ""

echo "6. Checking TypeScript declarations:"
if [ -f "react-native-svg.d.ts" ]; then
  echo "✓ SVG type declarations exist"
else
  echo "✗ SVG type declarations missing"
fi
echo ""

echo "=== Verification Complete ==="

