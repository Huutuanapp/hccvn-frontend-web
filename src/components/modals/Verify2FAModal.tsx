/**
 * 2FA Verification Modal Component
 * TOTP verification for ADMIN users
 */

import React, { useEffect } from 'react';
import { AlertCircle, Lock, Check, AlertTriangle } from 'lucide-react';
import { useVerify2FAForm } from '../../hooks/useAuthForms';
import { useAuth } from '../../context/AuthContext';
import Modal from './Modal';

export const Verify2FAModal: React.FC = () => {
  const { modal, verify2FA } = useAuth();
  const { formData, errors, handleChange, validate, setFormData } = useVerify2FAForm();

  const isOpen = modal.type === 'VERIFY_2FA' && modal.isOpen;

  // Auto-focus on the input
  const inputRef = React.useRef<HTMLInputElement>(null);
  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus();
    }
  }, [isOpen]);

  // Auto-submit when code reaches 6 digits
  useEffect(() => {
    if (formData.totp_code.length === 6 && !errors.totp_code) {
      handleSubmit();
    }
  }, [formData.totp_code]);

  const handleSubmit = async () => {
    if (!validate()) {
      return;
    }

    try {
      const token = modal.data?.token || '';
      await verify2FA({
        token,
        totp_code: formData.totp_code,
      });
    } catch (error) {
      // Error is handled by context
      setFormData({ totp_code: '' });
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <Modal isOpen={isOpen}>
      <div className="w-full max-w-md">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Xác minh hai lớp (2FA)</h2>
        <p className="text-gray-600 mb-6">
          Nhập mã OTP từ ứng dụng xác thực của bạn
        </p>

        <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg mb-6">
          <div className="flex gap-3">
            <AlertTriangle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-blue-900">
              <p className="font-medium mb-1">Cần xác minh hai lớp</p>
              <p>Vui lòng sử dụng ứng dụng xác thực (Google Authenticator, Microsoft Authenticator, Authy, v.v.) để lấy mã 6 chữ số.</p>
            </div>
          </div>
        </div>

        <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }} className="space-y-4">
          {/* TOTP Code Input */}
          <div>
            <label htmlFor="totp_code" className="block text-sm font-medium text-gray-700 mb-1">
              <Lock className="inline w-4 h-4 mr-2" />
              Mã OTP (6 chữ số) *
            </label>
            <div className="flex gap-2">
              <input
                ref={inputRef}
                id="totp_code"
                name="totp_code"
                type="text"
                value={formData.totp_code}
                onChange={handleChange}
                onKeyDown={handleKeyDown}
                maxLength={6}
                className={`flex-1 text-4xl tracking-widest text-center font-mono border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 py-3 ${
                  errors.totp_code ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="000000"
                inputMode="numeric"
              />
            </div>
            {errors.totp_code && (
              <p className="text-red-500 text-sm mt-1 flex items-center">
                <AlertCircle className="w-4 h-4 mr-1" />
                {errors.totp_code}
              </p>
            )}
            <p className="text-gray-600 text-xs mt-2">
              Đã nhập: {formData.totp_code.length}/6
            </p>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={modal.isLoading || formData.totp_code.length !== 6}
            className="w-full bg-blue-600 text-white py-2 rounded-lg font-medium hover:bg-blue-700 disabled:bg-gray-400 transition-colors flex items-center justify-center"
          >
            {modal.isLoading ? (
              <>
                <span className="inline-block animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></span>
                Đang xác minh...
              </>
            ) : (
              <>
                <Check className="w-4 h-4 mr-2" />
                Xác minh
              </>
            )}
          </button>

          {/* Backup Code Info */}
          <div className="text-center pt-4 border-t border-gray-200">
            <p className="text-xs text-gray-600 mb-2">
              Không có quyền truy cập vào ứng dụng xác thực?
            </p>
            <button
              type="button"
              className="text-blue-600 hover:underline text-sm font-medium"
            >
              Sử dụng mã dự phòng
            </button>
          </div>
        </form>
      </div>
    </Modal>
  );
};
