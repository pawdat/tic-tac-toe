const AppError = require('./appError');

module.exports = class InvalidSymbolError extends AppError {
  constructor(symbol) {
    super(`Invalid symbol given (${symbol}). Should be "x" or "o"`);
  }
};
