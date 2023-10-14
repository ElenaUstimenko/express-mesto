class ReRegistrationError extends Error {
  constructor(message) {
    super(message);
    this.name = 'ReRegistrationError';
    this.statusCode = 409;
  }
}

module.exports = { ReRegistrationError };
