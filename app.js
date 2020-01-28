const Symbols = require('./symbols');
const AppError = require('./errors/appError');
const State = require('./state');
const Board = require('./board');

class App {
  constructor() {
    this.playerNumber = 0;
    this.state = null;
    this.board = null;
    this.out = process.stdout;
    this.in = process.stdin;

    this.in.setEncoding('utf-8');
  }

  clearScreen() {
    console.clear();
  }

  start() {
    this.clearScreen();
    this.out.write('Welcome to TicTacToe :)\n');
    this.out.write('Set board size (default: 3): ');

    this.in.once('data', (sizeInput) => {
      let size = Number(sizeInput) || 3;

      if (size < 2) {
        size = 2;
      }


      this.state = new State(size);
      this.board = new Board(size);

      this.clearScreen();
      this.board.print();
      this.state.onUpdate(this.clearScreen);
      this.state.onUpdate(this.board.print.bind(this.board));

      this.promptUserInput();
    });
  }

  end() {
    process.exit(0);
  }

  promptUserInput() {
    let col;
    let row;

    this.out.write(`Player ${this.playerNumber + 1} enter row number: `);
    this.in.once('data', (rowInput) => {
      row = Number(rowInput);

      this.out.write(`Player ${this.playerNumber + 1} enter column number: `);
      this.in.once('data', (colInput) => {
        col = Number(colInput);

        row = !isNaN(row) ? row - 1 : row;
        col = !isNaN(col) ? col - 1 : col;

        try {
          this.state.update(row, col, Object.values(Symbols)[this.playerNumber]);

          if (this.state.getWinner()) {
            this.out.write(`Player ${this.playerNumber + 1} won!`);
            this.end();
          } else {
            this.playerNumber = (this.playerNumber + 1) % 2;
            this.promptUserInput();
          }
        } catch (error) {
          if (error instanceof AppError) {
            this.out.write(`${error.message}\n`);
            this.promptUserInput();
          } else {
            throw error;
          }
        }
      });
    });
  }
}

module.exports = new App();
