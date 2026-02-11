/**
 * Form Validation Utilities
 * Centralized validation logic for all auth forms
 */

import {
  RegisterFormData,
  ActivateFormData,
  LoginFormData,
  ForgotPasswordFormData,
  ResetPasswordFormData,
  UpdateProfileFormData,
  Verify2FAFormData,
} from '../types/auth';

// ============================================================================
// VALIDATION RULES
// ============================================================================

const VALIDATION_RULES = {
  email: {
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    minLength: 5,
    maxLength: 255,
  },
  password: {
    minLength: 8,
    hasUppercase: /[A-Z]/,
    hasLowercase: /[a-z]/,
    hasNumber: /[0-9]/,
    hasSpecialChar: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/,
  },
  fullName: {
    minLength: 2,
    maxLength: 255,
    pattern: /^[a-zA-ZÀ-ỿ\s'-]+$/,
  },
  phone: {
    pattern: /^[\d+\-\s()]+$/,
    minLength: 10,
    maxLength: 20,
  },
  totpCode: {
    pattern: /^\d{6}$/,
  },
  department: {
    maxLength: 255,
  },
  position: {
    maxLength: 255,
  },
};

// ============================================================================
// ERROR MESSAGES (Vietnamese)
// ============================================================================

const ERROR_MESSAGES = {
  email: {
    required: 'Email là bắt buộc',
    invalid: 'Email không hợp lệ',
    tooLong: 'Email không được vượt quá 255 ký tự',
  },
  password: {
    required: 'Mật khẩu là bắt buộc',
    tooShort: 'Mật khẩu phải có ít nhất 8 ký tự',
    noUppercase: 'Mật khẩu phải chứa ít nhất một chữ in hoa',
    noLowercase: 'Mật khẩu phải chứa ít nhất một chữ thường',
    noNumber: 'Mật khẩu phải chứa ít nhất một số',
    noSpecialChar: 'Mật khẩu phải chứa ít nhất một ký tự đặc biệt (!@#$%^&*)',
  },
  confirmPassword: {
    required: 'Xác nhận mật khẩu là bắt buộc',
    notMatch: 'Mật khẩu xác nhận không khớp',
  },
  fullName: {
    required: 'Họ tên là bắt buộc',
    tooShort: 'Họ tên phải có ít nhất 2 ký tự',
    tooLong: 'Họ tên không được vượt quá 255 ký tự',
    invalid: 'Họ tên chỉ được chứa chữ cái, khoảng trắng, dấu gạch ngang và nháy đơn',
  },
  phone: {
    invalid: 'Số điện thoại không hợp lệ',
    tooShort: 'Số điện thoại phải có ít nhất 10 chữ số',
    tooLong: 'Số điện thoại không được vượt quá 20 ký tự',
  },
  department: {
    tooLong: 'Phòng ban không được vượt quá 255 ký tự',
  },
  position: {
    tooLong: 'Chức vụ không được vượt quá 255 ký tự',
  },
  legalConsent: {
    required: 'Bạn phải chấp nhận điều khoản pháp lý',
  },
  totpCode: {
    required: 'Mã OTP là bắt buộc',
    invalid: 'Mã OTP phải là 6 chữ số',
  },
  activationToken: {
    required: 'Mã kích hoạt là bắt buộc',
  },
  resetToken: {
    required: 'Mã đặt lại mật khẩu là bắt buộc',
  },
};

// ============================================================================
// VALIDATION FUNCTIONS
// ============================================================================

export const validateEmail = (email: string): string | null => {
  if (!email) return ERROR_MESSAGES.email.required;
  if (!VALIDATION_RULES.email.pattern.test(email))
    return ERROR_MESSAGES.email.invalid;
  if (email.length > VALIDATION_RULES.email.maxLength)
    return ERROR_MESSAGES.email.tooLong;
  return null;
};

export const validatePassword = (password: string): string | null => {
  if (!password) return ERROR_MESSAGES.password.required;
  if (password.length < VALIDATION_RULES.password.minLength)
    return ERROR_MESSAGES.password.tooShort;
  if (!VALIDATION_RULES.password.hasUppercase.test(password))
    return ERROR_MESSAGES.password.noUppercase;
  if (!VALIDATION_RULES.password.hasLowercase.test(password))
    return ERROR_MESSAGES.password.noLowercase;
  if (!VALIDATION_RULES.password.hasNumber.test(password))
    return ERROR_MESSAGES.password.noNumber;
  if (!VALIDATION_RULES.password.hasSpecialChar.test(password))
    return ERROR_MESSAGES.password.noSpecialChar;
  return null;
};

export const validateConfirmPassword = (
  password: string,
  confirmPassword: string
): string | null => {
  if (!confirmPassword) return ERROR_MESSAGES.confirmPassword.required;
  if (password !== confirmPassword)
    return ERROR_MESSAGES.confirmPassword.notMatch;
  return null;
};

export const validateFullName = (fullName: string): string | null => {
  if (!fullName) return ERROR_MESSAGES.fullName.required;
  if (fullName.length < VALIDATION_RULES.fullName.minLength)
    return ERROR_MESSAGES.fullName.tooShort;
  if (fullName.length > VALIDATION_RULES.fullName.maxLength)
    return ERROR_MESSAGES.fullName.tooLong;
  if (!VALIDATION_RULES.fullName.pattern.test(fullName))
    return ERROR_MESSAGES.fullName.invalid;
  return null;
};

export const validatePhone = (phone: string): string | null => {
  if (!phone) return null; // Optional field
  if (!VALIDATION_RULES.phone.pattern.test(phone))
    return ERROR_MESSAGES.phone.invalid;
  const digits = phone.replace(/\D/g, '');
  if (digits.length < VALIDATION_RULES.phone.minLength)
    return ERROR_MESSAGES.phone.tooShort;
  if (digits.length > VALIDATION_RULES.phone.maxLength)
    return ERROR_MESSAGES.phone.tooLong;
  return null;
};

export const validateDepartment = (department?: string): string | null => {
  if (!department) return null; // Optional field
  if (department.length > VALIDATION_RULES.department.maxLength)
    return ERROR_MESSAGES.department.tooLong;
  return null;
};

export const validatePosition = (position?: string): string | null => {
  if (!position) return null; // Optional field
  if (position.length > VALIDATION_RULES.position.maxLength)
    return ERROR_MESSAGES.position.tooLong;
  return null;
};

export const validateTOTPCode = (code: string): string | null => {
  if (!code) return ERROR_MESSAGES.totpCode.required;
  if (!VALIDATION_RULES.totpCode.pattern.test(code))
    return ERROR_MESSAGES.totpCode.invalid;
  return null;
};

export const validateLegalConsent = (accepted: boolean): string | null => {
  if (!accepted) return ERROR_MESSAGES.legalConsent.required;
  return null;
};

export const validateActivationToken = (token: string): string | null => {
  if (!token) return ERROR_MESSAGES.activationToken.required;
  return null;
};

export const validateResetToken = (token: string): string | null => {
  if (!token) return ERROR_MESSAGES.resetToken.required;
  return null;
};

// ============================================================================
// FORM VALIDATION FUNCTIONS
// ============================================================================

export const validateRegisterForm = (
  data: RegisterFormData
): Record<string, string> => {
  const errors: Record<string, string> = {};

  const emailError = validateEmail(data.email);
  if (emailError) errors.email = emailError;

  const fullNameError = validateFullName(data.full_name);
  if (fullNameError) errors.full_name = fullNameError;

  if (data.department) {
    const deptError = validateDepartment(data.department);
    if (deptError) errors.department = deptError;
  }

  const consentError = validateLegalConsent(data.has_accepted_terms);
  if (consentError) errors.has_accepted_terms = consentError;

  return errors;
};

export const validateActivateForm = (
  data: ActivateFormData
): Record<string, string> => {
  const errors: Record<string, string> = {};

  const tokenError = validateActivationToken(data.activation_token);
  if (tokenError) errors.activation_token = tokenError;

  const passwordError = validatePassword(data.password);
  if (passwordError) errors.password = passwordError;

  const confirmError = validateConfirmPassword(data.password, data.confirm_password);
  if (confirmError) errors.confirm_password = confirmError;

  return errors;
};

export const validateLoginForm = (
  data: LoginFormData
): Record<string, string> => {
  const errors: Record<string, string> = {};

  const emailError = validateEmail(data.email);
  if (emailError) errors.email = emailError;

  if (!data.password) errors.password = ERROR_MESSAGES.password.required;

  return errors;
};

export const validateVerify2FAForm = (
  data: Verify2FAFormData
): Record<string, string> => {
  const errors: Record<string, string> = {};

  const codeError = validateTOTPCode(data.totp_code);
  if (codeError) errors.totp_code = codeError;

  return errors;
};

export const validateForgotPasswordForm = (
  data: ForgotPasswordFormData
): Record<string, string> => {
  const errors: Record<string, string> = {};

  const emailError = validateEmail(data.email);
  if (emailError) errors.email = emailError;

  return errors;
};

export const validateResetPasswordForm = (
  data: ResetPasswordFormData
): Record<string, string> => {
  const errors: Record<string, string> = {};

  const tokenError = validateResetToken(data.reset_token);
  if (tokenError) errors.reset_token = tokenError;

  const passwordError = validatePassword(data.password);
  if (passwordError) errors.password = passwordError;

  const confirmError = validateConfirmPassword(data.password, data.confirm_password);
  if (confirmError) errors.confirm_password = confirmError;

  return errors;
};

export const validateUpdateProfileForm = (
  data: UpdateProfileFormData
): Record<string, string> => {
  const errors: Record<string, string> = {};

  const nameError = validateFullName(data.full_name);
  if (nameError) errors.full_name = nameError;

  if (data.phone) {
    const phoneError = validatePhone(data.phone);
    if (phoneError) errors.phone = phoneError;
  }

  if (data.department) {
    const deptError = validateDepartment(data.department);
    if (deptError) errors.department = deptError;
  }

  if (data.position) {
    const posError = validatePosition(data.position);
    if (posError) errors.position = posError;
  }

  return errors;
};

// ============================================================================
// HELPERS
// ============================================================================

export const hasErrors = (errors: Record<string, string>): boolean => {
  return Object.keys(errors).length > 0;
};

export const getFirstError = (errors: Record<string, string>): string | null => {
  const keys = Object.keys(errors);
  return keys.length > 0 ? errors[keys[0]] : null;
};
