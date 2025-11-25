/**
 * API Endpoints
 * Centralized endpoint definitions
 */

const API_VERSION = '/api/v1';

export const endpoints = {
  // Auth endpoints
  auth: {
    login: `${API_VERSION}/auth/login`,
    verifyOTP: `${API_VERSION}/auth/verify-otp`,
    resendOTP: `${API_VERSION}/auth/resend-otp`,
    logout: `${API_VERSION}/auth/logout`,
    refreshToken: `${API_VERSION}/auth/refresh`,
  },

  // User endpoints
  user: {
    profile: `${API_VERSION}/user/profile`,
    updateProfile: `${API_VERSION}/user/profile`,
    changePassword: `${API_VERSION}/user/change-password`,
  },

  // Product endpoints
  products: {
    list: `${API_VERSION}/products`,
    detail: (id: string) => `${API_VERSION}/products/${id}`,
    search: `${API_VERSION}/products/search`,
    byCategory: (categoryId: string) => `${API_VERSION}/products/category/${categoryId}`,
  },

  // Category endpoints
  categories: {
    list: `${API_VERSION}/categories`,
    detail: (id: string) => `${API_VERSION}/categories/${id}`,
  },

  // Cart endpoints
  cart: {
    get: `${API_VERSION}/cart`,
    addItem: `${API_VERSION}/cart/items`,
    updateItem: (itemId: string) => `${API_VERSION}/cart/items/${itemId}`,
    removeItem: (itemId: string) => `${API_VERSION}/cart/items/${itemId}`,
    clear: `${API_VERSION}/cart/clear`,
  },

  // Order endpoints
  orders: {
    list: `${API_VERSION}/orders`,
    detail: (id: string) => `${API_VERSION}/orders/${id}`,
    create: `${API_VERSION}/orders`,
    cancel: (id: string) => `${API_VERSION}/orders/${id}/cancel`,
    rate: (id: string) => `${API_VERSION}/orders/${id}/rate`,
    status: (id: string) => `${API_VERSION}/orders/${id}/status`,
  },

  // Address endpoints
  addresses: {
    list: `${API_VERSION}/addresses`,
    create: `${API_VERSION}/addresses`,
    update: (id: string) => `${API_VERSION}/addresses/${id}`,
    delete: (id: string) => `${API_VERSION}/addresses/${id}`,
    setDefault: (id: string) => `${API_VERSION}/addresses/${id}/default`,
  },

  // Payment endpoints
  payments: {
    methods: `${API_VERSION}/payments/methods`,
    addMethod: `${API_VERSION}/payments/methods`,
    removeMethod: (id: string) => `${API_VERSION}/payments/methods/${id}`,
    setDefault: (id: string) => `${API_VERSION}/payments/methods/${id}/default`,
  },

  // Coupon endpoints
  coupons: {
    list: `${API_VERSION}/coupons`,
    validate: `${API_VERSION}/coupons/validate`,
    apply: `${API_VERSION}/coupons/apply`,
  },

  // Notification endpoints
  notifications: {
    list: `${API_VERSION}/notifications`,
    markRead: (id: string) => `${API_VERSION}/notifications/${id}/read`,
    markAllRead: `${API_VERSION}/notifications/read-all`,
  },
} as const;

