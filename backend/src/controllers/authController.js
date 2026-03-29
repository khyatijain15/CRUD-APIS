const authService = require('../services/authService');
const { successResponse, errorResponse } = require('../utils/response');

const register = async (req, res, next) => {
  try {
    const user = await authService.registerUser(req.body);
    return successResponse(res, { user }, 'User registered successfully', 201);
  } catch (error) {
    if (error.message === 'User already exists') {
      return errorResponse(res, error.message, 400);
    }
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const { token, user } = await authService.loginUser(email, password);
    return successResponse(res, { token, user }, 'Logged in successfully', 200);
  } catch (error) {
    if (error.message === 'Invalid credentials') {
      return errorResponse(res, error.message, 401);
    }
    next(error);
  }
};

const getMe = async (req, res, next) => {
  try {
    const user = req.user;
    return successResponse(res, { user }, 'Current user retrieved successfully', 200);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  register,
  login,
  getMe
};