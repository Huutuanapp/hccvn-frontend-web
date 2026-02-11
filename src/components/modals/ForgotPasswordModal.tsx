/**
 * Forgot Password Modal Component
 * Request password reset
 */

import React from 'react';
import { AlertCircle, Mail, Send } from 'lucide-react';
import { useForgotPasswordForm } from '../../hooks/useAuthForms';
import { useAuth } from '../../context/AuthContext';
import { AuthModalType } from '../../types/auth';
import Modal from './Modal';

export const ForgotPasswordModal: React.FC = () => {
  const { modal, forgotPassword, openModal } = useAuth();
  const { formData, errors, handleChange, validate } = useForgotPasswordForm();

  const isOpen = modal.type === 'FORGOT_PASSWORD' && modal.isOpen;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    try {
      await forgotPassword(formData.email);
    } catch (error) {
      // Error is handled by context
    }
  };

  return (
    <Modal isOpen={isOpen}>
      <div className="w-full max-w-md">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Quên mật khẩu</h2>
        <p className="text-gray-600 mb-6">
          Nhập email của bạn để nhận liên kết đặt lại mật khẩu
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              <Mail className="inline w-4 h-4 mr-2" />
              Email *
            </label>
            <input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.email ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="ten@hccvn.gov.vn"
              autoComplete="email"
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1 flex items-center">
                <AlertCircle className="w-4 h-4 mr-1" />
                {errors.email}
              </p>
            )}
          </div>

          {/* Info */}
          <div className="bg-blue-50 p-4 rounded-lg">
            <p className="text-sm text-blue-900">
              Chúng tôi sẽ gửi một liên kết đặt lại mật khẩu đến email của bạn. Liên kết này sẽ hết hạn sau 1 giờ.
            </p>
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
                <Send className="w-4 h-4 mr-2" />
                Gửi liên kết đặt lại
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
