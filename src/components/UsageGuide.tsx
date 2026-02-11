import { useState } from 'react';
import { ChevronDown, ChevronUp, AlertTriangle, BookOpen } from 'lucide-react';
import './UsageGuide.css';

interface UsageGuideProps {
  title: string;
  description: string;
  items: { label: string; description: string }[];
  note?: string;
  defaultExpanded?: boolean;
}

export default function UsageGuide({
  title,
  description,
  items,
  note,
  defaultExpanded = false,
}: UsageGuideProps) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  return (
    <div className="usage-guide-container">
      <div className="usage-guide-card">
        <button
          className="usage-guide-header"
          onClick={() => setIsExpanded(!isExpanded)}
          aria-expanded={isExpanded}
        >
          <div className="usage-guide-header-left">
            <BookOpen size={20} className="usage-guide-icon" />
            <h3 className="usage-guide-title">Hướng dẫn sử dụng</h3>
          </div>
          <div className="usage-guide-header-right">
            {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
          </div>
        </button>

        {isExpanded && (
          <div className="usage-guide-content">
            <div className="usage-guide-section">
              <p className="usage-guide-description">
                <strong>{title}:</strong> {description}
              </p>
              
              <ul className="usage-guide-list">
                {items.map((item, index) => (
                  <li key={index} className="usage-guide-item">
                    <strong>{item.label}:</strong> {item.description}
                  </li>
                ))}
              </ul>

              {note && (
                <div className="usage-guide-note">
                  <AlertTriangle size={16} />
                  <p>
                    <strong>Lưu ý:</strong> {note}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
