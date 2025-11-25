/**
 * Auth Service
 * Handles authentication-related API calls
 */

import { api } from '../api/client';
import { endpoints } from '../api/endpoints';
import type { ApiResponse } from '../api/types';

export interface LoginRequest {
  phoneNumber: string;
}

export interface LoginResponse {
  success: boolean;
  message: string;
  sessionId?: string;
}

export interface VerifyOTPRequest {
  phoneNumber: string;
  otp: string;
  sessionId?: string;
}

export interface VerifyOTPResponse {
  success: boolean;
  token: string;
  refreshToken: string;
  user: {
    id: string;
    name: string;
    email?: string;
    phoneNumber: string;
  };
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

export interface RefreshTokenResponse {
  token: string;
  refreshToken: string;
}

/**
 * Send OTP to phone number
 */
export const sendOTP = async (data: LoginRequest): Promise<ApiResponse<LoginResponse>> => {
  return api.post<LoginResponse>(endpoints.auth.login, data, { skipAuth: true });
};

/**
 * Verify OTP
 */
export const verifyOTP = async (data: VerifyOTPRequest): Promise<ApiResponse<VerifyOTPResponse>> => {
  return api.post<VerifyOTPResponse>(endpoints.auth.verifyOTP, data, { skipAuth: true });
};

/**
 * Resend OTP
 */
export const resendOTP = async (data: LoginRequest): Promise<ApiResponse<LoginResponse>> => {
  return api.post<LoginResponse>(endpoints.auth.resendOTP, data, { skipAuth: true });
};

/**
 * Logout user
 */
export const logout = async (): Promise<ApiResponse<void>> => {
  return api.post<void>(endpoints.auth.logout);
};

/**
 * Refresh access token
 */
export const refreshToken = async (data: RefreshTokenRequest): Promise<ApiResponse<RefreshTokenResponse>> => {
  return api.post<RefreshTokenResponse>(endpoints.auth.refreshToken, data, { skipAuth: true });
};

