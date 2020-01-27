module.exports = class Board {
  constructor(size) {
    this.size = size;
    this.cellHeight = 3;
    this.cellWidth = 7;
    this.out = process.stdout;
  }

  print(state) {
    this.out.write('\n');
    for (let row = 0; row < this.size; row++) {
      for (let rowLine = 0; rowLine < this.cellHeight; rowLine++) {
        let rowChar = ' ';
        let colChar = '|';
        let line = [];

        if (row === this.size - 1) {
          rowChar = ' ';
        } else if (rowLine === this.cellHeight - 1) {
          rowChar = '_';
        }

        for (let col = 0; col < this.size; col++) {
          if (col === this.size - 1) {
            colChar = '';
          }

          let cellPart = `${rowChar.repeat(this.cellWidth)}${colChar}`;

          if (
            state &&
            state.getCell(row, col) &&
            rowLine === Math.floor(this.cellHeight / 2)
          ) {
            const cellChars = cellPart.split('');
            cellChars[Math.floor(this.cellWidth / 2)] = state.getCell(row, col);
            cellPart = cellChars.join('');
          }

          line.push(cellPart);
        }

        this.out.write(`${line.join('')}\n`);
      }
    }
  }
};
