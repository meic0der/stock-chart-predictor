const crypto = require('crypto');

class AuthService {
  constructor() {
    this.sessions = {};
  }

  createSession(username) {
    const sessionId = crypto.randomBytes(16).toString('hex');
    this.sessions[sessionId] = { 
      username, 
      createdAt: Date.now() 
    };
    return sessionId;
  }

  getSession(sessionId) {
    return this.sessions[sessionId];
  }

  deleteSession(sessionId) {
    delete this.sessions[sessionId];
  }

  isSessionValid(sessionId) {
    const session = this.sessions[sessionId];
    if (!session) return false;

    // セッションの有効期限を24時間に設定
    const sessionAge = Date.now() - session.createdAt;
    const maxAge = 24 * 60 * 60 * 1000; // 24時間

    if (sessionAge > maxAge) {
      this.deleteSession(sessionId);
      return false;
    }

    return true;
  }

  getCurrentUser(sessionId) {
    if (!this.isSessionValid(sessionId)) {
      return null;
    }
    return this.sessions[sessionId];
  }
}

// シングルトンインスタンスを作成
const authService = new AuthService();

module.exports = authService; 