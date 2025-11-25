/**
 * Secure Storage Utility
 * Wrapper around react-native-keychain for secure storage
 */

import * as Keychain from 'react-native-keychain';

const ACCESS_TOKEN_KEY = 'access_token';
const REFRESH_TOKEN_KEY = 'refresh_token';
const USER_DATA_KEY = 'user_data';

/**
 * Get access token from secure storage
 */
export const getToken = async (): Promise<string | null> => {
  try {
    const credentials = await Keychain.getGenericPassword();
    if (credentials && credentials.password) {
      return credentials.password;
    }
    return null;
  } catch (error) {
    console.error('Error getting token:', error);
    return null;
  }
};

/**
 * Save access token to secure storage
 */
export const saveToken = async (token: string): Promise<boolean> => {
  try {
    await Keychain.setGenericPassword(ACCESS_TOKEN_KEY, token);
    return true;
  } catch (error) {
    console.error('Error saving token:', error);
    return false;
  }
};

/**
 * Get refresh token from secure storage
 */
export const getRefreshToken = async (): Promise<string | null> => {
  try {
    const credentials = await Keychain.getInternetCredentials(REFRESH_TOKEN_KEY);
    if (credentials && credentials.password) {
      return credentials.password;
    }
    return null;
  } catch (error) {
    console.error('Error getting refresh token:', error);
    return null;
  }
};

/**
 * Save refresh token to secure storage
 */
export const saveRefreshToken = async (token: string): Promise<boolean> => {
  try {
    await Keychain.setInternetCredentials(REFRESH_TOKEN_KEY, REFRESH_TOKEN_KEY, token);
    return true;
  } catch (error) {
    console.error('Error saving refresh token:', error);
    return false;
  }
};

/**
 * Clear all tokens from secure storage
 */
export const clearToken = async (): Promise<boolean> => {
  try {
    await Keychain.resetGenericPassword();
    await Keychain.resetInternetCredentials(REFRESH_TOKEN_KEY);
    return true;
  } catch (error) {
    console.error('Error clearing tokens:', error);
    return false;
  }
};

/**
 * Save user data to secure storage
 */
export const saveUserData = async (userData: string): Promise<boolean> => {
  try {
    await Keychain.setInternetCredentials(USER_DATA_KEY, USER_DATA_KEY, userData);
    return true;
  } catch (error) {
    console.error('Error saving user data:', error);
    return false;
  }
};

/**
 * Get user data from secure storage
 */
export const getUserData = async (): Promise<string | null> => {
  try {
    const credentials = await Keychain.getInternetCredentials(USER_DATA_KEY);
    if (credentials && credentials.password) {
      return credentials.password;
    }
    return null;
  } catch (error) {
    console.error('Error getting user data:', error);
    return null;
  }
};

/**
 * Clear all stored data
 */
export const clearAll = async (): Promise<boolean> => {
  try {
    await clearToken();
    await Keychain.resetInternetCredentials(USER_DATA_KEY);
    return true;
  } catch (error) {
    console.error('Error clearing all data:', error);
    return false;
  }
};

