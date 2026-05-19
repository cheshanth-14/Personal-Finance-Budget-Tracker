// src/routes/budgetRoutes.js
const express = require('express');
const router = express.Router();
const {
  getBudgets,
  createBudget,
  updateBudget,
  deleteBudget,
  budgetValidation,
  updateBudgetValidation,
} = require('../controllers/budgetController');
const { protect } = require('../middleware/authMiddleware');
const { validate } = require('../middleware/validateMiddleware');

router.use(protect);

router.get('/', getBudgets);
router.post('/', budgetValidation, validate, createBudget);
router.put('/:id', updateBudgetValidation, validate, updateBudget);
router.delete('/:id', deleteBudget);

module.exports = router;
