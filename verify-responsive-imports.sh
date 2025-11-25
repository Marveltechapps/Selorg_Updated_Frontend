#!/bin/bash

echo "=== Responsive Utils Import Verification ==="
echo ""

echo "1. Checking if responsive.ts exists:"
if [ -f "src/utils/responsive.ts" ]; then
  echo "✓ src/utils/responsive.ts exists"
  ls -lh src/utils/responsive.ts
  echo ""
  echo "   Exported functions:"
  grep "^export " src/utils/responsive.ts | sed 's/export //' | sed 's/ {.*//' | sed 's/ =.*//' | sed 's/const //' | sed 's/function //' | head -15
else
  echo "✗ src/utils/responsive.ts NOT FOUND"
fi
echo ""

echo "2. Checking TopSection.tsx import:"
if grep -q "utils/responsive" src/components/layout/TopSection.tsx; then
  echo "   Import found:"
  grep "utils/responsive" src/components/layout/TopSection.tsx
  echo ""
  echo "   Verifying path resolution:"
  echo "   From: src/components/layout/TopSection.tsx"
  echo "   To:   src/utils/responsive.ts"
  echo "   Expected: ../../utils/responsive"
  ACTUAL=$(grep "utils/responsive" src/components/layout/TopSection.tsx | sed "s/.*from '//" | sed "s/';.*//")
  echo "   Actual: $ACTUAL"
  if [[ "$ACTUAL" == *"../../utils/responsive"* ]]; then
    echo "   ✓ Path is correct"
  else
    echo "   ✗ Path is INCORRECT"
  fi
else
  echo "   ✗ No responsive import found"
fi
echo ""

echo "3. Checking all responsive imports in components:"
echo "   Files importing responsive utils:"
grep -r "from.*utils/responsive" src/components --include="*.tsx" --include="*.ts" | cut -d: -f1 | sort -u
echo ""

echo "4. Verifying Metro config:"
if [ -f "metro.config.js" ]; then
  echo "✓ metro.config.js exists"
  if grep -q "sourceExts" metro.config.js; then
    echo "✓ sourceExts configured"
  fi
else
  echo "✗ metro.config.js NOT FOUND"
fi
echo ""

echo "=== Verification Complete ==="

