const AppError = require('./appError');

module.exports = class CellAlreadySetError extends AppError {
  constructor(row, col) {
    super(`Cell already set (row: ${row + 1}, column: ${col + 1})`);
  }
};
