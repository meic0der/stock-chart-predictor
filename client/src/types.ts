export type StockData = {
  actual: number[];
  actualDates: string[];
  predicted: number[];
  predictedDates: string[];
  company?: {
    name?: string;
    exchange?: string;
    currency?: string;
  };
};

export type HistoryItem = {
  id: number;
  symbol: string;
  predicted: number[];
  predictedDates: string[];
  actual: number[];
  actualDates: string[];
  company?: {
    name?: string;
    exchange?: string;
    currency?: string;
  };
  note?: string;
  created_at: string;
  range: string;
  model: string;
};

// ポートフォリオ関連の型定義
export type PortfolioStock = {
  id: string;
  symbol: string;
  name: string;
  shares: number;
  currentPrice: number;
  purchasePrice: number;
  purchaseDate: string;
  value: number;
  weight: number;
  return: number;
  returnPercent: number;
};

export type PortfolioData = {
  totalValue: number;
  totalInvestment: number;
  unrealizedPnL: number;
  averageReturn: number;
  annualDividends: number;
  portfolioRisk: number;
  dividendYield: number;
  stocks: PortfolioStock[];
  lastUpdated: string;
};