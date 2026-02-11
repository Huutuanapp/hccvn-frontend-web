/**
 * Register Modal Component
 * Email-based registration with legal consent
 */

import React from 'react';
import { AlertCircle, Mail, User, FileText, Check } from 'lucide-react';
import { useRegisterForm } from '../../hooks/useAuthForms';
import { useAuth } from '../../context/AuthContext';
import Modal from './Modal';

export const RegisterModal: React.FC = () => {
  const { modal, register } = useAuth();
  const { formData, errors, handleChange, validate } = useRegisterForm();

  const isOpen = modal.type === 'REGISTER' && modal.isOpen;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    try {
      await register({
        email: formData.email,
        full_name: formData.full_name,
        department: formData.department || undefined,
        has_accepted_terms: formData.has_accepted_terms,
      });
    } catch (error) {
      // Error is handled by context
    }
  };

  return (
    <Modal isOpen={isOpen}>
      <div className="w-full max-w-md">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Đăng ký tài khoản</h2>
        <p className="text-gray-600 mb-6">Vui lòng nhập thông tin để tạo tài khoản mới</p>

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
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1 flex items-center">
                <AlertCircle className="w-4 h-4 mr-1" />
                {errors.email}
              </p>
            )}
          </div>

          {/* Full Name */}
          <div>
            <label htmlFor="full_name" className="block text-sm font-medium text-gray-700 mb-1">
              <User className="inline w-4 h-4 mr-2" />
              Họ tên *
            </label>
            <input
              id="full_name"
              name="full_name"
              type="text"
              value={formData.full_name}
              onChange={handleChange}
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.full_name ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Nguyễn Văn A"
            />
            {errors.full_name && (
              <p className="text-red-500 text-sm mt-1 flex items-center">
                <AlertCircle className="w-4 h-4 mr-1" />
                {errors.full_name}
              </p>
            )}
          </div>

          {/* Department */}
          <div>
            <label htmlFor="department" className="block text-sm font-medium text-gray-700 mb-1">
              Phòng ban
            </label>
            <input
              id="department"
              name="department"
              type="text"
              value={formData.department || ''}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Phòng Đăng ký kinh doanh"
            />
          </div>

          {/* Legal Consent */}
          <div className="bg-blue-50 p-4 rounded-lg">
            <label className="flex items-start cursor-pointer">
              <input
                type="checkbox"
                name="has_accepted_terms"
                checked={formData.has_accepted_terms}
                onChange={handleChange}
                className="mt-1 w-4 h-4 border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
              />
              <span className="ml-3 text-sm text-gray-700">
                <span className="flex items-center font-medium text-blue-900 mb-1">
                  <FileText className="w-4 h-4 mr-1" />
                  Tôi chấp nhận
                </span>
                <a
                  href="/terms"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  Điều khoản sử dụng
                </a>
                {' và '}
                <a
                  href="/privacy"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  Chính sách bảo mật
                </a>
              </span>
            </label>
            {errors.has_accepted_terms && (
              <p className="text-red-500 text-sm mt-2 flex items-center">
                <AlertCircle className="w-4 h-4 mr-1" />
                {errors.has_accepted_terms}
              </p>
            )}
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
                Đăng ký
              </>
            )}
          </button>

          {/* Links */}
          <div className="text-center text-sm text-gray-600">
            Đã có tài khoản?{' '}
            <button type="button" className="text-blue-600 hover:underline font-medium">
              Đăng nhập
            </button>
          </div>
        </form>
      </div>
    </Modal>
  );
};
