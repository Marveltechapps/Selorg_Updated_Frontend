# React Native Config Setup Guide

This document contains all the steps and commands needed to set up and use `react-native-config` in this React Native iOS project.

## ✅ Setup Complete

The following setup has been completed:

1. ✅ Installed `react-native-config` package
2. ✅ Created `.env` file with default environment variables
3. ✅ Updated `.gitignore` to exclude `.env` files
4. ✅ Created `.env.example` template file
5. ✅ Installed CocoaPods dependencies
6. ✅ Cleaned iOS build directories

## 📋 Commands Summary

### 1. Install Package
```bash
npm install react-native-config
```

### 2. Create Environment File
The `.env` file has been created at the root of the project with the following variables:
- `ENV=development`
- `API_BASE_URL=https://api.example.com`
- `API_VERSION=/api/v1`
- `ENABLE_LOGGING=true`
- `ENABLE_ANALYTICS=true`

### 3. Install iOS Dependencies
```bash
cd ios
export LANG=en_US.UTF-8  # Fix encoding issues if needed
pod install
```

### 4. Clean and Rebuild iOS Project
```bash
# Clean build directories
cd ios
rm -rf build DerivedData
xcodebuild clean -workspace Frontend.xcworkspace -scheme Frontend

# Or use the React Native CLI
cd ..
npx react-native run-ios
```

## 🔧 Verification Steps

### Verify Package Installation
```bash
grep "react-native-config" package.json
```

### Verify .env File
```bash
cat .env
```

### Verify Pod Installation
```bash
cd ios
pod list | grep react-native-config
```

### Test Import in Code
The package is imported in `src/config/env.ts`:
```typescript
import Config from 'react-native-config';
```

## 📝 Important Notes

1. **Build Script**: React Native Config automatically adds a build script to your Xcode project during `pod install`. This script reads your `.env` file and generates the necessary configuration files.

2. **Environment Files**: 
   - `.env` - Your actual environment variables (gitignored)
   - `.env.example` - Template file (committed to git)

3. **Accessing Variables**:
   ```typescript
   import Config from 'react-native-config';
   const apiUrl = Config.API_BASE_URL;
   ```

4. **Multiple Environments**: You can create different `.env` files:
   - `.env.development`
   - `.env.staging`
   - `.env.production`

## 🚀 Running the Project

### Start Metro Bundler
```bash
npx react-native start
```

### Run on iOS Simulator
```bash
npx react-native run-ios
```

### Run on iOS Device
```bash
npx react-native run-ios --device "Your Device Name"
```

## 🔍 Troubleshooting

### Error: "Unable to resolve module react-native-config"
- ✅ **Fixed**: Package is now installed
- Verify: `npm list react-native-config`
- If still failing: `npm install react-native-config --save`

### Error: "Config file not found"
- Ensure `.env` file exists at project root
- Check file permissions: `ls -la .env`
- Verify file content: `cat .env`

### iOS Build Issues
- Clean build: `cd ios && rm -rf build DerivedData && pod install`
- Reset Metro cache: `npx react-native start --reset-cache`
- Reinstall pods: `cd ios && pod deintegrate && pod install`

### Pod Installation Issues
- Set encoding: `export LANG=en_US.UTF-8`
- Update CocoaPods: `sudo gem install cocoapods`
- Clear pod cache: `pod cache clean --all`

## 📚 Additional Resources

- [react-native-config Documentation](https://github.com/lugg/react-native-config)
- [React Native iOS Setup](https://reactnative.dev/docs/environment-setup)

