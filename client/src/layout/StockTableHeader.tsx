import React from "react";

interface StockTableHeaderProps {
  stocksCount: number;
  lastUpdated: string | null;
  loading: boolean;
  updating: boolean;
  selectedStocksCount: number;
  onRefresh: () => void;
  onUpdateSelected: () => void;
  onUpdateAll: () => void;
  onResetAndReload: () => void;
}

const StockTableHeader: React.FC<StockTableHeaderProps> = ({
  stocksCount,
  lastUpdated,
  loading,
  updating,
  selectedStocksCount,
  onRefresh,
  onUpdateSelected,
  onUpdateAll,
  onResetAndReload
}) => {
  return (
    <div className="table-header-container">
      <h2 className="table-title">Search Results</h2>
      <div className="table-controls">
        <button
          onClick={onRefresh}
          disabled={loading}
          className="control-btn refresh-btn"
        >
          {loading ? '読み込み中...' : '🔄 再読み込み'}
        </button>
        <button
          onClick={onUpdateSelected}
          disabled={updating || selectedStocksCount === 0}
          className={`control-btn update-selected-btn ${selectedStocksCount > 0 ? 'active' : 'disabled'}`}
        >
          {updating ? '更新中...' : `📈 選択更新 (${selectedStocksCount})`}
        </button>
        <button
          onClick={onUpdateAll}
          disabled={updating}
          className="control-btn update-all-btn"
        >
          {updating ? '更新中...' : '🚀 全更新'}
        </button>
        <button
          onClick={onResetAndReload}
          disabled={updating}
          className="control-btn reset-btn"
        >
          {updating ? 'リセット中...' : '🔄 セクター修正'}
        </button>
        <span className="stocks-count">
          {stocksCount} stocks found
        </span>
        {lastUpdated && (
          <span className="last-updated">
            最終更新: {new Date(lastUpdated).toLocaleString('ja-JP')}
          </span>
        )}
      </div>
    </div>
  );
};

export default StockTableHeader; 