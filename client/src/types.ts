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
