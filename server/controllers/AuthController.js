const User = require('../models/User');
const AuthService = require('../services/AuthService');

class AuthController {
  static async register(req, res) {
    try {
      const { username, email, password } = req.body;

      // バリデーション
      if (!username || !email || !password) {
        return res.status(400).json({ 
          error: 'ユーザー名、メールアドレス、パスワードは必須です' 
        });
      }

      // 既存ユーザーの確認
      const existingUser = await User.findByUsername(username);
      if (existingUser) {
        return res.status(409).json({ 
          error: 'このユーザー名は既に使用されています' 
        });
      }

      await User.create({ username, email, password });
      res.status(201).json({ message: 'ユーザー登録成功' });
    } catch (err) {
      console.error('Registration error:', err);
      res.status(500).json({ error: '登録に失敗しました' });
    }
  }

  static async login(req, res) {
    try {
      const { username, password } = req.body;

      // バリデーション
      if (!username || !password) {
        return res.status(400).json({ 
          error: 'ユーザー名とパスワードは必須です' 
        });
      }

      const user = await User.findByUsername(username);
      if (!user) {
        return res.status(401).json({ 
          error: 'ユーザー名が存在しません' 
        });
      }

      const isValidPassword = User.verifyPassword(password, user.salt, user.password);
      if (!isValidPassword) {
        return res.status(401).json({ 
          error: 'パスワードが間違っています' 
        });
      }

      const sessionId = AuthService.createSession(username);
      res.cookie('sessionId', sessionId, { httpOnly: true });
      res.json({ message: 'ログイン成功' });
    } catch (err) {
      console.error('Login error:', err);
      res.status(500).json({ error: 'ログインエラー' });
    }
  }

  static async logout(req, res) {
    try {
      const sessionId = req.cookies.sessionId;
      if (sessionId) {
        AuthService.deleteSession(sessionId);
      }
      res.clearCookie('sessionId');
      res.json({ message: 'ログアウト成功' });
    } catch (err) {
      console.error('Logout error:', err);
      res.status(500).json({ error: 'ログアウトエラー' });
    }
  }

  static async getCurrentUser(req, res) {
    try {
      const sessionId = req.cookies.sessionId;
      const session = AuthService.getCurrentUser(sessionId);
      
      if (!session) {
        return res.status(401).json({ error: '認証が必要です' });
      }

      const user = await User.findByUsername(session.username);
      if (!user) {
        return res.status(404).json({ error: 'ユーザーが見つかりません' });
      }

      res.json({ 
        user: { 
          id: user.id, 
          username: user.username, 
          email: user.email 
        } 
      });
    } catch (err) {
      console.error('Get current user error:', err);
      res.status(500).json({ error: 'ユーザー情報の取得に失敗しました' });
    }
  }
}

module.exports = AuthController; 