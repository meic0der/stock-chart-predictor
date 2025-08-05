import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import type { PortfolioData, PortfolioStock } from "../types";
// import { fetchPortfolioSummary, removeFromPortfolio } from "../services/portfolioApi";

const PortfolioPage: React.FC = () => {
  const navigate = useNavigate();
  
  const [portfolioData, setPortfolioData] = useState<PortfolioData>({
    totalValue: 0,
    totalInvestment: 0,
    unrealizedPnL: 0,
    averageReturn: 0,
    annualDividends: 0,
    portfolioRisk: 0,
    dividendYield: 0,
    lastUpdated: new Date().toLocaleDateString('en-US'),
    stocks: []
  });

  const [showAddStock, setShowAddStock] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadPortfolioData();
  }, []);

  const loadPortfolioData = async () => {
    try {
      setLoading(true);
      setError(null);
      // 一時的にAPIコールをコメントアウト（APIが未実装のため）
      // const data = await fetchPortfolioSummary();
      // setPortfolioData(data);
      
      // サンプルデータを設定
      setPortfolioData({
        totalValue: 27427.30,
        totalInvestment: 23225.00,
        unrealizedPnL: 4202.30,
        averageReturn: 18.09,
        annualDividends: 122.90,
        portfolioRisk: 3.70,
        dividendYield: 0.45,
        lastUpdated: new Date().toLocaleDateString('en-US'),
        stocks: [
          {
            id: "1",
            symbol: "AAPL",
            name: "Apple Inc.",
            shares: 50,
            currentPrice: 175.43,
            purchasePrice: 150.00,
            purchaseDate: "2024-01-15",
            value: 8771.50,
            weight: 32.0,
            return: 1271.50,
            returnPercent: 16.95
          },
          {
            id: "2",
            symbol: "MSFT",
            name: "Microsoft Corporation",
            shares: 30,
            currentPrice: 378.85,
            purchasePrice: 320.00,
            purchaseDate: "2024-02-20",
            value: 11365.50,
            weight: 41.4,
            return: 1765.50,
            returnPercent: 18.39
          },
          {
            id: "3",
            symbol: "GOOGL",
            name: "Alphabet Inc.",
            shares: 25,
            currentPrice: 142.56,
            purchasePrice: 125.00,
            purchaseDate: "2024-03-10",
            value: 3564.00,
            weight: 13.0,
            return: 439.00,
            returnPercent: 14.05
          },
          {
            id: "4",
            symbol: "TSLA",
            name: "Tesla, Inc.",
            shares: 20,
            currentPrice: 186.50,
            purchasePrice: 165.00,
            purchaseDate: "2024-04-05",
            value: 3730.00,
            weight: 13.6,
            return: 430.00,
            returnPercent: 13.03
          }
        ]
      });
    } catch (err) {
      setError('ポートフォリオデータの読み込みに失敗しました。');
      console.error('Error loading portfolio data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddStock = () => {
    setShowAddStock(true);
  };

  const handleEditStock = (id: string) => {
    console.log("Edit stock:", id);
  };

  const handleDeleteStock = async (symbol: string) => {
    if (!confirm(`${symbol}をポートフォリオから削除しますか？`)) {
      return;
    }

    try {
      // 一時的にAPIコールをコメントアウト（APIが未実装のため）
      // const success = await removeFromPortfolio(symbol);
      // if (success) {
      //   await loadPortfolioData(); // データを再読み込み
      //   alert(`${symbol}をポートフォリオから削除しました。`);
      // } else {
      //   alert('削除に失敗しました。');
      // }
      alert('削除機能は現在開発中です。');
    } catch (error) {
      console.error('Error removing from portfolio:', error);
      alert('エラーが発生しました。');
    }
  };

  const handleStockClick = (symbol: string) => {
    navigate(`/stock/${symbol}`);
  };

  // ドーナツチャートの色配列
  const chartColors = ['#8b5cf6', '#3b82f6', '#10b981', '#f59e0b'];

  return (
    <div style={{ 
      maxWidth: '1200px', 
      margin: '0 auto', 
      padding: '2rem',
      fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif'
    }}>
      {/* ヘッダーセクション */}
      <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <h1 style={{ 
          fontSize: '2.5rem', 
          fontWeight: '700', 
          color: '#8b5cf6',
          margin: '0 0 0.5rem 0'
        }}>
          Portfolio Management
        </h1>
        <p style={{ 
          fontSize: '1.1rem', 
          color: '#6b7280',
          margin: '0 0 1rem 0'
        }}>
          Track your investments, analyze performance, and make informed decisions with comprehensive portfolio insights.
        </p>
        <div style={{ 
          fontSize: '0.9rem', 
          color: '#9ca3af',
          fontWeight: '500'
        }}>
          Last updated: {portfolioData.lastUpdated}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem' }}>
        {/* 左側のコンテンツ */}
        <div>
          {/* ポートフォリオ概要 */}
          <div style={{ marginBottom: '2rem' }}>
            <h2 style={{ 
              fontSize: '1.5rem', 
              fontWeight: '600', 
              color: '#1f2937',
              margin: '0 0 1.5rem 0'
            }}>
              Portfolio Overview
            </h2>
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(2, 1fr)', 
              gap: '1rem'
            }}>
              {/* 総ポートフォリオ価値 */}
              <div style={{
                background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
                borderRadius: '1rem',
                padding: '1.5rem',
                color: 'white',
                position: 'relative',
                overflow: 'hidden'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <div style={{ 
                      background: 'rgba(255,255,255,0.2)', 
                      padding: '0.25rem 0.75rem', 
                      borderRadius: '1rem',
                      fontSize: '0.75rem',
                      fontWeight: '600',
                      marginBottom: '0.5rem',
                      display: 'inline-block'
                    }}>
                      ${portfolioData.unrealizedPnL.toFixed(2)} gain
                    </div>
                    <div style={{ fontSize: '0.875rem', opacity: 0.9, marginBottom: '0.5rem' }}>
                      TOTAL PORTFOLIO VALUE
                    </div>
                    <div style={{ fontSize: '1.75rem', fontWeight: '700' }}>
                      ${portfolioData.totalValue.toLocaleString()}
                    </div>
                  </div>
                  <div style={{
                    width: '48px',
                    height: '48px',
                    background: 'rgba(255,255,255,0.2)',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1.5rem'
                  }}>
                    $
                  </div>
                </div>
              </div>

              {/* 平均リターン */}
              <div style={{
                background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                borderRadius: '1rem',
                padding: '1.5rem',
                color: 'white',
                position: 'relative'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <div style={{ 
                      background: 'rgba(255,255,255,0.2)', 
                      padding: '0.25rem 0.75rem', 
                      borderRadius: '1rem',
                      fontSize: '0.75rem',
                      fontWeight: '600',
                      marginBottom: '0.5rem',
                      display: 'inline-block'
                    }}>
                      Positive performance
                    </div>
                    <div style={{ fontSize: '0.875rem', opacity: 0.9, marginBottom: '0.5rem' }}>
                      AVERAGE RETURN
                    </div>
                    <div style={{ fontSize: '1.75rem', fontWeight: '700' }}>
                      +{portfolioData.averageReturn}%
                    </div>
                  </div>
                  <div style={{
                    width: '48px',
                    height: '48px',
                    background: 'rgba(255,255,255,0.2)',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1.5rem'
                  }}>
                    ↗
                  </div>
                </div>
              </div>

              {/* 年間配当 */}
              <div style={{
                background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
                borderRadius: '1rem',
                padding: '1.5rem',
                color: 'white',
                position: 'relative'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <div style={{ 
                      background: 'rgba(255,255,255,0.2)', 
                      padding: '0.25rem 0.75rem', 
                      borderRadius: '1rem',
                      fontSize: '0.75rem',
                      fontWeight: '600',
                      marginBottom: '0.5rem',
                      display: 'inline-block'
                    }}>
                      {portfolioData.dividendYield}% yield
                    </div>
                    <div style={{ fontSize: '0.875rem', opacity: 0.9, marginBottom: '0.5rem' }}>
                      ANNUAL DIVIDENDS
                    </div>
                    <div style={{ fontSize: '1.75rem', fontWeight: '700' }}>
                      ${portfolioData.annualDividends}
                    </div>
                  </div>
                  <div style={{
                    width: '48px',
                    height: '48px',
                    background: 'rgba(255,255,255,0.2)',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1.5rem'
                  }}>
                    ⏰
                  </div>
                </div>
              </div>

              {/* ポートフォリオリスク */}
              <div style={{
                background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                borderRadius: '1rem',
                padding: '1.5rem',
                color: 'white',
                position: 'relative'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <div style={{ 
                      background: 'rgba(255,255,255,0.2)', 
                      padding: '0.25rem 0.75rem', 
                      borderRadius: '1rem',
                      fontSize: '0.75rem',
                      fontWeight: '600',
                      marginBottom: '0.5rem',
                      display: 'inline-block'
                    }}>
                      Low risk
                    </div>
                    <div style={{ fontSize: '0.875rem', opacity: 0.9, marginBottom: '0.5rem' }}>
                      PORTFOLIO RISK
                    </div>
                    <div style={{ fontSize: '1.75rem', fontWeight: '700' }}>
                      {portfolioData.portfolioRisk}%
                    </div>
                  </div>
                  <div style={{
                    width: '48px',
                    height: '48px',
                    background: 'rgba(255,255,255,0.2)',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1.5rem'
                  }}>
                    ⚠
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* クイックインサイト */}
          <div style={{ marginBottom: '2rem' }}>
            <h3 style={{ 
              fontSize: '1.25rem', 
              fontWeight: '600', 
              color: '#1f2937',
              margin: '0 0 1rem 0'
            }}>
              Quick Insights
            </h3>
            <div style={{ 
              background: '#f9fafb', 
              borderRadius: '0.75rem', 
              padding: '1.5rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.75rem'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div style={{ 
                  width: '8px', 
                  height: '8px', 
                  borderRadius: '50%', 
                  background: '#3b82f6' 
                }}></div>
                <span style={{ color: '#374151', fontWeight: '500' }}>
                  Total Investment: ${portfolioData.totalInvestment.toLocaleString()}
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div style={{ 
                  width: '8px', 
                  height: '8px', 
                  borderRadius: '50%', 
                  background: '#10b981' 
                }}></div>
                <span style={{ color: '#374151', fontWeight: '500' }}>
                  Unrealized P&L: ${portfolioData.unrealizedPnL.toFixed(2)}
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div style={{ 
                  width: '8px', 
                  height: '8px', 
                  borderRadius: '50%', 
                  background: '#8b5cf6' 
                }}></div>
                <span style={{ color: '#374151', fontWeight: '500' }}>
                  Dividend Yield: {portfolioData.dividendYield}%
                </span>
              </div>
            </div>
          </div>

          {/* 株式保有 */}
          <div>
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              marginBottom: '1rem'
            }}>
              <h3 style={{ 
                fontSize: '1.25rem', 
                fontWeight: '600', 
                color: '#1f2937',
                margin: 0
              }}>
                Stock Holdings
              </h3>
              <button 
                onClick={handleAddStock}
                style={{
                  background: '#3b82f6',
                  color: 'white',
                  border: 'none',
                  borderRadius: '0.5rem',
                  padding: '0.5rem 1rem',
                  fontSize: '0.875rem',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'background 0.2s'
                }}
                onMouseOver={(e) => e.currentTarget.style.background = '#2563eb'}
                onMouseOut={(e) => e.currentTarget.style.background = '#3b82f6'}
              >
                + Add Stock
              </button>
            </div>
            
            <div style={{
              background: 'white',
              borderRadius: '0.75rem',
              overflow: 'hidden',
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
            }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ background: '#f8fafc' }}>
                    <th style={{ 
                      padding: '1rem', 
                      textAlign: 'left', 
                      fontWeight: '600', 
                      color: '#374151',
                      fontSize: '0.875rem'
                    }}>
                      Stock
                    </th>
                    <th style={{ 
                      padding: '1rem', 
                      textAlign: 'right', 
                      fontWeight: '600', 
                      color: '#374151',
                      fontSize: '0.875rem'
                    }}>
                      Shares
                    </th>
                    <th style={{ 
                      padding: '1rem', 
                      textAlign: 'right', 
                      fontWeight: '600', 
                      color: '#374151',
                      fontSize: '0.875rem'
                    }}>
                      Current Price
                    </th>
                    <th style={{ 
                      padding: '1rem', 
                      textAlign: 'right', 
                      fontWeight: '600', 
                      color: '#374151',
                      fontSize: '0.875rem'
                    }}>
                      Value
                    </th>
                    <th style={{ 
                      padding: '1rem', 
                      textAlign: 'right', 
                      fontWeight: '600', 
                      color: '#374151',
                      fontSize: '0.875rem'
                    }}>
                      Weight
                    </th>
                    <th style={{ 
                      padding: '1rem', 
                      textAlign: 'right', 
                      fontWeight: '600', 
                      color: '#374151',
                      fontSize: '0.875rem'
                    }}>
                      Return
                    </th>
                    <th style={{ 
                      padding: '1rem', 
                      textAlign: 'center', 
                      fontWeight: '600', 
                      color: '#374151',
                      fontSize: '0.875rem'
                    }}>
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {portfolioData.stocks.map((stock, index) => (
                    <tr key={stock.id} style={{ 
                      borderBottom: index < portfolioData.stocks.length - 1 ? '1px solid #e5e7eb' : 'none'
                    }}>
                      <td style={{ padding: '1rem' }}>
                        <div 
                          style={{ 
                            cursor: 'pointer',
                            transition: 'opacity 0.2s'
                          }}
                          onClick={() => handleStockClick(stock.symbol)}
                          onMouseOver={(e) => e.currentTarget.style.opacity = '0.7'}
                          onMouseOut={(e) => e.currentTarget.style.opacity = '1'}
                        >
                          <div style={{ fontWeight: '600', color: '#1f2937' }}>
                            {stock.symbol}
                          </div>
                          <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                            {stock.name}
                          </div>
                        </div>
                      </td>
                      <td style={{ padding: '1rem', textAlign: 'right', fontWeight: '500' }}>
                        {stock.shares}
                      </td>
                      <td style={{ padding: '1rem', textAlign: 'right', fontWeight: '500' }}>
                        ${stock.currentPrice}
                      </td>
                      <td style={{ padding: '1rem', textAlign: 'right', fontWeight: '600' }}>
                        ${stock.value.toLocaleString()}
                      </td>
                      <td style={{ padding: '1rem', textAlign: 'right', fontWeight: '500' }}>
                        {stock.weight}%
                      </td>
                      <td style={{ 
                        padding: '1rem', 
                        textAlign: 'right', 
                        fontWeight: '600',
                        color: stock.returnPercent >= 0 ? '#10b981' : '#ef4444'
                      }}>
                        +{stock.returnPercent}%
                      </td>
                      <td style={{ padding: '1rem', textAlign: 'center' }}>
                        <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center' }}>
                          <button
                            onClick={() => handleEditStock(stock.id)}
                            style={{
                              background: 'none',
                              border: 'none',
                              cursor: 'pointer',
                              padding: '0.25rem',
                              borderRadius: '0.25rem',
                              color: '#6b7280',
                              transition: 'background 0.2s'
                            }}
                            onMouseOver={(e) => e.currentTarget.style.background = '#f3f4f6'}
                            onMouseOut={(e) => e.currentTarget.style.background = 'none'}
                          >
                            ✏️
                          </button>
                          <button
                            onClick={() => handleDeleteStock(stock.id)}
                            style={{
                              background: 'none',
                              border: 'none',
                              cursor: 'pointer',
                              padding: '0.25rem',
                              borderRadius: '0.25rem',
                              color: '#6b7280',
                              transition: 'background 0.2s'
                            }}
                            onMouseOver={(e) => e.currentTarget.style.background = '#f3f4f6'}
                            onMouseOut={(e) => e.currentTarget.style.background = 'none'}
                          >
                            🗑️
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* 右側のポートフォリオ配分 */}
        <div>
          <div style={{ 
            background: 'white', 
            borderRadius: '1rem', 
            padding: '1.5rem',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
            height: 'fit-content'
          }}>
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              marginBottom: '1.5rem'
            }}>
              <h3 style={{ 
                fontSize: '1.25rem', 
                fontWeight: '600', 
                color: '#1f2937',
                margin: 0
              }}>
                Portfolio Allocation
              </h3>
              <span style={{ 
                fontSize: '0.875rem', 
                color: '#6b7280',
                fontWeight: '500'
              }}>
                Total: ${portfolioData.totalValue.toLocaleString()}
              </span>
            </div>

            {/* ドーナツチャート */}
            <div style={{ 
              position: 'relative', 
              width: '200px', 
              height: '200px', 
              margin: '0 auto 1.5rem auto'
            }}>
              <svg width="200" height="200" viewBox="0 0 200 200">
                <circle
                  cx="100"
                  cy="100"
                  r="80"
                  fill="none"
                  stroke="#e5e7eb"
                  strokeWidth="40"
                />
                {portfolioData.stocks.map((stock, index) => {
                  const totalWeight = portfolioData.stocks.reduce((sum, s) => sum + s.weight, 0);
                  const percentage = (stock.weight / totalWeight) * 100;
                  const circumference = 2 * Math.PI * 80;
                  const strokeDasharray = (percentage / 100) * circumference;
                  const strokeDashoffset = index === 0 ? 0 : 
                    portfolioData.stocks.slice(0, index).reduce((sum, s) => {
                      const p = (s.weight / totalWeight) * 100;
                      return sum + (p / 100) * circumference;
                    }, 0);
                  
                  return (
                    <circle
                      key={stock.id}
                      cx="100"
                      cy="100"
                      r="80"
                      fill="none"
                      stroke={chartColors[index % chartColors.length]}
                      strokeWidth="40"
                      strokeDasharray={strokeDasharray}
                      strokeDashoffset={strokeDashoffset}
                      transform="rotate(-90 100 100)"
                    />
                  );
                })}
              </svg>
            </div>

            {/* 凡例 */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {portfolioData.stocks.map((stock, index) => (
                <div 
                  key={stock.id} 
                  style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '0.75rem',
                    cursor: 'pointer',
                    transition: 'opacity 0.2s'
                  }}
                  onClick={() => handleStockClick(stock.symbol)}
                  onMouseOver={(e) => e.currentTarget.style.opacity = '0.7'}
                  onMouseOut={(e) => e.currentTarget.style.opacity = '1'}
                >
                  <div style={{ 
                    width: '12px', 
                    height: '12px', 
                    borderRadius: '50%', 
                    background: chartColors[index % chartColors.length] 
                  }}></div>
                  <span style={{ 
                    fontSize: '0.875rem', 
                    color: '#374151',
                    fontWeight: '500'
                  }}>
                    {stock.symbol} ({stock.weight}%)
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* フッター */}
      <div style={{ 
        textAlign: 'center', 
        marginTop: '3rem', 
        padding: '1rem',
        color: '#9ca3af',
        fontSize: '0.875rem'
      }}>
        Made with <span style={{ fontWeight: '600' }}>MagicPath</span>
      </div>
    </div>
  );
};

export default PortfolioPage; 