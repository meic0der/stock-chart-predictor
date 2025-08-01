// server/routes/history.js
const express = require('express');
const router = express.Router();
const HistoryController = require('../controllers/HistoryController');

router.get('/history', HistoryController.getAllHistories);
router.get('/history/:id', HistoryController.getHistoryById);
router.patch('/history/:id', HistoryController.updateNote);
router.delete('/history/:id', HistoryController.deleteHistory);

module.exports = router;
