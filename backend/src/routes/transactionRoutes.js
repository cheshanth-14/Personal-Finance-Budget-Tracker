// src/routes/transactionRoutes.js
const express = require('express');
const router = express.Router();
const {
  getTransactions,
  createTransaction,
  updateTransaction,
  deleteTransaction,
  transactionValidation,
} = require('../controllers/transactionController');
const { protect } = require('../middleware/authMiddleware');
const { validate } = require('../middleware/validateMiddleware');

router.use(protect);

router.get('/', getTransactions);
router.post('/', transactionValidation, validate, createTransaction);
router.put('/:id', transactionValidation, validate, updateTransaction);
router.delete('/:id', deleteTransaction);

module.exports = router;
