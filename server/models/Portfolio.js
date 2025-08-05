const db = require('../db');

class Portfolio {
  static async getAll() {
    return await db('portfolio')
      .join('stocks', 'portfolio.symbol', 'stocks.symbol')
      .select(
        'portfolio.id',
        'portfolio.symbol',
        'stocks.name',
        'portfolio.shares',
        'stocks.price as currentPrice',
        'portfolio.purchase_price as purchasePrice',
        'portfolio.purchase_date as purchaseDate',
        db.raw('portfolio.shares * stocks.price as value'),
        db.raw('(stocks.price - portfolio.purchase_price) * portfolio.shares as return'),
        db.raw('((stocks.price - portfolio.purchase_price) / portfolio.purchase_price) * 100 as returnPercent')
      )
      .orderBy('portfolio.purchase_date', 'desc');
  }

  static async getBySymbol(symbol) {
    return await db('portfolio').where('symbol', symbol).first();
  }

  static async add(symbol, shares, purchasePrice) {
    const existing = await this.getBySymbol(symbol);
    
    if (existing) {
      // 既に存在する場合は株数を追加
      const [updated] = await db('portfolio')
        .where('symbol', symbol)
        .update({
          shares: db.raw(`shares + ${shares}`),
          updated_at: db.fn.now()
        })
        .returning('*');
      
      return updated;
    } else {
      // 新規追加
      const [portfolio] = await db('portfolio').insert({
        symbol,
        shares,
        purchase_price: purchasePrice,
        purchase_date: db.fn.now(),
        created_at: db.fn.now(),
        updated_at: db.fn.now()
      }).returning('*');
      
      return portfolio;
    }
  }

  static async update(symbol, shares, purchasePrice) {
    const [updated] = await db('portfolio')
      .where('symbol', symbol)
      .update({
        shares,
        purchase_price: purchasePrice,
        updated_at: db.fn.now()
      })
      .returning('*');
    
    return updated;
  }

  static async remove(symbol) {
    const deleted = await db('portfolio')
      .where('symbol', symbol)
      .del();
    
    return deleted > 0;
  }

  static async getPortfolioSummary() {
    const portfolio = await this.getAll();
    
    if (portfolio.length === 0) {
      return {
        totalValue: 0,
        totalInvestment: 0,
        unrealizedPnL: 0,
        averageReturn: 0,
        annualDividends: 0,
        portfolioRisk: 0,
        dividendYield: 0,
        stocks: []
      };
    }

    const totalValue = portfolio.reduce((sum, stock) => sum + parseFloat(stock.value), 0);
    const totalInvestment = portfolio.reduce((sum, stock) => sum + (stock.purchasePrice * stock.shares), 0);
    const unrealizedPnL = totalValue - totalInvestment;
    const averageReturn = portfolio.reduce((sum, stock) => sum + stock.returnPercent, 0) / portfolio.length;
    
    // 簡易的な配当計算（実際の実装ではより詳細な計算が必要）
    const annualDividends = portfolio.reduce((sum, stock) => {
      const dividendYield = stock.dividendYield || 0;
      return sum + (stock.value * dividendYield / 100);
    }, 0);

    const dividendYield = totalValue > 0 ? (annualDividends / totalValue) * 100 : 0;

    return {
      totalValue,
      totalInvestment,
      unrealizedPnL,
      averageReturn,
      annualDividends,
      portfolioRisk: 3.7, // 簡易的な値
      dividendYield,
      stocks: portfolio,
      lastUpdated: new Date().toLocaleDateString('en-US')
    };
  }
}

module.exports = Portfolio; 