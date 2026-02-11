import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Filter, AlertTriangle } from 'lucide-react';
import { casesAPI } from '../services/api';
import UsageGuide from '../components/UsageGuide';
import './CaseList.css';

interface CaseItem {
  procedure_id: string;
  procedure_type: string;
  enterprise_name: string;
  tin: string;
  status: string;
  result_status: string;
  submitted_at: string;
}

export default function CaseList() {
  const [cases, setCases] = useState<CaseItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    loadCases();
  }, []);

  const loadCases = async () => {
    try {
      const data = await casesAPI.getAll();
      setCases((data as any)?.items || []);
    } catch (error) {
      console.error('Load cases failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredCases = cases.filter((c) => {
    const matchSearch =
      c.procedure_id.toLowerCase().includes(search.toLowerCase()) ||
      c.enterprise_name.toLowerCase().includes(search.toLowerCase()) ||
      c.tin.includes(search);
    const matchStatus = !statusFilter || c.status === statusFilter;
    const matchType = !typeFilter || c.procedure_type === typeFilter;
    return matchSearch && matchStatus && matchType;
  });

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
        <p>Đang tải danh sách hồ sơ...</p>
      </div>
    );
  }

  return (
    <div className="case-list-page">
      <div className="page-header">
        <h1>Quản lý hồ sơ</h1>
        <p className="subtitle">Danh sách hồ sơ thủ tục</p>
      </div>

      <div className="filters-bar card">
        <div className="search-box">
          <Search size={20} />
          <input
            type="text"
            className="input"
            placeholder="Tìm kiếm theo mã, tên doanh nghiệp, MST..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="filter-group">
          <Filter size={18} />
          <select
            className="input"
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            aria-label="Filter by case type"
            title="Filter by case type"
          >
            <option value="">Tất cả loại</option>
            <option value="REGISTRATION">Đăng ký</option>
            <option value="AMENDMENT">Thay đổi</option>
            <option value="TERMINATION">Giải thể</option>
            <option value="AUTHORIZATION">Ủy quyền</option>
          </select>

          <select
            className="input"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            aria-label="Filter by status"
            title="Filter by status"
          >
            <option value="">Tất cả trạng thái</option>
            <option value="SUBMITTED">Đã nộp</option>
            <option value="UNDER_REVIEW">Đang thẩm định</option>
            <option value="APPROVED_PENDING_SIGNATURE">Chờ ký</option>
            <option value="COMPLETED">Hoàn thành</option>
            <option value="REJECTED">Từ chối</option>
          </select>

          {(search || statusFilter || typeFilter) && (
            <button
              className="btn btn-secondary"
              onClick={() => {
                setSearch('');
                setStatusFilter('');
                setTypeFilter('');
              }}
            >
              Xóa bộ lọc
            </button>
          )}
        </div>
      </div>

      <div className="card">
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>Mã hồ sơ</th>
                <th>Loại</th>
                <th>Tên doanh nghiệp</th>
                <th>MST</th>
                <th>Trạng thái</th>
                <th>Ngày nộp</th>
                <th>Hành động</th>
              </tr>
            </thead>
            <tbody>
              {filteredCases.length === 0 ? (
                <tr>
                  <td colSpan={7} className="empty-message">
                    {search || statusFilter || typeFilter
                      ? 'Không tìm thấy hồ sơ phù hợp'
                      : 'Chưa có hồ sơ nào'}
                  </td>
                </tr>
              ) : (
                filteredCases.map((item) => (
                  <tr key={item.procedure_id}>
                    <td className="mono">{item.procedure_id}</td>
                    <td>{getProcedureType(item.procedure_type)}</td>
                    <td>{item.enterprise_name}</td>
                    <td className="mono">{item.tin}</td>
                    <td>{getStatusBadge(item.status)}</td>
                    <td>{new Date(item.submitted_at).toLocaleDateString('vi-VN')}</td>
                    <td>
                      <button
                        className="btn-link"
                        onClick={() => navigate(`/cases/${item.procedure_id}`)}
                      >
                        Chi tiết
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="table-footer">
          <p className="result-count">
            Hiển thị <strong>{filteredCases.length}</strong> / {cases.length} hồ sơ
          </p>
        </div>
      </div>

      <UsageGuide
        title="Quản lý hồ sơ"
        description="Tìm kiếm và lọc hồ sơ theo các tiêu chí sau"
        items={[
          { label: 'Tìm kiếm', description: 'Nhập mã hồ sơ, tên doanh nghiệp hoặc MST để tìm nhanh' },
          { label: 'Lọc theo loại', description: 'Đăng ký mới, Thay đổi, Giải thể, Ủy quyền' },
          { label: 'Lọc trạng thái', description: 'Đã nộp, Đang thẩm định, Chờ ký, Hoàn thành, Từ chối' },
        ]}
        note="Click vào bất kỳ hồ sơ nào để xem chi tiết và thực hiện thẩm định."
        defaultExpanded={filteredCases.length === 0}
      />
    </div>
  );
}
