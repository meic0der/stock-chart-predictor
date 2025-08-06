const db = require('../db');

class Favorite {
  static async getAll() {
    const favorites = await db('favorites')
      .join('stocks', 'favorites.symbol', 'stocks.symbol')
      .select(
        'favorites.id',
        'favorites.symbol',
        'stocks.name',
        'stocks.country',
        'stocks.sector',
        'stocks.price',
        'stocks.pe_ratio as pe',
        'stocks.pb_ratio as pb',
        'stocks.dividend as dividend',
        'stocks.dividend_yield as dividendYield',
        'stocks.annual_return as annualReturn',
        'stocks.volatility as volatility',
        'stocks.last_updated as lastUpdated',
        'favorites.added_at'
      )
      .orderBy('favorites.added_at', 'desc');

    // 数値フィールドを適切に変換
    return favorites.map(favorite => ({
      ...favorite,
      pe: favorite.pe ? parseFloat(favorite.pe) : null,
      pb: favorite.pb ? parseFloat(favorite.pb) : null,
      dividend: favorite.dividend ? parseFloat(favorite.dividend) : null,
      dividendYield: favorite.dividendYield ? parseFloat(favorite.dividendYield) : null,
      annualReturn: favorite.annualReturn ? parseFloat(favorite.annualReturn) : null,
      volatility: favorite.volatility ? parseFloat(favorite.volatility) : null
    }));
  }

  static async getBySymbol(symbol) {
    return await db('favorites').where('symbol', symbol).first();
  }

  static async add(symbol) {
    const existing = await this.getBySymbol(symbol);
    if (existing) {
      return existing; // 既に存在する場合はそのまま返す
    }

    const [favorite] = await db('favorites').insert({
      symbol,
      added_at: db.fn.now()
    }).returning('*');
    
    return favorite;
  }

  static async remove(symbol) {
    const deleted = await db('favorites')
      .where('symbol', symbol)
      .del();
    
    return deleted > 0;
  }

  static async isFavorite(symbol) {
    const favorite = await this.getBySymbol(symbol);
    return !!favorite;
  }
}

module.exports = Favorite; 