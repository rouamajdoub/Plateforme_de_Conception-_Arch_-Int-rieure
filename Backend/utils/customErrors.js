// utils/customErrors.js

/**
 * Base custom error class
 */
class AppError extends Error {
  constructor(message, statusCode, extras = {}) {
    super(message);
    this.statusCode = statusCode;
    this.extras = extras;
    this.success = false;
    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * Authentication related errors (401)
 */
class AuthenticationError extends AppError {
  constructor(message, extras) {
    super(message, 401, extras);
  }
}

/**
 * Authorization related errors (403)
 */
class AuthorizationError extends AppError {
  constructor(message, extras) {
    super(message, 403, extras);
  }
}

/**
 * Resource not found errors (404)
 */
class NotFoundError extends AppError {
  constructor(message, extras) {
    super(message, 404, extras);
  }
}

/**
 * Validation related errors (400)
 */
class ValidationError extends AppError {
  constructor(message, extras) {
    super(message, 400, extras);
  }
}

/**
 * Conflict errors like duplicate resources (409)
 */
class ConflictError extends AppError {
  constructor(message, extras) {
    super(message, 409, extras);
  }
}

module.exports = {
  AppError,
  AuthenticationError,
  AuthorizationError,
  NotFoundError,
  ValidationError,
  ConflictError,
};
