// src/controllers/budgetController.js
const { body } = require('express-validator');
const Budget = require('../models/Budget');
const Transaction = require('../models/Transaction');
const Category = require('../models/Category');

// ------- Validation Rules -------
const budgetValidation = [
  body('categoryId').notEmpty().withMessage('Category is required'),
  body('amount').isFloat({ min: 1 }).withMessage('Budget amount must be at least 1'),
  body('month')
    .isInt({ min: 1, max: 12 })
    .withMessage('Month must be between 1 and 12'),
  body('year').isInt({ min: 2000 }).withMessage('Year must be a valid year'),
];

const updateBudgetValidation = [
  body('amount').isFloat({ min: 1 }).withMessage('Budget amount must be at least 1'),
];

// ------- Helper -------

/**
 * Calculate spending for a budget category within a given month/year
 */
const getSpentAmount = async (userId, categoryId, month, year) => {
  const startDate = new Date(year, month - 1, 1);
  const endDate = new Date(year, month, 0, 23, 59, 59, 999);

  const result = await Transaction.aggregate([
    {
      $match: {
        userId: userId,
        categoryId: categoryId,
        type: 'expense',
        date: { $gte: startDate, $lte: endDate },
      },
    },
    { $group: { _id: null, total: { $sum: '$amount' } } },
  ]);

  return result.length > 0 ? result[0].total : 0;
};

// ------- Controller Functions -------

/**
 * GET /api/budgets?month=&year=
 * Get all budgets with spending calculations
 */
const getBudgets = async (req, res) => {
  try {
    const now = new Date();
    const month = parseInt(req.query.month) || now.getMonth() + 1;
    const year = parseInt(req.query.year) || now.getFullYear();

    const budgets = await Budget.find({
      userId: req.user._id,
      month,
      year,
    }).populate('categoryId', 'name color type');

    // Calculate spent/remaining/percentage for each budget
    const budgetsWithStats = await Promise.all(
      budgets.map(async (budget) => {
        const spent = await getSpentAmount(
          req.user._id,
          budget.categoryId._id,
          month,
          year
        );
        const remaining = budget.amount - spent;
        const percentage = budget.amount > 0 ? (spent / budget.amount) * 100 : 0;
        return {
          ...budget.toObject(),
          spent,
          remaining,
          percentage: parseFloat(percentage.toFixed(2)),
          isExceeded: spent > budget.amount,
        };
      })
    );

    res.json(budgetsWithStats);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * POST /api/budgets
 * Create a new budget (no duplicates per category+month+year)
 */
const createBudget = async (req, res) => {
  try {
    const { categoryId, amount, month, year } = req.body;

    // Ensure category belongs to user
    const category = await Category.findOne({ _id: categoryId, userId: req.user._id });
    if (!category) {
      return res.status(400).json({ message: 'Invalid category' });
    }

    // Check for duplicate
    const existing = await Budget.findOne({
      userId: req.user._id,
      categoryId,
      month,
      year,
    });
    if (existing) {
      return res
        .status(400)
        .json({ message: 'A budget for this category and period already exists' });
    }

    const budget = await Budget.create({
      userId: req.user._id,
      categoryId,
      amount,
      month,
      year,
    });

    const populated = await budget.populate('categoryId', 'name color type');
    res.status(201).json(populated);
  } catch (error) {
    if (error.code === 11000) {
      return res
        .status(400)
        .json({ message: 'A budget for this category and period already exists' });
    }
    res.status(500).json({ message: error.message });
  }
};

/**
 * PUT /api/budgets/:id
 * Update budget amount
 */
const updateBudget = async (req, res) => {
  try {
    const budget = await Budget.findOne({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!budget) {
      return res.status(404).json({ message: 'Budget not found' });
    }

    budget.amount = req.body.amount;
    const updated = await budget.save();
    const populated = await updated.populate('categoryId', 'name color type');
    res.json(populated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * DELETE /api/budgets/:id
 * Delete a budget
 */
const deleteBudget = async (req, res) => {
  try {
    const budget = await Budget.findOne({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!budget) {
      return res.status(404).json({ message: 'Budget not found' });
    }

    await budget.deleteOne();
    res.json({ message: 'Budget deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getBudgets,
  createBudget,
  updateBudget,
  deleteBudget,
  budgetValidation,
  updateBudgetValidation,
};
