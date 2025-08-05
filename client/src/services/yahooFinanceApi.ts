interface StockData {
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

// バックエンドAPIのベースURL
const API_BASE_URL = 'http://localhost:4010/api/stocks';

// 単一の株価データを取得
export const fetchStockData = async (symbol: string): Promise<StockData | null> => {
  try {
    const response = await fetch(`${API_BASE_URL}/${symbol}`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const result = await response.json();
    
    if (!result.success || !result.data) {
      return null;
    }
    
    return result.data;
  } catch (error) {
    console.error(`Error fetching data for ${symbol}:`, error);
    return null;
  }
};

// 複数の株価データを一括取得
export const fetchMultipleStockData = async (): Promise<StockData[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/all`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const result = await response.json();
    
    if (!result.success || !result.data) {
      return [];
    }
    
    return result.data;
  } catch (error) {
    console.error('Error fetching multiple stock data:', error);
    return [];
  }
};

// 特定の条件でフィルタリングされた株価データを取得
export const fetchFilteredStockData = async (
  country?: string,
  sector?: string,
  name?: string,
  peRange?: { min: number; max: number },
  pbRange?: { min: number; max: number },
  dividendRange?: { min: number; max: number }
): Promise<StockData[]> => {
  try {
    const params = new URLSearchParams();
    
    if (country) params.append('country', country);
    if (sector) params.append('sector', sector);
    if (name) params.append('name', name);
    if (peRange) {
      params.append('peMin', peRange.min.toString());
      params.append('peMax', peRange.max.toString());
    }
    if (pbRange) {
      params.append('pbMin', pbRange.min.toString());
      params.append('pbMax', pbRange.max.toString());
    }
    if (dividendRange) {
      params.append('dividendMin', dividendRange.min.toString());
      params.append('dividendMax', dividendRange.max.toString());
    }
    
    const response = await fetch(`${API_BASE_URL}/filtered?${params.toString()}`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const result = await response.json();
    
    if (!result.success || !result.data) {
      return [];
    }
    
    return result.data;
  } catch (error) {
    console.error('Error fetching filtered stock data:', error);
    return [];
  }
};

// 利用可能なフィルターオプションを取得
export const fetchAvailableFilters = async (): Promise<{ countries: string[]; sectors: string[] }> => {
  try {
    const response = await fetch(`${API_BASE_URL}/filters`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const result = await response.json();
    
    if (!result.success || !result.data) {
      return { countries: ['All Countries'], sectors: ['All Sectors'] };
    }
    
    return result.data;
  } catch (error) {
    console.error('Error fetching available filters:', error);
    return { countries: ['All Countries'], sectors: ['All Sectors'] };
  }
};

// 選択した銘柄を更新
export const updateSelectedStocks = async (symbols: string[]): Promise<StockData[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/update-selected`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ symbols }),
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const result = await response.json();
    
    if (!result.success || !result.data) {
      return [];
    }
    
    return result.data;
  } catch (error) {
    console.error('Error updating selected stocks:', error);
    return [];
  }
};

// 全銘柄を更新
export const updateAllStocks = async (): Promise<StockData[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/update-all`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const result = await response.json();
    
    if (!result.success || !result.data) {
      return [];
    }
    
    return result.data;
  } catch (error) {
    console.error('Error updating all stocks:', error);
    return [];
  }
};

// 最終更新日時を取得
export const fetchLastUpdated = async (): Promise<string | null> => {
  try {
    const response = await fetch(`${API_BASE_URL}/last-updated`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const result = await response.json();
    
    if (!result.success || !result.data) {
      return null;
    }
    
    return result.data.lastUpdated;
  } catch (error) {
    console.error('Error fetching last updated:', error);
    return null;
  }
};

// データベースをリセットして正しいセクター情報で再取得
export const resetAndReloadStocks = async (): Promise<StockData[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/reset-and-reload`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const result = await response.json();
    
    if (!result.success || !result.data) {
      return [];
    }
    
    return result.data;
  } catch (error) {
    console.error('Error resetting and reloading stocks:', error);
    return [];
  }
}; 