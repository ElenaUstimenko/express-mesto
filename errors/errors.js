const { AuthorizationError } = require('./AuthorizationError');
const { ForbiddenError } = require('./ForbiddenError');
const { NotFoundError } = require('./NotFoundError');
const { ReRegistrationError } = require('./ReRegistrationError');
const { ValidationError } = require('./ValidationError');

module.exports = {
  AuthorizationError,
  ForbiddenError,
  NotFoundError,
  ReRegistrationError,
  ValidationError,
};
