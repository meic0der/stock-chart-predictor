const Portfolio = require('../models/Portfolio');

class PortfolioController {
  // ポートフォリオ一覧を取得
  static async getPortfolio(req, res) {
    try {
      const portfolio = await Portfolio.getAll();
      res.json({
        success: true,
        portfolio
      });
    } catch (error) {
      console.error('Error fetching portfolio:', error);
      res.status(500).json({
        success: false,
        message: 'ポートフォリオの取得に失敗しました。'
      });
    }
  }

  // ポートフォリオサマリーを取得
  static async getPortfolioSummary(req, res) {
    try {
      const summary = await Portfolio.getPortfolioSummary();
      res.json({
        success: true,
        portfolioData: summary
      });
    } catch (error) {
      console.error('Error fetching portfolio summary:', error);
      res.status(500).json({
        success: false,
        message: 'ポートフォリオサマリーの取得に失敗しました。'
      });
    }
  }

  // ポートフォリオに追加
  static async addToPortfolio(req, res) {
    try {
      const { symbol, shares, purchasePrice } = req.body;
      
      if (!symbol || !shares || !purchasePrice) {
        return res.status(400).json({
          success: false,
          message: '銘柄コード、株数、購入価格が必要です。'
        });
      }

      if (shares <= 0 || purchasePrice <= 0) {
        return res.status(400).json({
          success: false,
          message: '株数と購入価格は正の値である必要があります。'
        });
      }

      const portfolio = await Portfolio.add(symbol, shares, purchasePrice);
      res.json({
        success: true,
        portfolio
      });
    } catch (error) {
      console.error('Error adding to portfolio:', error);
      res.status(500).json({
        success: false,
        message: 'ポートフォリオへの追加に失敗しました。'
      });
    }
  }

  // ポートフォリオを更新
  static async updatePortfolio(req, res) {
    try {
      const { symbol } = req.params;
      const { shares, purchasePrice } = req.body;
      
      if (!symbol || !shares || !purchasePrice) {
        return res.status(400).json({
          success: false,
          message: '銘柄コード、株数、購入価格が必要です。'
        });
      }

      if (shares <= 0 || purchasePrice <= 0) {
        return res.status(400).json({
          success: false,
          message: '株数と購入価格は正の値である必要があります。'
        });
      }

      const portfolio = await Portfolio.update(symbol, shares, purchasePrice);
      
      if (portfolio) {
        res.json({
          success: true,
          portfolio
        });
      } else {
        res.status(404).json({
          success: false,
          message: 'ポートフォリオが見つかりません。'
        });
      }
    } catch (error) {
      console.error('Error updating portfolio:', error);
      res.status(500).json({
        success: false,
        message: 'ポートフォリオの更新に失敗しました。'
      });
    }
  }

  // ポートフォリオから削除
  static async removeFromPortfolio(req, res) {
    try {
      const { symbol } = req.params;
      
      if (!symbol) {
        return res.status(400).json({
          success: false,
          message: '銘柄コードが必要です。'
        });
      }

      const success = await Portfolio.remove(symbol);
      
      if (success) {
        res.json({
          success: true,
          message: 'ポートフォリオから削除しました。'
        });
      } else {
        res.status(404).json({
          success: false,
          message: 'ポートフォリオが見つかりません。'
        });
      }
    } catch (error) {
      console.error('Error removing from portfolio:', error);
      res.status(500).json({
        success: false,
        message: 'ポートフォリオからの削除に失敗しました。'
      });
    }
  }
}

module.exports = PortfolioController; 