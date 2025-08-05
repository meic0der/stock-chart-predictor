const yahooFinance = require('yahoo-finance2').default;

class ReturnCalculator {
  // 履歴データを取得してリターンとボラティリティを計算
  static async calculateReturns(symbol, period = '1y') {
    try {
      console.log(`Calculating returns for ${symbol} over ${period}`);
      
      // 履歴データを取得
      const historicalData = await yahooFinance.historical(symbol, {
        period1: this.getPeriodStartDate(period),
        period2: new Date(),
        interval: '1d'
      });
      
      if (!historicalData || historicalData.length < 30) {
        console.log(`Insufficient data for ${symbol}, returning null`);
        return { annualReturn: null, volatility: null };
      }
      
      // 日次リターンを計算
      const dailyReturns = [];
      for (let i = 1; i < historicalData.length; i++) {
        const previousPrice = historicalData[i - 1].close;
        const currentPrice = historicalData[i].close;
        const dailyReturn = (currentPrice - previousPrice) / previousPrice;
        dailyReturns.push(dailyReturn);
      }
      
      // 年平均リターンを計算（年率化）
      const totalReturn = (historicalData[historicalData.length - 1].close - historicalData[0].close) / historicalData[0].close;
      const daysInPeriod = (historicalData[historicalData.length - 1].date - historicalData[0].date) / (1000 * 60 * 60 * 24);
      const annualReturn = Math.pow(1 + totalReturn, 365 / daysInPeriod) - 1;
      
      // ボラティリティ（年率化された標準偏差）を計算
      const meanReturn = dailyReturns.reduce((sum, ret) => sum + ret, 0) / dailyReturns.length;
      const variance = dailyReturns.reduce((sum, ret) => sum + Math.pow(ret - meanReturn, 2), 0) / dailyReturns.length;
      const volatility = Math.sqrt(variance * 252); // 252営業日で年率化
      
      console.log(`Calculated for ${symbol}: Annual Return = ${(annualReturn * 100).toFixed(2)}%, Volatility = ${(volatility * 100).toFixed(2)}%`);
      
      return {
        annualReturn: annualReturn * 100, // パーセンテージで返す
        volatility: volatility * 100
      };
      
    } catch (error) {
      console.error(`Error calculating returns for ${symbol}:`, error.message);
      return { annualReturn: null, volatility: null };
    }
  }
  
  // 期間の開始日を取得
  static getPeriodStartDate(period) {
    const now = new Date();
    switch (period) {
      case '1m':
        return new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
      case '3m':
        return new Date(now.getFullYear(), now.getMonth() - 3, now.getDate());
      case '6m':
        return new Date(now.getFullYear(), now.getMonth() - 6, now.getDate());
      case '1y':
      default:
        return new Date(now.getFullYear() - 1, now.getMonth(), now.getDate());
      case '2y':
        return new Date(now.getFullYear() - 2, now.getMonth(), now.getDate());
      case '5y':
        return new Date(now.getFullYear() - 5, now.getMonth(), now.getDate());
    }
  }
  
  // 複数の銘柄のリターンを並行計算
  static async calculateMultipleReturns(symbols, period = '1y') {
    console.log(`Calculating returns for ${symbols.length} symbols`);
    
    const results = {};
    const batchSize = 5; // API制限を避けるためバッチ処理
    
    for (let i = 0; i < symbols.length; i += batchSize) {
      const batch = symbols.slice(i, i + batchSize);
      const batchPromises = batch.map(async (symbol) => {
        const result = await this.calculateReturns(symbol, period);
        return { symbol, ...result };
      });
      
      const batchResults = await Promise.allSettled(batchPromises);
      
      batchResults.forEach((result) => {
        if (result.status === 'fulfilled') {
          results[result.value.symbol] = {
            annualReturn: result.value.annualReturn,
            volatility: result.value.volatility
          };
        } else {
          console.error(`Failed to calculate returns for symbol:`, result.reason);
        }
      });
      
      // バッチ間で少し待機
      if (i + batchSize < symbols.length) {
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }
    
    return results;
  }
}

module.exports = ReturnCalculator; 