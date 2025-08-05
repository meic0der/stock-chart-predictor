const express = require('express');
const router = express.Router();
const PortfolioController = require('../controllers/PortfolioController');

// ポートフォリオ一覧を取得
router.get('/', PortfolioController.getPortfolio);

// ポートフォリオサマリーを取得
router.get('/summary', PortfolioController.getPortfolioSummary);

// ポートフォリオに追加
router.post('/add', PortfolioController.addToPortfolio);

// ポートフォリオを更新
router.put('/:symbol', PortfolioController.updatePortfolio);

// ポートフォリオから削除
router.delete('/:symbol', PortfolioController.removeFromPortfolio);

module.exports = router; 