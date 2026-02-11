/**
 * Reset Password Modal Component
 * Set new password after clicking reset link
 */

import React from 'react';
import { AlertCircle, Lock, Check } from 'lucide-react';
import { useResetPasswordForm } from '../../hooks/useAuthForms';
import { useAuth } from '../../context/AuthContext';
import { AuthModalType } from '../../types/auth';
import Modal from './Modal';

const PasswordStrengthIndicator: React.FC<{ password: string }> = ({ password }) => {
  const getStrength = () => {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) strength++;
    return strength;
  };

  const strength = getStrength();
  const strengthText = ['Yếu', 'Vừa', 'Trung bình', 'Mạnh', 'Rất mạnh'];
  const strengthColor = [
    'bg-red-500',
    'bg-orange-500',
    'bg-yellow-500',
    'bg-blue-500',
    'bg-green-500',
  ];

  if (!password) return null;

  return (
    <div className="mt-2">
      <div className="flex gap-1 mb-1">
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className={`h-2 flex-1 rounded ${i < strength ? strengthColor[strength - 1] : 'bg-gray-200'}`}
          />
        ))}
      </div>
      <p className="text-xs text-gray-600">
        Độ mạnh: <span className="font-medium">{strengthText[strength - 1] || 'Không đủ'}</span>
      </p>
    </div>
  );
};

export const ResetPasswordModal: React.FC = () => {
  const { modal, resetPassword, openModal } = useAuth();
  const token = modal.data?.reset_token || '';
  const { formData, errors, handleChange, validate } = useResetPasswordForm(token);

  const isOpen = modal.type === 'RESET_PASSWORD' && modal.isOpen;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    try {
      await resetPassword(formData);
    } catch (error) {
      // Error is handled by context
    }
  };

  return (
    <Modal isOpen={isOpen}>
      <div className="w-full max-w-md">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Đặt lại mật khẩu</h2>
        <p className="text-gray-600 mb-6">Nhập mật khẩu mới để đặt lại tài khoản của bạn</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Password */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              <Lock className="inline w-4 h-4 mr-2" />
              Mật khẩu mới *
            </label>
            <input
              id="password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.password ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="••••••••"
            />
            <PasswordStrengthIndicator password={formData.password} />
            {errors.password && (
              <p className="text-red-500 text-sm mt-1 flex items-center">
                <AlertCircle className="w-4 h-4 mr-1" />
                {errors.password}
              </p>
            )}
          </div>

          {/* Confirm Password */}
          <div>
            <label htmlFor="confirm_password" className="block text-sm font-medium text-gray-700 mb-1">
              <Lock className="inline w-4 h-4 mr-2" />
              Xác nhận mật khẩu *
            </label>
            <input
              id="confirm_password"
              name="confirm_password"
              type="password"
              value={formData.confirm_password}
              onChange={handleChange}
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.confirm_password ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="••••••••"
            />
            {errors.confirm_password && (
              <p className="text-red-500 text-sm mt-1 flex items-center">
                <AlertCircle className="w-4 h-4 mr-1" />
                {errors.confirm_password}
              </p>
            )}
          </div>

          {/* Password Requirements */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-xs font-medium text-gray-700 mb-2">Yêu cầu mật khẩu:</p>
            <ul className="text-xs text-gray-600 space-y-1">
              <li className={formData.password.length >= 8 ? 'text-green-600 font-medium' : ''}>
                ✓ Ít nhất 8 ký tự
              </li>
              <li className={/[A-Z]/.test(formData.password) ? 'text-green-600 font-medium' : ''}>
                ✓ Ít nhất 1 chữ in hoa
              </li>
              <li className={/[a-z]/.test(formData.password) ? 'text-green-600 font-medium' : ''}>
                ✓ Ít nhất 1 chữ thường
              </li>
              <li className={/[0-9]/.test(formData.password) ? 'text-green-600 font-medium' : ''}>
                ✓ Ít nhất 1 số
              </li>
              <li
                className={
                  /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(formData.password)
                    ? 'text-green-600 font-medium'
                    : ''
                }
              >
                ✓ Ít nhất 1 ký tự đặc biệt (!@#$%^&*)
              </li>
            </ul>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={modal.isLoading}
            className="w-full bg-blue-600 text-white py-2 rounded-lg font-medium hover:bg-blue-700 disabled:bg-gray-400 transition-colors flex items-center justify-center"
          >
            {modal.isLoading ? (
              <>
                <span className="inline-block animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></span>
                Đang xử lý...
              </>
            ) : (
              <>
                <Check className="w-4 h-4 mr-2" />
                Đặt lại mật khẩu
              </>
            )}
          </button>

          {/* Back to Login */}
          <div className="text-center text-sm text-gray-600">
            <button
              type="button"
              onClick={() => openModal(AuthModalType.LOGIN)}
              className="text-blue-600 hover:underline font-medium"
            >
              Quay lại đăng nhập
            </button>
          </div>
        </form>
      </div>
    </Modal>
  );
};
