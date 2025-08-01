import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import type { PortfolioStock } from "../types";

const StockDetailPage: React.FC = () => {
  const { symbol } = useParams<{ symbol: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [stockData, setStockData] = useState<PortfolioStock | null>(null);

  useEffect(() => {
    // ローディング状態をシミュレート
    const timer = setTimeout(() => {
      setLoading(false);
      // サンプルデータを設定
      setStockData({
        id: "1",
        symbol: symbol || "AAPL",
        name: "Apple Inc.",
        shares: 50,
        currentPrice: 175.43,
        purchasePrice: 150.00,
        purchaseDate: "2024-01-15",
        value: 8771.50,
        weight: 32.0,
        return: 1271.50,
        returnPercent: 16.95
      });
    }, 2000);

    return () => clearTimeout(timer);
  }, [symbol]);

  const handleBack = () => {
    navigate("/portfolio");
  };

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif'
      }}>
        {/* ローディングスピナー */}
        <div style={{
          width: '60px',
          height: '60px',
          borderRadius: '50%',
          border: '4px solid #e2e8f0',
          borderTop: '4px solid #3b82f6',
          animation: 'spin 1s linear infinite',
          marginBottom: '1rem'
        }}></div>
        
        {/* ローディングテキスト */}
        <div style={{
          fontSize: '1.1rem',
          color: '#374151',
          fontWeight: '500',
          marginBottom: '2rem'
        }}>
          Loading stock data...
        </div>

        {/* MagicPath ロゴ */}
        <div style={{
          position: 'absolute',
          bottom: '2rem',
          right: '2rem',
          background: '#1f2937',
          color: 'white',
          padding: '0.5rem 1rem',
          borderRadius: '0.5rem',
          fontSize: '0.875rem',
          fontWeight: '500',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem'
        }}>
          Made with 
          <span style={{ fontWeight: '600' }}>MagicPath</span>
        </div>

        <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  if (!stockData) {
    return (
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif'
      }}>
        <div style={{ textAlign: 'center' }}>
          <h1 style={{ fontSize: '2rem', color: '#374151', marginBottom: '1rem' }}>
            Stock Not Found
          </h1>
          <p style={{ color: '#6b7280', marginBottom: '2rem' }}>
            The requested stock could not be found.
          </p>
          <button
            onClick={handleBack}
            style={{
              background: '#3b82f6',
              color: 'white',
              border: 'none',
              borderRadius: '0.5rem',
              padding: '0.75rem 1.5rem',
              fontSize: '1rem',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'background 0.2s'
            }}
            onMouseOver={(e) => e.currentTarget.style.background = '#2563eb'}
            onMouseOut={(e) => e.currentTarget.style.background = '#3b82f6'}
          >
            Back to Portfolio
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
      fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif'
    }}>
      {/* ヘッダー */}
      <div style={{
        background: 'white',
        borderBottom: '1px solid #e5e7eb',
        padding: '1rem 2rem'
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          display: 'flex',
          alignItems: 'center',
          gap: '1rem'
        }}>
          <button
            onClick={handleBack}
            style={{
              background: 'none',
              border: 'none',
              fontSize: '1.5rem',
              cursor: 'pointer',
              color: '#6b7280',
              padding: '0.5rem',
              borderRadius: '0.5rem',
              transition: 'background 0.2s'
            }}
            onMouseOver={(e) => e.currentTarget.style.background = '#f3f4f6'}
            onMouseOut={(e) => e.currentTarget.style.background = 'none'}
          >
            ←
          </button>
          <div>
            <h1 style={{ 
              fontSize: '1.5rem', 
              fontWeight: '700', 
              color: '#1f2937',
              margin: '0 0 0.25rem 0'
            }}>
              {stockData.symbol}
            </h1>
            <p style={{ 
              fontSize: '1rem', 
              color: '#6b7280',
              margin: 0
            }}>
              {stockData.name}
            </p>
          </div>
        </div>
      </div>

      {/* メインコンテンツ */}
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '2rem'
      }}>
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem' }}>
          {/* 左側 - 詳細情報 */}
          <div>
            {/* 価格情報 */}
            <div style={{
              background: 'white',
              borderRadius: '1rem',
              padding: '2rem',
              marginBottom: '2rem',
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
            }}>
              <h2 style={{
                fontSize: '1.5rem',
                fontWeight: '600',
                color: '#1f2937',
                margin: '0 0 1.5rem 0'
              }}>
                Price Information
              </h2>
              
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1.5rem' }}>
                <div>
                  <div style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.5rem' }}>
                    Current Price
                  </div>
                  <div style={{ fontSize: '2rem', fontWeight: '700', color: '#1f2937' }}>
                    ${stockData.currentPrice}
                  </div>
                </div>
                
                <div>
                  <div style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.5rem' }}>
                    Purchase Price
                  </div>
                  <div style={{ fontSize: '2rem', fontWeight: '700', color: '#1f2937' }}>
                    ${stockData.purchasePrice}
                  </div>
                </div>
                
                <div>
                  <div style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.5rem' }}>
                    Total Return
                  </div>
                  <div style={{ 
                    fontSize: '2rem', 
                    fontWeight: '700',
                    color: stockData.returnPercent >= 0 ? '#10b981' : '#ef4444'
                  }}>
                    {stockData.returnPercent >= 0 ? '+' : ''}{stockData.returnPercent}%
                  </div>
                </div>
                
                <div>
                  <div style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.5rem' }}>
                    Total Value
                  </div>
                  <div style={{ fontSize: '2rem', fontWeight: '700', color: '#1f2937' }}>
                    ${stockData.value.toLocaleString()}
                  </div>
                </div>
              </div>
            </div>

            {/* 保有情報 */}
            <div style={{
              background: 'white',
              borderRadius: '1rem',
              padding: '2rem',
              marginBottom: '2rem',
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
            }}>
              <h2 style={{
                fontSize: '1.5rem',
                fontWeight: '600',
                color: '#1f2937',
                margin: '0 0 1.5rem 0'
              }}>
                Holdings Information
              </h2>
              
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1.5rem' }}>
                <div>
                  <div style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.5rem' }}>
                    Number of Shares
                  </div>
                  <div style={{ fontSize: '1.5rem', fontWeight: '600', color: '#1f2937' }}>
                    {stockData.shares}
                  </div>
                </div>
                
                <div>
                  <div style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.5rem' }}>
                    Portfolio Weight
                  </div>
                  <div style={{ fontSize: '1.5rem', fontWeight: '600', color: '#1f2937' }}>
                    {stockData.weight}%
                  </div>
                </div>
                
                <div>
                  <div style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.5rem' }}>
                    Purchase Date
                  </div>
                  <div style={{ fontSize: '1.5rem', fontWeight: '600', color: '#1f2937' }}>
                    {new Date(stockData.purchaseDate).toLocaleDateString()}
                  </div>
                </div>
                
                <div>
                  <div style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.5rem' }}>
                    Unrealized P&L
                  </div>
                  <div style={{ 
                    fontSize: '1.5rem', 
                    fontWeight: '600',
                    color: stockData.return >= 0 ? '#10b981' : '#ef4444'
                  }}>
                    ${stockData.return.toFixed(2)}
                  </div>
                </div>
              </div>
            </div>

            {/* チャートエリア（プレースホルダー） */}
            <div style={{
              background: 'white',
              borderRadius: '1rem',
              padding: '2rem',
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
            }}>
              <h2 style={{
                fontSize: '1.5rem',
                fontWeight: '600',
                color: '#1f2937',
                margin: '0 0 1.5rem 0'
              }}>
                Price Chart
              </h2>
              
              <div style={{
                height: '300px',
                background: '#f9fafb',
                borderRadius: '0.5rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#6b7280',
                fontSize: '1.1rem'
              }}>
                Chart will be displayed here
              </div>
            </div>
          </div>

          {/* 右側 - アクション */}
          <div>
            <div style={{
              background: 'white',
              borderRadius: '1rem',
              padding: '1.5rem',
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
              height: 'fit-content'
            }}>
              <h3 style={{
                fontSize: '1.25rem',
                fontWeight: '600',
                color: '#1f2937',
                margin: '0 0 1.5rem 0'
              }}>
                Actions
              </h3>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <button style={{
                  background: '#3b82f6',
                  color: 'white',
                  border: 'none',
                  borderRadius: '0.5rem',
                  padding: '0.75rem 1rem',
                  fontSize: '1rem',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'background 0.2s'
                }}
                onMouseOver={(e) => e.currentTarget.style.background = '#2563eb'}
                onMouseOut={(e) => e.currentTarget.style.background = '#3b82f6'}
                >
                  Edit Position
                </button>
                
                <button style={{
                  background: '#10b981',
                  color: 'white',
                  border: 'none',
                  borderRadius: '0.5rem',
                  padding: '0.75rem 1rem',
                  fontSize: '1rem',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'background 0.2s'
                }}
                onMouseOver={(e) => e.currentTarget.style.background = '#059669'}
                onMouseOut={(e) => e.currentTarget.style.background = '#10b981'}
                >
                  Add Shares
                </button>
                
                <button style={{
                  background: '#f59e0b',
                  color: 'white',
                  border: 'none',
                  borderRadius: '0.5rem',
                  padding: '0.75rem 1rem',
                  fontSize: '1rem',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'background 0.2s'
                }}
                onMouseOver={(e) => e.currentTarget.style.background = '#d97706'}
                onMouseOut={(e) => e.currentTarget.style.background = '#f59e0b'}
                >
                  Sell Shares
                </button>
                
                <button style={{
                  background: '#ef4444',
                  color: 'white',
                  border: 'none',
                  borderRadius: '0.5rem',
                  padding: '0.75rem 1rem',
                  fontSize: '1rem',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'background 0.2s'
                }}
                onMouseOver={(e) => e.currentTarget.style.background = '#dc2626'}
                onMouseOut={(e) => e.currentTarget.style.background = '#ef4444'}
                >
                  Remove Position
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StockDetailPage; 