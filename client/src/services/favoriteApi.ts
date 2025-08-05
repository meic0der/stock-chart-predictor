import axios from 'axios';
import type { FavoriteStock } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';

// お気に入り銘柄一覧を取得
export const fetchFavorites = async (): Promise<FavoriteStock[]> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/api/favorites`);
    return response.data.favorites || [];
  } catch (error) {
    console.error('Error fetching favorites:', error);
    return [];
  }
};

// お気に入りに追加
export const addToFavorites = async (symbol: string): Promise<boolean> => {
  try {
    const response = await axios.post(`${API_BASE_URL}/api/favorites`, { symbol });
    return response.data.success;
  } catch (error) {
    console.error('Error adding to favorites:', error);
    return false;
  }
};

// お気に入りから削除
export const removeFromFavorites = async (symbol: string): Promise<boolean> => {
  try {
    const response = await axios.delete(`${API_BASE_URL}/api/favorites/${symbol}`);
    return response.data.success;
  } catch (error) {
    console.error('Error removing from favorites:', error);
    return false;
  }
};

// お気に入りかどうかをチェック
export const checkIsFavorite = async (symbol: string): Promise<boolean> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/api/favorites/check/${symbol}`);
    return response.data.isFavorite;
  } catch (error) {
    console.error('Error checking favorite status:', error);
    return false;
  }
};

// お気に入りをポートフォリオに追加
export const addFavoriteToPortfolio = async (symbol: string, shares: number, purchasePrice: number): Promise<boolean> => {
  try {
    const response = await axios.post(`${API_BASE_URL}/api/portfolio/add`, {
      symbol,
      shares,
      purchasePrice
    });
    return response.data.success;
  } catch (error) {
    console.error('Error adding to portfolio:', error);
    return false;
  }
}; 