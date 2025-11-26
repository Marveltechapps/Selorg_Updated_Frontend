/**
 * Expo App Configuration
 * 
 * This file replaces app.json and provides dynamic configuration
 * including environment variables and native module plugins.
 */

// Validate required environment variables
const GOOGLE_MAPS_API_KEY = process.env.GOOGLE_MAPS_API_KEY;
if (!GOOGLE_MAPS_API_KEY) {
  console.warn('⚠️  GOOGLE_MAPS_API_KEY not set. Maps features will be disabled.');
  // Continue with build but maps features will not work
}

module.exports = {
  expo: {
    name: "Selorg",
    slug: "frontend",
    version: "0.0.1",
    orientation: "portrait",
    icon: "./assets/app_logo.png",
    userInterfaceStyle: "light",
    splash: {
      image: "./assets/splash.png",
      resizeMode: "contain",
      backgroundColor: "#ffffff"
    },
    assetBundlePatterns: [
      "**/*"
    ],
    ios: {
      supportsTablet: true,
      bundleIdentifier: "com.selorg.mobile",
      config: {
        ...(GOOGLE_MAPS_API_KEY && { googleMapsApiKey: GOOGLE_MAPS_API_KEY })
      },
      infoPlist: {
        NSLocationWhenInUseUsageDescription: "This app needs access to your location to show the route to your delivery address.",
        NSLocationAlwaysUsageDescription: "This app needs access to your location to show the route to your delivery address."
      }
    },
    android: {
      adaptiveIcon: {
        foregroundImage: "./assets/app_logo.png",
        backgroundColor: "#ffffff"
      },
      package: "com.selorg.mobile",
      config: {
        ...(GOOGLE_MAPS_API_KEY && {
          googleMaps: {
            apiKey: GOOGLE_MAPS_API_KEY
          }
        })
      },
      permissions: [
        "ACCESS_FINE_LOCATION",
        "ACCESS_COARSE_LOCATION"
      ]
    },
    web: {
      favicon: "./assets/app_logo.png"
    },
    plugins: [
      [
        "expo-build-properties",
        {
          ios: {
            newArchEnabled: true
          },
          android: {
            newArchEnabled: true
          }
        }
      ],
      [
        "expo-location",
        {
          locationAlwaysAndWhenInUsePermission: "This app needs access to your location to show the route to your delivery address."
        }
      ],
      [
        "expo-av",
        {
          microphonePermission: false
        }
      ],
      "expo-secure-store"
    ],
    extra: {
      env: process.env.ENV || "development",
      apiBaseUrl: process.env.API_BASE_URL || "https://api.example.com",
      apiVersion: process.env.API_VERSION || "/api/v1",
      enableLogging: process.env.ENABLE_LOGGING !== "false",
      enableAnalytics: process.env.ENABLE_ANALYTICS !== "false",
      ...(GOOGLE_MAPS_API_KEY && { googleMapsApiKey: GOOGLE_MAPS_API_KEY })
    }
  }
};

