const History = require('../models/History');
const AuthService = require('../services/AuthService');

class HistoryController {
  static async getAllHistories(req, res) {
    try {
      // 認証チェック
      const sessionId = req.cookies.sessionId;
      const session = AuthService.getCurrentUser(sessionId);
      if (!session) {
        return res.status(401).json({ error: "認証が必要です" });
      }

      const limit = parseInt(req.query.limit) || 20;
      const histories = await History.findAll(limit);
      
      res.json(histories);
    } catch (err) {
      console.error('Get histories error:', err);
      res.status(500).json({ error: "履歴の取得に失敗しました" });
    }
  }

  static async getHistoryById(req, res) {
    try {
      const { id } = req.params;
      
      // 認証チェック
      const sessionId = req.cookies.sessionId;
      const session = AuthService.getCurrentUser(sessionId);
      if (!session) {
        return res.status(401).json({ error: "認証が必要です" });
      }

      const history = await History.findById(id);
      if (!history) {
        return res.status(404).json({ error: "履歴が見つかりません" });
      }

      res.json(history);
    } catch (err) {
      console.error('Get history by id error:', err);
      res.status(500).json({ error: "履歴の取得に失敗しました" });
    }
  }

  static async updateNote(req, res) {
    try {
      const { id } = req.params;
      const { note } = req.body;

      // バリデーション
      if (typeof note !== 'string') {
        return res.status(400).json({ 
          error: 'noteは文字列である必要があります' 
        });
      }

      // 認証チェック
      const sessionId = req.cookies.sessionId;
      const session = AuthService.getCurrentUser(sessionId);
      if (!session) {
        return res.status(401).json({ error: "認証が必要です" });
      }

      // 履歴の存在確認
      const history = await History.findById(id);
      if (!history) {
        return res.status(404).json({ error: "履歴が見つかりません" });
      }

      await History.updateNote(id, note);
      res.sendStatus(200);
    } catch (err) {
      console.error('Update note error:', err);
      res.status(500).json({ error: "メモの更新に失敗しました" });
    }
  }

  static async deleteHistory(req, res) {
    try {
      const { id } = req.params;

      // 認証チェック
      const sessionId = req.cookies.sessionId;
      const session = AuthService.getCurrentUser(sessionId);
      if (!session) {
        return res.status(401).json({ error: "認証が必要です" });
      }

      // 履歴の存在確認
      const history = await History.findById(id);
      if (!history) {
        return res.status(404).json({ error: "履歴が見つかりません" });
      }

      await History.delete(id);
      res.sendStatus(204);
    } catch (err) {
      console.error('Delete history error:', err);
      res.status(500).json({ error: "履歴の削除に失敗しました" });
    }
  }
}

module.exports = HistoryController; 