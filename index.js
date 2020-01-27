const AppError = require('./errors/appError');

const symbols = [
  'X',
  'O',
];

let playerNumber = 0;
let row;
let col;
let state;
let board;

function start() {
  console.clear();

  process.stdin.setEncoding('utf-8');
  process.stdout.write('Welcome to TicTacToe :)\n');
  process.stdout.write('Set board size (default: 3): ');

  process.stdin.once('data', (sizeInput) => {
    let size = Number(sizeInput) || 3;

    if (size < 2) {
      size = 2;
    }

    const State = require('./state');
    state = new State(size);

    const Board = require('./board');
    board = new Board(size);

    console.clear();
    board.print();
    state.onUpdate(console.clear);
    state.onUpdate(board.print.bind(board));

    promptUserInput();
  });
}

function promptUserInput() {
  process.stdout.write(`Player ${playerNumber + 1} enter row number: `);
  process.stdin.once('data', (rowInput) => {
    row = Number(rowInput);

    process.stdout.write(`Player ${playerNumber + 1} enter column number: `);
    process.stdin.once('data', (colInput) => {
      col = Number(colInput);

      row = !isNaN(row) ? row - 1 : row;
      col = !isNaN(col) ? col - 1 : col;

      try {
        state.update(row, col, symbols[playerNumber]);

        if (state.getWinner()) {
          process.stdout.write(`Player ${playerNumber + 1} won!`);
          process.exit(0);
        } else {
          playerNumber = (playerNumber + 1) % 2;
          promptUserInput();
        }
      } catch (error) {
        if (error instanceof AppError) {
          process.stdout.write(`${error.message}\n`);
          promptUserInput();
        } else {
          throw error;
        }
      }
    });
  });
}

start();
