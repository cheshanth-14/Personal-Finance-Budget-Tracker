// src/middleware/validateMiddleware.js
// Handles express-validator validation results

const { validationResult } = require('express-validator');

/**
 * Middleware that checks for validation errors from express-validator.
 * Returns 400 with field-level error messages if validation fails.
 */
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    // Format errors into { field: message } structure
    const formattedErrors = {};
    errors.array().forEach((err) => {
      if (!formattedErrors[err.path]) {
        formattedErrors[err.path] = err.msg;
      }
    });
    return res.status(400).json({
      message: 'Validation failed',
      errors: formattedErrors,
    });
  }
  next();
};

module.exports = { validate };
