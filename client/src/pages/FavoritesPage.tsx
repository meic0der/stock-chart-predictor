import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchFavorites, removeFromFavorites, updateAllFavorites } from '../services/favoriteApi';
import { addFavoriteToPortfolio } from '../services/favoriteApi';
import type { FavoriteStock } from '../types';
import AddToPortfolioModal from '../components/AddToPortfolioModal';

const FavoritesPage: React.FC = () => {
  const navigate = useNavigate();
  const [favorites, setFavorites] = useState<FavoriteStock[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [portfolioModalOpen, setPortfolioModalOpen] = useState(false);
  const [selectedStockForPortfolio, setSelectedStockForPortfolio] = useState<FavoriteStock | null>(null);
  const [updating, setUpdating] = useState(false);
  const [updateStatus, setUpdateStatus] = useState<{
    type: 'success' | 'error' | null;
    message: string;
    details?: string[];
  } | null>(null);

  useEffect(() => {
    loadFavorites();
  }, []);

  const loadFavorites = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchFavorites();
      setFavorites(data);
    } catch (err) {
      setError('お気に入りの読み込みに失敗しました。');
      console.error('Error loading favorites:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateAll = async () => {
    if (favorites.length === 0) {
      alert('更新するお気に入りがありません。');
      return;
    }

    if (!confirm(`${favorites.length}件のお気に入り銘柄の最新情報を更新しますか？\nこの処理には時間がかかる場合があります。`)) {
      return;
    }

    try {
      setUpdating(true);
      setUpdateStatus(null);
      
      const result = await updateAllFavorites();
      
      if (result.success) {
        setUpdateStatus({
          type: 'success',
          message: result.message,
          details: result.errors
        });
        
        // 更新後に最新データを再取得
        await loadFavorites();
      } else {
        setUpdateStatus({
          type: 'error',
          message: result.message,
          details: result.errors
        });
      }
    } catch (error) {
      console.error('Error updating favorites:', error);
      setUpdateStatus({
        type: 'error',
        message: '更新処理中にエラーが発生しました。'
      });
    } finally {
      setUpdating(false);
    }
  };

  const handleRemoveFavorite = async (symbol: string) => {
    if (!confirm(`${symbol}をお気に入りから削除しますか？`)) {
      return;
    }

    try {
      const success = await removeFromFavorites(symbol);
      if (success) {
        setFavorites(prev => prev.filter(fav => fav.symbol !== symbol));
        alert(`${symbol}をお気に入りから削除しました。`);
      } else {
        alert('削除に失敗しました。');
      }
    } catch (error) {
      console.error('Error removing favorite:', error);
      alert('エラーが発生しました。');
    }
  };

  const handleAddToPortfolio = (stock: FavoriteStock) => {
    setSelectedStockForPortfolio(stock);
    setPortfolioModalOpen(true);
  };

  const handlePortfolioSuccess = () => {
    console.log('Portfolio updated successfully');
  };

  const handleStockClick = (symbol: string) => {
    navigate(`/stock/${symbol}`);
  };

  const getRiskClass = (volatility: number | null) => {
    if (volatility === null || volatility === undefined) return 'favorites-calculating';
    if (volatility < 20) return 'favorites-risk-low';
    if (volatility < 40) return 'favorites-risk-medium';
    return 'favorites-risk-high';
  };

  const getReturnClass = (annualReturn: number | null) => {
    if (annualReturn === null || annualReturn === undefined) return 'favorites-calculating';
    return annualReturn >= 0 ? 'favorites-return-positive' : 'favorites-return-negative';
  };

  return (
    <div className="favorites-page">
      {/* ヘッダーセクション */}
      <div className="favorites-header">
        <h1 className="favorites-title">My Favorites</h1>
        <p className="favorites-subtitle">
          お気に入りに登録した銘柄を管理し、ポートフォリオに追加できます。
        </p>
        <div className="favorites-count">
          {favorites.length} 銘柄が登録されています
        </div>
      </div>

      {/* 更新ボタンとステータス */}
      {!loading && !error && favorites.length > 0 && (
        <>
          <button
            onClick={handleUpdateAll}
            disabled={updating}
            className={`favorites-update-button ${updating ? 'updating' : ''}`}
          >
            {updating ? '更新中...' : '全更新'}
          </button>
          
          {updateStatus && (
            <div className={`favorites-update-status favorites-update-${updateStatus.type}`}>
              <div>{updateStatus.message}</div>
              {updateStatus.details && updateStatus.details.length > 0 && (
                <details style={{ marginTop: '0.5rem' }}>
                  <summary style={{ cursor: 'pointer', fontSize: '0.8rem' }}>
                    エラー詳細を表示
                  </summary>
                  <ul style={{ margin: '0.5rem 0 0 0', paddingLeft: '1rem', fontSize: '0.8rem' }}>
                    {updateStatus.details.map((error, index) => (
                      <li key={index}>{error}</li>
                    ))}
                  </ul>
                </details>
              )}
            </div>
          )}
        </>
      )}

      {/* メインコンテンツ */}
      <div className="favorites-container">
        {loading && (
          <div className="favorites-loading">
            <div className="favorites-loading-icon">⏳</div>
            <div>お気に入りを読み込み中...</div>
          </div>
        )}
        
        {error && (
          <div className="favorites-error">
            <div className="favorites-error-icon">❌</div>
            <div>{error}</div>
            <button
              onClick={loadFavorites}
              className="retry-button"
            >
              再試行
            </button>
          </div>
        )}
        
        {!loading && !error && favorites.length === 0 && (
          <div className="favorites-empty">
            <div className="favorites-empty-icon">🤍</div>
            <div className="favorites-empty-title">
              お気に入りがありません
            </div>
            <div className="favorites-empty-subtitle">
              銘柄検索ページでお気に入りに登録してください。
            </div>
            <button
              onClick={() => navigate('/')}
              className="search-button"
            >
              銘柄検索へ
            </button>
          </div>
        )}
        
        {!loading && !error && favorites.length > 0 && (
          <table className="favorites-table">
            <thead>
              <tr className="favorites-table-header">
                <th className="favorites-table-header-cell">Stock</th>
                <th className="favorites-table-header-cell">Country</th>
                <th className="favorites-table-header-cell">Sector</th>
                <th className="favorites-table-header-cell">Price</th>
                <th className="favorites-table-header-cell">P/E</th>
                <th className="favorites-table-header-cell">P/B</th>
                <th className="favorites-table-header-cell">Dividend</th>
                <th className="favorites-table-header-cell">Div Yield</th>
                <th className="favorites-table-header-cell">Annual Return</th>
                <th className="favorites-table-header-cell">Risk</th>
                <th className="favorites-table-header-cell">Updated</th>
                <th className="favorites-table-header-actions">Actions</th>
              </tr>
            </thead>
            <tbody>
              {favorites.map((stock, index) => (
                <tr key={stock.id} className="favorites-table-row">
                  <td className="favorites-table-cell">
                    <div 
                      className="favorites-stock-cell"
                      onClick={() => handleStockClick(stock.symbol)}
                    >
                      <div className="favorites-stock-symbol">{stock.symbol}</div>
                      <div className="favorites-stock-name">{stock.name}</div>
                    </div>
                  </td>
                  <td className="favorites-table-cell">
                    <span className="favorites-country-badge">
                      {stock.country}
                    </span>
                  </td>
                  <td className="favorites-table-cell">{stock.sector}</td>
                  <td className="favorites-table-cell">
                    <span className="favorites-price">{stock.price}</span>
                  </td>
                  <td className="favorites-table-cell">{stock.pe || '-'}</td>
                  <td className="favorites-table-cell">{stock.pb || '-'}</td>
                  <td className="favorites-table-cell">
                    {stock.dividend !== null && stock.dividend !== undefined && typeof stock.dividend === 'number' ? 
                      `¥${stock.dividend.toFixed(2)}` : 
                      stock.dividend ? `¥${parseFloat(stock.dividend).toFixed(2)}` : '-'
                    }
                  </td>
                  <td className="favorites-table-cell">
                    {stock.dividendYield ? `${stock.dividendYield}%` : '-'}
                  </td>
                  <td className="favorites-table-cell">
                    {stock.annualReturn !== null && stock.annualReturn !== undefined && typeof stock.annualReturn === 'number' ? (
                      <span className={getReturnClass(stock.annualReturn)}>
                        {stock.annualReturn >= 0 ? '+' : ''}{stock.annualReturn.toFixed(2)}%
                      </span>
                    ) : (
                      <span className="favorites-calculating">計算中...</span>
                    )}
                  </td>
                  <td className="favorites-table-cell">
                    {stock.volatility !== null && stock.volatility !== undefined && typeof stock.volatility === 'number' ? (
                      <span className={getRiskClass(stock.volatility)}>
                        {stock.volatility.toFixed(2)}%
                      </span>
                    ) : (
                      <span className="favorites-calculating">計算中...</span>
                    )}
                  </td>
                  <td className="favorites-table-cell">
                    {stock.lastUpdated ? (
                      <span className="favorites-updated-time">
                        {new Date(stock.lastUpdated).toLocaleString('ja-JP', {
                          year: 'numeric',
                          month: '2-digit',
                          day: '2-digit',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </span>
                    ) : (
                      <span className="favorites-calculating">-</span>
                    )}
                  </td>
                  <td className="favorites-table-cell">
                    <div className="favorites-actions">
                      <button
                        onClick={() => handleAddToPortfolio(stock)}
                        className="favorites-action-btn favorites-portfolio-btn"
                        title="ポートフォリオに追加"
                      >
                        📊
                      </button>
                      <button
                        onClick={() => handleRemoveFavorite(stock.symbol)}
                        className="favorites-action-btn favorites-delete-btn"
                        title="お気に入りから削除"
                      >
                        🗑️
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
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

export default FavoritesPage; 