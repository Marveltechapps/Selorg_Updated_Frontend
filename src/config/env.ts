/**
 * Environment Configuration
 * Manages environment variables using react-native-config
 */

import Config from 'react-native-config';

export type Environment = 'development' | 'staging' | 'production';

interface EnvConfig {
  env: Environment;
  apiBaseUrl: string;
  apiVersion: string;
  enableLogging: boolean;
  enableAnalytics: boolean;
}

/**
 * Get environment configuration
 */
export const getEnvConfig = (): EnvConfig => {
  const env = (Config.ENV || 'development') as Environment;

  return {
    env,
    apiBaseUrl: Config.API_BASE_URL || 'https://api.example.com',
    apiVersion: Config.API_VERSION || '/api/v1',
    enableLogging: Config.ENABLE_LOGGING === 'true',
    enableAnalytics: Config.ENABLE_ANALYTICS === 'true',
  };
};

/**
 * Current environment configuration
 */
export const envConfig = getEnvConfig();

/**
 * Check if running in development
 */
export const isDevelopment = (): boolean => envConfig.env === 'development';

/**
 * Check if running in production
 */
export const isProduction = (): boolean => envConfig.env === 'production';

/**
 * Check if running in staging
 */
export const isStaging = (): boolean => envConfig.env === 'staging';

