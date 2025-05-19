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