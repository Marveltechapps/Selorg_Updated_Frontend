# Expo Go Compatibility Guide

This document outlines all Expo Go compatibility fixes and native module handling.

## ✅ Native Modules Status

### 1. **expo-av (Video Player)** ✅ FIXED
- **Status**: Conditionally loaded with Expo Go detection
- **Expo Go**: Shows placeholder image
- **Dev/Prod Builds**: Uses full video player
- **Files Modified**:
  - `src/components/layout/TopSection.tsx`
  - `src/components/sections/VideoSection.tsx`

### 2. **@react-native-async-storage/async-storage** ✅ FIXED
- **Status**: Fallback to in-memory storage in Expo Go
- **Expo Go**: Uses in-memory storage (data persists during session)
- **Dev/Prod Builds**: Uses AsyncStorage (persistent storage)
- **Feature Flag**: Prefers AsyncStorage when available
- **Files Modified**:
  - `src/utils/storage.ts`

### 3. **expo-secure-store** ✅ HANDLED
- **Status**: Not used (replaced with AsyncStorage fallback)
- **Note**: SecureStore requires native modules, not available in Expo Go

### 4. **expo-location** ⚠️ PARTIAL
- **Status**: May have limited functionality in Expo Go
- **Usage**: Used in `RouteMap.tsx`, `OrderStatusMain.tsx`
- **Note**: Location services work in Expo Go but may have limitations

### 5. **expo-linear-gradient** ✅ WORKS
- **Status**: Works in Expo Go
- **No changes needed**

### 6. **expo-constants** ✅ WORKS
- **Status**: Works in Expo Go
- **Usage**: Used for feature detection

### 7. **react-native-maps** ⚠️ LIMITED
- **Status**: Limited functionality in Expo Go
- **Usage**: Used in `RouteMap.tsx`
- **Note**: Maps may not work fully in Expo Go, consider fallback

---

## 🛠️ Feature Detection Utility

**File**: `src/utils/nativeFeatures.ts`

### Usage:
```typescript
import { NativeFeatures, isExpoGo } from '@/utils/nativeFeatures';

// Check if running in Expo Go
if (isExpoGo()) {
  // Use fallback
}

// Check feature availability
if (NativeFeatures.videoPlayer.preferred) {
  // Use video player
} else {
  // Use placeholder
}

// Check storage availability
if (NativeFeatures.asyncStorage.preferred) {
  // Use AsyncStorage
} else {
  // Use in-memory fallback
}
```

### Available Features:
- `NativeFeatures.videoPlayer` - Video player availability
- `NativeFeatures.asyncStorage` - AsyncStorage availability
- `NativeFeatures.secureStore` - SecureStore availability
- `NativeFeatures.location` - Location services availability
- `NativeFeatures.maps` - Maps availability
- `NativeFeatures.environment` - Environment info (isExpoGo, platform, etc.)

---

## 📋 Implementation Details

### Video Player Fix

**Before**:
```typescript
import { VideoView, useVideoPlayer } from 'expo-av';
const player = useVideoPlayer(...); // ❌ Crashes in Expo Go
```

**After**:
```typescript
let player: any = null;
let VideoView: any = null;
const shouldUseVideoPlayer = NativeFeatures.videoPlayer.preferred;

if (NativeFeatures.videoPlayer.available) {
  try {
    const expoAv = require('expo-av');
    VideoView = expoAv.VideoView;
    const useVideoPlayerHook = expoAv.useVideoPlayer;
    player = useVideoPlayerHook(...);
  } catch (error) {
    // Fallback to placeholder
  }
}

// Render conditionally
{player && VideoView && shouldUseVideoPlayer ? (
  <VideoView player={player} ... />
) : (
  <Image source={...} /> // Placeholder
)}
```

### Storage Fix

**Before**:
```typescript
import AsyncStorage from '@react-native-async-storage/async-storage';
// ❌ Native module error in Expo Go
```

**After**:
```typescript
import { NativeFeatures } from '@/utils/nativeFeatures';

if (NativeFeatures.asyncStorage.preferred) {
  AsyncStorage = require('@react-native-async-storage/async-storage').default;
} else {
  // Use in-memory fallback
}
```

---

## 🧪 Testing

### In Expo Go:
1. Video sections show placeholder images ✅
2. Storage uses in-memory fallback ✅
3. No native module errors ✅

### In Development/Production Builds:
1. Video player works normally ✅
2. AsyncStorage works with persistent storage ✅
3. All native modules available ✅

---

## 📝 Notes

- **Expo Go Limitations**: Some native modules are not available in Expo Go
- **Feature Detection**: Always check availability before using native modules
- **Fallbacks**: Always provide fallbacks for Expo Go compatibility
- **Production**: All features work normally in development/production builds

---

## 🔄 Migration Checklist

- [x] Create feature detection utility
- [x] Fix video player components
- [x] Update storage to use feature flags
- [x] Add Expo Go detection
- [x] Test in Expo Go
- [x] Test in development build
- [ ] Add maps fallback (if needed)
- [ ] Add location fallback (if needed)

---

## 🚀 Next Steps

1. Test all components in Expo Go
2. Add fallbacks for maps if needed
3. Monitor for any other native module issues
4. Consider creating development build for full feature testing

