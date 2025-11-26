# Actionable Fixes for Audit Issues

This document provides step-by-step fixes for the issues identified in the audit report.

---

## Priority 1: Critical Fixes

### Fix 1: Environment Variable Validation in app.config.js

**File**: `app.config.js`  
**Lines**: 9-12

**Current Code**:
```javascript
const GOOGLE_MAPS_API_KEY = process.env.GOOGLE_MAPS_API_KEY;
if (!GOOGLE_MAPS_API_KEY) {
  throw new Error('GOOGLE_MAPS_API_KEY environment variable is required. Please set it in your .env file.');
}
```

**Fixed Code**:
```javascript
const GOOGLE_MAPS_API_KEY = process.env.GOOGLE_MAPS_API_KEY;
if (!GOOGLE_MAPS_API_KEY) {
  console.warn('⚠️  GOOGLE_MAPS_API_KEY not set. Maps features will be disabled.');
  // Continue with build but disable maps features
}
```

---

## Priority 2: High-Priority Fixes

### Fix 2: Replace Console Statements with Logger

**Pattern to Replace**:
```typescript
// Before
console.log('Message', data);
console.error('Error:', error);
console.warn('Warning:', warning);

// After
import { logger } from '@/utils/logger';
logger.info('Message', data);
logger.error('Error', error);
logger.warn('Warning', warning);
```

**Files to Update**:
- `src/utils/storage.ts` (13 instances)
- `src/components/features/location/RouteMap.tsx` (6 instances)
- `src/screens/OTPVerification.tsx` (3 instances)
- `src/screens/OrderStatusDetails.tsx` (5 instances)
- All section components (DealsSection, FreshJuiceDealsSection, etc.)

---

### Fix 3: Convert Deep Relative Imports to Path Aliases

**Pattern to Replace**:
```typescript
// Before
import { useCart } from '../../../contexts/CartContext';
import type { RootStackNavigationProp } from '../../../types/navigation';
import { scale } from '../../../utils/responsive';

// After
import { useCart } from '@/contexts/CartContext';
import type { RootStackNavigationProp } from '@/types/navigation';
import { scale } from '@/utils/responsive';
```

**Files to Update**:
1. `src/components/features/product/ProductVariantModal.tsx`
2. `src/components/features/support/SupportCard.tsx`
3. `src/components/features/order/DeliveryAddressCard.tsx`
4. `src/components/features/support/HelpItem.tsx`
5. `src/components/features/support/FAQItem.tsx`
6. `src/components/features/order/OrderCard.tsx`
7. `src/components/features/search/SearchBar.tsx`
8. `src/components/features/product/ProductCard.tsx`
9. `src/components/features/product/BannerProductCard.tsx`
10. `src/components/features/cart/FloatingCartBar.tsx`

---

### Fix 4: Replace `any` Types in Navigation

**File**: `src/types/navigation.ts`  
**Lines**: 15-16

**Current Code**:
```typescript
export interface NavigationProps {
  navigation?: any;
  route?: any;
}
```

**Fixed Code**:
```typescript
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RouteProp } from '@react-navigation/native';

export interface NavigationProps<T extends keyof RootStackParamList = keyof RootStackParamList> {
  navigation?: NativeStackNavigationProp<RootStackParamList, T>;
  route?: RouteProp<RootStackParamList, T>;
}
```

---

## Priority 3: Medium-Priority Fixes

### Fix 5: Add Error Boundaries to Critical Sections

**Add Error Boundaries Around**:
1. Map components
2. Payment flows
3. Checkout process

**Example Implementation**:
```typescript
import ErrorBoundary from '@/components/common/ErrorBoundary';

// Wrap critical sections
<ErrorBoundary>
  <RouteMap />
</ErrorBoundary>
```

---

### Fix 6: Optimize Inline Functions

**Pattern to Replace**:
```typescript
// Before
onPress={() => handlePress(item.id)}

// After
const handleItemPress = useCallback((id: string) => {
  handlePress(id);
}, [handlePress]);

// In render
onPress={() => handleItemPress(item.id)}
```

---

## Quick Fix Script

Run these commands to apply fixes:

```bash
# 1. Fix app.config.js
# (Manual edit required)

# 2. Find all console statements
grep -r "console\." src/ --include="*.ts" --include="*.tsx" | wc -l

# 3. Find all deep relative imports
grep -r "from ['\"]\.\.\/\.\.\/\.\.\/" src/ --include="*.ts" --include="*.tsx"
```

---

## Verification Steps

After applying fixes:

1. ✅ Run `npm run lint` to check for linting errors
2. ✅ Run `npx tsc --noEmit` to check TypeScript errors
3. ✅ Test app startup with missing `GOOGLE_MAPS_API_KEY`
4. ✅ Verify all imports resolve correctly
5. ✅ Check that logger is used instead of console

---

**Note**: Some fixes require manual review and testing. Use this as a guide for systematic improvements.

