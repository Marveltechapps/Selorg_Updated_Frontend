# Terminal Commands to Fix react-native-config Error

All commands below should be run from the project root directory: `/Users/muthuramanveerashekar/Desktop/NewToday`

## ✅ Already Completed Steps

The following have already been completed:
- ✅ Package installed: `react-native-config@^1.6.0`
- ✅ `.env` file created with default values
- ✅ `.env.example` template created
- ✅ CocoaPods dependencies installed
- ✅ `.gitignore` updated to exclude `.env` files
- ✅ iOS build directories cleaned

## 📝 Manual Verification & Rebuild Commands

If you need to verify or rebuild, use these commands:

### 1. Verify Package Installation
```bash
npm list react-native-config
```

### 2. Verify .env File Exists
```bash
cat .env
```

### 3. Reinstall CocoaPods Dependencies (if needed)
```bash
cd ios
export LANG=en_US.UTF-8
pod install
cd ..
```

### 4. Clean iOS Build
```bash
cd ios
rm -rf build DerivedData
xcodebuild clean -workspace Frontend.xcworkspace -scheme Frontend
cd ..
```

### 5. Clean Metro Bundler Cache
```bash
npx react-native start --reset-cache
```

### 6. Build and Run iOS Project
```bash
# Option 1: Using React Native CLI
npx react-native run-ios

# Option 2: Using Xcode
# Open ios/Frontend.xcworkspace in Xcode and build/run from there
```

## 🔧 Complete Rebuild Process

If you encounter any issues, run these commands in order:

```bash
# 1. Navigate to project root
cd /Users/muthuramanveerashekar/Desktop/NewToday

# 2. Verify package is installed
npm list react-native-config

# 3. Verify .env file
cat .env

# 4. Clean node_modules and reinstall (if needed)
# rm -rf node_modules
# npm install

# 5. Clean iOS build
cd ios
rm -rf build DerivedData Pods Podfile.lock
cd ..

# 6. Reinstall pods
cd ios
export LANG=en_US.UTF-8
pod install --repo-update
cd ..

# 7. Clean Metro cache and start
npx react-native start --reset-cache &
# (Press Ctrl+C after Metro starts)

# 8. Build and run iOS
npx react-native run-ios
```

## 🚀 Quick Start (Everything is Already Set Up)

Since all setup steps are complete, you can directly run:

```bash
# Start Metro bundler (in one terminal)
npx react-native start

# Run iOS app (in another terminal)
npx react-native run-ios
```

## 📋 Verification Checklist

- [x] `react-native-config` is in `package.json` dependencies
- [x] `.env` file exists at project root
- [x] `.env.example` template file created
- [x] CocoaPods dependencies installed
- [x] iOS pods include `react-native-config`
- [x] `.gitignore` excludes `.env` files

## 🔍 Troubleshooting Commands

### If module still can't be resolved:

```bash
# 1. Clear npm cache
npm cache clean --force

# 2. Remove node_modules and reinstall
rm -rf node_modules
npm install

# 3. Clear watchman cache
watchman watch-del-all

# 4. Clear Metro bundler cache
rm -rf /tmp/metro-* /tmp/haste-*

# 5. Rebuild
npx react-native start --reset-cache
```

### If iOS build fails:

```bash
# 1. Clean everything
cd ios
rm -rf build DerivedData Pods Podfile.lock
cd ..

# 2. Reinstall pods
cd ios
pod deintegrate
pod install
cd ..

# 3. Clean Xcode derived data
rm -rf ~/Library/Developer/Xcode/DerivedData

# 4. Rebuild
npx react-native run-ios
```

## 📚 Additional Information

- The `react-native-config` package is automatically linked via React Native's autolinking
- The build script for reading `.env` is automatically added during `pod install`
- Environment variables are accessed via: `Config.VARIABLE_NAME` in TypeScript/JavaScript
- Import path: `import Config from 'react-native-config';`

