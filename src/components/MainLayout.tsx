import { ReactNode } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Home, FolderOpen, FileSignature, GraduationCap, LogOut } from 'lucide-react';
import { useAuthStore } from '../stores/authStore';
import logoSvg from '../assets/vn-gov-logo.svg';
import './MainLayout.css';

interface MainLayoutProps {
  children: ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps) {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { path: '/dashboard', icon: Home, label: 'Tổng quan' },
    { path: '/cases', icon: FolderOpen, label: 'Hồ sơ' },
    { path: '/signing', icon: FileSignature, label: 'Ký số', roles: ['OFFICER', 'REVIEWER'] },
    { path: '/ai-teaching', icon: GraduationCap, label: 'AI Teaching', roles: ['SYSTEM', 'AI'] },
  ];

  const canAccess = (roles?: string[]) => {
    if (!roles) return true;
    return user && roles.includes(user.role);
  };

  return (
    <div className="layout">
      <aside className="sidebar">
        <div className="sidebar-header">
          <img src={logoSvg} alt="Logo" className="sidebar-logo" />
          <div>
            <h2>HCCVN AI</h2>
            <p className="sidebar-slogan">Hệ thống AI nội bộ</p>
          </div>
        </div>

        <nav className="sidebar-nav">
          {navItems.map((item) => {
            const Icon = item.icon;
            const disabled = !canAccess(item.roles);
            
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `nav-item ${isActive ? 'active' : ''} ${disabled ? 'disabled' : ''}`
                }
                onClick={(e) => disabled && e.preventDefault()}
              >
                <Icon size={20} />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </nav>

        <div className="sidebar-footer">
          <div className="user-info">
            <div className="user-avatar">{user?.name.charAt(0)}</div>
            <div className="user-details">
              <div className="user-name">{user?.name}</div>
              <div className="user-role">{user?.department}</div>
            </div>
          </div>
          <button className="btn-logout" onClick={handleLogout} title="Đăng xuất">
            <LogOut size={18} />
          </button>
        </div>
      </aside>

      <main className="main-content">
        {children}
      </main>
    </div>
  );
}
