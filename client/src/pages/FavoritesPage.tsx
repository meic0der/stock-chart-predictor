import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchFavorites, removeFromFavorites } from '../services/favoriteApi';
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
          color: '#ef4444',
          margin: '0 0 0.5rem 0'
        }}>
          My Favorites
        </h1>
        <p style={{ 
          fontSize: '1.1rem', 
          color: '#6b7280',
          margin: '0 0 1rem 0'
        }}>
          お気に入りに登録した銘柄を管理し、ポートフォリオに追加できます。
        </p>
        <div style={{ 
          fontSize: '0.9rem', 
          color: '#9ca3af',
          fontWeight: '500'
        }}>
          {favorites.length} 銘柄が登録されています
        </div>
      </div>

      {/* メインコンテンツ */}
      <div style={{
        background: 'white',
        borderRadius: '12px',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        overflow: 'hidden'
      }}>
        {loading && (
          <div style={{
            padding: '3rem',
            textAlign: 'center',
            color: '#6b7280'
          }}>
            <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>⏳</div>
            <div>お気に入りを読み込み中...</div>
          </div>
        )}
        
        {error && (
          <div style={{
            padding: '3rem',
            textAlign: 'center',
            color: '#ef4444'
          }}>
            <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>❌</div>
            <div>{error}</div>
            <button
              onClick={loadFavorites}
              style={{
                marginTop: '1rem',
                padding: '0.5rem 1rem',
                backgroundColor: '#ef4444',
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
        
        {!loading && !error && favorites.length === 0 && (
          <div style={{
            padding: '3rem',
            textAlign: 'center',
            color: '#6b7280'
          }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🤍</div>
            <div style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>
              お気に入りがありません
            </div>
            <div style={{ marginBottom: '1.5rem' }}>
              銘柄検索ページでお気に入りに登録してください。
            </div>
            <button
              onClick={() => navigate('/')}
              style={{
                padding: '0.75rem 1.5rem',
                backgroundColor: '#ef4444',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '1rem',
                fontWeight: '500'
              }}
            >
              銘柄検索へ
            </button>
          </div>
        )}
        
        {!loading && !error && favorites.length > 0 && (
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
                <th style={{ 
                  padding: '1rem', 
                  textAlign: 'center', 
                  fontWeight: 'bold',
                  color: '#374151'
                }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {favorites.map((stock, index) => (
                <tr key={stock.id} style={{ 
                  borderBottom: index < favorites.length - 1 ? '1px solid #f3f4f6' : 'none'
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
                  <td style={{ padding: '1rem', color: '#374151' }}>
                    {stock.dividendYield ? `${stock.dividendYield}%` : '-'}
                  </td>
                  <td style={{ padding: '1rem', textAlign: 'center' }}>
                    <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center' }}>
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
                      <button
                        onClick={() => handleRemoveFavorite(stock.symbol)}
                        style={{
                          background: 'none',
                          border: 'none',
                          cursor: 'pointer',
                          padding: '0.5rem',
                          borderRadius: '0.25rem',
                          transition: 'all 0.2s',
                          fontSize: '1.2rem',
                          color: '#ef4444'
                        }}
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