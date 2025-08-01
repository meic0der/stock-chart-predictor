// server/routes/predict.js
const express = require('express');
const router = express.Router();
const PredictController = require('../controllers/PredictController');

router.post('/predict', PredictController.predict);

module.exports = router;
