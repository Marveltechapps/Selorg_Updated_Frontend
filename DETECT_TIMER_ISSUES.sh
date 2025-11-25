#!/bin/bash

# Timer Overlay Detection Script
# This script helps identify where timer components might be rendering globally

echo "🔍 Detecting Timer Overlay Issues..."
echo ""

cd "$(dirname "$0")"

echo "📋 Step 1: Checking for timer-related components..."
echo ""

# Find all timer-related code
echo "Files containing 'timer' or 'Timer':"
grep -r "timer\|Timer" src/ --include="*.tsx" --include="*.ts" -l | head -20
echo ""

echo "📋 Step 2: Checking for absolute positioned components..."
echo ""

# Find absolute positioned components that might overlay
echo "Files with absolute positioning:"
grep -r "position.*absolute\|position: 'absolute'" src/ --include="*.tsx" --include="*.ts" -l | head -20
echo ""

echo "📋 Step 3: Checking for high zIndex values..."
echo ""

# Find high zIndex values
echo "Files with zIndex > 100:"
grep -r "zIndex.*[1-9][0-9][0-9]\|zIndex: [1-9][0-9][0-9]" src/ --include="*.tsx" --include="*.ts" -l | head -20
echo ""

echo "📋 Step 4: Checking App.tsx for global components..."
echo ""

# Check App.tsx for any global renders
if grep -q "OTPVerification\|timer\|Timer" src/App.tsx 2>/dev/null; then
  echo "⚠️  WARNING: Timer-related code found in App.tsx"
  grep -n "OTPVerification\|timer\|Timer" src/App.tsx
else
  echo "✅ No timer code in App.tsx"
fi
echo ""

echo "📋 Step 5: Checking navigation files..."
echo ""

# Check navigation files
if grep -q "OTPVerification" src/navigation/*.tsx 2>/dev/null; then
  echo "OTPVerification found in navigation:"
  grep -n "OTPVerification" src/navigation/*.tsx
else
  echo "✅ OTPVerification not found in navigation (this might be an issue)"
fi
echo ""

echo "📋 Step 6: Checking for Modal or Overlay components..."
echo ""

# Find Modal components
echo "Files with Modal:"
grep -r "Modal\|modal" src/ --include="*.tsx" --include="*.ts" -l | head -20
echo ""

echo "✅ Detection complete!"
echo ""
echo "💡 Next steps:"
echo "1. Review the files listed above"
echo "2. Check if any timer components are rendered outside OTPVerification.tsx"
echo "3. Verify OTPVerification properly unmounts on navigation"
echo "4. Check for absolute positioned components with high zIndex"

