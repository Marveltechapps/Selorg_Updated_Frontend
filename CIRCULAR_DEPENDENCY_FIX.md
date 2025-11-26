# Circular Dependency Fix - logger.ts ↔ env.ts

## Problem

**Circular Dependency Cycle:**
```
logger.ts → env.ts → logger.ts
```

1. `logger.ts` imports `getEnvConfigSafe` from `env.ts` (to check `enableLogging` and `enableAnalytics`)
2. `env.ts` imports `logger` from `logger.ts` (to log warnings/errors)

This creates a circular dependency that can cause:
- Module initialization issues
- Undefined imports
- Runtime errors
- Build problems

---

## Solution Applied

**Approach**: Remove logger dependency from `env.ts`

### Rationale

1. **Dependency Hierarchy**: `env.ts` is a foundational utility that should be independent
2. **Logger is Higher-Level**: Logger depends on config, so config should not depend on logger
3. **Acceptable Trade-off**: Using `console` directly in `env.ts` is acceptable for error reporting during initialization

---

## Changes Made

### 1. ✅ env.ts - Removed logger import

**Before:**
```typescript
import Constants from 'expo-constants';
import { logger } from '@/utils/logger';  // ❌ Circular dependency

// ...
logger.warn(`Error accessing config key ${key}`, error);
logger.error('Error getting environment config, using defaults', error);
```

**After:**
```typescript
import Constants from 'expo-constants';
// ✅ No logger import - breaks circular dependency

// ...
// Use console directly to avoid circular dependency with logger
// Only log in development to avoid noise in production
if (typeof __DEV__ !== 'undefined' && __DEV__) {
  console.warn(`[env] Error accessing config key ${key}:`, error);
  console.error('[env] Error getting environment config, using defaults:', error);
}
```

### 2. ✅ Added Global Type Definition

**File**: `src/types/global.d.ts` (new file)

```typescript
/**
 * Global type definitions for React Native/Expo
 */
declare const __DEV__: boolean;
```

This ensures TypeScript recognizes the `__DEV__` global variable used in both files.

---

## Dependency Flow (After Fix)

**Before (Circular):**
```
logger.ts ──┐
            │
            ├──> env.ts ──┐
            │             │
            └─────────────┘
```

**After (Linear):**
```
env.ts (independent, uses console)
    ↑
    │
logger.ts (depends on env.ts)
```

---

## Files Modified

1. ✅ `src/config/env.ts`
   - Removed `import { logger } from '@/utils/logger'`
   - Replaced `logger.warn()` with `console.warn()` (guarded by `__DEV__`)
   - Replaced `logger.error()` with `console.error()` (guarded by `__DEV__`)
   - Added comment explaining why console is used directly

2. ✅ `src/types/global.d.ts` (new file)
   - Added `__DEV__` type declaration for TypeScript

3. ✅ `src/utils/logger.ts`
   - No changes needed (still correctly depends on `env.ts`)

---

## Benefits

1. ✅ **No Circular Dependencies**: Clean dependency graph
2. ✅ **Proper Hierarchy**: Config is independent, logger depends on config
3. ✅ **Functionality Preserved**: All error reporting still works
4. ✅ **Type Safety**: TypeScript types are correct
5. ✅ **Production Safe**: Only logs in development mode

---

## Verification

- ✅ No linter errors
- ✅ TypeScript compilation passes
- ✅ No circular dependency warnings
- ✅ All functionality preserved
- ✅ Error reporting still works (using console in dev mode)

---

## Alternative Solutions Considered

### Option 1: Move shared code to constants.ts ❌
- **Rejected**: Would require significant refactoring
- **Issue**: The dependency is on functions, not constants

### Option 2: Lazy imports ❌
- **Rejected**: More complex, adds runtime overhead
- **Issue**: Not necessary for this use case

### Option 3: Remove logger from env.ts ✅
- **Selected**: Cleanest solution
- **Benefits**: Simple, maintains proper dependency hierarchy
- **Trade-off**: Uses console directly (acceptable for foundational utilities)

---

## Best Practices Applied

1. **Dependency Direction**: Lower-level utilities (config) should not depend on higher-level utilities (logger)
2. **Error Handling**: Using console directly in foundational utilities is acceptable
3. **Development-Only Logging**: Guarded by `__DEV__` to avoid production noise
4. **Type Safety**: Added proper TypeScript declarations

---

**Status**: ✅ **FIXED** - Circular dependency eliminated

