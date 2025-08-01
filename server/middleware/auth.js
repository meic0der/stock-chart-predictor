const AuthService = require('../services/AuthService');

const requireAuth = (req, res, next) => {
  const sessionId = req.cookies.sessionId;
  const session = AuthService.getCurrentUser(sessionId);
  
  if (!session) {
    return res.status(401).json({ error: "認証が必要です" });
  }
  
  req.user = session;
  next();
};

const optionalAuth = (req, res, next) => {
  const sessionId = req.cookies.sessionId;
  const session = AuthService.getCurrentUser(sessionId);
  
  if (session) {
    req.user = session;
  }
  
  next();
};

module.exports = {
  requireAuth,
  optionalAuth
}; 