import { useEffect, useState } from 'react';
import { GraduationCap, Upload, FileText, CheckCircle, XCircle, Clock } from 'lucide-react';
import { aiTeachingAPI, Document } from '../services/api';
import UsageGuide from '../components/UsageGuide';
import './AITeaching.css';

export default function AITeaching() {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    loadDocuments();
  }, []);

  const loadDocuments = async () => {
    try {
      const data = await aiTeachingAPI.getDocuments();
      setDocuments((data as any)?.items || []);
    } catch (error) {
      console.error('Load documents failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) return;

    const formData = new FormData();
    formData.append('file', selectedFile);

    setUploading(true);
    try {
      await aiTeachingAPI.uploadDocument(formData);
      alert('Tải tài liệu thành công');
      setShowUploadModal(false);
      setSelectedFile(null);
      loadDocuments();
    } catch (error) {
      alert('Tải tài liệu thất bại');
    } finally {
      setUploading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return <CheckCircle size={18} className="text-success" />;
      case 'PROCESSING':
        return <Clock size={18} className="text-warning" />;
      default:
        return <FileText size={18} />;
    }
  };

  const getApprovalBadge = (status: string) => {
    const badges: Record<string, { label: string; class: string }> = {
      PENDING: { label: 'Chờ duyệt', class: 'badge-warning' },
      APPROVED: { label: 'Đã duyệt', class: 'badge-success' },
      REJECTED: { label: 'Từ chối', class: 'badge-error' },
    };
    const badge = badges[status] || { label: status, class: 'badge' };
    return <span className={`badge ${badge.class}`}>{badge.label}</span>;
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner" />
        <p>Đang tải tài liệu...</p>
      </div>
    );
  }

  return (
    <div className="ai-teaching-page">
      <div className="page-header">
        <div>
          <h1>
            <GraduationCap size={32} />
            AI Teaching
          </h1>
          <p className="subtitle">Quản lý tài liệu huấn luyện AI</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowUploadModal(true)}>
          <Upload size={18} />
          Tải tài liệu mới
        </button>
      </div>

      <div className="stats-grid">
        <div className="stat-card-small">
          <FileText size={24} />
          <div>
            <div className="stat-value">{documents.length}</div>
            <div className="stat-label">Tổng tài liệu</div>
          </div>
        </div>
        <div className="stat-card-small">
          <Clock size={24} />
          <div>
            <div className="stat-value">
              {documents.filter((d) => d.processing_status === 'PROCESSING').length}
            </div>
            <div className="stat-label">Đang xử lý</div>
          </div>
        </div>
        <div className="stat-card-small">
          <CheckCircle size={24} />
          <div>
            <div className="stat-value">
              {documents.filter((d) => d.approval_status === 'APPROVED').length}
            </div>
            <div className="stat-label">Đã duyệt</div>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>Tên tài liệu</th>
                <th>Loại</th>
                <th>Trạng thái xử lý</th>
                <th>Trạng thái duyệt</th>
                <th>Ngày tải lên</th>
                <th>Người tải</th>
              </tr>
            </thead>
            <tbody>
              {documents.length === 0 ? (
                <tr>
                  <td colSpan={6} className="empty-message">
                    Chưa có tài liệu nào
                  </td>
                </tr>
              ) : (
                documents.map((doc) => (
                  <tr key={doc.id}>
                    <td>
                      <div className="doc-name">
                        {getStatusIcon(doc.processing_status)}
                        {doc.name}
                      </div>
                    </td>
                    <td className="mono">{doc.type}</td>
                    <td>
                      <span className={`badge ${doc.processing_status === 'COMPLETED' ? 'badge-success' : 'badge-warning'}`}>
                        {doc.processing_status === 'COMPLETED' ? 'Hoàn thành' : 'Đang xử lý'}
                      </span>
                    </td>
                    <td>{getApprovalBadge(doc.approval_status)}</td>
                    <td>{new Date(doc.uploaded_at).toLocaleDateString('vi-VN')}</td>
                    <td>{doc.uploaded_by}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showUploadModal && (
        <div className="modal-overlay" onClick={() => setShowUploadModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h2>Tải tài liệu mới</h2>

            <form onSubmit={handleUpload}>
              <div className="form-group">
                <label>Chọn file (PDF, DOCX, TXT):</label>
                <input
                  type="file"
                  className="input"
                  accept=".pdf,.docx,.txt"
                  onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                  title="Select file to upload"
                  required
                />
              </div>

              {selectedFile && (
                <div className="file-info">
                  <FileText size={20} />
                  <div>
                    <div className="file-name">{selectedFile.name}</div>
                    <div className="file-size">
                      {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                    </div>
                  </div>
                </div>
              )}

              <div className="modal-actions">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowUploadModal(false)}
                  disabled={uploading}
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={!selectedFile || uploading}
                >
                  {uploading ? 'Đang tải lên...' : 'Tải lên'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <UsageGuide
        title="Quản lý tài liệu huấn luyện AI"
        description="Hệ thống AI Teaching giúp huấn luyện và cải thiện độ chính xác của AI"
        items={[
          { label: 'Tải tài liệu', description: 'Upload file PDF, DOCX, TXT chứa dữ liệu mẫu về thủ tục' },
          { label: 'Trạng thái xử lý', description: 'Theo dõi quá trình AI phân tích và học từ tài liệu' },
          { label: 'Trạng thái duyệt', description: 'Quản trị viên phê duyệt tài liệu trước khi áp dụng vào hệ thống' },
          { label: 'Loại tài liệu', description: 'Phân loại theo UC-01 (Đăng ký), UC-02 (Thay đổi), UC-03 (Giải thể)' },
        ]}
        note="Tài liệu cần được phê duyệt bởi quản trị viên trước khi AI sử dụng để học."
        defaultExpanded={documents.length === 0}
      />
    </div>
  );
}
