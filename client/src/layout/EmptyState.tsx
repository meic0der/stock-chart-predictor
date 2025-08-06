import React from "react";

interface EmptyStateProps {
  message?: string;
}

const EmptyState: React.FC<EmptyStateProps> = ({ message = "条件に一致する株価が見つかりませんでした。" }) => {
  return (
    <div className="empty-state">
      <div className="empty-icon">🔍</div>
      <div className="empty-message">{message}</div>
    </div>
  );
};

export default EmptyState; 