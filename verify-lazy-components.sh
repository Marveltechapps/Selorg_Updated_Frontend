#!/bin/bash

# Verify all lazy-loaded components have correct exports

cd /Users/muthuramanveerashekar/Desktop/NewToday

echo "🔍 Verifying Lazy-Loaded Components"
echo "===================================="
echo ""

ERRORS=0

# List of lazy-loaded components from AppNavigator.tsx
declare -a COMPONENTS=(
  "src/screens/Onboarding.tsx"
  "src/screens/OTPVerification.tsx"
  "src/screens/VerificationSuccess.tsx"
  "src/navigation/MainTabNavigator.tsx"
  "src/navigation/OrderStatusStack.tsx"
  "src/screens/Settings.tsx"
  "src/navigation/OrdersStack.tsx"
  "src/navigation/CustomerSupportStack.tsx"
  "src/navigation/LocationStack.tsx"
  "src/navigation/RefundsStack.tsx"
  "src/screens/Profile.tsx"
  "src/screens/PaymentManagement.tsx"
  "src/navigation/GeneralInfoStack.tsx"
  "src/screens/Notifications.tsx"
  "src/screens/Checkout.tsx"
  "src/screens/Coupons.tsx"
  "src/screens/Home.tsx"
  "src/screens/Category.tsx"
  "src/screens/Search.tsx"
  "src/screens/SearchResults.tsx"
  "src/screens/ProductDetail.tsx"
  "src/screens/CategoryProducts.tsx"
  "src/screens/BannerDetail.tsx"
  "src/screens/TinyTimmies.tsx"
  "src/screens/CategoriesExpo.tsx"
)

for component in "${COMPONENTS[@]}"; do
  if [ ! -f "$component" ]; then
    echo "❌ File not found: $component"
    ERRORS=$((ERRORS + 1))
    continue
  fi
  
  # Check for default export
  if grep -q "^export default" "$component"; then
    echo "✅ $(basename $component) - has default export"
  else
    echo "❌ $(basename $component) - missing default export"
    ERRORS=$((ERRORS + 1))
  fi
done

echo ""
echo "===================================="
if [ $ERRORS -eq 0 ]; then
  echo "✅ All components verified successfully!"
  exit 0
else
  echo "❌ Found $ERRORS component(s) with issues"
  exit 1
fi


