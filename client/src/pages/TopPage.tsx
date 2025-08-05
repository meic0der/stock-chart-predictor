import React, { useState, useEffect } from "react";
import { 
  fetchMultipleStockData, 
  fetchFilteredStockData, 
  fetchAvailableFilters,
  updateSelectedStocks,
  updateAllStocks,
  fetchLastUpdated,
  resetAndReloadStocks
} from "../services/yahooFinanceApi";
import FilterSidebar from "../components/FilterSidebar";
import FavoriteButton from "../components/FavoriteButton";
import AddToPortfolioModal from "../components/AddToPortfolioModal";
import "./TopPage.css";

interface StockItem {
  symbol: string;
  name: string;
  country: string;
  sector: string;
  price: string;
  pe: number;
  pb: number;
  dividendYield: number;
  lastUpdated?: string;
  annualReturn?: number;
  volatility?: number;
}

const TopPage: React.FC = () => {
  const [selectedCountry, setSelectedCountry] = useState("All Countries");
  const [selectedSector, setSelectedSector] = useState("All Sectors");
  const [searchName, setSearchName] = useState("");
  const [peRange, setPeRange] = useState({ min: -100, max: 1000 });
  const [pbRange, setPbRange] = useState({ min: -100, max: 300 });
  const [roeRange, setRoeRange] = useState({ min: -100, max: 100 });
  const [dividendRange, setDividendRange] = useState({ min: 0, max: 20 });
  const [stocks, setStocks] = useState<StockItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [availableSectors, setAvailableSectors] = useState<string[]>([]);
  const [availableCountries, setAvailableCountries] = useState<string[]>([]);
  const [selectedStocks, setSelectedStocks] = useState<Set<string>>(new Set());
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);
  const [updating, setUpdating] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [portfolioModalOpen, setPortfolioModalOpen] = useState(false);
  const [selectedStockForPortfolio, setSelectedStockForPortfolio] = useState<StockItem | null>(null);

  // サイドバートグル機能
  const handleSidebarToggle = () => {
    setSidebarOpen(!sidebarOpen);
  };

  // App.tsxのグローバルヘッダーのサイドバートグルボタンとの連携
  useEffect(() => {
    const handleGlobalToggle = () => {
      setSidebarOpen(!sidebarOpen);
    };
    
    // カスタムイベントをリッスン
    window.addEventListener('toggleSidebar', handleGlobalToggle);
    
    return () => {
      window.removeEventListener('toggleSidebar', handleGlobalToggle);
    };
  }, [sidebarOpen]);

  // 初期データの読み込み
  useEffect(() => {
    loadStockData();
  }, []);

  // フィルター条件が変更されたときにデータを再取得
  useEffect(() => {
    // 初期化後かつフィルター条件が変更された場合のみフィルタリングを実行
    if (isInitialized) {
      loadFilteredData();
    }
  }, [selectedCountry, selectedSector, searchName, peRange, pbRange, dividendRange]);

  const handleSelectAll = () => {
    if (selectedStocks.size === stocks.length) {
      setSelectedStocks(new Set());
    } else {
      setSelectedStocks(new Set(stocks.map(stock => stock.symbol)));
    }
  };

  const handleSelectStock = (symbol: string) => {
    const newSelected = new Set(selectedStocks);
    if (newSelected.has(symbol)) {
      newSelected.delete(symbol);
    } else {
      newSelected.add(symbol);
    }
    setSelectedStocks(newSelected);
  };

  const handleUpdateSelected = async () => {
    if (selectedStocks.size === 0) {
      alert('更新する銘柄を選択してください。');
      return;
    }

    try {
      setUpdating(true);
      const symbols = Array.from(selectedStocks);
      const updatedStocks = await updateSelectedStocks(symbols);
      
      if (updatedStocks.length > 0) {
        // 更新されたデータでstocksを更新
        const updatedStocksMap = new Map(updatedStocks.map((stock: StockItem) => [stock.symbol, stock]));
        const newStocks = stocks.map(stock => 
          updatedStocksMap.has(stock.symbol) ? updatedStocksMap.get(stock.symbol)! : stock
        );
        setStocks(newStocks);
        
        // 最終更新日時を更新
        const lastUpdatedTime = await fetchLastUpdated();
        setLastUpdated(lastUpdatedTime);
        
        alert(`${updatedStocks.length}銘柄を更新しました。`);
      }
    } catch (err) {
      setError('選択した銘柄の更新に失敗しました。');
      console.error('Error updating selected stocks:', err);
    } finally {
      setUpdating(false);
    }
  };

  const handleUpdateAll = async () => {
    try {
      setUpdating(true);
      const updatedStocks = await updateAllStocks();
      
      if (updatedStocks.length > 0) {
        setStocks(updatedStocks);
        
        // 最終更新日時を更新
        const lastUpdatedTime = await fetchLastUpdated();
        setLastUpdated(lastUpdatedTime);
        
        alert(`${updatedStocks.length}銘柄を更新しました。`);
      }
    } catch (err) {
      setError('全銘柄の更新に失敗しました。');
      console.error('Error updating all stocks:', err);
    } finally {
      setUpdating(false);
    }
  };

  const handleResetAndReload = async () => {
    if (!confirm('データベースをリセットして正しいセクター情報で再取得しますか？この操作には時間がかかります。')) {
      return;
    }

    try {
      setUpdating(true);
      const updatedStocks = await resetAndReloadStocks();
      
      if (updatedStocks.length > 0) {
        setStocks(updatedStocks);
        
        // 最終更新日時を更新
        const lastUpdatedTime = await fetchLastUpdated();
        setLastUpdated(lastUpdatedTime);
        
        // フィルターオプションも更新
        const filters = await fetchAvailableFilters();
        setAvailableSectors(filters.sectors);
        setAvailableCountries(filters.countries);
        
        alert(`データベースをリセットして${updatedStocks.length}銘柄を正しいセクター情報で再取得しました。`);
      }
    } catch (err) {
      setError('データベースのリセットと再取得に失敗しました。');
      console.error('Error resetting and reloading stocks:', err);
    } finally {
      setUpdating(false);
    }
  };

  const loadStockData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // 並行してデータとフィルターオプションを取得
      const [data, filters] = await Promise.all([
        fetchMultipleStockData(),
        fetchAvailableFilters()
      ]);
      
      setStocks(data);
      setAvailableSectors(filters.sectors);
      setAvailableCountries(filters.countries);
      setIsInitialized(true);
    } catch (err) {
      setError('データの読み込みに失敗しました。');
      console.error('Error loading stock data:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadFilteredData = async () => {
    try {
      setLoading(true);
      
      // "All Countries"や"All Sectors"の場合はundefinedを送信
      const countryFilter = selectedCountry === 'All Countries' ? undefined : selectedCountry;
      const sectorFilter = selectedSector === 'All Sectors' ? undefined : selectedSector;
      const nameFilter = searchName.trim() === '' ? undefined : searchName.trim();
      
      const filteredData = await fetchFilteredStockData(
        countryFilter,
        sectorFilter,
        nameFilter,
        peRange,
        pbRange,
        dividendRange
      );
      setStocks(filteredData);
    } catch (err) {
      setError('フィルター適用中にエラーが発生しました。');
      console.error('Error applying filters:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = () => {
    loadStockData();
  };

  const handleAddToPortfolio = (stock: StockItem) => {
    setSelectedStockForPortfolio(stock);
    setPortfolioModalOpen(true);
  };

  const handlePortfolioSuccess = () => {
    // ポートフォリオ追加成功時の処理
    console.log('Portfolio updated successfully');
  };

  return (
    <div className="top-page-container">
      {/* オーバーレイ */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="sidebar-overlay"
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            zIndex: 997,
            display: 'block'
          }}
        />
      )}

      <div className="content-wrapper" style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '0 2rem'
      }}>
        {/* 左サイドバー - フィルター条件 */}
        <FilterSidebar
          searchName={searchName}
          setSearchName={setSearchName}
          selectedCountry={selectedCountry}
          setSelectedCountry={setSelectedCountry}
          selectedSector={selectedSector}
          setSelectedSector={setSelectedSector}
          peRange={peRange}
          setPeRange={setPeRange}
          pbRange={pbRange}
          setPbRange={setPbRange}
          roeRange={roeRange}
          setRoeRange={setRoeRange}
          dividendRange={dividendRange}
          setDividendRange={setDividendRange}
          availableSectors={availableSectors}
          availableCountries={availableCountries}
          isOpen={sidebarOpen}
        />

        {/* 右メインエリア - 検索結果 */}
        <div className="main-content">
          <div style={{ 
            backgroundColor: '#fff',
            borderRadius: '12px',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
            overflow: 'hidden',
            marginTop: '2rem'
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
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <button
                  onClick={handleRefresh}
                  disabled={loading}
                  style={{
                    padding: '0.5rem 1rem',
                    backgroundColor: '#8b5cf6',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: loading ? 'not-allowed' : 'pointer',
                    opacity: loading ? 0.6 : 1
                  }}
                >
                  {loading ? '読み込み中...' : '🔄 再読み込み'}
                </button>
                <button
                  onClick={handleUpdateSelected}
                  disabled={updating || selectedStocks.size === 0}
                  style={{
                    padding: '0.5rem 1rem',
                    backgroundColor: selectedStocks.size > 0 ? '#10b981' : '#9ca3af',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: (updating || selectedStocks.size === 0) ? 'not-allowed' : 'pointer',
                    opacity: (updating || selectedStocks.size === 0) ? 0.6 : 1
                  }}
                >
                  {updating ? '更新中...' : `📈 選択更新 (${selectedStocks.size})`}
                </button>
                <button
                  onClick={handleUpdateAll}
                  disabled={updating}
                  style={{
                    padding: '0.5rem 1rem',
                    backgroundColor: '#f59e0b',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: updating ? 'not-allowed' : 'pointer',
                    opacity: updating ? 0.6 : 1
                  }}
                >
                  {updating ? '更新中...' : '🚀 全更新'}
                </button>
                <button
                  onClick={handleResetAndReload}
                  disabled={updating}
                  style={{
                    padding: '0.5rem 1rem',
                    backgroundColor: '#ef4444',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: updating ? 'not-allowed' : 'pointer',
                    opacity: updating ? 0.6 : 1
                  }}
                >
                  {updating ? 'リセット中...' : '🔄 セクター修正'}
                </button>
                <span style={{
                  backgroundColor: '#f3f4f6',
                  color: '#6b7280',
                  padding: '0.25rem 0.75rem',
                  borderRadius: '20px',
                  fontSize: '14px',
                  fontWeight: '500'
                }}>
                  {stocks.length} stocks found
                </span>
                {lastUpdated && (
                  <span style={{
                    backgroundColor: '#e0f2fe',
                    color: '#0369a1',
                    padding: '0.25rem 0.75rem',
                    borderRadius: '20px',
                    fontSize: '12px',
                    fontWeight: '500'
                  }}>
                    最終更新: {new Date(lastUpdated).toLocaleString('ja-JP')}
                  </span>
                )}
              </div>
            </div>

            <div style={{ overflow: 'auto' }}>
              {loading && (
                <div style={{
                  padding: '2rem',
                  textAlign: 'center',
                  color: '#6b7280'
                }}>
                  <div style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>⏳</div>
                  <div>データを読み込み中...</div>
                </div>
              )}
              
              {error && (
                <div style={{
                  padding: '2rem',
                  textAlign: 'center',
                  color: '#ef4444'
                }}>
                  <div style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>❌</div>
                  <div>{error}</div>
                  <button
                    onClick={handleRefresh}
                    style={{
                      marginTop: '1rem',
                      padding: '0.5rem 1rem',
                      backgroundColor: '#8b5cf6',
                      color: 'white',
                      border: 'none',
                      borderRadius: '6px',
                      cursor: 'pointer'
                    }}
                  >
                    再試行
                  </button>
                </div>
              )}
              
              {!loading && !error && stocks.length === 0 && (
                <div style={{
                  padding: '2rem',
                  textAlign: 'center',
                  color: '#6b7280'
                }}>
                  <div style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>🔍</div>
                  <div>条件に一致する株価が見つかりませんでした。</div>
                </div>
              )}
              
              {!loading && !error && stocks.length > 0 && (
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
                        textAlign: 'center', 
                        fontWeight: 'bold',
                        color: '#374151',
                        width: '50px'
                      }}>
                        <input
                          type="checkbox"
                          checked={selectedStocks.size === stocks.length}
                          onChange={handleSelectAll}
                          style={{
                            width: '16px',
                            height: '16px',
                            cursor: 'pointer'
                          }}
                        />
                      </th>
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
                      <th style={{ 
                        padding: '1rem', 
                        textAlign: 'left', 
                        fontWeight: 'bold',
                        color: '#374151'
                      }}>Annual Return</th>
                      <th style={{ 
                        padding: '1rem', 
                        textAlign: 'left', 
                        fontWeight: 'bold',
                        color: '#374151'
                      }}>Risk</th>
                      <th style={{ 
                        padding: '1rem', 
                        textAlign: 'left', 
                        fontWeight: 'bold',
                        color: '#374151'
                      }}>Updated</th>
                      <th style={{ 
                        padding: '1rem', 
                        textAlign: 'center', 
                        fontWeight: 'bold',
                        color: '#374151'
                      }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {stocks.map((stock: StockItem, index: number) => (
                      <tr key={index} style={{ 
                        borderBottom: '1px solid #f3f4f6'
                      }}>
                        <td style={{ padding: '1rem', textAlign: 'center' }}>
                          <input
                            type="checkbox"
                            checked={selectedStocks.has(stock.symbol)}
                            onChange={() => handleSelectStock(stock.symbol)}
                            style={{
                              width: '16px',
                              height: '16px',
                              cursor: 'pointer'
                            }}
                          />
                        </td>
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
                        <td style={{ padding: '1rem', color: '#374151' }}>{stock.pe || '-'}</td>
                        <td style={{ padding: '1rem', color: '#374151' }}>{stock.pb || '-'}</td>
                        <td style={{ padding: '1rem', color: '#374151' }}>{stock.dividendYield ? `${stock.dividendYield}%` : '-'}</td>
                        <td style={{ padding: '1rem', color: '#374151' }}>
                          {stock.annualReturn !== null && stock.annualReturn !== undefined && typeof stock.annualReturn === 'number' ? (
                            <span style={{
                              color: stock.annualReturn >= 0 ? '#10b981' : '#ef4444',
                              fontWeight: 'bold'
                            }}>
                              {stock.annualReturn >= 0 ? '+' : ''}{stock.annualReturn.toFixed(2)}%
                            </span>
                          ) : (
                            <span style={{
                              fontSize: '12px',
                              color: '#9ca3af',
                              fontStyle: 'italic'
                            }}>
                              計算中...
                            </span>
                          )}
                        </td>
                        <td style={{ padding: '1rem', color: '#374151' }}>
                          {stock.volatility !== null && stock.volatility !== undefined && typeof stock.volatility === 'number' ? (
                            <span style={{
                              color: stock.volatility < 20 ? '#10b981' : stock.volatility < 40 ? '#f59e0b' : '#ef4444',
                              fontWeight: 'bold'
                            }}>
                              {stock.volatility.toFixed(2)}%
                            </span>
                          ) : (
                            <span style={{
                              fontSize: '12px',
                              color: '#9ca3af',
                              fontStyle: 'italic'
                            }}>
                              計算中...
                            </span>
                          )}
                        </td>
                        <td style={{ padding: '1rem', color: '#374151' }}>
                          {stock.lastUpdated ? (
                            <span style={{
                              fontSize: '12px',
                              color: '#6b7280'
                            }}>
                              {new Date(stock.lastUpdated).toLocaleString('ja-JP', {
                                year: 'numeric',
                                month: '2-digit',
                                day: '2-digit',
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </span>
                          ) : (
                            <span style={{
                              fontSize: '12px',
                              color: '#9ca3af',
                              fontStyle: 'italic'
                            }}>
                              未更新
                            </span>
                          )}
                        </td>
                        <td style={{ padding: '1rem', textAlign: 'center' }}>
                          <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center' }}>
                            <FavoriteButton 
                              symbol={stock.symbol}
                              onFavoriteChange={(isFavorite) => {
                                console.log(`${stock.symbol} ${isFavorite ? 'added to' : 'removed from'} favorites`);
                              }}
                            />
                            <button
                              onClick={() => handleAddToPortfolio(stock)}
                              style={{
                                background: 'none',
                                border: 'none',
                                cursor: 'pointer',
                                padding: '0.5rem',
                                borderRadius: '0.25rem',
                                transition: 'all 0.2s',
                                fontSize: '1.2rem',
                                color: '#3b82f6'
                              }}
                              title="ポートフォリオに追加"
                            >
                              📊
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ポートフォリオ追加モーダル */}
      {selectedStockForPortfolio && (
        <AddToPortfolioModal
          isOpen={portfolioModalOpen}
          onClose={() => {
            setPortfolioModalOpen(false);
            setSelectedStockForPortfolio(null);
          }}
          stock={selectedStockForPortfolio}
          onSuccess={handlePortfolioSuccess}
        />
      )}
    </div>
  );
};

export default TopPage; 