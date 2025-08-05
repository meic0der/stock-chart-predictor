const db = require('../db');

class Favorite {
  static async getAll() {
    return await db('favorites')
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
        'stocks.dividend_yield as dividendYield',
        'favorites.added_at'
      )
      .orderBy('favorites.added_at', 'desc');
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