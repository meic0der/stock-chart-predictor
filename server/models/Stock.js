const db = require('../db');

class Stock {
  static async getAll() {
    return await db('stocks').select('*').orderBy('symbol');
  }

  static async getBySymbol(symbol) {
    return await db('stocks').where('symbol', symbol).first();
  }

  static async getFiltered(filters = {}) {
    let query = db('stocks').select('*');

    // デバッグ用ログ
    console.log('Filtering with conditions:', filters);

    // 国フィルター（undefined、null、空文字、'All Countries'の場合は除外）
    if (filters.country && filters.country !== 'All Countries' && filters.country.trim() !== '') {
      query = query.where('country', filters.country);
      console.log('Applied country filter:', filters.country);
    }

    // セクターフィルター（undefined、null、空文字、'All Sectors'の場合は除外）
    if (filters.sector && filters.sector !== 'All Sectors' && filters.sector.trim() !== '') {
      query = query.where('sector', filters.sector);
      console.log('Applied sector filter:', filters.sector);
    }

    // 名前フィルター（部分一致検索）
    if (filters.name && filters.name.trim() !== '') {
      query = query.whereILike('name', `%${filters.name}%`);
      console.log('Applied name filter:', filters.name);
    }

    if (filters.peRange) {
      query = query.whereBetween('pe_ratio', [filters.peRange.min, filters.peRange.max]);
      console.log('Applied PE range filter:', filters.peRange);
    }

    if (filters.pbRange) {
      query = query.whereBetween('pb_ratio', [filters.pbRange.min, filters.pbRange.max]);
      console.log('Applied PB range filter:', filters.pbRange);
    }

    if (filters.dividendRange) {
      query = query.whereBetween('dividend_yield', [filters.dividendRange.min, filters.dividendRange.max]);
      console.log('Applied dividend range filter:', filters.dividendRange);
    }

    if (filters.marketCapRange) {
      query = query.whereBetween('market_cap', [filters.marketCapRange.min, filters.marketCapRange.max]);
      console.log('Applied market cap range filter:', filters.marketCapRange);
    }

    const result = await query.orderBy('symbol');
    console.log('Filtered result count:', result.length);
    
    return result;
  }

  static async create(stockData) {
    const [stock] = await db('stocks').insert(stockData).returning('*');
    return stock;
  }

  static async update(symbol, stockData) {
    const [stock] = await db('stocks')
      .where('symbol', symbol)
      .update({
        ...stockData,
        updated_at: db.fn.now()
      })
      .returning('*');
    return stock;
  }

  static async upsert(stockData) {
    const existingStock = await this.getBySymbol(stockData.symbol);
    
    if (existingStock) {
      return await this.update(stockData.symbol, stockData);
    } else {
      return await this.create(stockData);
    }
  }

  static async updateMultiple(symbols, stockDataArray) {
    const updates = [];
    
    for (let i = 0; i < symbols.length; i++) {
      const symbol = symbols[i];
      const stockData = stockDataArray[i];
      
      if (stockData) {
        const updatedStock = await this.upsert({
          ...stockData,
          last_updated: db.fn.now()
        });
        updates.push(updatedStock);
      }
    }
    
    return updates;
  }

  static async getAvailableFilters() {
    const countries = await db('stocks').distinct('country').pluck('country');
    const sectors = await db('stocks').distinct('sector').pluck('sector');
    
    return {
      countries: ['All Countries', ...countries.sort()],
      sectors: ['All Sectors', ...sectors.sort()]
    };
  }

  static async getLastUpdated() {
    const result = await db('stocks').max('last_updated as last_updated').first();
    return result.last_updated;
  }

  static async getStocksBySymbols(symbols) {
    return await db('stocks').whereIn('symbol', symbols).orderBy('symbol');
  }

  static async clearAll() {
    return await db('stocks').del();
  }
}

module.exports = Stock; 