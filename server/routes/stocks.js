const express = require('express');
const router = express.Router();
const StockController = require('../controllers/StockController');

// 特定のパスを先に定義（パラメータ付きルートより前に配置）
router.get('/all', StockController.getAllStocks);
router.get('/filtered', StockController.getFilteredStocks);
router.get('/filters', StockController.getAvailableFilters);
router.get('/last-updated', StockController.getLastUpdated);

// 更新エンドポイント
router.post('/update-selected', StockController.updateSelectedStocks);
router.post('/update-all', StockController.updateAllStocks);
router.post('/reset-and-reload', StockController.resetAndReloadStocks);

// パラメータ付きルートは最後に配置
router.get('/:symbol', StockController.getStockBySymbol);

module.exports = router; 