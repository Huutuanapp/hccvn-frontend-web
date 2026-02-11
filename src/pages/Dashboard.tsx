import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FolderOpen, Clock, CheckCircle, AlertTriangle } from 'lucide-react';
import { casesAPI } from '../services/api';
import UsageGuide from '../components/UsageGuide';
import './Dashboard.css';

interface Stats {
  total: number;
  submitted: number;
  under_review: number;
  approved: number;
}

interface RecentCase {
  procedure_id: string;
  procedure_type: string;
  enterprise_name: string;
  status: string;
  submitted_at: string;
}

export default function Dashboard() {
  const [stats, setStats] = useState<Stats>({ total: 0, submitted: 0, under_review: 0, approved: 0 });
  const [recentCases, setRecentCases] = useState<RecentCase[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const navigate = useNavigate();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setError('');
      const statsData = await casesAPI.getStats();
      const casesData = await casesAPI.getAll({ limit: 5 });
      
      setStats(statsData);
      setRecentCases((casesData as any)?.items || []);
    } catch (error: any) {
      console.error('Load dashboard failed:', error);
      if (error.code === 'ERR_NETWORK') {
        setError('❌ Không thể kết nối đến máy chủ. Vui lòng kiểm tra: (1) Backend đang chạy tại http://localhost:8000, (2) Không có lỗi CORS.');
      } else if (error.response?.status === 401) {
        setError('❌ Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại.');
      } else if (error.response?.status === 403) {
        setError('❌ Bạn không có quyền truy cập. Vui lòng liên hệ quản trị viên.');
      } else {
        setError(`❌ Lỗi tải dữ liệu: ${error.message || 'Lỗi không xác định'}`);
      }
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const badges: Record<string, { label: string; class: string }> = {
      SUBMITTED: { label: 'Đã nộp', class: 'badge-warning' },
      UNDER_REVIEW: { label: 'Đang thẩm định', class: 'badge badge-warning' },
      APPROVED_PENDING_SIGNATURE: { label: 'Chờ ký', class: 'badge badge-success' },
      COMPLETED: { label: 'Hoàn thành', class: 'badge badge-success' },
      REJECTED: { label: 'Từ chối', class: 'badge badge-error' },
    };
    const badge = badges[status] || { label: status, class: 'badge' };
    return <span className={badge.class}>{badge.label}</span>;
  };

  const getProcedureType = (type: string) => {
    const types: Record<string, string> = {
      REGISTRATION: 'Đăng ký',
      AMENDMENT: 'Thay đổi',
      TERMINATION: 'Giải thể',
      AUTHORIZATION: 'Ủy quyền',
    };
    return types[type] || type;
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner" />
        <p>Đang tải dữ liệu...</p>
      </div>
    );
  }

  return (
    <div className="dashboard">
      {error && (
        <div className="error-banner">
          <AlertTriangle size={20} />
          <div className="error-content">
            <strong>Lỗi kết nối:</strong>
            <p>{error}</p>
          </div>
        </div>
      )}
      <div className="dashboard-header">
        <h1>Tổng quan</h1>
        <p className="subtitle">Thống kê hệ thống xử lý thủ tục</p>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon blue">
            <FolderOpen size={24} />
          </div>
          <div className="stat-content">
            <div className="stat-value">{stats.total}</div>
            <div className="stat-label">Tổng hồ sơ</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon orange">
            <Clock size={24} />
          </div>
          <div className="stat-content">
            <div className="stat-value">{stats.submitted}</div>
            <div className="stat-label">Đã nộp</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon purple">
            <AlertTriangle size={24} />
          </div>
          <div className="stat-content">
            <div className="stat-value">{stats.under_review}</div>
            <div className="stat-label">Đang thẩm định</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon green">
            <CheckCircle size={24} />
          </div>
          <div className="stat-content">
            <div className="stat-value">{stats.approved}</div>
            <div className="stat-label">Đã phê duyệt</div>
          </div>
        </div>
      </div>

      <div className="recent-section card">
        <h2>Hồ sơ gần đây</h2>
        
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>Mã hồ sơ</th>
                <th>Loại</th>
                <th>Tên doanh nghiệp</th>
                <th>Trạng thái</th>
                <th>Ngày nộp</th>
                <th>Hành động</th>
              </tr>
            </thead>
            <tbody>
              {recentCases.length === 0 ? (
                <tr>
                  <td colSpan={6} className="empty-message">
                    Chưa có hồ sơ nào
                  </td>
                </tr>
              ) : (
                recentCases.map((item) => (
                  <tr key={item.procedure_id}>
                    <td className="mono">{item.procedure_id}</td>
                    <td>{getProcedureType(item.procedure_type)}</td>
                    <td>{item.enterprise_name}</td>
                    <td>{getStatusBadge(item.status)}</td>
                    <td>{new Date(item.submitted_at).toLocaleDateString('vi-VN')}</td>
                    <td>
                      <button
                        className="btn-link"
                        onClick={() => navigate(`/cases/${item.procedure_id}`)}
                      >
                        Xem chi tiết
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <UsageGuide
        title="Tổng quan hệ thống"
        description="Màn hình này hiển thị thống kê tổng quan về các hồ sơ đăng ký doanh nghiệp"
        items={[
          { label: 'Tổng hồ sơ', description: 'Tổng số hồ sơ trong hệ thống' },
          { label: 'Đã nộp', description: 'Hồ sơ đã được nộp, chờ xử lý' },
          { label: 'Đang thẩm định', description: 'Hồ sơ đang được thẩm định bởi cán bộ' },
          { label: 'Đã phê duyệt', description: 'Hồ sơ đã được phê duyệt thành công' },
        ]}
        note='Click vào "Chi tiết" ở bảng hồ sơ gần đây để xem đầy đủ thông tin.'
        defaultExpanded={recentCases.length === 0}
      />
    </div>
  );
}
