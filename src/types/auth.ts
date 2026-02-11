/**
 * Authentication Types
 * Defines all TypeScript interfaces for auth service integration
 */

// ============================================================================
// ENUMS
// ============================================================================

export enum UserRole {
  RECEIVER = 'RECEIVER',
  REVIEWER = 'REVIEWER',
  APPROVER = 'APPROVER',
  ADMIN = 'ADMIN',
}

export enum AuthModalType {
  REGISTER = 'REGISTER',
  LOGIN = 'LOGIN',
  VERIFY_2FA = 'VERIFY_2FA',
  FORGOT_PASSWORD = 'FORGOT_PASSWORD',
  RESET_PASSWORD = 'RESET_PASSWORD',
  UPDATE_PROFILE = 'UPDATE_PROFILE',
}

// ============================================================================
// USER & PROFILE
// ============================================================================

export interface User {
  id: string;
  email: string;
  full_name: string;
  department?: string;
  phone?: string;
  position?: string;
  role: UserRole;
  is_active: boolean;
  is_locked: boolean;
  has_2fa_enabled: boolean;
  has_accepted_terms: boolean;
  last_login?: string;
  created_at: string;
  updated_at: string;
}

export interface UserProfile {
  full_name: string;
  department?: string;
  phone?: string;
  position?: string;
}

// ============================================================================
// TOKEN & SESSION
// ============================================================================

export interface TokenResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
  expires_in: number;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  expiresAt: number;
}

// ============================================================================
// REQUEST PAYLOADS
// ============================================================================

export interface RegisterRequest {
  email: string;
  full_name: string;
  department?: string;
  has_accepted_terms: boolean;
}

export interface ActivateAccountRequest {
  activation_token: string;
  password: string;
  confirm_password: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface Verify2FARequest {
  token: string;
  totp_code: string;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  reset_token: string;
  password: string;
  confirm_password: string;
}

export interface UpdateProfileRequest {
  full_name?: string;
  department?: string;
  phone?: string;
  position?: string;
}

export interface Enable2FARequest {
  phone?: string;
}

export interface Verify2FASetupRequest {
  totp_code: string;
  backup_code?: string;
}

export interface Disable2FARequest {
  totp_code: string;
}

// ============================================================================
// RESPONSE PAYLOADS
// ============================================================================

export interface RegisterResponse {
  email: string;
  message: string;
  activation_required: boolean;
}

export interface ActivateAccountResponse {
  user: User;
  tokens: TokenResponse;
  message: string;
}

export interface LoginResponse {
  user: User;
  tokens?: TokenResponse;
  requires_2fa: boolean;
  message?: string;
}

export interface Verify2FAResponse {
  user: User;
  tokens: TokenResponse;
  message: string;
}

export interface ForgotPasswordResponse {
  email: string;
  message: string;
  reset_email_sent: boolean;
}

export interface ResetPasswordResponse {
  message: string;
  success: boolean;
}

export interface UpdateProfileResponse {
  user: User;
  message: string;
}

export interface Enable2FAResponse {
  secret: string;
  qr_code: string;
  backup_codes: string[];
  message: string;
}

export interface Verify2FASetupResponse {
  message: string;
  enabled: boolean;
  backup_codes: string[];
}

// ============================================================================
// ERROR HANDLING
// ============================================================================

export interface ApiError {
  status: number;
  message: string;
  error_code?: string;
  details?: Record<string, string | string[]>;
  timestamp?: string;
}

export interface ValidationError {
  field: string;
  message: string;
}

// ============================================================================
// 2FA
// ============================================================================

export interface TOTPSetup {
  secret: string;
  qr_code: string;
  backup_codes: string[];
  provisioning_uri: string;
}

export interface TOTPVerification {
  code: string;
  backup_code?: string;
}

// ============================================================================
// FORM STATE
// ============================================================================

export interface FormState {
  isSubmitting: boolean;
  isLoading: boolean;
  error?: string;
  success?: string;
  errors: Record<string, string>;
}

export interface RegisterFormData {
  email: string;
  full_name: string;
  department?: string;
  has_accepted_terms: boolean;
}

export interface ActivateFormData {
  activation_token: string;
  password: string;
  confirm_password: string;
}

export interface LoginFormData {
  email: string;
  password: string;
}

export interface Verify2FAFormData {
  totp_code: string;
}

export interface ForgotPasswordFormData {
  email: string;
}

export interface ResetPasswordFormData {
  reset_token: string;
  password: string;
  confirm_password: string;
}

export interface UpdateProfileFormData {
  full_name: string;
  department?: string;
  phone?: string;
  position?: string;
}

// ============================================================================
// MODAL STATE
// ============================================================================

export interface ModalState {
  type?: AuthModalType;
  isOpen: boolean;
  data?: Record<string, any>;
  error?: string;
  isLoading: boolean;
}

// ============================================================================
// CONTEXT STATE
// ============================================================================

export interface AuthContextState {
  user: User | null;
  tokens: AuthTokens | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error?: string;
  modal: ModalState;
}

export interface AuthContextActions {
  openModal: (type: AuthModalType, data?: Record<string, any>) => void;
  closeModal: () => void;
  setError: (error?: string) => void;
  setLoading: (loading: boolean) => void;
  register: (data: RegisterRequest) => Promise<void>;
  login: (data: LoginRequest) => Promise<void>;
  verify2FA: (data: Verify2FARequest) => Promise<void>;
  forgotPassword: (email: string) => Promise<void>;
  resetPassword: (data: ResetPasswordRequest) => Promise<void>;
  updateProfile: (data: UpdateProfileRequest) => Promise<void>;
  logout: () => void;
  refreshToken: () => Promise<void>;
}
