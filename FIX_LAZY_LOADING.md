# Fix: Lazy Loading Error in SplashScreen

## Problem
"Element type is invalid. Received a promise that resolves to: undefined. Lazy element type must resolve to a class or function."

## Root Cause
The lazy loading pattern in `AppNavigator.tsx` was incorrect. The `LazyScreen` wrapper component was trying to pass the lazy component as a prop, which doesn't work correctly with React.lazy().

## Solution Applied

### Changed Pattern
**Before (Incorrect):**
```typescript
const LazyScreen = ({ component: Component, ...props }: any) => (
  <Suspense fallback={<LoadingFallback />}>
    <Component {...props} />
  </Suspense>
);

<Stack.Screen 
  name="Onboarding" 
  component={(props: any) => <LazyScreen component={Onboarding} {...props} />} 
/>
```

**After (Correct):**
```typescript
const createLazyScreen = (LazyComponent: React.LazyExoticComponent<React.ComponentType<any>>) => {
  return (props: any) => (
    <Suspense fallback={<LoadingFallback />}>
      <LazyComponent {...props} />
    </Suspense>
  );
};

<Stack.Screen 
  name="Onboarding" 
  component={createLazyScreen(Onboarding)} 
/>
```

## Key Changes

1. **Replaced LazyScreen wrapper** with `createLazyScreen` helper function
2. **Direct component reference** instead of inline function
3. **Proper Suspense wrapping** for each lazy component
4. **Type-safe lazy component handling**

## Verification

All components have default exports:
- ✅ Onboarding.tsx - `export default Onboarding;`
- ✅ Home.tsx - `export default function HomeScreen()`
- ✅ All other lazy-loaded components have default exports

## Testing

1. Run the app:
   ```bash
   npx expo start
   ```

2. Verify SplashScreen loads without errors
3. Navigate to Onboarding - should load correctly
4. Check all lazy-loaded screens work properly

## Best Practices for React.lazy() with React Navigation

```typescript
// ✅ Correct Pattern
const MyComponent = React.lazy(() => import('./MyComponent'));

const createLazyScreen = (LazyComponent: React.LazyExoticComponent<React.ComponentType<any>>) => {
  return (props: any) => (
    <Suspense fallback={<LoadingFallback />}>
      <LazyComponent {...props} />
    </Suspense>
  );
};

<Stack.Screen name="MyScreen" component={createLazyScreen(MyComponent)} />
```

### Requirements:
1. Component must have **default export**
2. Lazy component must be wrapped in **Suspense**
3. Use helper function to create wrapper component
4. Pass wrapper directly to `component` prop (not inline function)


