/**
 * File: frontend-web/src/api/client.ts
 * Purpose: Centralized API client using generated SDK
 * EN: Configures and exports API clients with authentication
 * VI: Cấu hình và xuất các API client với xác thực
 */

import {
  Configuration,
  AuthenticationApi,
  ExplainabilityApi,
  ProxyApi,
} from './generated';

/**
 * Get base URL from environment
 */
const getBaseUrl = (): string => {
  // Check environment variables
  const envUrl = (import.meta.env.VITE_API_BASE_URL || import.meta.env.VITE_API_URL) as string | undefined;
  
  if (envUrl) {
    return envUrl;
  }
  
  // Default to localhost in development
  if (import.meta.env.DEV) {
    return 'http://localhost:8080';
  }
  
  // Production default
  return 'https://api.hccvn-ai.gov.vn';
};

/**
 * Get JWT token from localStorage
 */
const getAuthToken = (): string | undefined => {
  try {
    const token = localStorage.getItem('access_token');
    return token || undefined;
  } catch {
    return undefined;
  }
};

/**
 * Create API configuration with authentication
 */
const createConfiguration = (): Configuration => {
  const token = getAuthToken();
  
  return new Configuration({
    basePath: getBaseUrl(),
    headers: token ? {
      'Authorization': `Bearer ${token}`,
    } : {},
  });
};

/**
 * Get fresh configuration (call this before each API call to get latest token)
 */
export const getConfiguration = (): Configuration => {
  return createConfiguration();
};

// ==================== API CLIENT INSTANCES ====================

/**
 * Authentication API
 * - Register, login, refresh, JWKS
 */
export const authApi = new AuthenticationApi(createConfiguration());

/**
 * Explainability API
 */
export const explainabilityApi = new ExplainabilityApi(createConfiguration());

/**
 * Proxy API
 */
export const proxyApi = new ProxyApi(createConfiguration());

// ==================== HELPER FUNCTIONS ====================

/**
 * Refresh all API clients (call after login/token update)
 * Since configuration is protected, we'll just reinitialize the module
 */
export const refreshApiClients = (): void => {
  // Configuration is protected, so we can't modify existing instances
  // Instead, create new instances - users should call createAuthenticatedClient
};

/**
 * Create API client with fresh token (use for individual calls)
 */
export const createAuthenticatedClient = <T>(ApiClass: new (config: Configuration) => T): T => {
  return new ApiClass(createConfiguration());
};

// ==================== ERROR HANDLING ====================

/**
 * Check if error is authentication error
 */
export const isAuthError = (error: any): boolean => {
  return error?.status === 401 || error?.statusCode === 401;
};

/**
 * Check if error is forbidden error
 */
export const isForbiddenError = (error: any): boolean => {
  return error?.status === 403 || error?.statusCode === 403;
};

/**
 * Extract error message from API error
 */
export const getErrorMessage = (error: any): string => {
  if (error?.json) {
    return error.json.detail || error.json.message || 'Đã xảy ra lỗi';
  }
  
  if (error?.message) {
    return error.message;
  }
  
  return 'Đã xảy ra lỗi không xác định';
};

// ==================== RE-EXPORTS ====================

// Export all types from generated SDK
export * from './generated';

// Export commonly used types
export type {
  HTTPValidationError,
  LocationInner,
  ValidationError,
} from './generated';
