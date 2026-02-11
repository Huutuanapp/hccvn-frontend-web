import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Building2,
  User,
  Briefcase,
  AlertCircle,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Brain,
  TrendingUp,
  Shield,
} from 'lucide-react';
import { casesAPI, CaseDetail as CaseData } from '../services/api';
import './CaseDetail.css';

export default function CaseDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [caseData, setCaseData] = useState<CaseData | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [decision, setDecision] = useState('');
  const [reason, setReason] = useState('');

  useEffect(() => {
    if (id) loadCase();
  }, [id]);

  const loadCase = async () => {
    try {
      const data = await casesAPI.getById(id!);
      setCaseData(data);
    } catch (error) {
      console.error('Load case failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleReview = async () => {
    if (!decision) return;
    
    setActionLoading(true);
    try {
      await casesAPI.review(id!, decision, reason);
      alert('Thẩm định thành công');
      loadCase();
      setShowReviewModal(false);
    } catch (error) {
      alert('Thẩm định thất bại');
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner" />
        <p>Đang tải hồ sơ...</p>
      </div>
    );
  }

  if (!caseData) {
    return (
      <div className="error-container">
        <AlertCircle size={48} />
        <h2>Không tìm thấy hồ sơ</h2>
        <button className="btn btn-primary" onClick={() => navigate('/cases')}>
          Quay lại danh sách
        </button>
      </div>
    );
  }

  const getStatusBadge = (status: string) => {
    const badges: Record<string, { label: string; class: string; icon: any }> = {
      SUBMITTED: { label: 'Đã nộp', class: 'badge-warning', icon: AlertCircle },
      UNDER_REVIEW: { label: 'Đang thẩm định', class: 'badge badge-warning', icon: AlertCircle },
      APPROVED_PENDING_SIGNATURE: { label: 'Chờ ký', class: 'badge badge-success', icon: CheckCircle },
      COMPLETED: { label: 'Hoàn thành', class: 'badge badge-success', icon: CheckCircle },
      REJECTED: { label: 'Từ chối', class: 'badge badge-error', icon: XCircle },
    };
    const badge = badges[status] || { label: status, class: 'badge', icon: AlertCircle };
    const Icon = badge.icon;
    return (
      <span className={badge.class}>
        <Icon size={14} />
        {badge.label}
      </span>
    );
  };

  return (
    <div className="case-detail-page">
      <div className="instruction-panel">
        <div className="instruction-header">
          <AlertTriangle size={20} />
          <h3>Hướng dẫn sử dụng</h3>
        </div>
        <div className="instruction-content">
          <p><strong>Chi tiết hồ sơ:</strong> Màn hình này hiển thị đầy đủ thông tin về hồ sơ đăng ký doanh nghiệp.</p>
          <ul>
            <li><strong>Cột 1 - Thông tin hồ sơ:</strong> Thông tin doanh nghiệp, người nộp, cổ đông, ngành nghề kinh doanh</li>
            <li><strong>Cột 2 - AI Phân tích (CHỈ ĐỌC):</strong> Kết quả phân tích tự động từ AI, bao gồm điểm tin cậy, rủi ro, đề xuất</li>
            <li><strong>Cột 3 - Hành động cán bộ:</strong> Thực hiện thẩm định - Phê duyệt / Yêu cầu bổ sung / Từ chối</li>
          </ul>
          <p><strong>Lưu ý:</strong> Khi từ chối hoặc yêu cầu bổ sung, bạn <strong>PHẢI</strong> nhập lý do cụ thể để doanh nghiệp hiểu rõ vấn đề.</p>
        </div>
      </div>
      <div className="page-header">
        <button className="btn-back" onClick={() => navigate('/cases')}>
          <ArrowLeft size={20} />
          Quay lại
        </button>
        <div className="header-content">
          <div className="header-left">
            <h1>{caseData.enterprise_name}</h1>
            <p className="case-id">
              <span className="mono">{caseData.procedure_id}</span>
              {getStatusBadge(caseData.status)}
            </p>
          </div>
        </div>
      </div>

      <div className="three-column-layout">
        {/* Cột 1: Thông tin hồ sơ */}
        <div className="column column-info">
          <div className="card">
            <div className="card-header">
              <Building2 size={20} />
              <h3>Thông tin doanh nghiệp</h3>
            </div>
            <div className="info-grid">
              <div className="info-item">
                <span className="label">Mã số thuế:</span>
                <span className="value mono">{caseData.tin}</span>
              </div>
              <div className="info-item">
                <span className="label">Địa chỉ:</span>
                <span className="value">{caseData.address}</span>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="card-header">
              <User size={20} />
              <h3>Người nộp hồ sơ</h3>
            </div>
            <div className="info-grid">
              <div className="info-item">
                <span className="label">Họ tên:</span>
                <span className="value">{caseData.submitter_name}</span>
              </div>
              <div className="info-item">
                <span className="label">CCCD/CMND:</span>
                <span className="value mono">{caseData.submitter_citizen_id}</span>
              </div>
            </div>
          </div>

          {caseData.beneficial_owners.length > 0 && (
            <div className="card">
              <div className="card-header">
                <User size={20} />
                <h3>Người thụ hưởng lợi ích</h3>
              </div>
              <div className="owners-list">
                {caseData.beneficial_owners.map((owner, idx) => (
                  <div key={idx} className="owner-card">
                    <div className="owner-name">{owner.full_name}</div>
                    <div className="owner-details">
                      <span className="mono">{owner.citizen_id}</span>
                      <span className="ownership">{owner.ownership_percentage}%</span>
                    </div>
                    <div className="control-method">{owner.control_method}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {caseData.business_lines.length > 0 && (
            <div className="card">
              <div className="card-header">
                <Briefcase size={20} />
                <h3>Ngành nghề kinh doanh</h3>
              </div>
              <div className="business-lines">
                {caseData.business_lines.map((line, idx) => (
                  <div key={idx} className="business-line">
                    <div className="line-code mono">{line.code}</div>
                    <div className="line-desc">{line.description_vi}</div>
                    {line.is_licensed && (
                      <span className="badge badge-warning">Cần giấy phép</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Cột 2: Phân tích AI (READ-ONLY) */}
        <div className="column column-ai">
          <div className="card ai-card">
            <div className="card-header">
              <Brain size={20} />
              <h3>Phân tích AI</h3>
              <span className="badge badge-primary">Chỉ đọc</span>
            </div>

            {caseData.ai_analysis ? (
              <>
                <div className="ai-score-section">
                  <div className="score-item">
                    <TrendingUp size={18} />
                    <div>
                      <div className="score-label">Độ tin cậy</div>
                      <div className="score-value">
                        {(caseData.ai_analysis.confidence_score * 100).toFixed(1)}%
                      </div>
                    </div>
                  </div>

                  <div className="score-item">
                    <Shield size={18} />
                    <div>
                      <div className="score-label">Mức độ rủi ro</div>
                      <div className={`risk-badge risk-${caseData.ai_analysis.risk_level.toLowerCase()}`}>
                        {caseData.ai_analysis.risk_level}
                      </div>
                    </div>
                  </div>
                </div>

                {caseData.ai_analysis.recommendations.length > 0 && (
                  <div className="ai-recommendations">
                    <h4>Khuyến nghị từ AI:</h4>
                    <ul>
                      {caseData.ai_analysis.recommendations.map((rec, idx) => (
                        <li key={idx}>{rec}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {Object.keys(caseData.ai_analysis.extracted_entities).length > 0 && (
                  <div className="ai-entities">
                    <h4>Thực thể trích xuất:</h4>
                    <pre>{JSON.stringify(caseData.ai_analysis.extracted_entities, null, 2)}</pre>
                  </div>
                )}
              </>
            ) : (
              <div className="ai-placeholder">
                <Brain size={32} />
                <p>Đang chờ phân tích AI...</p>
              </div>
            )}
          </div>

          {caseData.validation_passed === false && (
            <div className="card validation-card error">
              <div className="card-header">
                <XCircle size={20} />
                <h3>❌ Lỗi xác thực - Hồ sơ không hợp lệ</h3>
              </div>
              <div className="validation-explanation">
                <p><strong>Tại sao hồ sơ bị từ chối:</strong></p>
                <p>Hệ thống đã phát hiện các lỗi sau đây trong hồ sơ của bạn. Vui lòng sửa đúng theo hướng dẫn bên dưới:</p>
              </div>
              <ul className="validation-errors">
                {caseData.validation_errors.map((error, idx) => (
                  <li key={idx}>
                    <strong>Lỗi {idx + 1}:</strong> {error}
                    <div className="error-reason">
                      <span className="error-icon">💡</span>
                      <span>Hãy kiểm tra lại thông tin và đảm bảo tuân thủ đúng quy định pháp luật.</span>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {caseData.deficiencies.length > 0 && (
            <div className="card deficiency-card">
              <div className="card-header">
                <AlertCircle size={20} />
                <h3>Thiếu sót ({caseData.deficiencies.length})</h3>
              </div>
              <div className="deficiencies">
                {caseData.deficiencies.map((def, idx) => (
                  <div key={idx} className="deficiency-item">
                    <div className="def-header">
                      <span className="def-code">{def.code}</span>
                      <span className="badge badge-warning">{def.category}</span>
                    </div>
                    <div className="def-description">{def.description_vi}</div>
                    <div className="def-instruction">
                      <strong>Hướng dẫn:</strong> {def.instruction_vi}
                    </div>
                    <div className="def-legal">
                      <strong>Căn cứ pháp lý:</strong> {def.legal_basis_vi}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Cột 3: Hành động cán bộ */}
        <div className="column column-actions">
          <div className="card">
            <div className="card-header">
              <CheckCircle size={20} />
              <h3>Hành động</h3>
            </div>

            {caseData.status === 'UNDER_REVIEW' ? (
              <div className="action-buttons">
                <button
                  className="btn btn-success"
                  onClick={() => {
                    setDecision('APPROVE');
                    setShowReviewModal(true);
                  }}
                >
                  <CheckCircle size={18} />
                  Phê duyệt
                </button>

                <button
                  className="btn btn-primary"
                  onClick={() => {
                    setDecision('REQUEST_ADDITIONAL');
                    setShowReviewModal(true);
                  }}
                >
                  <AlertCircle size={18} />
                  Yêu cầu bổ sung
                </button>

                <button
                  className="btn btn-danger"
                  onClick={() => {
                    setDecision('REJECT');
                    setShowReviewModal(true);
                  }}
                >
                  <XCircle size={18} />
                  Từ chối
                </button>
              </div>
            ) : (
              <div className="status-info">
                <p>Hồ sơ đang ở trạng thái: {getStatusBadge(caseData.status)}</p>
                {caseData.status === 'APPROVED_PENDING_SIGNATURE' && (
                  <p className="info-text">
                    Hồ sơ đã được phê duyệt, đang chờ ký số.
                  </p>
                )}
              </div>
            )}
          </div>

          <div className="card timeline-card">
            <div className="card-header">
              <h3>Timeline</h3>
            </div>
            <div className="timeline">
              <div className="timeline-item">
                <div className="timeline-dot" />
                <div className="timeline-content">
                  <div className="timeline-label">Tạo hồ sơ</div>
                  <div className="timeline-date">
                    {new Date(caseData.created_at).toLocaleString('vi-VN')}
                  </div>
                </div>
              </div>

              {caseData.submitted_at && (
                <div className="timeline-item">
                  <div className="timeline-dot" />
                  <div className="timeline-content">
                    <div className="timeline-label">Nộp hồ sơ</div>
                    <div className="timeline-date">
                      {new Date(caseData.submitted_at).toLocaleString('vi-VN')}
                    </div>
                  </div>
                </div>
              )}

              {caseData.completed_at && (
                <div className="timeline-item">
                  <div className="timeline-dot completed" />
                  <div className="timeline-content">
                    <div className="timeline-label">Hoàn thành</div>
                    <div className="timeline-date">
                      {new Date(caseData.completed_at).toLocaleString('vi-VN')}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {showReviewModal && (
        <div className="modal-overlay" onClick={() => setShowReviewModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h2>Xác nhận {decision === 'APPROVE' ? 'phê duyệt' : decision === 'REJECT' ? 'từ chối' : 'yêu cầu bổ sung'}</h2>
            
            {decision !== 'APPROVE' && (
              <div className="modal-warning">
                <AlertTriangle size={20} />
                <div>
                  <strong>⚠️ Lý do là BẮT BUỘC</strong>
                  <p>Bạn PHẢI giải thích rõ ràng lý do {decision === 'REJECT' ? 'từ chối' : 'yêu cầu bổ sung'} để doanh nghiệp hiểu và khắc phục đúng vấn đề.</p>
                </div>
              </div>
            )}
            
            <div className="form-group">
              <label>
                Lý do {decision === 'APPROVE' ? '(tùy chọn)' : '(bắt buộc)'}:
                {decision !== 'APPROVE' && <span className="required-mark">*</span>}
              </label>
              <textarea
                className="input"
                rows={5}
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder={decision === 'APPROVE' 
                  ? 'Nhập lý do (không bắt buộc)...' 
                  : 'VD: Thiếu giấy tờ chứng minh quyền sở hữu, MST không hợp lệ, địa chỉ không chính xác...'}
                required={decision !== 'APPROVE'}
              />
              {decision !== 'APPROVE' && !reason && (
                <div className="field-error">
                  <XCircle size={14} />
                  <span>Vui lòng nhập lý do cụ thể trước khi {decision === 'REJECT' ? 'từ chối' : 'yêu cầu bổ sung'}</span>
                </div>
              )}
            </div>

            <div className="modal-actions">
              <button
                className="btn btn-secondary"
                onClick={() => setShowReviewModal(false)}
                disabled={actionLoading}
              >
                Hủy
              </button>
              <button
                className="btn btn-primary"
                onClick={handleReview}
                disabled={actionLoading || (decision !== 'APPROVE' && !reason)}
              >
                {actionLoading ? 'Đang xử lý...' : 'Xác nhận'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
