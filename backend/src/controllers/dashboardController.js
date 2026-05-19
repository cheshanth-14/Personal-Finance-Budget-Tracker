// src/controllers/dashboardController.js
const Transaction = require('../models/Transaction');
const Budget = require('../models/Budget');
const Category = require('../models/Category');
const mongoose = require('mongoose');

// ------- Helper -------

/**
 * Build start and end Date objects for a given month/year
 */
const getMonthRange = (month, year) => {
  const startDate = new Date(year, month - 1, 1);
  const endDate = new Date(year, month, 0, 23, 59, 59, 999);
  return { startDate, endDate };
};

// ------- Controller Functions -------

/**
 * GET /api/dashboard/summary?month=&year=
 * Returns total income, total expenses, balance, and budget usage %
 */
const getSummary = async (req, res) => {
  try {
    const now = new Date();
    const month = parseInt(req.query.month) || now.getMonth() + 1;
    const year = parseInt(req.query.year) || now.getFullYear();
    const { startDate, endDate } = getMonthRange(month, year);

    // Aggregate income and expenses for the month
    const totals = await Transaction.aggregate([
      {
        $match: {
          userId: new mongoose.Types.ObjectId(req.user._id),
          date: { $gte: startDate, $lte: endDate },
        },
      },
      {
        $group: {
          _id: '$type',
          total: { $sum: '$amount' },
        },
      },
    ]);

    let totalIncome = 0;
    let totalExpenses = 0;
    totals.forEach((t) => {
      if (t._id === 'income') totalIncome = t.total;
      if (t._id === 'expense') totalExpenses = t.total;
    });

    const balance = totalIncome - totalExpenses;

    // Calculate budget usage
    const budgets = await Budget.find({
      userId: req.user._id,
      month,
      year,
    });
    const totalBudget = budgets.reduce((sum, b) => sum + b.amount, 0);
    const budgetUsage =
      totalBudget > 0 ? parseFloat(((totalExpenses / totalBudget) * 100).toFixed(2)) : 0;

    res.json({ totalIncome, totalExpenses, balance, budgetUsage });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * GET /api/dashboard/charts?year=
 * Returns data for all 3 charts
 */
const getCharts = async (req, res) => {
  try {
    const now = new Date();
    const year = parseInt(req.query.year) || now.getFullYear();
    const currentMonth = now.getMonth() + 1;
    const userId = new mongoose.Types.ObjectId(req.user._id);

    const yearStart = new Date(year, 0, 1);
    const yearEnd = new Date(year, 11, 31, 23, 59, 59, 999);

    // 1. Expense breakdown by category (current year)
    const expenseByCategoryRaw = await Transaction.aggregate([
      {
        $match: {
          userId,
          type: 'expense',
          date: { $gte: yearStart, $lte: yearEnd },
        },
      },
      { $group: { _id: '$categoryId', amount: { $sum: '$amount' } } },
    ]);

    const expenseByCategory = await Promise.all(
      expenseByCategoryRaw.map(async (item) => {
        const cat = await Category.findById(item._id);
        return {
          category: cat ? cat.name : 'Unknown',
          amount: parseFloat(item.amount.toFixed(2)),
          color: cat ? cat.color : '#999',
        };
      })
    );

    // 2. Monthly income vs expense trend (all 12 months of the year)
    const monthlyTrendRaw = await Transaction.aggregate([
      {
        $match: {
          userId,
          date: { $gte: yearStart, $lte: yearEnd },
        },
      },
      {
        $group: {
          _id: { month: { $month: '$date' }, type: '$type' },
          total: { $sum: '$amount' },
        },
      },
    ]);

    const MONTH_NAMES = [
      'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
      'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
    ];

    const monthlyTrend = MONTH_NAMES.map((name, idx) => {
      const monthNum = idx + 1;
      const incomeEntry = monthlyTrendRaw.find(
        (e) => e._id.month === monthNum && e._id.type === 'income'
      );
      const expenseEntry = monthlyTrendRaw.find(
        (e) => e._id.month === monthNum && e._id.type === 'expense'
      );
      return {
        month: name,
        income: incomeEntry ? parseFloat(incomeEntry.total.toFixed(2)) : 0,
        expense: expenseEntry ? parseFloat(expenseEntry.total.toFixed(2)) : 0,
      };
    });

    // 3. Budget vs actual for current month
    const { startDate, endDate } = getMonthRange(currentMonth, year);

    const budgets = await Budget.find({
      userId: req.user._id,
      month: currentMonth,
      year,
    }).populate('categoryId', 'name color');

    const budgetVsActual = await Promise.all(
      budgets.map(async (budget) => {
        const spentResult = await Transaction.aggregate([
          {
            $match: {
              userId,
              categoryId: new mongoose.Types.ObjectId(budget.categoryId._id),
              type: 'expense',
              date: { $gte: startDate, $lte: endDate },
            },
          },
          { $group: { _id: null, total: { $sum: '$amount' } } },
        ]);
        const spent = spentResult.length > 0 ? spentResult[0].total : 0;
        return {
          category: budget.categoryId.name,
          budget: budget.amount,
          spent: parseFloat(spent.toFixed(2)),
          color: budget.categoryId.color,
        };
      })
    );

    res.json({ expenseByCategory, monthlyTrend, budgetVsActual });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * GET /api/dashboard/recent-transactions
 * Returns the last 5 transactions with category populated
 */
const getRecentTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.find({ userId: req.user._id })
      .populate('categoryId', 'name color type')
      .sort({ date: -1 })
      .limit(5);

    res.json(transactions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getSummary, getCharts, getRecentTransactions };
