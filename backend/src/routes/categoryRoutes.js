// src/routes/categoryRoutes.js
const express = require('express');
const router = express.Router();
const {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
  categoryValidation,
  updateCategoryValidation,
} = require('../controllers/categoryController');
const { protect } = require('../middleware/authMiddleware');
const { validate } = require('../middleware/validateMiddleware');

router.use(protect);

router.get('/', getCategories);
router.post('/', categoryValidation, validate, createCategory);
router.put('/:id', updateCategoryValidation, validate, updateCategory);
router.delete('/:id', deleteCategory);

module.exports = router;
