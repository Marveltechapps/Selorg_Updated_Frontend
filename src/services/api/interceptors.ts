/**
 * API Interceptors
 * Request and response interceptors for axios
 */

import axios, { AxiosError, InternalAxiosRequestConfig, AxiosResponse } from 'axios';
import type { ApiError } from './types';
import { tokenManager } from './tokenManager';
import * as storage from '../../utils/storage';

/**
 * Request interceptor - Add auth token to requests
 */
export const requestInterceptor = (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
  // Skip auth for certain endpoints
  if (config.skipAuth) {
    return config;
  }

  // Add auth token if available (synchronous access via token manager)
  const token = tokenManager.getToken();
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  // Add common headers
  if (config.headers) {
    config.headers['Content-Type'] = config.headers['Content-Type'] || 'application/json';
  }

  return config;
};

/**
 * Response interceptor - Handle responses and errors
 */
export const responseInterceptor = {
  onFulfilled: (response: AxiosResponse) => {
    // Return data directly if it exists
    return response.data;
  },
  onRejected: (error: AxiosError<ApiError>) => {
    // Handle different error status codes
    if (error.response) {
      const { status, data } = error.response;

      switch (status) {
        case 401:
          // Unauthorized - clear token and redirect to login
          tokenManager.clearTokens();
          // You can add navigation logic here if needed
          break;
        case 403:
          // Forbidden
          break;
        case 404:
          // Not found
          break;
        case 500:
          // Server error
          break;
        default:
          break;
      }

      // Return formatted error
      const apiError: ApiError = {
        message: data?.message || error.message || 'An error occurred',
        code: data?.code,
        status,
        errors: data?.errors,
      };

      return Promise.reject(apiError);
    }

    // Network error or other issues
    const apiError: ApiError = {
      message: error.message || 'Network error. Please check your connection.',
      code: 'NETWORK_ERROR',
    };

    return Promise.reject(apiError);
  },
};

