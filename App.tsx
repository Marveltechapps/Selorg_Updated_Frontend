/**
 * React Native App - Main Entry Point
 * 
 * This is the main entry point of the application.
 * Default screen: NoInternet (checks connectivity on startup)
 * 
 * Navigation Structure:
 * - NoInternet (main/default screen)
 *   - Shows when there's no internet connection
 *   - Reload button to check connectivity
 * - Login
 *   - Mobile number input
 *   - OTP verification flow
 * - Checkout
 *   - Empty cart state
 *   - Cart with products (no address)
 *   - Cart with products and address
 * - Order Status
 *   - Order Status Main
 *   - Order Status Details
 * - Settings
 *   - Orders
 *   - Customer Support & FAQ
 *   - Addresses
 *   - Refunds
 *   - Profile
 *   - Payment management
 *   - General Info
 *   - Notifications
 *
 * @format
 */

import React, { useRef, useEffect } from 'react';
import { NavigationContainer, NavigationContainerRef } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import type { RootStackParamList } from './src/types/navigation';
import AppNavigator from './src/navigation/AppNavigator';
import { CartProvider } from './src/contexts/CartContext';
import { NetworkProvider, useNetwork } from './src/contexts/NetworkContext';
import ErrorBoundary from './src/components/common/ErrorBoundary';
import { setupGlobalErrorHandler } from './src/utils/errorHandler';
import { analytics } from './src/utils/analytics';

// Note: To integrate Sentry, uncomment and configure:
// import * as Sentry from '@sentry/react-native';
// import { envConfig } from './src/config/env';
// Sentry.init({
//   dsn: 'YOUR_SENTRY_DSN',
//   environment: envConfig.env,
//   enableAutoSessionTracking: true,
// });

// Inner component that has access to NetworkContext
const AppContent: React.FC = () => {
  const navigationRef = useRef<NavigationContainerRef<RootStackParamList> | null>(null);
  const { setNavigationRef } = useNetwork();

  return (
    <NavigationContainer
      ref={(ref) => {
        navigationRef.current = ref;
        setNavigationRef(ref);
      }}
    >
      <AppNavigator />
    </NavigationContainer>
  );
};

function App() {
  useEffect(() => {
    // Setup global error handler
    setupGlobalErrorHandler();
    
    // Track app launch
    analytics.trackScreenView('App');
  }, []);

  return (
    <ErrorBoundary>
      <SafeAreaProvider>
        <NetworkProvider>
          <CartProvider>
            <AppContent />
          </CartProvider>
        </NetworkProvider>
      </SafeAreaProvider>
    </ErrorBoundary>
  );
}

export default App;
