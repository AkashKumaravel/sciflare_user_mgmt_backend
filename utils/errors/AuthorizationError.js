class AuthorizationError extends Error {
  constructor(message = 'UnAuthorized Access') {
    super(message);
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = AuthorizationError;
