const express = require('express');
const router = express.Router();
const FavoriteController = require('../controllers/FavoriteController');

// お気に入り一覧を取得
router.get('/', FavoriteController.getAllFavorites);

// お気に入りに追加
router.post('/', FavoriteController.addToFavorites);

// お気に入りから削除
router.delete('/:symbol', FavoriteController.removeFromFavorites);

// お気に入りかどうかをチェック
router.get('/check/:symbol', FavoriteController.checkIsFavorite);

// お気に入り銘柄の最新情報を更新
router.put('/update-all', FavoriteController.updateAllFavorites);

module.exports = router; 