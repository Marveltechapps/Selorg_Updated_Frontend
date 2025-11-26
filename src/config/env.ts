/**
 * Environment Configuration
 * Manages environment variables using expo-constants
 * 
 * Note: This file does not use the logger utility to avoid circular dependencies.
 * Logger depends on env.ts, so env.ts uses console directly for error reporting.
 */

import Constants from 'expo-constants';

export type Environment = 'development' | 'staging' | 'production';

interface EnvConfig {
  env: Environment;
  apiBaseUrl: string;
  apiVersion: string;
  enableLogging: boolean;
  enableAnalytics: boolean;
}

// Default configuration values
const DEFAULT_CONFIG: EnvConfig = {
  env: 'development' as Environment,
  apiBaseUrl: 'https://api.example.com',
  apiVersion: '/api/v1',
  enableLogging: true,
  enableAnalytics: true,
};

/**
 * Safely get a config value from expo-constants with fallback
 */
const getConfigValue = (key: string, defaultValue: string): string => {
  try {
    const extra = Constants.expoConfig?.extra;
    if (extra && typeof extra === 'object' && key in extra) {
      const value = extra[key];
      return value !== null && value !== undefined ? String(value) : defaultValue;
    }
    return defaultValue;
  } catch (error) {
    // Use console directly to avoid circular dependency with logger
    // Only log in development to avoid noise in production
    // @ts-ignore - __DEV__ is a global defined by React Native/Metro bundler
    if (typeof __DEV__ !== 'undefined' && __DEV__) {
      console.warn(`[env] Error accessing config key ${key}:`, error);
    }
    return defaultValue;
  }
};

/**
 * Get environment configuration
 */
export const getEnvConfig = (): EnvConfig => {
  try {
    const env = (getConfigValue('env', 'development') || 'development') as Environment;

    return {
      env,
      apiBaseUrl: getConfigValue('apiBaseUrl', DEFAULT_CONFIG.apiBaseUrl),
      apiVersion: getConfigValue('apiVersion', DEFAULT_CONFIG.apiVersion),
      enableLogging: getConfigValue('enableLogging', 'true') === 'true',
      enableAnalytics: getConfigValue('enableAnalytics', 'true') === 'true',
    };
  } catch (error) {
    // Use console directly to avoid circular dependency with logger
    // Only log in development to avoid noise in production
    // @ts-ignore - __DEV__ is a global defined by React Native/Metro bundler
    if (typeof __DEV__ !== 'undefined' && __DEV__) {
      console.error('[env] Error getting environment config, using defaults:', error);
    }
    return DEFAULT_CONFIG;
  }
};

/**
 * Current environment configuration (lazy-loaded)
 */
let cachedEnvConfig: EnvConfig | null = null;

export const getEnvConfigSafe = (): EnvConfig => {
  if (!cachedEnvConfig) {
    cachedEnvConfig = getEnvConfig();
  }
  return cachedEnvConfig;
};

/**
 * Current environment configuration
 * @deprecated Use getEnvConfigSafe() for safer access
 */
export const envConfig: EnvConfig = getEnvConfigSafe();

/**
 * Check if running in development
 */
export const isDevelopment = (): boolean => {
  try {
    return getEnvConfigSafe().env === 'development';
  } catch {
    return true; // Default to development if config fails
  }
};

/**
 * Check if running in production
 */
export const isProduction = (): boolean => {
  try {
    return getEnvConfigSafe().env === 'production';
  } catch {
    return false;
  }
};

/**
 * Check if running in staging
 */
export const isStaging = (): boolean => {
  try {
    return getEnvConfigSafe().env === 'staging';
  } catch {
    return false;
  }
};

