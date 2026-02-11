export interface User {
  id: string;
  name: string;
  email: string;
  role: 'USER' | 'OFFICER' | 'REVIEWER' | 'SYSTEM' | 'AI';
  department?: string;
}

export const MOCK_USERS: User[] = [
  { id: '1', name: 'Nguyễn Văn A', email: 'officer@hccvn.gov.vn', role: 'OFFICER', department: 'Phòng Đăng ký kinh doanh' },
  { id: '2', name: 'Trần Thị B', email: 'reviewer@hccvn.gov.vn', role: 'REVIEWER', department: 'Phòng Thẩm định' },
  { id: '3', name: 'Lê Văn C', email: 'admin@hccvn.gov.vn', role: 'SYSTEM', department: 'Quản trị hệ thống' },
];

export const authService = {
  login: async (email: string, password: string): Promise<User> => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    
    const user = MOCK_USERS.find((u) => u.email === email);
    if (!user) {
      throw new Error('Email hoặc mật khẩu không đúng');
    }

    const token = `mock_token_${user.id}_${Date.now()}`;
    localStorage.setItem('hccvn_token', token);
    localStorage.setItem('hccvn_user', JSON.stringify(user));
    localStorage.setItem('hccvn_role', user.role);

    return user;
  },

  logout: () => {
    localStorage.removeItem('hccvn_token');
    localStorage.removeItem('hccvn_user');
    localStorage.removeItem('hccvn_role');
  },

  getCurrentUser: (): User | null => {
    const userStr = localStorage.getItem('hccvn_user');
    if (!userStr) return null;
    try {
      return JSON.parse(userStr);
    } catch {
      return null;
    }
  },

  isAuthenticated: (): boolean => {
    return !!localStorage.getItem('hccvn_token');
  },
};
