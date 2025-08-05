const Favorite = require('../models/Favorite');

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
}

module.exports = FavoriteController; 