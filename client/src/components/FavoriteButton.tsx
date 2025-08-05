import React, { useState, useEffect } from 'react';
import { addToFavorites, removeFromFavorites, checkIsFavorite } from '../services/favoriteApi';

interface FavoriteButtonProps {
  symbol: string;
  onFavoriteChange?: (isFavorite: boolean) => void;
}

const FavoriteButton: React.FC<FavoriteButtonProps> = ({ symbol, onFavoriteChange }) => {
  const [isFavorite, setIsFavorite] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    checkFavoriteStatus();
  }, [symbol]);

  const checkFavoriteStatus = async () => {
    try {
      const status = await checkIsFavorite(symbol);
      setIsFavorite(status);
    } catch (error) {
      console.error('Error checking favorite status:', error);
    }
  };

  const handleToggleFavorite = async () => {
    if (isLoading) return;

    setIsLoading(true);
    try {
      let success = false;
      
      if (isFavorite) {
        success = await removeFromFavorites(symbol);
        if (success) {
          setIsFavorite(false);
          onFavoriteChange?.(false);
        }
      } else {
        success = await addToFavorites(symbol);
        if (success) {
          setIsFavorite(true);
          onFavoriteChange?.(true);
        }
      }

      if (!success) {
        alert(isFavorite ? 'お気に入りから削除できませんでした。' : 'お気に入りに追加できませんでした。');
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
      alert('エラーが発生しました。');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handleToggleFavorite}
      disabled={isLoading}
      style={{
        background: 'none',
        border: 'none',
        cursor: isLoading ? 'not-allowed' : 'pointer',
        padding: '0.5rem',
        borderRadius: '0.25rem',
        transition: 'all 0.2s',
        opacity: isLoading ? 0.6 : 1,
        fontSize: '1.2rem'
      }}
      title={isFavorite ? 'お気に入りから削除' : 'お気に入りに追加'}
    >
      {isLoading ? (
        <span style={{ fontSize: '1rem' }}>⏳</span>
      ) : isFavorite ? (
        <span style={{ color: '#ef4444' }}>❤️</span>
      ) : (
        <span style={{ color: '#9ca3af' }}>🤍</span>
      )}
    </button>
  );
};

export default FavoriteButton; 