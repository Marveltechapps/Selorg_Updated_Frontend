/**
 * Expo App Configuration
 * 
 * This file replaces app.json and provides dynamic configuration
 * including environment variables and native module plugins.
 */

module.exports = {
  expo: {
    name: "SELORG",
    slug: "frontend",
    version: "0.0.1",
    orientation: "portrait",
    icon: "./assets/icon.png",
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
      bundleIdentifier: "com.frontend",
      config: {
        googleMapsApiKey: process.env.GOOGLE_MAPS_API_KEY || "AIzaSyAKVumkjaEhGUefBCclE23rivFqPK3LDRQ"
      },
      infoPlist: {
        NSLocationWhenInUseUsageDescription: "This app needs access to your location to show the route to your delivery address.",
        NSLocationAlwaysUsageDescription: "This app needs access to your location to show the route to your delivery address."
      }
    },
    android: {
      adaptiveIcon: {
        foregroundImage: "./assets/adaptive-icon.png",
        backgroundColor: "#ffffff"
      },
      package: "com.frontend",
      config: {
        googleMaps: {
          apiKey: process.env.GOOGLE_MAPS_API_KEY || "AIzaSyAKVumkjaEhGUefBCclE23rivFqPK3LDRQ"
        }
      },
      permissions: [
        "ACCESS_FINE_LOCATION",
        "ACCESS_COARSE_LOCATION"
      ]
    },
    web: {
      favicon: "./assets/favicon.png"
    },
    plugins: [
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
      ]
    ],
    extra: {
      env: process.env.ENV || "development",
      apiBaseUrl: process.env.API_BASE_URL || "https://api.example.com",
      apiVersion: process.env.API_VERSION || "/api/v1",
      enableLogging: process.env.ENABLE_LOGGING !== "false",
      enableAnalytics: process.env.ENABLE_ANALYTICS !== "false",
      googleMapsApiKey: process.env.GOOGLE_MAPS_API_KEY || "AIzaSyAKVumkjaEhGUefBCclE23rivFqPK3LDRQ"
    }
  }
};

