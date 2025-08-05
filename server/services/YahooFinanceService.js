const yahooFinance = require('yahoo-finance2').default;
const Stock = require('../models/Stock');
const ReturnCalculator = require('./ReturnCalculator');
const fs = require('fs').promises;
const path = require('path');

// 株価データファイルからシンボルを読み込む関数
const loadStockSymbols = async () => {
  try {
    const usStocksPath = path.join(__dirname, '../data/us_stocks.json');
    const jpStocksPath = path.join(__dirname, '../data/jp_stocks.json');
    
    const [usStocksData, jpStocksData] = await Promise.all([
      fs.readFile(usStocksPath, 'utf8'),
      fs.readFile(jpStocksPath, 'utf8')
    ]);
    
    const usStocks = JSON.parse(usStocksData);
    const jpStocks = JSON.parse(jpStocksData);
    
    // シンボルのみを抽出
    const usSymbols = usStocks.map(stock => stock.symbol);
    const jpSymbols = jpStocks.map(stock => stock.symbol);
    
    return [...usSymbols, ...jpSymbols];
  } catch (error) {
    console.error('Error loading stock symbols from files:', error);
    // フォールバック用のデフォルトシンボル
    return [
      // 米国株
      'AAPL', 'MSFT', 'GOOGL', 'AMZN', 'TSLA', 'META', 'NVDA', 'NFLX', 'ADBE', 'CRM',
      'JPM', 'JNJ', 'PG', 'UNH', 'HD', 'MA', 'V', 'PYPL', 'BAC', 'WMT',
      'DIS', 'NKE', 'KO', 'PEP', 'ABT', 'TMO', 'AVGO', 'COST', 'MRK', 'PFE',
      
      // 日本株
      '7203.T', '6758.T', '9984.T', '6861.T', '7974.T', '6954.T', '8306.T', '9433.T', '9432.T', '4502.T',
      '6501.T', '7267.T', '7751.T', '8766.T', '8411.T', '9020.T', '9022.T', '9434.T', '9435.T', '9437.T',
      '9501.T', '9502.T', '9503.T', '9531.T', '9532.T', '9602.T', '9613.T', '9983.T', '6752.T', '6954.T'
    ];
  }
};

// 米国株のシンボルのみを取得
const loadUSStockSymbols = async () => {
  try {
    const usStocksPath = path.join(__dirname, '../data/us_stocks.json');
    const usStocksData = await fs.readFile(usStocksPath, 'utf8');
    const usStocks = JSON.parse(usStocksData);
    return usStocks.map(stock => stock.symbol);
  } catch (error) {
    console.error('Error loading US stock symbols from file:', error);
    return [];
  }
};

// 日本株のシンボルのみを取得
const loadJPStockSymbols = async () => {
  try {
    const jpStocksPath = path.join(__dirname, '../data/jp_stocks.json');
    const jpStocksData = await fs.readFile(jpStocksPath, 'utf8');
    const jpStocks = JSON.parse(jpStocksData);
    return jpStocks.map(stock => stock.symbol);
  } catch (error) {
    console.error('Error loading JP stock symbols from file:', error);
    return [];
  }
};

// 日本のセクター情報を取得する関数
const getJapaneseSector = (sector) => {
  const sectorMap = {
    'Technology': 'Technology',
    'Consumer Cyclical': 'Consumer Goods',
    'Financial Services': 'Financial Services',
    'Healthcare': 'Healthcare',
    'Industrials': 'Industrials',
    'Consumer Defensive': 'Consumer Goods',
    'Communication Services': 'Communication Services',
    'Energy': 'Energy',
    'Basic Materials': 'Basic Materials',
    'Real Estate': 'Real Estate',
    'Utilities': 'Utilities',
    'Consumer Discretionary': 'Consumer Goods',
    'Consumer Staples': 'Consumer Goods',
    'Financial': 'Financial Services',
    'Materials': 'Basic Materials',
    'Telecommunication Services': 'Communication Services',
    // 実際に取得されるセクター名を追加
    'Communication Services': 'Communication Services',
    'Consumer Cyclical': 'Consumer Goods',
    'Technology': 'Technology'
  };
  
  return sectorMap[sector] || 'Other';
};

// 価格をフォーマットする関数
const formatPrice = (price, country) => {
  if (country === 'Japan') {
    return `¥${price.toLocaleString('ja-JP', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
  } else {
    return `$${price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  }
};

// 単一の株価データを取得
const fetchStockData = async (symbol) => {
  try {
    console.log(`Fetching data for symbol: ${symbol}`);
    
    // yahoo-finance2ライブラリを使用してデータを取得
    const quote = await yahooFinance.quote(symbol);
    
    // セクター情報を取得するためにquoteSummaryも使用
    let sectorInfo = { sector: 'Other', industry: 'Other' };
    try {
      const profile = await yahooFinance.quoteSummary(symbol, {
        modules: ['assetProfile']
      });
      
      if (profile.assetProfile) {
        sectorInfo = {
          sector: profile.assetProfile.sector || 'Other',
          industry: profile.assetProfile.industry || 'Other'
        };
        console.log(`Sector info for ${symbol}:`, sectorInfo);
      }
    } catch (sectorError) {
      console.log(`Could not fetch sector info for ${symbol}:`, sectorError.message);
    }
    // 詳細なデバッグ情報を出力
    console.log(`=== Detailed Quote Data for ${symbol} ===`);
    console.log('Basic Info:', {
      symbol: quote.symbol,
      longName: quote.longName,
      shortName: quote.shortName,
      displayName: quote.displayName,
      exchange: quote.exchange,
      exchangeTimezoneName: quote.exchangeTimezoneName,
      exchangeTimezoneShortName: quote.exchangeTimezoneShortName,
      market: quote.market,
      marketState: quote.marketState,
      quoteType: quote.quoteType,
      typeDisp: quote.typeDisp
    });
    
    console.log('Sector & Industry:', {
      sector: quote.sector,
      industry: quote.industry,
      industryDisp: quote.industryDisp,
      sectorDisp: quote.sectorDisp,
      longBusinessSummary: quote.longBusinessSummary ? quote.longBusinessSummary.substring(0, 200) + '...' : null
    });
    
    console.log('Price Info:', {
      regularMarketPrice: quote.regularMarketPrice,
      regularMarketChange: quote.regularMarketChange,
      regularMarketChangePercent: quote.regularMarketChangePercent,
      regularMarketTime: quote.regularMarketTime,
      regularMarketDayHigh: quote.regularMarketDayHigh,
      regularMarketDayLow: quote.regularMarketDayLow,
      regularMarketOpen: quote.regularMarketOpen,
      regularMarketPreviousClose: quote.regularMarketPreviousClose,
      regularMarketVolume: quote.regularMarketVolume
    });
    
    console.log('Financial Ratios:', {
      trailingPE: quote.trailingPE,
      forwardPE: quote.forwardPE,
      priceToBook: quote.priceToBook,
      priceToSalesTrailing12Months: quote.priceToSalesTrailing12Months,
      enterpriseToRevenue: quote.enterpriseToRevenue,
      enterpriseToEbitda: quote.enterpriseToEbitda,
      profitMargins: quote.profitMargins,
      operatingMargins: quote.operatingMargins,
      returnOnAssets: quote.returnOnAssets,
      returnOnEquity: quote.returnOnEquity,
      revenueGrowth: quote.revenueGrowth,
      earningsGrowth: quote.earningsGrowth,
      revenuePerShare: quote.revenuePerShare,
      returnOnCapital: quote.returnOnCapital,
      grossProfits: quote.grossProfits,
      freeCashflow: quote.freeCashflow,
      operatingCashflow: quote.operatingCashflow
    });
    
    console.log('Dividend Info:', {
      trailingAnnualDividendYield: quote.trailingAnnualDividendYield,
      trailingAnnualDividendRate: quote.trailingAnnualDividendRate,
      dividendRate: quote.dividendRate,
      dividendYield: quote.dividendYield,
      fiveYearAvgDividendYield: quote.fiveYearAvgDividendYield,
      payoutRatio: quote.payoutRatio
    });
    
    console.log('Market Cap & Volume:', {
      marketCap: quote.marketCap,
      enterpriseValue: quote.enterpriseValue,
      floatShares: quote.floatShares,
      sharesOutstanding: quote.sharesOutstanding,
      sharesShort: quote.sharesShort,
      sharesShortPrevMonth: quote.sharesShortPrevMonth,
      sharesPercentSharesOut: quote.sharesPercentSharesOut,
      heldPercentInsiders: quote.heldPercentInsiders,
      heldPercentInstitutions: quote.heldPercentInstitutions,
      impliedSharesOutstanding: quote.impliedSharesOutstanding,
      volume: quote.volume,
      averageVolume: quote.averageVolume,
      averageVolume10days: quote.averageVolume10days,
      averageDailyVolume3Month: quote.averageDailyVolume3Month
    });
    
    console.log('Other Info:', {
      currency: quote.currency,
      currencySymbol: quote.currencySymbol,
      fromCurrency: quote.fromCurrency,
      toCurrency: quote.toCurrency,
      lastMarket: quote.lastMarket,
      coinMarketCapLink: quote.coinMarketCapLink,
      circulatingSupply: quote.circulatingSupply,
      maxAge: quote.maxAge,
      timestamp: quote.timestamp,
      expires: quote.expires
    });
    
    // すべての利用可能なプロパティを表示
    console.log('All available properties:', Object.keys(quote).sort());
    console.log(`=== End Quote Data for ${symbol} ===`);
    
    // 国とセクターの情報を設定
    let country = 'US';
    let sector = 'Other';
    
    if (symbol.endsWith('.T')) {
      country = 'Japan';
      sector = getJapaneseSector(sectorInfo.sector);
      console.log(`Japanese stock ${symbol}: original sector="${sectorInfo.sector}", mapped to="${sector}"`);
    } else {
      sector = sectorInfo.sector;
      console.log(`US stock ${symbol}: sector="${sector}"`);
    }
    
    const stockData = {
      symbol: symbol,
      name: quote.longName || quote.shortName || symbol,
      country: country,
      sector: sector,
      price: formatPrice(quote.regularMarketPrice, country),
      rawPrice: quote.regularMarketPrice,
      pe: quote.trailingPE || 0,
      pb: quote.priceToBook || 0,
      dividendYield: quote.trailingAnnualDividendYield ? quote.trailingAnnualDividendYield * 100 : 0,
      marketCap: quote.marketCap || 0,
      volume: quote.volume || 0,
      change: quote.regularMarketChange || 0,
      changePercent: quote.regularMarketChangePercent || 0,
      lastUpdated: new Date().toISOString()
    };
    
    // リターンとボラティリティを計算（非同期で実行）
    ReturnCalculator.calculateReturns(symbol, '1y').then(returns => {
      if (returns.annualReturn !== null && returns.volatility !== null) {
        Stock.update(symbol, {
          annual_return: returns.annualReturn,
          volatility: returns.volatility
        }).catch(err => console.error(`Error updating returns for ${symbol}:`, err));
      }
    }).catch(err => console.error(`Error calculating returns for ${symbol}:`, err));
    
    console.log(`Successfully fetched data for ${symbol}:`, stockData);
    return stockData;
    
  } catch (error) {
    console.error(`Error fetching data for ${symbol}:`, error.message);
    return null;
  }
};

// 複数の株価データを一括取得
const fetchMultipleStockData = async () => {
  // まずDBからデータを取得
  const dbStocks = await Stock.getAll();
  
  // DBにデータがない場合は、Yahoo Financeから取得してDBに保存
  if (dbStocks.length === 0) {
    console.log('No data in DB, fetching from Yahoo Finance...');
    const stockSymbols = await loadStockSymbols();
    const stockDataPromises = stockSymbols.map(symbol => fetchStockData(symbol));
    const results = await Promise.allSettled(stockDataPromises);
    
    const validResults = [];
    
    results.forEach((result) => {
      if (result.status === 'fulfilled' && result.value) {
        validResults.push(result.value);
      }
    });
    
    // DBに保存
    for (const stockData of validResults) {
      await Stock.upsert({
        symbol: stockData.symbol,
        name: stockData.name,
        country: stockData.country,
        sector: stockData.sector,
        price: stockData.rawPrice, // フォーマットされていない数値を使用
        raw_price: stockData.rawPrice,
        pe_ratio: stockData.pe,
        pb_ratio: stockData.pb,
        dividend_yield: stockData.dividendYield,
        market_cap: stockData.marketCap,
        volume: stockData.volume,
        change: stockData.change,
        change_percent: stockData.changePercent,
        last_updated: new Date()
      });
    }
    
    return validResults;
  }
  
  // DBからデータを返す
  return dbStocks.map(stock => ({
    symbol: stock.symbol,
    name: stock.name,
    country: stock.country,
    sector: stock.sector,
    price: formatPrice(stock.price, stock.country), // フロントエンド用にフォーマット
    rawPrice: stock.raw_price,
    pe: stock.pe_ratio,
    pb: stock.pb_ratio,
    dividendYield: stock.dividend_yield,
    marketCap: stock.market_cap,
    volume: stock.volume,
    change: stock.change,
    changePercent: stock.change_percent,
    lastUpdated: stock.last_updated,
    annualReturn: stock.annual_return ? parseFloat(stock.annual_return) : null,
    volatility: stock.volatility ? parseFloat(stock.volatility) : null
  }));
};

// 特定の条件でフィルタリングされた株価データを取得
const fetchFilteredStockData = async (filters = {}) => {
  const dbStocks = await Stock.getFiltered(filters);
  
  // フロントエンドが期待する形式に変換
  return dbStocks.map(stock => ({
    symbol: stock.symbol,
    name: stock.name,
    country: stock.country,
    sector: stock.sector,
    price: formatPrice(stock.price, stock.country), // フロントエンド用にフォーマット
    rawPrice: stock.raw_price,
    pe: stock.pe_ratio,
    pb: stock.pb_ratio,
    dividendYield: stock.dividend_yield,
    marketCap: stock.market_cap,
    volume: stock.volume,
    change: stock.change,
    changePercent: stock.change_percent,
    lastUpdated: stock.last_updated,
    annualReturn: stock.annual_return ? parseFloat(stock.annual_return) : null,
    volatility: stock.volatility ? parseFloat(stock.volatility) : null
  }));
};

// 利用可能な国とセクターのリストを取得
const getAvailableFilters = async () => {
  return await Stock.getAvailableFilters();
};

// 選択した銘柄のみを更新
const updateSelectedStocks = async (symbols) => {
  console.log(`Updating selected stocks: ${symbols.join(', ')}`);
  
  const stockDataPromises = symbols.map(symbol => fetchStockData(symbol));
  const results = await Promise.allSettled(stockDataPromises);
  
  const validResults = [];
  
  results.forEach((result) => {
    if (result.status === 'fulfilled' && result.value) {
      validResults.push(result.value);
    }
  });
  
  // DBに保存
  const updatedStocks = [];
  for (const stockData of validResults) {
    const updatedStock = await Stock.upsert({
      symbol: stockData.symbol,
      name: stockData.name,
      country: stockData.country,
      sector: stockData.sector,
      price: stockData.rawPrice, // フォーマットされていない数値を使用
      raw_price: stockData.rawPrice,
      pe_ratio: stockData.pe,
      pb_ratio: stockData.pb,
      dividend_yield: stockData.dividendYield,
      market_cap: stockData.marketCap,
      volume: stockData.volume,
      change: stockData.change,
      change_percent: stockData.changePercent,
      last_updated: new Date()
    });
    updatedStocks.push(updatedStock);
  }
  
  return updatedStocks;
};

// 全銘柄を更新
const updateAllStocks = async () => {
  console.log('Updating all stocks...');
  const stockSymbols = await loadStockSymbols();
  return await updateSelectedStocks(stockSymbols);
};

// データベースをリセットして正しいセクター情報で再取得
const resetAndReloadStocks = async () => {
  try {
    console.log('Resetting database and reloading stocks with correct sector information...');
    
    // データベースをクリア
    await Stock.clearAll();
    
    // 全銘柄を再取得
    const updatedStocks = await updateAllStocks();
    
    console.log(`Successfully reloaded ${updatedStocks.length} stocks with correct sector information`);
    return updatedStocks;
  } catch (error) {
    console.error('Error resetting and reloading stocks:', error);
    throw error;
  }
};

module.exports = {
  fetchStockData,
  fetchMultipleStockData,
  fetchFilteredStockData,
  getAvailableFilters,
  updateSelectedStocks,
  updateAllStocks,
  loadStockSymbols,
  loadUSStockSymbols,
  loadJPStockSymbols,
  resetAndReloadStocks
}; 