/**
 * Example Component: Using Auth Modals
 * Shows how to integrate authentication into your pages
 */

import React from 'react';
import { useAuth } from '../context/AuthContext';
import { AuthModalType } from '../types/auth';
import { LogOut, Settings, User } from 'lucide-react';

/**
 * Example: Login Page
 * Demonstrates opening the login modal
 */
export const LoginPage: React.FC = () => {
  const { openModal, isAuthenticated } = useAuth();

  if (isAuthenticated) {
    return <Dashboard />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center p-4">
      <div className="text-center text-white">
        <h1 className="text-4xl font-bold mb-4">HCCVN-AI</h1>
        <p className="text-xl mb-8">Hệ thống xử lý thủ tục chuyên nghiệp</p>

        <div className="space-y-4">
          <button
            onClick={() => openModal(AuthModalType.LOGIN)}
            className="w-full max-w-md bg-white text-blue-600 py-3 rounded-lg font-semibold hover:bg-gray-100 transition"
          >
            Đăng nhập
          </button>

          <button
            onClick={() => openModal(AuthModalType.REGISTER)}
            className="w-full max-w-md bg-blue-500 text-white py-3 rounded-lg font-semibold hover:bg-blue-400 transition"
          >
            Đăng ký tài khoản
          </button>
        </div>
      </div>
    </div>
  );
};

/**
 * Example: Dashboard with User Menu
 * Demonstrates accessing auth state and opening modals
 */
export const Dashboard: React.FC = () => {
  const { user, logout, openModal } = useAuth();
  const [showMenu, setShowMenu] = React.useState(false);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-blue-600">HCCVN-AI</h1>

          {/* User Menu */}
          <div className="relative">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
            >
              <User className="w-4 h-4" />
              {user?.full_name || user?.email}
            </button>

            {showMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg z-10">
                <div className="p-4 border-b">
                  <p className="font-semibold text-sm">{user?.full_name}</p>
                  <p className="text-xs text-gray-600">{user?.email}</p>
                  <p className="text-xs text-gray-500 mt-1">Chức vụ: {user?.role}</p>
                </div>

                <button
                  onClick={() => {
                    setShowMenu(false);
                    openModal(AuthModalType.UPDATE_PROFILE);
                  }}
                  className="w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center gap-2 text-sm"
                >
                  <Settings className="w-4 h-4" />
                  Cập nhật hồ sơ
                </button>

                <button
                  onClick={() => {
                    setShowMenu(false);
                    logout();
                  }}
                  className="w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center gap-2 text-sm text-red-600"
                >
                  <LogOut className="w-4 h-4" />
                  Đăng xuất
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* User Info Card */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold mb-4">Thông tin tài khoản</h2>
            <div className="space-y-2 text-sm">
              <p>
                <span className="font-medium">Tên:</span> {user?.full_name}
              </p>
              <p>
                <span className="font-medium">Email:</span> {user?.email}
              </p>
              <p>
                <span className="font-medium">Phòng ban:</span> {user?.department || 'Chưa cập nhật'}
              </p>
              <p>
                <span className="font-medium">Chức vụ:</span> {user?.position || 'Chưa cập nhật'}
              </p>
              <p>
                <span className="font-medium">Vai trò:</span>{' '}
                <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">
                  {user?.role}
                </span>
              </p>
              {user?.has_2fa_enabled && (
                <p>
                  <span className="font-medium">2FA:</span>{' '}
                  <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs">
                    Đã bật
                  </span>
                </p>
              )}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold mb-4">Tác vụ nhanh</h2>
            <div className="space-y-2">
              <button
                onClick={() => openModal(AuthModalType.UPDATE_PROFILE)}
                className="w-full text-left px-4 py-2 bg-blue-50 text-blue-600 rounded hover:bg-blue-100"
              >
                Cập nhật hồ sơ
              </button>
              {user?.role === 'ADMIN' && (
                <button
                  onClick={() => alert('2FA management modal would open here')}
                  className="w-full text-left px-4 py-2 bg-purple-50 text-purple-600 rounded hover:bg-purple-100"
                >
                  Quản lý 2FA
                </button>
              )}
              <button
                onClick={() => openModal(AuthModalType.FORGOT_PASSWORD)}
                className="w-full text-left px-4 py-2 bg-orange-50 text-orange-600 rounded hover:bg-orange-100"
              >
                Đổi mật khẩu
              </button>
            </div>
          </div>

          {/* Security Info */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold mb-4">Bảo mật</h2>
            <div className="space-y-3 text-sm">
              <div>
                <p className="font-medium">Trạng thái tài khoản</p>
                <p className={user?.is_active ? 'text-green-600' : 'text-red-600'}>
                  {user?.is_active ? '✓ Hoạt động' : '✗ Bị khóa'}
                </p>
              </div>
              <div>
                <p className="font-medium">Điều khoản pháp lý</p>
                <p className={user?.has_accepted_terms ? 'text-green-600' : 'text-red-600'}>
                  {user?.has_accepted_terms ? '✓ Đã chấp nhận' : '✗ Chưa chấp nhận'}
                </p>
              </div>
              <div>
                <p className="font-medium">Lần đăng nhập cuối</p>
                <p className="text-gray-600">
                  {user?.last_login
                    ? new Date(user.last_login).toLocaleString('vi-VN')
                    : 'Chưa có'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

/**
 * Example: Protecting Routes with Auth Check
 */
export const ProtectedComponent: React.FC = () => {
  const { isAuthenticated, user, openModal } = useAuth();

  if (!isAuthenticated) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-semibold mb-4">Vui lòng đăng nhập</h2>
        <button
          onClick={() => openModal(AuthModalType.LOGIN)}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
        >
          Đăng nhập ngay
        </button>
      </div>
    );
  }

  return (
    <div className="bg-green-50 p-6 rounded-lg">
      <h2 className="text-lg font-semibold text-green-900 mb-2">
        Chào mừng, {user?.full_name}!
      </h2>
      <p className="text-green-700">Bạn đã được xác thực thành công.</p>
    </div>
  );
};

export default LoginPage;
