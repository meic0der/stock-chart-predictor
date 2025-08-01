import React, { useState } from "react";

interface StockItem {
  symbol: string;
  name: string;
  country: string;
  sector: string;
  price: string;
  pe: number;
  pb: number;
  dividendYield: number;
}

const TopPage: React.FC = () => {
  const [selectedCountry, setSelectedCountry] = useState("All Countries");
  const [selectedSector, setSelectedSector] = useState("All Sectors");
  const [peRange, setPeRange] = useState({ min: 0, max: 100 });
  const [pbRange, setPbRange] = useState({ min: 0, max: 10 });
  const [roeRange, setRoeRange] = useState({ min: 0, max: 50 });
  const [dividendRange, setDividendRange] = useState({ min: 0, max: 10 });

  // サンプルデータ
  const sampleStocks: StockItem[] = [
    {
      symbol: "AAPL",
      name: "Apple Inc.",
      country: "US",
      sector: "Technology",
      price: "$175.43",
      pe: 28.5,
      pb: 5.2,
      dividendYield: 0.5
    },
    {
      symbol: "7203",
      name: "Toyota Motor Corp",
      country: "Japan",
      sector: "Automotive",
      price: "¥2,450",
      pe: 12.3,
      pb: 1.1,
      dividendYield: 2.8
    },
    {
      symbol: "MSFT",
      name: "Microsoft Corporation",
      country: "US",
      sector: "Technology",
      price: "$378.85",
      pe: 32.1,
      pb: 4.8,
      dividendYield: 0.7
    }
  ];

  const filteredStocks = sampleStocks.filter(stock => {
    if (selectedCountry !== "All Countries" && stock.country !== selectedCountry) return false;
    if (selectedSector !== "All Sectors" && stock.sector !== selectedSector) return false;
    if (stock.pe < peRange.min || stock.pe > peRange.max) return false;
    if (stock.pb < pbRange.min || stock.pb > pbRange.max) return false;
    if (stock.dividendYield < dividendRange.min || stock.dividendYield > dividendRange.max) return false;
    return true;
  });

  return (
    <div style={{ 
      maxWidth: '1400px', 
      margin: '2rem auto', 
      padding: '0 2rem',
      display: 'flex',
      gap: '2rem'
    }}>
      {/* 左サイドバー - フィルター条件 */}
      <div style={{ 
        width: '350px',
        backgroundColor: '#fff',
        borderRadius: '12px',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        overflow: 'hidden'
      }}>
        {/* フィルター条件ヘッダー */}
        <div style={{
          backgroundColor: '#8b5cf6',
          color: 'white',
          padding: '1rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem'
        }}>
          <span style={{ fontSize: '18px' }}>🔍</span>
          <span style={{ fontWeight: 'bold' }}>Filter Criteria</span>
        </div>

        <div style={{ padding: '1.5rem' }}>
          {/* 国フィルター */}
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ 
              display: 'block', 
              marginBottom: '0.5rem', 
              fontWeight: 'bold',
              color: '#374151'
            }}>
              Country
            </label>
            <select 
              value={selectedCountry}
              onChange={(e) => setSelectedCountry(e.target.value)}
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '1px solid #d1d5db',
                borderRadius: '8px',
                fontSize: '14px'
              }}
            >
              <option>All Countries</option>
              <option>US</option>
              <option>Japan</option>
            </select>
          </div>

          {/* セクターフィルター */}
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ 
              display: 'block', 
              marginBottom: '0.5rem', 
              fontWeight: 'bold',
              color: '#374151'
            }}>
              Sector
            </label>
            <select 
              value={selectedSector}
              onChange={(e) => setSelectedSector(e.target.value)}
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '1px solid #d1d5db',
                borderRadius: '8px',
                fontSize: '14px'
              }}
            >
              <option>All Sectors</option>
              <option>Technology</option>
              <option>Automotive</option>
            </select>
          </div>

          {/* 財務比率セクション */}
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ 
              display: 'block', 
              marginBottom: '1rem', 
              fontWeight: 'bold',
              color: '#374151'
            }}>
              Financial Ratios
            </label>

            {/* P/E Ratio */}
            <div style={{ marginBottom: '1rem' }}>
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                marginBottom: '0.5rem' 
              }}>
                <span style={{ fontSize: '14px', fontWeight: 'bold' }}>P/E Ratio</span>
              </div>
              <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.25rem' }}>
                <input
                  type="number"
                  value={peRange.min}
                  onChange={(e) => setPeRange(prev => ({ ...prev, min: Number(e.target.value) }))}
                  style={{
                    width: '50%',
                    padding: '0.5rem',
                    border: '1px solid #d1d5db',
                    borderRadius: '6px',
                    fontSize: '14px'
                  }}
                  placeholder="Min"
                />
                <input
                  type="number"
                  value={peRange.max}
                  onChange={(e) => setPeRange(prev => ({ ...prev, max: Number(e.target.value) }))}
                  style={{
                    width: '50%',
                    padding: '0.5rem',
                    border: '1px solid #d1d5db',
                    borderRadius: '6px',
                    fontSize: '14px'
                  }}
                  placeholder="Max"
                />
              </div>
              <div style={{ fontSize: '12px', color: '#6b7280' }}>Range: 0 - 100</div>
            </div>

            {/* P/B Ratio */}
            <div style={{ marginBottom: '1rem' }}>
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                marginBottom: '0.5rem' 
              }}>
                <span style={{ fontSize: '14px', fontWeight: 'bold' }}>P/B Ratio</span>
              </div>
              <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.25rem' }}>
                <input
                  type="number"
                  value={pbRange.min}
                  onChange={(e) => setPbRange(prev => ({ ...prev, min: Number(e.target.value) }))}
                  style={{
                    width: '50%',
                    padding: '0.5rem',
                    border: '1px solid #d1d5db',
                    borderRadius: '6px',
                    fontSize: '14px'
                  }}
                  placeholder="Min"
                />
                <input
                  type="number"
                  value={pbRange.max}
                  onChange={(e) => setPbRange(prev => ({ ...prev, max: Number(e.target.value) }))}
                  style={{
                    width: '50%',
                    padding: '0.5rem',
                    border: '1px solid #d1d5db',
                    borderRadius: '6px',
                    fontSize: '14px'
                  }}
                  placeholder="Max"
                />
              </div>
              <div style={{ fontSize: '12px', color: '#6b7280' }}>Range: 0 - 10</div>
            </div>

            {/* ROE */}
            <div style={{ marginBottom: '1rem' }}>
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                marginBottom: '0.5rem' 
              }}>
                <span style={{ fontSize: '14px', fontWeight: 'bold' }}>ROE (Return on Equity)</span>
              </div>
              <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.25rem' }}>
                <input
                  type="number"
                  value={roeRange.min}
                  onChange={(e) => setRoeRange(prev => ({ ...prev, min: Number(e.target.value) }))}
                  style={{
                    width: '50%',
                    padding: '0.5rem',
                    border: '1px solid #d1d5db',
                    borderRadius: '6px',
                    fontSize: '14px'
                  }}
                  placeholder="Min"
                />
                <input
                  type="number"
                  value={roeRange.max}
                  onChange={(e) => setRoeRange(prev => ({ ...prev, max: Number(e.target.value) }))}
                  style={{
                    width: '50%',
                    padding: '0.5rem',
                    border: '1px solid #d1d5db',
                    borderRadius: '6px',
                    fontSize: '14px'
                  }}
                  placeholder="Max"
                />
              </div>
              <div style={{ fontSize: '12px', color: '#6b7280' }}>Range: 0% - 50%</div>
            </div>

            {/* Dividend Yield */}
            <div style={{ marginBottom: '1rem' }}>
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                marginBottom: '0.5rem' 
              }}>
                <span style={{ fontSize: '14px', fontWeight: 'bold' }}>Dividend Yield</span>
              </div>
              <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.25rem' }}>
                <input
                  type="number"
                  value={dividendRange.min}
                  onChange={(e) => setDividendRange(prev => ({ ...prev, min: Number(e.target.value) }))}
                  style={{
                    width: '50%',
                    padding: '0.5rem',
                    border: '1px solid #d1d5db',
                    borderRadius: '6px',
                    fontSize: '14px'
                  }}
                  placeholder="Min"
                />
                <input
                  type="number"
                  value={dividendRange.max}
                  onChange={(e) => setDividendRange(prev => ({ ...prev, max: Number(e.target.value) }))}
                  style={{
                    width: '50%',
                    padding: '0.5rem',
                    border: '1px solid #d1d5db',
                    borderRadius: '6px',
                    fontSize: '14px'
                  }}
                  placeholder="Max"
                />
              </div>
              <div style={{ fontSize: '12px', color: '#6b7280' }}>Range: 0% - 10%</div>
            </div>
          </div>
        </div>
      </div>

      {/* 右メインエリア - 検索結果 */}
      <div style={{ flex: 1 }}>
        <div style={{ 
          backgroundColor: '#fff',
          borderRadius: '12px',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
          overflow: 'hidden'
        }}>
          <div style={{
            padding: '1.5rem',
            borderBottom: '1px solid #e5e7eb',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <h2 style={{ 
              margin: 0, 
              fontSize: '1.25rem', 
              fontWeight: 'bold',
              color: '#1f2937'
            }}>
              Search Results
            </h2>
            <span style={{
              backgroundColor: '#f3f4f6',
              color: '#6b7280',
              padding: '0.25rem 0.75rem',
              borderRadius: '20px',
              fontSize: '14px',
              fontWeight: '500'
            }}>
              {filteredStocks.length} stocks found
            </span>
          </div>

          <div style={{ overflow: 'auto' }}>
            <table style={{ 
              width: '100%', 
              borderCollapse: 'collapse',
              fontSize: '14px'
            }}>
              <thead>
                <tr style={{ 
                  backgroundColor: '#f9fafb',
                  borderBottom: '1px solid #e5e7eb'
                }}>
                  <th style={{ 
                    padding: '1rem', 
                    textAlign: 'left', 
                    fontWeight: 'bold',
                    color: '#374151'
                  }}>Stock</th>
                  <th style={{ 
                    padding: '1rem', 
                    textAlign: 'left', 
                    fontWeight: 'bold',
                    color: '#374151'
                  }}>Country</th>
                  <th style={{ 
                    padding: '1rem', 
                    textAlign: 'left', 
                    fontWeight: 'bold',
                    color: '#374151'
                  }}>Sector</th>
                  <th style={{ 
                    padding: '1rem', 
                    textAlign: 'left', 
                    fontWeight: 'bold',
                    color: '#374151'
                  }}>Price</th>
                  <th style={{ 
                    padding: '1rem', 
                    textAlign: 'left', 
                    fontWeight: 'bold',
                    color: '#374151'
                  }}>P/E</th>
                  <th style={{ 
                    padding: '1rem', 
                    textAlign: 'left', 
                    fontWeight: 'bold',
                    color: '#374151'
                  }}>P/B</th>
                  <th style={{ 
                    padding: '1rem', 
                    textAlign: 'left', 
                    fontWeight: 'bold',
                    color: '#374151'
                  }}>Div Yield</th>
                </tr>
              </thead>
              <tbody>
                {filteredStocks.map((stock, index) => (
                  <tr key={index} style={{ 
                    borderBottom: '1px solid #f3f4f6'
                  }}>
                    <td style={{ padding: '1rem' }}>
                      <div>
                        <div style={{ fontWeight: 'bold', color: '#1f2937' }}>{stock.symbol}</div>
                        <div style={{ fontSize: '12px', color: '#6b7280' }}>{stock.name}</div>
                      </div>
                    </td>
                    <td style={{ padding: '1rem' }}>
                      <span style={{
                        backgroundColor: '#3b82f6',
                        color: 'white',
                        padding: '0.25rem 0.5rem',
                        borderRadius: '12px',
                        fontSize: '12px',
                        fontWeight: '500'
                      }}>
                        {stock.country}
                      </span>
                    </td>
                    <td style={{ padding: '1rem', color: '#374151' }}>{stock.sector}</td>
                    <td style={{ padding: '1rem' }}>
                      <span style={{ fontWeight: 'bold', color: '#1f2937' }}>{stock.price}</span>
                    </td>
                    <td style={{ padding: '1rem', color: '#374151' }}>{stock.pe}</td>
                    <td style={{ padding: '1rem', color: '#374151' }}>{stock.pb}</td>
                    <td style={{ padding: '1rem', color: '#374151' }}>{stock.dividendYield}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopPage; 