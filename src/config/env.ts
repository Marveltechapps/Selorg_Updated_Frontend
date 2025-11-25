/**
 * Environment Configuration
 * Manages environment variables using react-native-config
 */

let Config: any = null;

// Safely import react-native-config with error handling
try {
  Config = require('react-native-config').default || require('react-native-config');
} catch (error) {
  console.warn('react-native-config not available, using default values', error);
}

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
 * Safely get a config value with fallback
 */
const getConfigValue = (key: string, defaultValue: string): string => {
  try {
    // Check if Config exists and is not null
    if (!Config || Config === null || typeof Config === 'undefined') {
      return defaultValue;
    }
    
    // Handle both Config.key and Config.getConfig().key patterns
    // Only check getConfig if Config is not null
    if (Config && typeof Config === 'object' && 'getConfig' in Config && typeof Config.getConfig === 'function') {
      try {
        const config = Config.getConfig();
        if (config && typeof config === 'object' && config !== null && key in config && config[key] !== undefined) {
          return String(config[key]);
        }
      } catch (getConfigError) {
        // If getConfig() fails, fall through to direct property access
        console.warn(`Error calling Config.getConfig() for key ${key}:`, getConfigError);
      }
    }
    
    // Direct property access (standard react-native-config pattern)
    if (Config && typeof Config === 'object' && key in Config && Config[key] !== undefined) {
      const value = Config[key];
      return value !== null && value !== undefined ? String(value) : defaultValue;
    }
    
    return defaultValue;
  } catch (error) {
    console.warn(`Error accessing config key ${key}:`, error);
    return defaultValue;
  }
};

/**
 * Get environment configuration
 */
export const getEnvConfig = (): EnvConfig => {
  try {
    const env = (getConfigValue('ENV', 'development') || 'development') as Environment;

    return {
      env,
      apiBaseUrl: getConfigValue('API_BASE_URL', DEFAULT_CONFIG.apiBaseUrl),
      apiVersion: getConfigValue('API_VERSION', DEFAULT_CONFIG.apiVersion),
      enableLogging: getConfigValue('ENABLE_LOGGING', 'true') === 'true',
      enableAnalytics: getConfigValue('ENABLE_ANALYTICS', 'true') === 'true',
    };
  } catch (error) {
    console.error('Error getting environment config, using defaults:', error);
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

