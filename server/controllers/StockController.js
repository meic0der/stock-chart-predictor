const YahooFinanceService = require('../services/YahooFinanceService');
const Stock = require('../models/Stock');
const ReturnCalculator = require('../services/ReturnCalculator');

// 全ての株価データを取得
const getAllStocks = async (req, res) => {
  try {
    const stocks = await YahooFinanceService.fetchMultipleStockData();
    
    res.json({
      success: true,
      data: stocks,
      count: stocks.length
    });
  } catch (error) {
    console.error('Error fetching all stocks:', error);
    res.status(500).json({
      success: false,
      message: '株価データの取得に失敗しました。',
      error: error.message
    });
  }
};

// フィルタリングされた株価データを取得
const getFilteredStocks = async (req, res) => {
  try {
    const {
      country,
      sector,
      name,
      peMin,
      peMax,
      pbMin,
      pbMax,
      dividendMin,
      dividendMax,
      marketCapMin,
      marketCapMax
    } = req.query;

    // フィルター条件を構築
    const filters = {};
    
    if (country) filters.country = country;
    if (sector) filters.sector = sector;
    if (name) filters.name = name;
    
    if (peMin !== undefined || peMax !== undefined) {
      filters.peRange = {
        min: peMin ? parseFloat(peMin) : 0,
        max: peMax ? parseFloat(peMax) : 1000
      };
    }
    
    if (pbMin !== undefined || pbMax !== undefined) {
      filters.pbRange = {
        min: pbMin ? parseFloat(pbMin) : 0,
        max: pbMax ? parseFloat(pbMax) : 100
      };
    }
    
    if (dividendMin !== undefined || dividendMax !== undefined) {
      filters.dividendRange = {
        min: dividendMin ? parseFloat(dividendMin) : 0,
        max: dividendMax ? parseFloat(dividendMax) : 100
      };
    }
    
    if (marketCapMin !== undefined || marketCapMax !== undefined) {
      filters.marketCapRange = {
        min: marketCapMin ? parseFloat(marketCapMin) : 0,
        max: marketCapMax ? parseFloat(marketCapMax) : Number.MAX_SAFE_INTEGER
      };
    }

    const stocks = await YahooFinanceService.fetchFilteredStockData(filters);
    
    res.json({
      success: true,
      data: stocks,
      count: stocks.length,
      filters: filters
    });
  } catch (error) {
    console.error('Error fetching filtered stocks:', error);
    res.status(500).json({
      success: false,
      message: 'フィルタリングされた株価データの取得に失敗しました。',
      error: error.message
    });
  }
};

// 利用可能なフィルターオプションを取得
const getAvailableFilters = async (req, res) => {
  try {
    const filters = await YahooFinanceService.getAvailableFilters();
    
    res.json({
      success: true,
      data: filters
    });
  } catch (error) {
    console.error('Error fetching available filters:', error);
    res.status(500).json({
      success: false,
      message: 'フィルターオプションの取得に失敗しました。',
      error: error.message
    });
  }
};

// 特定の株価データを取得
const getStockBySymbol = async (req, res) => {
  try {
    const { symbol } = req.params;
    
    if (!symbol) {
      return res.status(400).json({
        success: false,
        message: '株価シンボルが必要です。'
      });
    }

    const stock = await Stock.getBySymbol(symbol);
    
    if (!stock) {
      return res.status(404).json({
        success: false,
        message: '指定された株価シンボルのデータが見つかりません。'
      });
    }

    res.json({
      success: true,
      data: stock
    });
  } catch (error) {
    console.error('Error fetching stock by symbol:', error);
    res.status(500).json({
      success: false,
      message: '株価データの取得に失敗しました。',
      error: error.message
    });
  }
};

// 選択した銘柄を更新
const updateSelectedStocks = async (req, res) => {
  try {
    const { symbols } = req.body;
    
    if (!symbols || !Array.isArray(symbols) || symbols.length === 0) {
      return res.status(400).json({
        success: false,
        message: '更新する銘柄のシンボルリストが必要です。'
      });
    }

    const updatedStocks = await YahooFinanceService.updateSelectedStocks(symbols);
    
    res.json({
      success: true,
      data: updatedStocks,
      count: updatedStocks.length,
      message: `${updatedStocks.length}銘柄を更新しました。`
    });
  } catch (error) {
    console.error('Error updating selected stocks:', error);
    res.status(500).json({
      success: false,
      message: '銘柄の更新に失敗しました。',
      error: error.message
    });
  }
};

// 全銘柄を更新
const updateAllStocks = async (req, res) => {
  try {
    const updatedStocks = await YahooFinanceService.updateAllStocks();
    
    res.json({
      success: true,
      data: updatedStocks,
      count: updatedStocks.length,
      message: `${updatedStocks.length}銘柄を更新しました。`
    });
  } catch (error) {
    console.error('Error updating all stocks:', error);
    res.status(500).json({
      success: false,
      message: '全銘柄の更新に失敗しました。',
      error: error.message
    });
  }
};

// 最終更新日時を取得
const getLastUpdated = async (req, res) => {
  try {
    const lastUpdated = await Stock.getLastUpdated();
    
    res.json({
      success: true,
      data: { lastUpdated }
    });
  } catch (error) {
    console.error('Error getting last updated:', error);
    res.status(500).json({
      success: false,
      message: '最終更新日時の取得に失敗しました。',
      error: error.message
    });
  }
};

// データベースをリセットして正しいセクター情報で再取得
const resetAndReloadStocks = async (req, res) => {
  try {
    const updatedStocks = await YahooFinanceService.resetAndReloadStocks();
    
    res.json({
      success: true,
      data: updatedStocks,
      count: updatedStocks.length,
      message: `データベースをリセットして${updatedStocks.length}銘柄を正しいセクター情報で再取得しました。`
    });
  } catch (error) {
    console.error('Error resetting and reloading stocks:', error);
    res.status(500).json({
      success: false,
      message: 'データベースのリセットと再取得に失敗しました。',
      error: error.message
    });
  }
};

// リターン計算を実行
const calculateReturns = async (req, res) => {
  try {
    const { symbols, period = '1y' } = req.body;
    
    if (!symbols || !Array.isArray(symbols) || symbols.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'リターン計算する銘柄のシンボルリストが必要です。'
      });
    }

    console.log(`Calculating returns for ${symbols.length} symbols over ${period}`);
    const results = await ReturnCalculator.calculateMultipleReturns(symbols, period);
    
    // データベースを更新
    const updatePromises = Object.entries(results).map(([symbol, data]) => {
      if (data.annualReturn !== null && data.volatility !== null) {
        return Stock.update(symbol, {
          annual_return: data.annualReturn,
          volatility: data.volatility
        });
      }
      return Promise.resolve();
    });
    
    await Promise.all(updatePromises);
    
    res.json({
      success: true,
      data: results,
      message: `${Object.keys(results).length}銘柄のリターン計算が完了しました。`
    });
  } catch (error) {
    console.error('Error calculating returns:', error);
    res.status(500).json({
      success: false,
      message: 'リターン計算に失敗しました。',
      error: error.message
    });
  }
};

module.exports = {
  getAllStocks,
  getFilteredStocks,
  getAvailableFilters,
  getStockBySymbol,
  updateSelectedStocks,
  updateAllStocks,
  getLastUpdated,
  resetAndReloadStocks,
  calculateReturns
}; 