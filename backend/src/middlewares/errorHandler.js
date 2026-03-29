const { errorResponse } = require('../utils/response');
const logger = require('../utils/logger');
const { ValidationError, UniqueConstraintError } = require('sequelize');

const errorHandler = (err, req, res, next) => {
  logger.error(`${err.name}: ${err.message}`);

  let errors = [];
  let statusCode = 500;
  let message = 'Internal Server Error';

  if (err instanceof ValidationError || err instanceof UniqueConstraintError) {
    statusCode = 400;
    message = 'Validation Error';
    errors = err.errors.map(e => ({
      field: e.path,
      message: e.message
    }));
  } else {
    errors = [err.message];
  }

  return errorResponse(res, message, statusCode, errors);
};

module.exports = errorHandler;