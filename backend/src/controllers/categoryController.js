// src/controllers/categoryController.js
const { body } = require('express-validator');
const Category = require('../models/Category');
const Transaction = require('../models/Transaction');

// ------- Validation Rules -------
const categoryValidation = [
  body('name').trim().notEmpty().withMessage('Category name is required'),
  body('type').isIn(['income', 'expense']).withMessage('Type must be income or expense'),
  body('color')
    .optional()
    .matches(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/)
    .withMessage('Color must be a valid hex color'),
];

const updateCategoryValidation = [
  body('name').optional().trim().notEmpty().withMessage('Category name cannot be empty'),
  body('color')
    .optional()
    .matches(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/)
    .withMessage('Color must be a valid hex color'),
];

// ------- Controller Functions -------

/**
 * GET /api/categories
 * Get all categories for the current user, optionally filtered by type
 */
const getCategories = async (req, res) => {
  try {
    const filter = { userId: req.user._id };
    if (req.query.type) {
      filter.type = req.query.type;
    }
    const categories = await Category.find(filter).sort({ name: 1 });
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * POST /api/categories
 * Create a new custom category
 */
const createCategory = async (req, res) => {
  try {
    const { name, type, color } = req.body;
    const category = await Category.create({
      userId: req.user._id,
      name,
      type,
      color: color || '#6366f1',
      isDefault: false,
    });
    res.status(201).json(category);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * PUT /api/categories/:id
 * Update a category name or color
 */
const updateCategory = async (req, res) => {
  try {
    const category = await Category.findOne({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }

    const { name, color } = req.body;
    if (name !== undefined) category.name = name;
    if (color !== undefined) category.color = color;

    const updated = await category.save();
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * DELETE /api/categories/:id
 * Delete a category if it is not in use by any transactions
 */
const deleteCategory = async (req, res) => {
  try {
    const category = await Category.findOne({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }

    // Check if any transaction is using this category
    const usageCount = await Transaction.countDocuments({
      categoryId: req.params.id,
      userId: req.user._id,
    });

    if (usageCount > 0) {
      return res
        .status(400)
        .json({ message: 'Category is in use and cannot be deleted' });
    }

    await category.deleteOne();
    res.json({ message: 'Category deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
  categoryValidation,
  updateCategoryValidation,
};
