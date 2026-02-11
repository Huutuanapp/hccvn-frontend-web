/**
 * Custom Authentication Hooks
 * Reusable hooks for form handling and auth operations
 */

import { useState, useCallback } from 'react';
import {
  RegisterFormData,
  ActivateFormData,
  LoginFormData,
  Verify2FAFormData,
  ForgotPasswordFormData,
  ResetPasswordFormData,
  UpdateProfileFormData,
} from '../types/auth';
import {
  validateRegisterForm,
  validateActivateForm,
  validateLoginForm,
  validateVerify2FAForm,
  validateForgotPasswordForm,
  validateResetPasswordForm,
  validateUpdateProfileForm,
  hasErrors,
} from '../utils/validation';

// ============================================================================
// REGISTER FORM HOOK
// ============================================================================

export const useRegisterForm = () => {
  const [formData, setFormData] = useState<RegisterFormData>({
    email: '',
    full_name: '',
    department: '',
    has_accepted_terms: false,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value, type, checked } = e.target;
      setFormData((prev) => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value,
      }));

      // Clear error for this field when user starts typing
      if (errors[name]) {
        setErrors((prev) => {
          const updated = { ...prev };
          delete updated[name];
          return updated;
        });
      }
    },
    [errors]
  );

  const validate = useCallback(() => {
    const newErrors = validateRegisterForm(formData);
    setErrors(newErrors);
    return !hasErrors(newErrors);
  }, [formData]);

  const reset = useCallback(() => {
    setFormData({
      email: '',
      full_name: '',
      department: '',
      has_accepted_terms: false,
    });
    setErrors({});
  }, []);

  return { formData, errors, handleChange, validate, reset, setFormData };
};

// ============================================================================
// ACTIVATE ACCOUNT FORM HOOK
// ============================================================================

export const useActivateForm = (token: string = '') => {
  const [formData, setFormData] = useState<ActivateFormData>({
    activation_token: token,
    password: '',
    confirm_password: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));

      if (errors[name]) {
        setErrors((prev) => {
          const updated = { ...prev };
          delete updated[name];
          return updated;
        });
      }
    },
    [errors]
  );

  const validate = useCallback(() => {
    const newErrors = validateActivateForm(formData);
    setErrors(newErrors);
    return !hasErrors(newErrors);
  }, [formData]);

  const reset = useCallback(() => {
    setFormData({
      activation_token: token,
      password: '',
      confirm_password: '',
    });
    setErrors({});
  }, [token]);

  return { formData, errors, handleChange, validate, reset, setFormData };
};

// ============================================================================
// LOGIN FORM HOOK
// ============================================================================

export const useLoginForm = () => {
  const [formData, setFormData] = useState<LoginFormData>({
    email: '',
    password: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));

      if (errors[name]) {
        setErrors((prev) => {
          const updated = { ...prev };
          delete updated[name];
          return updated;
        });
      }
    },
    [errors]
  );

  const validate = useCallback(() => {
    const newErrors = validateLoginForm(formData);
    setErrors(newErrors);
    return !hasErrors(newErrors);
  }, [formData]);

  const reset = useCallback(() => {
    setFormData({ email: '', password: '' });
    setErrors({});
  }, []);

  return { formData, errors, handleChange, validate, reset, setFormData };
};

// ============================================================================
// VERIFY 2FA FORM HOOK
// ============================================================================

export const useVerify2FAForm = () => {
  const [formData, setFormData] = useState<Verify2FAFormData>({
    totp_code: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;
      // Only allow digits
      const numericValue = value.replace(/\D/g, '').slice(0, 6);
      setFormData((prev) => ({
        ...prev,
        [name]: numericValue,
      }));

      if (errors[name]) {
        setErrors((prev) => {
          const updated = { ...prev };
          delete updated[name];
          return updated;
        });
      }
    },
    [errors]
  );

  const validate = useCallback(() => {
    const newErrors = validateVerify2FAForm(formData);
    setErrors(newErrors);
    return !hasErrors(newErrors);
  }, [formData]);

  const reset = useCallback(() => {
    setFormData({ totp_code: '' });
    setErrors({});
  }, []);

  return { formData, errors, handleChange, validate, reset, setFormData };
};

// ============================================================================
// FORGOT PASSWORD FORM HOOK
// ============================================================================

export const useForgotPasswordForm = () => {
  const [formData, setFormData] = useState<ForgotPasswordFormData>({
    email: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));

      if (errors[name]) {
        setErrors((prev) => {
          const updated = { ...prev };
          delete updated[name];
          return updated;
        });
      }
    },
    [errors]
  );

  const validate = useCallback(() => {
    const newErrors = validateForgotPasswordForm(formData);
    setErrors(newErrors);
    return !hasErrors(newErrors);
  }, [formData]);

  const reset = useCallback(() => {
    setFormData({ email: '' });
    setErrors({});
  }, []);

  return { formData, errors, handleChange, validate, reset, setFormData };
};

// ============================================================================
// RESET PASSWORD FORM HOOK
// ============================================================================

export const useResetPasswordForm = (token: string = '') => {
  const [formData, setFormData] = useState<ResetPasswordFormData>({
    reset_token: token,
    password: '',
    confirm_password: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));

      if (errors[name]) {
        setErrors((prev) => {
          const updated = { ...prev };
          delete updated[name];
          return updated;
        });
      }
    },
    [errors]
  );

  const validate = useCallback(() => {
    const newErrors = validateResetPasswordForm(formData);
    setErrors(newErrors);
    return !hasErrors(newErrors);
  }, [formData]);

  const reset = useCallback(() => {
    setFormData({
      reset_token: token,
      password: '',
      confirm_password: '',
    });
    setErrors({});
  }, [token]);

  return { formData, errors, handleChange, validate, reset, setFormData };
};

// ============================================================================
// UPDATE PROFILE FORM HOOK
// ============================================================================

export const useUpdateProfileForm = (initialData?: Partial<UpdateProfileFormData>) => {
  const [formData, setFormData] = useState<UpdateProfileFormData>({
    full_name: initialData?.full_name || '',
    department: initialData?.department || '',
    phone: initialData?.phone || '',
    position: initialData?.position || '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));

      if (errors[name]) {
        setErrors((prev) => {
          const updated = { ...prev };
          delete updated[name];
          return updated;
        });
      }
    },
    [errors]
  );

  const validate = useCallback(() => {
    const newErrors = validateUpdateProfileForm(formData);
    setErrors(newErrors);
    return !hasErrors(newErrors);
  }, [formData]);

  const reset = useCallback(() => {
    setFormData({
      full_name: initialData?.full_name || '',
      department: initialData?.department || '',
      phone: initialData?.phone || '',
      position: initialData?.position || '',
    });
    setErrors({});
  }, [initialData]);

  return { formData, errors, handleChange, validate, reset, setFormData };
};
