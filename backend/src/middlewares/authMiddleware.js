const { verifyToken } = require('../utils/token');
const { errorResponse } = require('../utils/response');
const { User } = require('../models');

const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return errorResponse(res, 'No token provided, authorization denied', 401);
    }

    const token = authHeader.split(' ')[1];
    const decoded = verifyToken(token);

    if (!decoded) {
      return errorResponse(res, 'Token is invalid or expired', 401);
    }

    const user = await User.findByPk(decoded.id);
    if (!user) {
      return errorResponse(res, 'User not found', 401);
    }

    req.user = user;
    next();
  } catch (error) {
    return errorResponse(res, 'Server error during authentication', 500, [error.message]);
  }
};

module.exports = authMiddleware;