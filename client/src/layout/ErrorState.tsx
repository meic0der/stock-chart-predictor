import React from "react";

interface ErrorStateProps {
  message: string;
  onRetry?: () => void;
}

const ErrorState: React.FC<ErrorStateProps> = ({ message, onRetry }) => {
  return (
    <div className="error-state">
      <div className="error-icon">❌</div>
      <div className="error-message">{message}</div>
      {onRetry && (
        <button onClick={onRetry} className="retry-btn">
          再試行
        </button>
      )}
    </div>
  );
};

export default ErrorState; 