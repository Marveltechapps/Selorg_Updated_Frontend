#!/bin/bash

# Script to update app name across all configuration files
# Usage: ./update-app-name.sh "Your App Name"

if [ -z "$1" ]; then
    echo "Usage: ./update-app-name.sh \"Your App Name\""
    exit 1
fi

APP_NAME="$1"

echo "Updating app name to: $APP_NAME"
echo ""

# Update app.json
echo "1. Updating app.json..."
sed -i '' "s/\"displayName\": \".*\"/\"displayName\": \"$APP_NAME\"/" app.json
sed -i '' "s/\"name\": \".*\"/\"name\": \"$(echo $APP_NAME | tr '[:upper:]' '[:lower:]' | tr ' ' '-')\"/" app.json

# Update iOS Info.plist
echo "2. Updating iOS Info.plist..."
sed -i '' "s/<string>Frontend<\/string>/<string>$APP_NAME<\/string>/" ios/Frontend/Info.plist

# Update Android strings.xml
echo "3. Updating Android strings.xml..."
sed -i '' "s/<string name=\"app_name\">.*<\/string>/<string name=\"app_name\">$APP_NAME<\/string>/" android/app/src/main/res/values/strings.xml

echo ""
echo "✅ App name updated successfully!"
echo ""
echo "Next steps:"
echo "1. Add your app icons (see APP_LOGO_AND_NAME_GUIDE.md)"
echo "2. Clean and rebuild the app:"
echo "   - iOS: cd ios && xcodebuild clean && cd .."
echo "   - Android: cd android && ./gradlew clean && cd .."
echo "3. Rebuild: npm run ios or npm run android"

