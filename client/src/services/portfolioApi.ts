import axios from 'axios';
import type { PortfolioData } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';

// ポートフォリオサマリーを取得
export const fetchPortfolioSummary = async (): Promise<PortfolioData> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/api/portfolio/summary`);
    return response.data.portfolioData;
  } catch (error) {
    console.error('Error fetching portfolio summary:', error);
    // エラーの場合は空のポートフォリオを返す
    return {
      totalValue: 0,
      totalInvestment: 0,
      unrealizedPnL: 0,
      averageReturn: 0,
      annualDividends: 0,
      portfolioRisk: 0,
      dividendYield: 0,
      stocks: [],
      lastUpdated: new Date().toLocaleDateString('en-US')
    };
  }
};

// ポートフォリオ一覧を取得
export const fetchPortfolio = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/api/portfolio`);
    return response.data.portfolio || [];
  } catch (error) {
    console.error('Error fetching portfolio:', error);
    return [];
  }
};

// ポートフォリオに追加
export const addToPortfolio = async (symbol: string, shares: number, purchasePrice: number) => {
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

// ポートフォリオを更新
export const updatePortfolio = async (symbol: string, shares: number, purchasePrice: number) => {
  try {
    const response = await axios.put(`${API_BASE_URL}/api/portfolio/${symbol}`, {
      shares,
      purchasePrice
    });
    return response.data.success;
  } catch (error) {
    console.error('Error updating portfolio:', error);
    return false;
  }
};

// ポートフォリオから削除
export const removeFromPortfolio = async (symbol: string) => {
  try {
    const response = await axios.delete(`${API_BASE_URL}/api/portfolio/${symbol}`);
    return response.data.success;
  } catch (error) {
    console.error('Error removing from portfolio:', error);
    return false;
  }
}; 