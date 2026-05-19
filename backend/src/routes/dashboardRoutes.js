// src/routes/dashboardRoutes.js
const express = require('express');
const router = express.Router();
const {
  getSummary,
  getCharts,
  getRecentTransactions,
} = require('../controllers/dashboardController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);

router.get('/summary', getSummary);
router.get('/charts', getCharts);
router.get('/recent-transactions', getRecentTransactions);

module.exports = router;
