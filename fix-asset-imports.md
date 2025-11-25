# Fix for Back-Button Asset Import Error

## Diagnosis Summary

✅ **File exists**: `src/assets/images/back-button.svg` (315 bytes)
✅ **Import path is correct**: `../../assets/images/back-button.svg` from `Header.tsx`
✅ **Metro config**: SVG transformer properly configured
✅ **TypeScript**: SVG type declarations exist

## Root Cause

The error is likely due to **Metro bundler cache** not recognizing the corrected import path.

## Solution Steps

### Step 1: Clear Metro Cache and Restart

```bash
# Stop the current Metro bundler (Ctrl+C)

# Clear Metro cache
npx expo start --clear

# Or if that doesn't work, clear all caches:
rm -rf node_modules/.cache
rm -rf .expo
npx expo start --clear
```

### Step 2: Verify Current Setup

The import in `src/components/layout/Header.tsx` should be:
```typescript
import BackButtonIcon from '../../assets/images/back-button.svg';
```

**Path Resolution:**
- From: `src/components/layout/Header.tsx`
- To: `src/assets/images/back-button.svg`
- Relative path: `../../assets/images/back-button.svg` ✓

### Step 3: Alternative Solution (If Step 1 doesn't work)

If the cache clear doesn't work, you can use the icon from the icons folder:

**Option A: Use icons folder version**
```typescript
// In Header.tsx, change to:
import BackButtonIcon from '../../../assets/icons/back-button.svg';
```

**Option B: Use absolute import (if you set up path aliases)**
```typescript
// Would require tsconfig.json path mapping
import BackButtonIcon from '@/assets/images/back-button.svg';
```

### Step 4: Verify Metro Config

Ensure `metro.config.js` has:
```javascript
config.transformer = {
  ...config.transformer,
  babelTransformerPath: require.resolve('react-native-svg-transformer'),
};

config.resolver = {
  ...config.resolver,
  assetExts: config.resolver.assetExts.filter((ext) => ext !== 'svg'),
  sourceExts: [...config.resolver.sourceExts, 'svg'],
};
```

### Step 5: Verify Dependencies

Ensure these are installed:
```bash
npm list react-native-svg react-native-svg-transformer
```

Should show:
- `react-native-svg@^15.15.0`
- `react-native-svg-transformer@^1.5.2`

## Verification Commands

Run the verification script:
```bash
./verify-assets.sh
```

Or manually check:
```bash
# Check file exists
ls -la src/assets/images/back-button.svg

# Check import path
grep "back-button" src/components/layout/Header.tsx

# Check Metro config
grep "svg-transformer" metro.config.js
```

## Current File Locations

All back-button variants found:
- ✅ `src/assets/images/back-button.svg` (used in Header.tsx)
- ✅ `src/assets/icons/back-button.svg` (alternative)
- ✅ `src/assets/icons/back-button-orders.svg`
- ✅ `src/assets/images/otp-back-button.svg`

## If File Was Missing (Not the case here)

If the file didn't exist, here's a sample back-button SVG:

```svg
<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M19 12H5" stroke="#4C4C4C" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M12 19L5 12L12 5" stroke="#4C4C4C" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
</svg>
```

Save to: `src/assets/images/back-button.svg`

