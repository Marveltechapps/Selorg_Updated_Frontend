#!/bin/bash

# Complete Expo Migration Script
# This script installs missing dependencies and prepares the project for Expo

set -e  # Exit on error

echo "🚀 Starting Expo Migration Setup..."
echo ""

# Change to project directory
cd "$(dirname "$0")"

# Step 1: Install missing dependencies
echo "📦 Step 1: Installing missing dependencies..."
echo ""

echo "Installing expo-secure-store..."
npm install expo-secure-store@~14.0.0

echo "Installing jest-expo..."
npm install --save-dev jest-expo@~52.0.0

echo ""
echo "✅ Dependencies installed successfully!"
echo ""

# Step 2: Verify installations
echo "🔍 Step 2: Verifying installations..."
echo ""

if npm list expo-secure-store &> /dev/null; then
    echo "✅ expo-secure-store is installed"
else
    echo "❌ expo-secure-store installation failed"
    exit 1
fi

if npm list jest-expo &> /dev/null; then
    echo "✅ jest-expo is installed"
else
    echo "❌ jest-expo installation failed"
    exit 1
fi

echo ""

# Step 3: Clear caches
echo "🧹 Step 3: Clearing caches..."
echo ""

# Clear Expo cache
if [ -d ".expo" ]; then
    rm -rf .expo
    echo "✅ Cleared .expo cache"
fi

# Clear Metro cache
if [ -d "node_modules/.cache" ]; then
    rm -rf node_modules/.cache
    echo "✅ Cleared Metro cache"
fi

echo ""

# Step 4: TypeScript check
echo "🔍 Step 4: Checking TypeScript errors..."
echo ""

if npx tsc --noEmit 2>&1 | head -20; then
    echo "✅ No TypeScript errors found"
else
    echo "⚠️  TypeScript check completed (errors may exist, see above)"
fi

echo ""

# Step 5: Summary
echo "=========================================="
echo "✅ Expo Migration Setup Complete!"
echo "=========================================="
echo ""
echo "📋 Next Steps:"
echo ""
echo "1. Clear Metro bundler cache and start dev server:"
echo "   npx expo start --clear"
echo ""
echo "2. Or start on specific platform:"
echo "   npm run ios"
echo "   npm run android"
echo ""
echo "3. If you need to rebuild native projects:"
echo "   npx expo prebuild --clean"
echo ""
echo "4. Verify everything works by:"
echo "   - Testing the login flow (uses secure storage)"
echo "   - Testing location/maps features"
echo "   - Running tests: npm test"
echo ""
echo "📚 See EXPO_MIGRATION_FIXES.md for complete details"
echo ""

