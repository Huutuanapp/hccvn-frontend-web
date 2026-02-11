// File: frontend-web/src/pages/Explainability.tsx
/**
 * Explainability Dashboard
 *
 * EN:
 * - Human-readable explanation of system decisions by trace_id.
 * - Used for audit, inspection, complaint handling.
 *
 * VI:
 * - Trang giải trình quyết định hệ thống theo trace_id.
 * - Phục vụ người dùng Việt Nam, kiểm toán, thanh tra, giải quyết khiếu nại.
 */

import { useState } from "react";
// import html2pdf from "html2pdf.js"; // TODO: Add html2pdf package when needed for PDF export

import { fetchExplainability } from "../services/explainabilityApi";

import "./Explainability.css";


/**
 * AuditEvent
 *
 * EN: One immutable audit decision event.
 * VI: Một sự kiện audit (bất biến).
 */
type AuditEvent = {
  created_at: string;
  actor_id: string;
  actor_role: string;
  action: string;
  resource: string;
  outcome: "allowed" | "denied";
  reason?: string;
  policy_version?: string;
};

export default function Explainability() {
  const [traceId, setTraceId] = useState("");
  const [events, setEvents] = useState<AuditEvent[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Fetch explainability data from Gateway
   */
  const handleExplain = async () => {
    if (!traceId) return;

    setLoading(true);
    setError(null);
    setEvents([]);

    try {
      const result = await fetchExplainability(traceId);
      setEvents(result.audit_events || []);
    } catch {
      setError("❌ Không thể tải dữ liệu giải trình. Vui lòng kiểm tra trace_id.");
    } finally {
      setLoading(false);
    }
  };

  /**
   * Export explainability timeline to PDF
   * (Biên bản giải trình – dùng cho lưu trữ / thanh tra)
   */
  const exportPDF = () => {
    const element = document.getElementById("explain-pdf");
    if (!element) return;

    // TODO: Uncomment when html2pdf package is added
    // const opt = {
    //   margin: 10,
    //   filename: `bien-ban-giai-trinh-${traceId}.pdf`,
    //   image: { type: "jpeg", quality: 0.98 },
    //   html2canvas: { scale: 2 },
    //   jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
    // };
    // html2pdf().set(opt).from(element).save();
    
    // Use browser's native print function as fallback
    window.print();
  };

  return (
    <div className="explain-container">
      <h1>🔍 BẢNG GIẢI TRÌNH QUYẾT ĐỊNH HỆ THỐNG</h1>

      <p className="explain-desc">
        Nhập <strong>trace_id</strong> để xem toàn bộ quá trình hệ thống ra quyết
        định (xác thực, phân quyền, chính sách, audit).
      </p>

      {/* ========================= */}
      {/* Input */}
      {/* ========================= */}
      <div className="explain-input">
        <input
          value={traceId}
          onChange={(e) => setTraceId(e.target.value)}
          placeholder="Ví dụ: 8f3c1a2e-xxxx-xxxx-xxxx"
        />
        <button onClick={handleExplain} disabled={!traceId || loading}>
          {loading ? "Đang tải..." : "Giải trình"}
        </button>
      </div>

      {error && <div className="error">{error}</div>}

      {/* ========================= */}
      {/* Timeline & PDF */}
      {/* ========================= */}
      {events.length > 0 && (
        <>
          <div className="export-wrapper">
            <button className="export-btn" onClick={exportPDF}>
              📄 Xuất PDF biên bản giải trình
            </button>
          </div>

          {/* PDF EXPORT ZONE */}
          <div id="explain-pdf">
            <div className="pdf-header">
              <h2>BIÊN BẢN GIẢI TRÌNH QUYẾT ĐỊNH HỆ THỐNG</h2>
              <div>
                <strong>Trace ID:</strong> {traceId}
              </div>
              <div>
                <strong>Thời gian xuất:</strong>{" "}
                {new Date().toLocaleString("vi-VN")}
              </div>
            </div>

            <div className="timeline">
              {events.map((e, idx) => (
                <div
                  key={idx}
                  className={`timeline-item ${
                    e.outcome === "allowed" ? "allowed" : "denied"
                  }`}
                >
                  <div className="timeline-time">
                    ⏱ {new Date(e.created_at).toLocaleString("vi-VN")}
                  </div>

                  <div className="timeline-body">
                    <div>
                      <strong>Người thực hiện:</strong> {e.actor_id} (
                      {e.actor_role})
                    </div>

                    <div>
                      <strong>Hành động:</strong> {e.action}
                    </div>

                    <div>
                      <strong>Tài nguyên:</strong> {e.resource}
                    </div>

                    <div>
                      <strong>Kết quả:</strong>{" "}
                      {e.outcome === "allowed"
                        ? "✅ ĐƯỢC PHÉP"
                        : "❌ TỪ CHỐI"}
                    </div>

                    {e.reason && (
                      <div>
                        <strong>Lý do hệ thống:</strong> {e.reason}
                      </div>
                    )}

                    {e.policy_version && (
                      <div className="policy-version">
                        Chính sách áp dụng: <b>{e.policy_version}</b>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="pdf-footer">
              <i>
                Tài liệu được sinh tự động từ hệ thống AI. Dùng cho mục đích
                giải trình, kiểm toán và lưu trữ hồ sơ.
              </i>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
