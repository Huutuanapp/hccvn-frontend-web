import { useEffect, useState } from 'react';
import { FileSignature, CheckCircle, AlertCircle } from 'lucide-react';
import { signingAPI } from '../services/api';
import './Signing.css';

interface SigningCase {
  procedure_id: string;
  enterprise_name: string;
  signing_status: string;
  submitted_at: string;
}

export default function Signing() {
  const [cases, setCases] = useState<SigningCase[]>([]);
  const [loading, setLoading] = useState(true);
  const [signingId, setSigningId] = useState<string | null>(null);

  useEffect(() => {
    loadCases();
  }, []);

  const loadCases = async () => {
    try {
      const data = await signingAPI.getAwaitingSignature();
      setCases((data as any)?.items || []);
    } catch (error) {
      console.error('Load signing cases failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSign = async (id: string) => {
    if (!confirm('Xác nhận ký số cho hồ sơ này?')) return;

    setSigningId(id);
    try {
      await signingAPI.sign(id);
      alert('Ký số thành công');
      loadCases();
    } catch (error) {
      alert('Ký số thất bại');
    } finally {
      setSigningId(null);
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner" />
        <p>Đang tải danh sách...</p>
      </div>
    );
  }

  return (
    <div className="signing-page">
      <div className="page-header">
        <FileSignature size={32} />
        <div>
          <h1>Ký số</h1>
          <p className="subtitle">Danh sách hồ sơ chờ ký</p>
        </div>
      </div>

      <div className="stats-bar">
        <div className="stat-box">
          <AlertCircle size={20} />
          <div>
            <div className="stat-value">{cases.length}</div>
            <div className="stat-label">Chờ ký số</div>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>Mã hồ sơ</th>
                <th>Tên doanh nghiệp</th>
                <th>Trạng thái ký</th>
                <th>Ngày nộp</th>
                <th>Hành động</th>
              </tr>
            </thead>
            <tbody>
              {cases.length === 0 ? (
                <tr>
                  <td colSpan={5} className="empty-message">
                    <CheckCircle size={32} />
                    <p>Không có hồ sơ nào chờ ký</p>
                  </td>
                </tr>
              ) : (
                cases.map((item) => (
                  <tr key={item.procedure_id}>
                    <td className="mono">{item.procedure_id}</td>
                    <td>{item.enterprise_name}</td>
                    <td>
                      <span className="badge badge-warning">Chờ ký</span>
                    </td>
                    <td>{new Date(item.submitted_at).toLocaleDateString('vi-VN')}</td>
                    <td>
                      <button
                        className="btn btn-primary btn-sm"
                        onClick={() => handleSign(item.procedure_id)}
                        disabled={signingId === item.procedure_id}
                      >
                        <FileSignature size={16} />
                        {signingId === item.procedure_id ? 'Đang ký...' : 'Ký số'}
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
