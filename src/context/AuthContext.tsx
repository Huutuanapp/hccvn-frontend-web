/**
 * Authentication Context
 * Manages authentication state and modal display
 */

import React, { createContext, useContext, useCallback, useState, useEffect } from 'react';
import {
  AuthContextState,
  AuthContextActions,
  AuthModalType,
  User,
  AuthTokens,
  ModalState,
  RegisterRequest,
  ActivateAccountRequest,
  LoginRequest,
  Verify2FARequest,
  ResetPasswordRequest,
  UpdateProfileRequest,
} from '../types/auth';
import { authApiClient } from '../services/authApiClient';

// ============================================================================
// CONTEXT CREATION
// ============================================================================

type AuthContextType = AuthContextState & AuthContextActions;

const AuthContext = createContext<AuthContextType | null>(null);

// ============================================================================
// INITIAL STATE
// ============================================================================

const INITIAL_MODAL_STATE: ModalState = {
  isOpen: false,
  isLoading: false,
};

const INITIAL_STATE: AuthContextState = {
  user: null,
  tokens: null,
  isAuthenticated: false,
  isLoading: false,
  modal: INITIAL_MODAL_STATE,
};

// ============================================================================
// CONTEXT PROVIDER
// ============================================================================

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<AuthContextState>(INITIAL_STATE);
  const [isInitializing, setIsInitializing] = useState(true);

  // Initialize auth state on mount
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        // Check if user is still authenticated
        if (authApiClient.isAuthenticated()) {
          const user = authApiClient.getStoredUser();
          if (user) {
            // Optionally verify token is still valid
            if (!authApiClient.isTokenExpired()) {
              setState((prev) => ({
                ...prev,
                user,
                isAuthenticated: true,
              }));
            } else {
              // Try to refresh token
              try {
                const tokens = await authApiClient.refreshToken();
                const user = await authApiClient.getCurrentUser();
                setState((prev) => ({
                  ...prev,
                  user,
                  isAuthenticated: true,
                  tokens: {
                    accessToken: tokens.access_token,
                    refreshToken: tokens.refresh_token,
                    expiresIn: tokens.expires_in,
                    expiresAt: Date.now() + tokens.expires_in * 1000,
                  },
                }));
              } catch (error) {
                // Silent fail - let user re-login
                setState((prev) => ({
                  ...prev,
                  user: null,
                  isAuthenticated: false,
                }));
              }
            }
          }
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
      } finally {
        setIsInitializing(false);
      }
    };

    initializeAuth();
  }, []);

  // ========================================================================
  // MODAL ACTIONS
  // ========================================================================

  const openModal = useCallback(
    (type: AuthModalType, data?: Record<string, any>) => {
      setState((prev) => ({
        ...prev,
        modal: {
          type,
          isOpen: true,
          data,
          isLoading: false,
        },
      }));
    },
    []
  );

  const closeModal = useCallback(() => {
    setState((prev) => ({
      ...prev,
      modal: INITIAL_MODAL_STATE,
    }));
  }, []);

  const setError = useCallback((error?: string) => {
    setState((prev) => ({
      ...prev,
      error,
    }));
  }, []);

  const setLoading = useCallback((loading: boolean) => {
    setState((prev) => ({
      ...prev,
      isLoading: loading,
    }));
  }, []);

  // ========================================================================
  // AUTH ACTIONS
  // ========================================================================

  const register = useCallback(
    async (data: RegisterRequest) => {
      try {
        setState((prev) => ({
          ...prev,
          modal: { ...prev.modal, isLoading: true },
        }));

        const response = await authApiClient.register(data);

        // Security frozen - no email activation, users registered with password are immediately active
        // Auto-close modal and show success message
        setState((prev) => ({
          ...prev,
          modal: {
            ...prev.modal,
            isOpen: false,
            isLoading: false,
            error: undefined,
          },
        }));

      } catch (error: any) {
        setState((prev) => ({
          ...prev,
          modal: {
            ...prev.modal,
            isLoading: false,
            error: error.message || 'Đăng ký không thành công',
          },
        }));
        throw error;
      }
    },
    []
  );

  const login = useCallback(
    async (data: LoginRequest) => {
      try {
        setState((prev) => ({
          ...prev,
          modal: { ...prev.modal, isLoading: true },
        }));

        const response = await authApiClient.login(data);

        // If 2FA is required, show verification modal
        if (response.requires_2fa) {
          setState((prev) => ({
            ...prev,
            modal: {
              type: AuthModalType.VERIFY_2FA,
              isOpen: true,
              data: { token: response.message },
              isLoading: false,
            },
          }));
          return;
        }

        // Otherwise, authentication is complete
        setState((prev) => ({
          ...prev,
          user: response.user,
          isAuthenticated: true,
          tokens: response.tokens
            ? {
                accessToken: response.tokens.access_token,
                refreshToken: response.tokens.refresh_token,
                expiresIn: response.tokens.expires_in,
                expiresAt: Date.now() + response.tokens.expires_in * 1000,
              }
            : null,
          modal: INITIAL_MODAL_STATE,
        }));
      } catch (error: any) {
        setState((prev) => ({
          ...prev,
          modal: {
            ...prev.modal,
            isLoading: false,
            error: error.message || 'Đăng nhập không thành công',
          },
        }));
        throw error;
      }
    },
    []
  );

  const verify2FA = useCallback(
    async (data: Verify2FARequest) => {
      try {
        setState((prev) => ({
          ...prev,
          modal: { ...prev.modal, isLoading: true },
        }));

        const response = (await authApiClient.verify2FA({
          token: data.token || '',
          totp_code: data.totp_code || '',
        })) as any;

        setState((prev) => ({
          ...prev,
          user: response.user,
          isAuthenticated: true,
          tokens: {
            accessToken: response.tokens.access_token,
            refreshToken: response.tokens.refresh_token,
            expiresIn: response.tokens.expires_in,
            expiresAt: Date.now() + response.tokens.expires_in * 1000,
          },
          modal: INITIAL_MODAL_STATE,
        }));
      } catch (error: any) {
        setState((prev) => ({
          ...prev,
          modal: {
            ...prev.modal,
            isLoading: false,
            error: error.message || 'Xác minh 2FA không thành công',
          },
        }));
        throw error;
      }
    },
    []
  );

  const forgotPassword = useCallback(
    async (email: string) => {
      try {
        setState((prev) => ({
          ...prev,
          modal: { ...prev.modal, isLoading: true },
        }));

        await authApiClient.forgotPassword({ email });

        setState((prev) => ({
          ...prev,
          modal: {
            type: AuthModalType.RESET_PASSWORD,
            isOpen: true,
            data: { email },
            isLoading: false,
          },
        }));
      } catch (error: any) {
        setState((prev) => ({
          ...prev,
          modal: {
            ...prev.modal,
            isLoading: false,
            error: error.message || 'Không thể gửi yêu cầu đặt lại mật khẩu',
          },
        }));
        throw error;
      }
    },
    []
  );

  const resetPassword = useCallback(
    async (data: ResetPasswordRequest) => {
      try {
        setState((prev) => ({
          ...prev,
          modal: { ...prev.modal, isLoading: true },
        }));

        await authApiClient.resetPassword(data);

        setState((prev) => ({
          ...prev,
          modal: {
            type: AuthModalType.LOGIN,
            isOpen: true,
            isLoading: false,
            error: undefined,
          },
        }));

        // Show success notification
        setTimeout(() => {
          setError('Mật khẩu đã được đặt lại. Vui lòng đăng nhập lại.');
        }, 300);
      } catch (error: any) {
        setState((prev) => ({
          ...prev,
          modal: {
            ...prev.modal,
            isLoading: false,
            error: error.message || 'Đặt lại mật khẩu không thành công',
          },
        }));
        throw error;
      }
    },
    [setError]
  );

  const updateProfile = useCallback(
    async (data: UpdateProfileRequest) => {
      try {
        setState((prev) => ({
          ...prev,
          modal: { ...prev.modal, isLoading: true },
        }));

        const response = await authApiClient.updateProfile(data);

        setState((prev) => ({
          ...prev,
          user: response.user,
          modal: INITIAL_MODAL_STATE,
        }));
      } catch (error: any) {
        setState((prev) => ({
          ...prev,
          modal: {
            ...prev.modal,
            isLoading: false,
            error: error.message || 'Cập nhật hồ sơ không thành công',
          },
        }));
        throw error;
      }
    },
    []
  );

  const logout = useCallback(() => {
    authApiClient.logout();
    setState(INITIAL_STATE);
  }, []);

  const refreshToken = useCallback(async () => {
    try {
      const tokens = await authApiClient.refreshToken();
      setState((prev) => ({
        ...prev,
        tokens: {
          accessToken: tokens.access_token,
          refreshToken: tokens.refresh_token,
          expiresIn: tokens.expires_in,
          expiresAt: Date.now() + tokens.expires_in * 1000,
        },
      }));
    } catch (error) {
      logout();
      throw error;
    }
  }, [logout]);

  const value: AuthContextType = {
    ...state,
    openModal,
    closeModal,
    setError,
    setLoading,
    register,
    login,
    verify2FA,
    forgotPassword,
    resetPassword,
    updateProfile,
    logout,
    refreshToken,
  };

  if (isInitializing) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Đang tải...</p>
        </div>
      </div>
    );
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// ============================================================================
// HOOK
// ============================================================================

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
};
