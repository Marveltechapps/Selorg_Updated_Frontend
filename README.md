# React Native App Setup Guide

This is a React Native project built with TypeScript.

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (>= 20)
- **npm** or **yarn**
- **React Native CLI**
- **Android Studio** (for Android development)
- **Xcode** (for iOS development, macOS only)
- **CocoaPods** (for iOS dependencies)

## Initial Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. iOS Setup (macOS only)

Install CocoaPods dependencies:

```bash
cd ios
pod install
cd ..
```

### 3. Android Setup

Ensure you have:
- Android SDK installed
- Android SDK Platform Tools in your PATH
- An Android emulator or physical device

## Running the App

### Quick Start

Use the provided shell scripts in the `shell-commands` folder:

#### Run on Android
```bash
./shell-commands/run-android.sh
```

#### Run on iOS
```bash
./shell-commands/run-ios.sh
```

### Manual Commands

#### Start Metro Bundler
```bash
npm start
```

#### Run Android (in a new terminal)
```bash
npm run android
```

#### Run iOS (in a new terminal)
```bash
npm run ios
```

## Building for Production

### Build Android APK
```bash
./shell-commands/build-android-apk.sh
```

The APK will be located at:
```
android/app/build/outputs/apk/release/app-release.apk
```

### Build iOS IPA
```bash
./shell-commands/build-ios-ipa.sh
```

**Note:** iOS builds require:
- Valid Apple Developer account
- Code signing certificates
- Provisioning profiles
- Updated `ExportOptions.plist` with your Team ID

The IPA will be located at:
```
ios/build/ipa/Frontend.ipa
```

## Project Structure

```
.
├── android/          # Android native code
├── ios/              # iOS native code
├── src/              # React Native source code
│   ├── components/   # Reusable components
│   ├── screens/      # Screen components
│   ├── navigation/   # Navigation setup
│   ├── contexts/     # React contexts
│   └── utils/        # Utility functions
├── shell-commands/   # Build and run scripts
└── package.json      # Dependencies and scripts
```

## Troubleshooting

### Android Issues

- **ADB not found**: Add Android SDK platform-tools to your PATH:
  ```bash
  export ANDROID_HOME=~/Library/Android/sdk
  export PATH=$PATH:$ANDROID_HOME/platform-tools
  ```

- **No devices found**: Start an emulator or connect a physical device via USB

### iOS Issues

- **Pod install fails**: Try:
  ```bash
  cd ios
  pod deintegrate
  pod install
  cd ..
  ```

- **Build errors**: Clean and rebuild:
  ```bash
  cd ios
  xcodebuild clean -workspace Frontend.xcworkspace -scheme Frontend
  cd ..
  ```

### Metro Bundler Issues

- **Cache issues**: Reset Metro cache:
  ```bash
  npm start -- --reset-cache
  ```

## Development

- **Fast Refresh**: Enabled by default. Changes to your code will automatically reload.
- **Dev Menu**: 
  - Android: Press `R` twice or `Ctrl+M` (Windows/Linux) / `Cmd+M` (macOS)
  - iOS: Press `Cmd+D` in simulator

## Learn More

- [React Native Documentation](https://reactnative.dev)
- [React Native Getting Started](https://reactnative.dev/docs/getting-started)
