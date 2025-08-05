import React, { useState } from 'react';
import { addFavoriteToPortfolio } from '../services/favoriteApi';

interface AddToPortfolioModalProps {
  isOpen: boolean;
  onClose: () => void;
  stock: {
    symbol: string;
    name: string;
    price: string;
  };
  onSuccess?: () => void;
}

const AddToPortfolioModal: React.FC<AddToPortfolioModalProps> = ({
  isOpen,
  onClose,
  stock,
  onSuccess
}) => {
  const [shares, setShares] = useState(1);
  const [purchasePrice, setPurchasePrice] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!purchasePrice || parseFloat(purchasePrice) <= 0) {
      alert('購入価格を正しく入力してください。');
      return;
    }

    if (shares <= 0) {
      alert('株数を正しく入力してください。');
      return;
    }

    setIsLoading(true);
    try {
      const success = await addFavoriteToPortfolio(
        stock.symbol,
        shares,
        parseFloat(purchasePrice)
      );

      if (success) {
        alert(`${stock.symbol}をポートフォリオに追加しました。`);
        onSuccess?.();
        onClose();
        // フォームをリセット
        setShares(1);
        setPurchasePrice('');
      } else {
        alert('ポートフォリオへの追加に失敗しました。');
      }
    } catch (error) {
      console.error('Error adding to portfolio:', error);
      alert('エラーが発生しました。');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000
    }}>
      <div style={{
        background: 'white',
        borderRadius: '12px',
        padding: '2rem',
        maxWidth: '400px',
        width: '90%',
        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)'
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '1.5rem'
        }}>
          <h2 style={{
            fontSize: '1.5rem',
            fontWeight: '600',
            color: '#1f2937',
            margin: 0
          }}>
            ポートフォリオに追加
          </h2>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              fontSize: '1.5rem',
              cursor: 'pointer',
              color: '#6b7280',
              padding: '0.25rem'
            }}
          >
            ×
          </button>
        </div>

        <div style={{ marginBottom: '1.5rem' }}>
          <div style={{
            background: '#f3f4f6',
            padding: '1rem',
            borderRadius: '8px',
            marginBottom: '1rem'
          }}>
            <div style={{ fontWeight: '600', color: '#1f2937' }}>
              {stock.symbol} - {stock.name}
            </div>
            <div style={{ color: '#6b7280', fontSize: '0.875rem' }}>
              現在価格: {stock.price}
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '1rem' }}>
            <label style={{
              display: 'block',
              marginBottom: '0.5rem',
              fontWeight: '500',
              color: '#374151'
            }}>
              株数
            </label>
            <input
              type="number"
              min="1"
              value={shares}
              onChange={(e) => setShares(parseInt(e.target.value) || 1)}
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '1px solid #d1d5db',
                borderRadius: '8px',
                fontSize: '1rem'
              }}
              required
            />
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{
              display: 'block',
              marginBottom: '0.5rem',
              fontWeight: '500',
              color: '#374151'
            }}>
              購入価格 ($)
            </label>
            <input
              type="number"
              step="0.01"
              min="0.01"
              value={purchasePrice}
              onChange={(e) => setPurchasePrice(e.target.value)}
              placeholder="例: 150.00"
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '1px solid #d1d5db',
                borderRadius: '8px',
                fontSize: '1rem'
              }}
              required
            />
          </div>

          <div style={{
            display: 'flex',
            gap: '1rem'
          }}>
            <button
              type="button"
              onClick={onClose}
              style={{
                flex: 1,
                padding: '0.75rem',
                border: '1px solid #d1d5db',
                borderRadius: '8px',
                background: 'white',
                color: '#374151',
                fontSize: '1rem',
                fontWeight: '500',
                cursor: 'pointer'
              }}
            >
              キャンセル
            </button>
            <button
              type="submit"
              disabled={isLoading}
              style={{
                flex: 1,
                padding: '0.75rem',
                border: 'none',
                borderRadius: '8px',
                background: isLoading ? '#9ca3af' : '#3b82f6',
                color: 'white',
                fontSize: '1rem',
                fontWeight: '500',
                cursor: isLoading ? 'not-allowed' : 'pointer',
                opacity: isLoading ? 0.6 : 1
              }}
            >
              {isLoading ? '追加中...' : '追加'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddToPortfolioModal; 