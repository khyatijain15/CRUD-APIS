const { check, validationResult } = require('express-validator');
const { errorResponse } = require('../utils/response');

const validateRequest = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return errorResponse(res, 'Validation failed', 400, errors.array());
  }
  next();
};

const registerValidator = [
  check('name', 'Name is required').not().isEmpty(),
  check('email', 'Please include a valid email').isEmail(),
  check('password', 'Password must be at least 6 characters').isLength({ min: 6 }),
  validateRequest
];

const loginValidator = [
  check('email', 'Please include a valid email').isEmail(),
  check('password', 'Password is required').exists(),
  validateRequest
];

const taskValidator = [
  check('title', 'Title is required').not().isEmpty(),
  check('status', 'Status must be pending, in_progress, or done').optional().isIn(['pending', 'in_progress', 'done']),
  validateRequest
];

module.exports = {
  registerValidator,
  loginValidator,
  taskValidator
};