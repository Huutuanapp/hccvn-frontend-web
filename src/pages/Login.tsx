import { useState, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';
import logoSvg from '../assets/vn-gov-logo.svg';
import './Login.css';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Đăng nhập thất bại');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-header">
          <img src={logoSvg} alt="Logo Chính phủ Việt Nam" className="login-logo" />
          <h1>HCCVN AI</h1>
          <p className="slogan">AI nội bộ hỗ trợ thẩm định & phê duyệt hồ sơ</p>
          <p className="subtitle">Đăng nhập hệ thống xử lý thủ tục</p>
        </div>

        <form className="login-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              className="input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="example@hccvn.gov.vn"
              required
              autoComplete="email"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Mật khẩu</label>
            <input
              id="password"
              type="password"
              className="input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              autoComplete="current-password"
            />
          </div>

          {error && <div className="error-message">{error}</div>}

          <button type="submit" className="btn btn-primary login-btn" disabled={loading}>
            {loading ? 'Đang đăng nhập...' : 'Đăng nhập'}
          </button>
        </form>

        <div className="demo-accounts">
          <h3>Tài khoản demo:</h3>
          <ul>
            <li><strong>Cán bộ:</strong> officer@hccvn.gov.vn</li>
            <li><strong>Thẩm định:</strong> reviewer@hccvn.gov.vn</li>
            <li><strong>Quản trị:</strong> admin@hccvn.gov.vn</li>
          </ul>
          <p className="demo-note">Mật khẩu bất kỳ (demo mode)</p>
        </div>
      </div>
    </div>
  );
}
