const express = require('express');
const router = express.Router();
const AuthController = require('../controllers/AuthController');
const { requireAuth } = require('../middleware/auth');

// 認証不要のルート
router.post('/register', AuthController.register);
router.post('/login', AuthController.login);
router.post('/logout', AuthController.logout);

// 認証が必要なルート
router.get('/me', requireAuth, AuthController.getCurrentUser);

module.exports = router;
