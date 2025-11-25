import React, { createContext, useContext, useEffect, useState, useRef, useCallback } from 'react';
import NetInfo, { NetInfoState } from '@react-native-community/netinfo';
import { NavigationContainerRef } from '@react-navigation/native';
import type { RootStackParamList } from '../types/navigation';

interface NetworkContextType {
  isConnected: boolean | null;
  previousRoute: { name: keyof RootStackParamList; params?: any } | null;
  setNavigationRef: (ref: NavigationContainerRef<RootStackParamList> | null) => void;
}

const NetworkContext = createContext<NetworkContextType | undefined>(undefined);

export const NetworkProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isConnected, setIsConnected] = useState<boolean | null>(null);
  const [previousRoute, setPreviousRoute] = useState<{ name: keyof RootStackParamList; params?: any } | null>(null);
  const navigationRef = useRef<NavigationContainerRef<RootStackParamList> | null>(null);
  const isNavigatingRef = useRef<boolean>(false);

  const setNavigationRef = useCallback((ref: NavigationContainerRef<RootStackParamList> | null) => {
    navigationRef.current = ref;
  }, []);

  useEffect(() => {
    // Check if NetInfo native module is available
    if (!NetInfo || typeof NetInfo.fetch !== 'function') {
      console.warn('NetInfo native module is not available. Network monitoring disabled.');
      return;
    }

    // Get initial network state
    NetInfo.fetch()
      .then((state: NetInfoState) => {
        setIsConnected(state.isConnected ?? false);
      })
      .catch((error) => {
        console.error('Error fetching initial network state:', error);
        setIsConnected(null);
      });

    // Subscribe to network state changes
    const unsubscribe = NetInfo.addEventListener((state: NetInfoState) => {
      const connected = state.isConnected ?? false;
      
      setIsConnected((prevConnected) => {
        const wasConnected = prevConnected;
        
        // Only handle navigation if we have a navigation ref
        if (!navigationRef.current) {
          return connected;
        }

        const currentRoute = navigationRef.current.getCurrentRoute();

        // If we just went offline
        if (!connected && wasConnected && currentRoute?.name !== 'NoInternet') {
          // Store the current route to return to later
          setPreviousRoute((prevRoute) => {
            // Only update if we don't already have a previous route
            if (!prevRoute) {
              return {
                name: currentRoute?.name as keyof RootStackParamList,
                params: currentRoute?.params,
              };
            }
            return prevRoute;
          });
          
          // Navigate to NoInternet screen
          if (!isNavigatingRef.current) {
            isNavigatingRef.current = true;
            navigationRef.current.navigate('NoInternet' as never);
            setTimeout(() => {
              isNavigatingRef.current = false;
            }, 500);
          }
        }
        
        // If we just came back online
        if (connected && !wasConnected && currentRoute?.name === 'NoInternet') {
          // Navigate back to the previous route
          if (!isNavigatingRef.current) {
            isNavigatingRef.current = true;
            
            setPreviousRoute((storedRoute) => {
              if (storedRoute && navigationRef.current) {
                navigationRef.current.navigate(storedRoute.name as never, storedRoute.params as never);
              } else if (navigationRef.current) {
                // If no previous route, navigate to Splash
                navigationRef.current.reset({
                  index: 0,
                  routes: [{ name: 'Splash' }],
                });
              }
              return null; // Clear the previous route
            });
            
            setTimeout(() => {
              isNavigatingRef.current = false;
            }, 500);
          }
        }
        
        return connected;
      });
    });

    return () => {
      unsubscribe();
    };
  }, []);

  return (
    <NetworkContext.Provider value={{ isConnected, previousRoute, setNavigationRef }}>
      {children}
    </NetworkContext.Provider>
  );
};

export const useNetwork = () => {
  const context = useContext(NetworkContext);
  if (context === undefined) {
    throw new Error('useNetwork must be used within a NetworkProvider');
  }
  return context;
};

