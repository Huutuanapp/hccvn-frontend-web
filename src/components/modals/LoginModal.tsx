/**
 * Login Modal Component
 * Standard email and password login
 */

import React from 'react';
import { AlertCircle, Mail, Lock, LogIn } from 'lucide-react';
import { useLoginForm } from '../../hooks/useAuthForms';
import { useAuth } from '../../context/AuthContext';
import { AuthModalType } from '../../types/auth';
import Modal from './Modal';

export const LoginModal: React.FC = () => {
  const { modal, login, openModal } = useAuth();
  const { formData, errors, handleChange, validate } = useLoginForm();

  const isOpen = modal.type === 'LOGIN' && modal.isOpen;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    try {
      await login(formData);
    } catch (error) {
      // Error is handled by context
    }
  };

  return (
    <Modal isOpen={isOpen}>
      <div className="w-full max-w-md">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Đăng nhập</h2>
        <p className="text-gray-600 mb-6">Đăng nhập vào hệ thống HCCVN-AI</p>

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

          {/* Password */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              <Lock className="inline w-4 h-4 mr-2" />
              Mật khẩu *
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
              autoComplete="current-password"
            />
            {errors.password && (
              <p className="text-red-500 text-sm mt-1 flex items-center">
                <AlertCircle className="w-4 h-4 mr-1" />
                {errors.password}
              </p>
            )}
          </div>

          {/* Forgot Password Link */}
          <div className="text-right">
            <button
              type="button"
              onClick={() => openModal(AuthModalType.FORGOT_PASSWORD)}
              className="text-blue-600 hover:underline text-sm font-medium"
            >
              Quên mật khẩu?
            </button>
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
                <LogIn className="w-4 h-4 mr-2" />
                Đăng nhập
              </>
            )}
          </button>

          {/* Register Link */}
          <div className="text-center text-sm text-gray-600">
            Chưa có tài khoản?{' '}
            <button
              type="button"
              onClick={() => openModal(AuthModalType.REGISTER)}
              className="text-blue-600 hover:underline font-medium"
            >
              Đăng ký ngay
            </button>
          </div>
        </form>
      </div>
    </Modal>
  );
};
