const { AuthorizationError } = require('./AuthorizationError');
const { ForbiddenError } = require('./ForbiddenError');
const { IncorrectError } = require('./IncorrectError');
const { NotFoundError } = require('./NotFoundError');
const { ReRegistrationError } = require('./ReRegistrationError');
const { ValidationError } = require('./ValidationError');

module.exports = {
  AuthorizationError,
  ForbiddenError,
  IncorrectError,
  NotFoundError,
  ReRegistrationError,
  ValidationError,
};
