// src/controllers/transactionController.js
const { body } = require('express-validator');
const Transaction = require('../models/Transaction');
const Category = require('../models/Category');

// ------- Validation Rules -------
const transactionValidation = [
  body('title').trim().notEmpty().withMessage('Title is required'),
  body('amount')
    .isFloat({ min: 0.01 })
    .withMessage('Amount must be a positive number (min 0.01)'),
  body('type').isIn(['income', 'expense']).withMessage('Type must be income or expense'),
  body('categoryId').notEmpty().withMessage('Category is required'),
  body('date').isISO8601().withMessage('Date must be a valid date'),
  body('note')
    .optional()
    .isLength({ max: 300 })
    .withMessage('Note cannot exceed 300 characters'),
];

// ------- Controller Functions -------

/**
 * GET /api/transactions
 * Returns paginated, filtered transactions for the current user
 */
const getTransactions = async (req, res) => {
  try {
    const {
      type,
      categoryId,
      startDate,
      endDate,
      page = 1,
      limit = 10,
    } = req.query;

    const filter = { userId: req.user._id };

    if (type) filter.type = type;
    if (categoryId) filter.categoryId = categoryId;
    if (startDate || endDate) {
      filter.date = {};
      if (startDate) filter.date.$gte = new Date(startDate);
      if (endDate) {
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        filter.date.$lte = end;
      }
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const total = await Transaction.countDocuments(filter);
    const transactions = await Transaction.find(filter)
      .populate('categoryId', 'name color type')
      .sort({ date: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    res.json({
      transactions,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / parseInt(limit)),
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * POST /api/transactions
 * Create a new transaction
 */
const createTransaction = async (req, res) => {
  try {
    const { title, amount, type, categoryId, date, note } = req.body;

    // Ensure category belongs to the user
    const category = await Category.findOne({ _id: categoryId, userId: req.user._id });
    if (!category) {
      return res.status(400).json({ message: 'Invalid category' });
    }

    const transaction = await Transaction.create({
      userId: req.user._id,
      title,
      amount,
      type,
      categoryId,
      date: new Date(date),
      note: note || '',
    });

    const populated = await transaction.populate('categoryId', 'name color type');
    res.status(201).json(populated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * PUT /api/transactions/:id
 * Update a transaction (must belong to current user)
 */
const updateTransaction = async (req, res) => {
  try {
    const transaction = await Transaction.findOne({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!transaction) {
      return res.status(404).json({ message: 'Transaction not found' });
    }

    const { title, amount, type, categoryId, date, note } = req.body;

    if (categoryId) {
      const category = await Category.findOne({ _id: categoryId, userId: req.user._id });
      if (!category) {
        return res.status(400).json({ message: 'Invalid category' });
      }
    }

    if (title !== undefined) transaction.title = title;
    if (amount !== undefined) transaction.amount = amount;
    if (type !== undefined) transaction.type = type;
    if (categoryId !== undefined) transaction.categoryId = categoryId;
    if (date !== undefined) transaction.date = new Date(date);
    if (note !== undefined) transaction.note = note;

    const updated = await transaction.save();
    const populated = await updated.populate('categoryId', 'name color type');
    res.json(populated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * DELETE /api/transactions/:id
 * Delete a transaction (must belong to current user)
 */
const deleteTransaction = async (req, res) => {
  try {
    const transaction = await Transaction.findOne({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!transaction) {
      return res.status(404).json({ message: 'Transaction not found' });
    }

    await transaction.deleteOne();
    res.json({ message: 'Transaction deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getTransactions,
  createTransaction,
  updateTransaction,
  deleteTransaction,
  transactionValidation,
};
