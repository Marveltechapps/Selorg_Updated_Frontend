// Jest setup file for Expo
import 'react-native-gesture-handler/jestSetup';

// Mock Expo modules
jest.mock('expo-constants', () => ({
  default: {
    expoConfig: {
      extra: {
        env: 'test',
        apiBaseUrl: 'https://api.test.com',
        apiVersion: '/api/v1',
        enableLogging: false,
        enableAnalytics: false,
      },
    },
  },
}));

jest.mock('expo-location', () => ({
  requestForegroundPermissionsAsync: jest.fn(() => Promise.resolve({ status: 'granted' })),
  getCurrentPositionAsync: jest.fn(() =>
    Promise.resolve({
      coords: {
        latitude: 37.7749,
        longitude: -122.4194,
      },
    })
  ),
  Accuracy: {
    High: 1,
  },
}));

jest.mock('expo-av', () => ({
  useVideoPlayer: jest.fn(() => ({
    play: jest.fn(),
    pause: jest.fn(),
    loop: false,
    muted: false,
  })),
  VideoView: 'VideoView',
}));

// Silence the warning: Animated: `useNativeDriver` is not supported
// Note: This path may vary by React Native version
try {
  jest.mock('react-native/Libraries/Animated/NativeAnimatedHelper');
} catch (e) {
  // Mock may not be needed in this RN version
}

