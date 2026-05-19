// src/utils/seedCategories.js
// Seeds default income and expense categories when a new user registers

const Category = require('../models/Category');

const DEFAULT_CATEGORIES = [
  // Income categories
  { name: 'Salary', type: 'income', color: '#6366f1', isDefault: true },
  { name: 'Freelance', type: 'income', color: '#8b5cf6', isDefault: true },
  { name: 'Investments', type: 'income', color: '#a78bfa', isDefault: true },
  // Expense categories
  { name: 'Food', type: 'expense', color: '#f97316', isDefault: true },
  { name: 'Transport', type: 'expense', color: '#f59e0b', isDefault: true },
  { name: 'Rent', type: 'expense', color: '#ef4444', isDefault: true },
  { name: 'Entertainment', type: 'expense', color: '#ec4899', isDefault: true },
  { name: 'Healthcare', type: 'expense', color: '#14b8a6', isDefault: true },
  { name: 'Shopping', type: 'expense', color: '#3b82f6', isDefault: true },
];

/**
 * Creates the default categories for a newly registered user.
 * @param {string} userId - The MongoDB ObjectId of the new user
 */
const seedCategories = async (userId) => {
  try {
    const categories = DEFAULT_CATEGORIES.map((cat) => ({ ...cat, userId }));
    await Category.insertMany(categories);
    console.log(`✅ Default categories seeded for user ${userId}`);
  } catch (error) {
    console.error(`❌ Error seeding categories: ${error.message}`);
  }
};

module.exports = seedCategories;
