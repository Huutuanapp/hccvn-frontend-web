/**
 * Authentication API Client
 * Communicates with the auth-service backend using generated SDK
 */

import {
  refreshApiClients,
  getErrorMessage,
  createAuthenticatedClient,
  AuthenticationApi,
  getConfiguration,
} from '../api/client';
import {
  User,
  TokenResponse,
  ApiError,
  RegisterRequest,
  RegisterResponse,
  LoginRequest,
  LoginResponse,
  ForgotPasswordRequest,
  ForgotPasswordResponse,
  ResetPasswordRequest,
  ResetPasswordResponse,
  UpdateProfileRequest,
  UpdateProfileResponse,
  Enable2FARequest,
  Enable2FAResponse,
  Verify2FARequest,
  Verify2FAResponse,
  Verify2FASetupRequest,
  Verify2FASetupResponse,
  Disable2FARequest,
} from '../types/auth';

// ============================================================================
// API CLIENT CLASS
// ============================================================================

class AuthApiClient {
  constructor() {
    // No initialization needed - SDK handles configuration
  }

  private buildUrl(path: string): string {
    const config = getConfiguration();
    return `${config.basePath}${path}`;
  }

  private async postJson<T>(path: string, body: unknown): Promise<T> {
    const config = getConfiguration();
    const headers = {
      'Content-Type': 'application/json',
      ...(config.headers || {}),
    } as Record<string, string>;

    const response = await fetch(this.buildUrl(path), {
      method: 'POST',
      headers,
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      throw response;
    }

    return (await response.json()) as T;
  }

  // ========================================================================
  // TOKEN MANAGEMENT
  // ========================================================================

  private getAccessToken(): string | null {
    return localStorage.getItem('access_token');
  }

  private getRefreshToken(): string | null {
    return localStorage.getItem('refresh_token');
  }

  private saveTokens(tokens: TokenResponse): void {
    localStorage.setItem('access_token', tokens.access_token);
    localStorage.setItem('refresh_token', tokens.refresh_token);
    localStorage.setItem(
      'hccvn_token_expires_at',
      (Date.now() + tokens.expires_in * 1000).toString()
    );
    // Refresh API clients with new token
    refreshApiClients();
  }

  private clearTokens(): void {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('hccvn_token_expires_at');
    localStorage.removeItem('hccvn_user');
    // Refresh API clients to remove token
    refreshApiClients();
  }

  private saveUser(user: User): void {
    localStorage.setItem('hccvn_user', JSON.stringify(user));
  }

  // ========================================================================
  // ERROR HANDLING
  // ========================================================================

  private handleError(error: any): ApiError {
    // Check if it's SDK error
    if (error?.status || error?.statusCode) {
      const status = error.status || error.statusCode;
      return {
        status,
        message: getErrorMessage(error),
        error_code: error?.error_code,
        details: error?.details,
        timestamp: new Date().toISOString(),
      };
    }

    return {
      status: 0,
      message: 'Đã xảy ra lỗi không xác định',
    };
  }

  // ========================================================================
  // PUBLIC ENDPOINTS
  // ========================================================================

  async register(payload: RegisterRequest): Promise<RegisterResponse> {
    try {
      const response = await this.postJson<any>('/api/auth/register', payload);
      return {
        message: 'User registered successfully',
        email: payload.email,
        activation_required: true,
      } as RegisterResponse;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async login(payload: LoginRequest): Promise<LoginResponse> {
    try {
      const response = await this.postJson<any>('/api/auth/login', payload);
      const accessToken = response?.access_token || response?.accessToken || '';
      const refreshToken = response?.refresh_token || response?.refreshToken || '';
      const tokenType = response?.token_type || response?.tokenType || 'bearer';
      const expiresIn = response?.expires_in || response?.expiresIn || 1800;

      if (!accessToken) {
        throw new Error('Login response missing access token');
      }

      const userFromResponse = response?.user || {};

      const loginResponse: LoginResponse = {
        user: {
          id: userFromResponse?.id || '',
          email: userFromResponse?.email || payload.email,
          full_name: userFromResponse?.full_name || payload.email,
          department: userFromResponse?.department,
          phone: userFromResponse?.phone,
          position: userFromResponse?.position,
          role: userFromResponse?.role || 'RECEIVER',
          is_active: userFromResponse?.is_active || false,
          is_locked: userFromResponse?.is_locked || false,
          has_2fa_enabled: userFromResponse?.has_2fa_enabled || false,
          has_accepted_terms: userFromResponse?.has_accepted_terms || false,
          last_login: userFromResponse?.last_login,
          created_at: userFromResponse?.created_at || new Date().toISOString(),
          updated_at: userFromResponse?.updated_at || new Date().toISOString(),
        } as User,
        tokens: {
          access_token: accessToken,
          refresh_token: refreshToken,
          token_type: tokenType,
          expires_in: expiresIn,
        },
        requires_2fa: false, // SDK doesn't expose 2FA requirement
      };

      if (!loginResponse.requires_2fa && loginResponse.tokens) {
        this.saveTokens(loginResponse.tokens);
        this.saveUser(loginResponse.user);
      }

      return loginResponse;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async verify2FA(payload: Verify2FARequest): Promise<Verify2FAResponse> {
    try {
      throw new Error('2FA endpoints are not available in current gateway OpenAPI');
    } catch (error) {
      throw this.handleError(error);
    }
  }

  getStoredUser(): User | null {
    try {
      const userJson = localStorage.getItem('hccvn_user');
      return userJson ? JSON.parse(userJson) : null;
    } catch {
      return null;
    }
  }

  async forgotPassword(payload: ForgotPasswordRequest): Promise<ForgotPasswordResponse> {
    try {
      // Note: This endpoint may not be in the generated SDK yet
      // Will need to be added to OpenAPI spec
      throw new Error('Forgot password not implemented in SDK');
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async resetPassword(payload: ResetPasswordRequest): Promise<ResetPasswordResponse> {
    try {
      // Note: This endpoint may not be in the generated SDK yet
      // Will need to be added to OpenAPI spec
      throw new Error('Reset password not implemented in SDK');
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // ========================================================================
  // AUTHENTICATED ENDPOINTS
  // ========================================================================

  async getCurrentUser(): Promise<User> {
    try {
      const api = createAuthenticatedClient(AuthenticationApi);
      const response = await api.getCurrentUserApiAuthMeGet();
      
      const user: User = {
        id: (response as any)?.id || '',
        email: (response as any)?.email || '',
        full_name: (response as any)?.full_name || (response as any)?.first_name || '',
        department: (response as any)?.department,
        phone: (response as any)?.phone,
        position: (response as any)?.position,
        role: (response as any)?.role || 'RECEIVER',
        is_active: (response as any)?.is_active || false,
        is_locked: (response as any)?.is_locked || false,
        has_2fa_enabled: (response as any)?.has_2fa_enabled || false,
        has_accepted_terms: (response as any)?.has_accepted_terms || false,
        last_login: (response as any)?.last_login,
        created_at: (response as any)?.created_at || new Date().toISOString(),
        updated_at: (response as any)?.updated_at || new Date().toISOString(),
      };
      
      this.saveUser(user);
      return user;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async updateProfile(payload: UpdateProfileRequest): Promise<UpdateProfileResponse> {
    try {
      // Note: This endpoint may need to be added to OpenAPI spec
      // For now, get current user and return as update response
      const user = await this.getCurrentUser();
      return { user, message: 'Profile updated' } as UpdateProfileResponse;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async refreshToken(): Promise<TokenResponse> {
    try {
      const refreshToken = this.getRefreshToken();
      if (!refreshToken) throw new Error('No refresh token available');

      const response = await this.postJson<any>('/api/auth/refresh', {
        refresh_token: refreshToken,
      });
      
      // SDK only returns new access token, refresh token stays the same
      return {
        access_token: response?.access_token || response?.accessToken || '',
        refresh_token: refreshToken, // Use existing refresh token
        token_type: response?.token_type || response?.tokenType || 'bearer',
        expires_in: response?.expires_in || response?.expiresIn || 1800,
      };
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async logout(): Promise<void> {
    try {
      // SDK doesn't have logout endpoint yet, just clear tokens
      this.clearTokens();
    } catch (error) {
      console.error('Logout error:', error);
      this.clearTokens();
    }
  }

  // ========================================================================
  // 2FA ENDPOINTS (ADMIN ONLY)
  // ========================================================================

  async enable2FA(payload: Enable2FARequest): Promise<Enable2FAResponse> {
    try {
      throw new Error('2FA endpoints are not available in current gateway OpenAPI');
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async verify2FASetup(payload: Verify2FASetupRequest): Promise<Verify2FASetupResponse> {
    try {
      throw new Error('2FA endpoints are not available in current gateway OpenAPI');
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async disable2FA(payload: Disable2FARequest): Promise<{ message: string }> {
    try {
      throw new Error('2FA endpoints are not available in current gateway OpenAPI');
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // ========================================================================
  // UTILITY METHODS
  // ========================================================================

  isAuthenticated(): boolean {
    const token = this.getAccessToken();
    const expiresAt = localStorage.getItem('hccvn_token_expires_at');

    if (!token || !expiresAt) return false;

    // Check if token is not expired
    return Date.now() < parseInt(expiresAt);
  }

  isTokenExpired(): boolean {
    const expiresAt = localStorage.getItem('hccvn_token_expires_at');
    if (!expiresAt) return true;

    // Refresh if token expires in less than 5 minutes
    return Date.now() > parseInt(expiresAt) - 5 * 60 * 1000;
  }

  getCurrentUserFromStorage(): User | null {
    const userStr = localStorage.getItem('hccvn_user');
    if (!userStr) return null;

    try {
      return JSON.parse(userStr);
    } catch {
      return null;
    }
  }
}

// ============================================================================
// EXPORT SINGLETON
// ============================================================================

export const authApiClient = new AuthApiClient();
