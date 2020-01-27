const InvalidPositionError = require('./errors/invalidPositionError');
const InvalidSymbolError = require('./errors/invalidSymbolError');
const CellAlreadySetError = require('./errors/cellAlreadySetError');

const X = 'X';
const O = 'O';

module.exports = class State {
  constructor(size = 3) {
    this.size = size;
    this.currentState = new Array(this.size);

    for (let row = 0; row < size; row++) {
      this.currentState[row] = new Array(this.size);
    }

    this.stateHistory = [];
    this.onUpdateCallbacks = [];
  }

  getCell(row, col) {
    return this.currentState[row][col];
  }

  update(row, col, xOrO) {
    if (row < 0 || row > this.size || col < 0 || col > this.size || isNaN(row) || isNaN(col)) {
      throw new InvalidPositionError(row, col, this.size);
    }

    xOrO = xOrO.toUpperCase();

    if (xOrO !== X && xOrO !== O) {
      throw new InvalidSymbolError(xOrO);
    }

    if (this.currentState[row][col]) {
      throw new CellAlreadySetError(row, col);
    }

    const newState = JSON.parse(JSON.stringify(this.currentState));
    this.stateHistory.push(this.currentState);

    newState[row][col] = xOrO;
    this.currentState = newState;

    this.onUpdateCallbacks.forEach((callback) => {
      callback(this);
    })
  }

  getWinner() {
    // get columns (transpose array)
    const columns = this.currentState[0].map(
      (col, i) => this.currentState.map(row => row[i])
    );

    // get diagonals
    const diagonals = [new Array(this.size), new Array(this.size)];
    this.currentState.forEach((row, i) => {
      diagonals[0][i] = row[i];
      diagonals[1][i] = row[this.size - 1 - i];
    }, diagonals);

    const found = this.currentState
      .concat(columns, diagonals)
      .filter(
        (row) => row.every(
          (cell) => cell === row[0]
        )
      );

    if (found.length) {
      return found[0][0];
    }
  }

  back() {
    if (this.stateHistory.length) {
      this.currentState = this.stateHistory.pop();
    }
  }

  onUpdate(callback) {
    this.onUpdateCallbacks.push(callback);
  }
};
