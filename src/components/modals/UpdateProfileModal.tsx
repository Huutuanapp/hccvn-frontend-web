/**
 * Update Profile Modal Component
 * Shown after first login to complete user profile
 */

import React from 'react';
import { AlertCircle, User, Phone, Briefcase, Building, Check } from 'lucide-react';
import { useUpdateProfileForm } from '../../hooks/useAuthForms';
import { useAuth } from '../../context/AuthContext';
import Modal from './Modal';

export const UpdateProfileModal: React.FC = () => {
  const { modal, updateProfile, user } = useAuth();
  const { formData, errors, handleChange, validate } = useUpdateProfileForm({
    full_name: user?.full_name,
    department: user?.department,
    phone: user?.phone,
    position: user?.position,
  });

  const isOpen = modal.type === 'UPDATE_PROFILE' && modal.isOpen;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    try {
      await updateProfile(formData);
    } catch (error) {
      // Error is handled by context
    }
  };

  return (
    <Modal isOpen={isOpen}>
      <div className="w-full max-w-md">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Cập nhật hồ sơ</h2>
        <p className="text-gray-600 mb-6">
          Vui lòng hoàn thành thông tin cá nhân của bạn
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
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
              <Building className="inline w-4 h-4 mr-2" />
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

          {/* Position */}
          <div>
            <label htmlFor="position" className="block text-sm font-medium text-gray-700 mb-1">
              <Briefcase className="inline w-4 h-4 mr-2" />
              Chức vụ
            </label>
            <input
              id="position"
              name="position"
              type="text"
              value={formData.position || ''}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Trưởng phòng"
            />
          </div>

          {/* Phone */}
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
              <Phone className="inline w-4 h-4 mr-2" />
              Số điện thoại
            </label>
            <input
              id="phone"
              name="phone"
              type="tel"
              value={formData.phone || ''}
              onChange={handleChange}
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.phone ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="0123456789"
            />
            {errors.phone && (
              <p className="text-red-500 text-sm mt-1 flex items-center">
                <AlertCircle className="w-4 h-4 mr-1" />
                {errors.phone}
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
                Đang lưu...
              </>
            ) : (
              <>
                <Check className="w-4 h-4 mr-2" />
                Lưu hồ sơ
              </>
            )}
          </button>

          <p className="text-xs text-gray-500 text-center">
            * Các trường được đánh dấu là bắt buộc. Bạn có thể cập nhật các trường khác sau.
          </p>
        </form>
      </div>
    </Modal>
  );
};
