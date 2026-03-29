const { errorResponse } = require('../utils/response');

const roleMiddleware = (requiredRole) => {
  return (req, res, next) => {
    if (!req.user) {
      return errorResponse(res, 'Not authenticated', 401);
    }

    if (req.user.role !== requiredRole && req.user.role !== 'admin') {
      return errorResponse(res, 'Access denied, insufficient permissions', 403);
    }

    next();
  };
};

module.exports = roleMiddleware;