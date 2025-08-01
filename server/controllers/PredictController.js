const StockService = require('../services/StockService');
const History = require('../models/History');
const AuthService = require('../services/AuthService');

class PredictController {
  static async predict(req, res) {
    try {
      const { symbol, range = "1w", model = "model1" } = req.body;
      
      // バリデーション
      if (!symbol) {
        return res.status(400).json({ error: "symbolは必須です" });
      }

      // 認証チェック
      const sessionId = req.cookies.sessionId;
      const session = AuthService.getCurrentUser(sessionId);
      if (!session) {
        return res.status(401).json({ error: "認証が必要です" });
      }

      // 株価データの取得
      const { actual, actualDates } = await StockService.getStockData(symbol, range);
      const lastPrice = actual[actual.length - 1];

      // 予測の実行
      const predicted = await StockService.predictStockPrice(lastPrice, model);
      const predictedDates = StockService.generatePredictedDates();

      // 会社情報の取得
      const company = await StockService.getCompanyInfo(symbol);

      // 履歴の保存
      const historyData = {
        symbol,
        actual,
        actualDates,
        predicted,
        predictedDates,
        company: JSON.stringify(company),
        created_at: new Date(),
        user_id: 1, // TODO: 実際のユーザーIDを取得
        note: "",
        range,
        model,
      };

      await History.upsert(historyData);

      res.json({
        symbol,
        predicted,
        actual,
        actualDates,
        predictedDates,
        company,
        created_at: new Date(),
      });
    } catch (err) {
      console.error('Prediction error:', err);
      
      if (err.message.includes('株価データが取得できませんでした')) {
        return res.status(400).json({ error: err.message });
      }
      
      if (err.message.includes('株価データが見つかりませんでした')) {
        return res.status(404).json({ error: err.message });
      }
      
      res.status(500).json({ error: "株価取得に失敗しました" });
    }
  }
}

module.exports = PredictController; 