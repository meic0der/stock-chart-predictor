import React, { useState } from "react";
import StockForm from "../components/StockForm";
import StockChart from "../components/StockChart";
import HistoryList from "../components/HistoryList";
import CompareChart from "../components/CompareChart";
import type { StockData, HistoryItem } from "../types";

const PredictPage: React.FC = () => {
  const [stockData, setStockData] = useState<StockData | null>(null);
  const [historyKey, setHistoryKey] = useState(0);
  const [selectedItems, setSelectedItems] = useState<HistoryItem[]>([]);
  const [showCompare, setShowCompare] = useState(false);

  const handleResult = (data: StockData) => {
    setStockData(data);
    setHistoryKey(prev => prev + 1);
    setShowCompare(false);
  };
  const handleHistorySelect = (data: HistoryItem) => {
    setStockData(data);
    setShowCompare(false);
  };
  const handleCompareToggle = () => {
    setShowCompare((prev) => !prev);
  };

  return (
    <div style={{ 
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #f8fafc 0%, #e0e7ef 100%)',
      padding: '2rem 0'
    }}>
      <div style={{ 
        maxWidth: 1200, 
        margin: '0 auto', 
        padding: '0 2rem'
      }}>
        {/* ページヘッダー */}
        <div style={{ 
          textAlign: 'center', 
          marginBottom: '3rem'
        }}>
          <h1 style={{ 
            fontSize: '2.5rem', 
            fontWeight: '700', 
            color: '#2d3748',
            margin: '0 0 1rem 0',
            letterSpacing: '0.05em'
          }}>
            株価予測分析
          </h1>
          <p style={{ 
            fontSize: '1.2rem', 
            color: '#64748b',
            margin: '0',
            maxWidth: '600px',
            marginLeft: 'auto',
            marginRight: 'auto'
          }}>
            AI予測モデルを使用して株価の将来動向を分析し、投資判断をサポートします
          </p>
        </div>

        {/* メインコンテンツエリア */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(500px, 1fr))', 
          gap: '2rem',
          alignItems: 'start'
        }}>
          {/* 左側: フォームとチャート */}
          <div>
            <StockForm onResult={handleResult} />
            
            {stockData && (
              <StockChart data={stockData} />
            )}

            {/* 比較チャートボタン */}
            {selectedItems.length > 0 && (
              <div style={{ 
                textAlign: 'center', 
                marginBottom: '2rem'
              }}>
                <button 
                  onClick={handleCompareToggle} 
                  style={{
                    background: 'linear-gradient(90deg, #8b5cf6 0%, #a855f7 100%)',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '0.8rem',
                    padding: '1rem 2rem',
                    fontSize: '1.1rem',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    boxShadow: '0 4px 12px rgba(139, 92, 246, 0.3)'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = '0 6px 16px rgba(139, 92, 246, 0.4)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 4px 12px rgba(139, 92, 246, 0.3)';
                  }}
                >
                  {showCompare ? "比較チャートを閉じる" : "比較チャートを表示"}
                </button>
              </div>
            )}

            {/* 比較チャート */}
            {showCompare && (
              <CompareChart data={selectedItems} />
            )}
          </div>

          {/* 右側: 履歴リスト */}
          <div>
            <HistoryList 
              onSelect={handleHistorySelect} 
              key={historyKey} 
              selectedItems={selectedItems} 
              setSelectedItems={setSelectedItems}
            />
          </div>
        </div>


      </div>
    </div>
  );
};

export default PredictPage; 