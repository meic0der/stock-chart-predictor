const Favorite = require('../models/Favorite');
const YahooFinanceService = require('../services/YahooFinanceService');

class FavoriteController {
  // お気に入り一覧を取得
  static async getAllFavorites(req, res) {
    try {
      const favorites = await Favorite.getAll();
      res.json({
        success: true,
        favorites
      });
    } catch (error) {
      console.error('Error fetching favorites:', error);
      res.status(500).json({
        success: false,
        message: 'お気に入りの取得に失敗しました。'
      });
    }
  }

  // お気に入りに追加
  static async addToFavorites(req, res) {
    try {
      const { symbol } = req.body;
      
      if (!symbol) {
        return res.status(400).json({
          success: false,
          message: '銘柄コードが必要です。'
        });
      }

      const favorite = await Favorite.add(symbol);
      res.json({
        success: true,
        favorite
      });
    } catch (error) {
      console.error('Error adding to favorites:', error);
      res.status(500).json({
        success: false,
        message: 'お気に入りへの追加に失敗しました。'
      });
    }
  }

  // お気に入りから削除
  static async removeFromFavorites(req, res) {
    try {
      const { symbol } = req.params;
      
      if (!symbol) {
        return res.status(400).json({
          success: false,
          message: '銘柄コードが必要です。'
        });
      }

      const success = await Favorite.remove(symbol);
      
      if (success) {
        res.json({
          success: true,
          message: 'お気に入りから削除しました。'
        });
      } else {
        res.status(404).json({
          success: false,
          message: 'お気に入りが見つかりません。'
        });
      }
    } catch (error) {
      console.error('Error removing from favorites:', error);
      res.status(500).json({
        success: false,
        message: 'お気に入りからの削除に失敗しました。'
      });
    }
  }

  // お気に入りかどうかをチェック
  static async checkIsFavorite(req, res) {
    try {
      const { symbol } = req.params;
      
      if (!symbol) {
        return res.status(400).json({
          success: false,
          message: '銘柄コードが必要です。'
        });
      }

      const isFavorite = await Favorite.isFavorite(symbol);
      res.json({
        success: true,
        isFavorite
      });
    } catch (error) {
      console.error('Error checking favorite status:', error);
      res.status(500).json({
        success: false,
        message: 'お気に入り状態の確認に失敗しました。'
      });
    }
  }

  // お気に入り銘柄の最新情報を更新
  static async updateAllFavorites(req, res) {
    try {
      const favorites = await Favorite.getAll();
      const symbols = favorites.map(fav => fav.symbol);
      
      if (symbols.length === 0) {
        return res.json({
          success: true,
          message: '更新するお気に入りがありません。',
          updatedCount: 0
        });
      }

      console.log(`Updating ${symbols.length} favorite stocks: ${symbols.join(', ')}`);
      
      // YahooFinanceServiceを使用して選択した銘柄を更新
      const updatedStocks = await YahooFinanceService.updateSelectedStocks(symbols);
      
      const updatedCount = updatedStocks.length;
      const errors = symbols.length - updatedCount > 0 ? 
        [`${symbols.length - updatedCount}件の銘柄で更新に失敗しました`] : [];

      res.json({
        success: true,
        message: `${updatedCount}件のお気に入りを更新しました。`,
        updatedCount,
        totalCount: symbols.length,
        errors: errors.length > 0 ? errors : undefined
      });
    } catch (error) {
      console.error('Error updating favorites:', error);
      res.status(500).json({
        success: false,
        message: 'お気に入りの更新に失敗しました。'
      });
    }
  }
}

module.exports = FavoriteController; 