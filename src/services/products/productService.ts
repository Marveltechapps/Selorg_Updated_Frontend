/**
 * Product Service
 * Handles product-related API calls
 */

import { api } from '../api/client';
import { endpoints } from '../api/endpoints';
import type { ApiResponse, PaginatedResponse } from '../api/types';

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  discount?: string;
  image: string;
  images?: string[];
  categoryId: string;
  categoryName: string;
  inStock: boolean;
  variants?: ProductVariant[];
}

export interface ProductVariant {
  id: string;
  size: string;
  price: number;
  originalPrice?: number;
  inStock: boolean;
}

export interface Category {
  id: string;
  name: string;
  image: string;
  description?: string;
  subCategories?: SubCategory[];
}

export interface SubCategory {
  id: string;
  name: string;
  image?: string;
}

export interface ProductListParams {
  page?: number;
  limit?: number;
  categoryId?: string;
  search?: string;
  sortBy?: 'price' | 'name' | 'popularity';
  sortOrder?: 'asc' | 'desc';
}

/**
 * Get list of products
 */
export const getProducts = async (params?: ProductListParams): Promise<ApiResponse<PaginatedResponse<Product>>> => {
  return api.get<PaginatedResponse<Product>>(endpoints.products.list, { params });
};

/**
 * Get product by ID
 */
export const getProductById = async (id: string): Promise<ApiResponse<Product>> => {
  return api.get<Product>(endpoints.products.detail(id));
};

/**
 * Search products
 */
export const searchProducts = async (query: string, params?: ProductListParams): Promise<ApiResponse<PaginatedResponse<Product>>> => {
  return api.get<PaginatedResponse<Product>>(endpoints.products.search, {
    params: { ...params, q: query },
  });
};

/**
 * Get products by category
 */
export const getProductsByCategory = async (categoryId: string, params?: ProductListParams): Promise<ApiResponse<PaginatedResponse<Product>>> => {
  return api.get<PaginatedResponse<Product>>(endpoints.products.byCategory(categoryId), { params });
};

/**
 * Get list of categories
 */
export const getCategories = async (): Promise<ApiResponse<Category[]>> => {
  return api.get<Category[]>(endpoints.categories.list);
};

/**
 * Get category by ID
 */
export const getCategoryById = async (id: string): Promise<ApiResponse<Category>> => {
  return api.get<Category>(endpoints.categories.detail(id));
};

