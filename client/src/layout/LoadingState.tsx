import React from "react";

interface LoadingStateProps {
  message?: string;
}

const LoadingState: React.FC<LoadingStateProps> = ({ message = "データを読み込み中..." }) => {
  return (
    <div className="loading-state">
      <div className="loading-icon">⏳</div>
      <div className="loading-message">{message}</div>
    </div>
  );
};

export default LoadingState; 