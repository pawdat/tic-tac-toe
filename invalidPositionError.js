const AppError = require('./appError');

module.exports = class InvalidPositionError extends AppError {
  constructor(row, col, size) {
    row = !isNaN(row) ? row + 1 : row;
    col = !isNaN(col) ? col + 1 : col;
    super(`Invalid position given (row: ${row}, column: ${col}). Column and row should be between 1 and ${size}`);
  }
};
