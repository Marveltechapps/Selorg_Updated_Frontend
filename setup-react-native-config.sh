#!/bin/bash

# React Native Config Setup Script
# This script installs and configures react-native-config for iOS

set -e  # Exit on error

echo "🚀 Setting up react-native-config for React Native iOS project..."

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Step 1: Install package
echo -e "${BLUE}Step 1: Installing react-native-config package...${NC}"
npm install react-native-config

# Step 2: Verify .env file exists
echo -e "${BLUE}Step 2: Checking for .env file...${NC}"
if [ ! -f .env ]; then
    echo -e "${YELLOW}Warning: .env file not found. Creating default .env file...${NC}"
    cat > .env << 'EOF'
# Environment Configuration
# This file contains environment variables for react-native-config

# Environment: development, staging, or production
ENV=development

# API Configuration
API_BASE_URL=https://api.example.com
API_VERSION=/api/v1

# Feature Flags
ENABLE_LOGGING=true
ENABLE_ANALYTICS=true
EOF
    echo -e "${GREEN}✅ Created .env file${NC}"
else
    echo -e "${GREEN}✅ .env file already exists${NC}"
fi

# Step 3: Set encoding for CocoaPods
echo -e "${BLUE}Step 3: Setting up environment...${NC}"
export LANG=en_US.UTF-8

# Step 4: Install iOS dependencies
echo -e "${BLUE}Step 4: Installing CocoaPods dependencies...${NC}"
cd ios
pod install --repo-update
cd ..

# Step 5: Clean build directories
echo -e "${BLUE}Step 5: Cleaning iOS build directories...${NC}"
cd ios
rm -rf build DerivedData
cd ..

echo -e "${GREEN}✅ Setup complete!${NC}"
echo ""
echo -e "${YELLOW}Next steps:${NC}"
echo "1. Start Metro bundler: npx react-native start"
echo "2. Run on iOS: npx react-native run-ios"
echo ""
echo -e "${BLUE}Note: The react-native-config module will be automatically linked${NC}"
echo -e "${BLUE}      during the iOS build process.${NC}"

