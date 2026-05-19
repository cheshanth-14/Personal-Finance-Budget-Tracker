// src/routes/authRoutes.js
const express = require('express');
const router = express.Router();
const { register, login, logout, getMe, registerValidation, loginValidation } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');
const { validate } = require('../middleware/validateMiddleware');

router.post('/register', registerValidation, validate, register);
router.post('/login', loginValidation, validate, login);
router.post('/logout', logout);
router.get('/me', protect, getMe);

module.exports = router;
