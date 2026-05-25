export class GameBoard {
  #board = Array.from({ length: 10 }, () => Array(10).fill(""));
  #missIdx = [];
  #ships = new Set();
  placeShip(row, col, ship) {
    if (this.validatePlacement(row, col, ship)) {
      this.#board[row][col] = ship;
      this.#ships.add(ship);
    }
  }

  validatePlacement(row, col, ship) {
    if (row > 9 || row < 0 || col > 9 || col < 0 || this.#board[row][col])
      return false;
    const peicesIdx = [];
    for (let i = 0; i < 10; i++) {
      for (let j = 0; j < 10; j++) {
        if (this.#board[i][j] === ship) {
          peicesIdx.push({ row: i, col: j });
        }
      }
    }
    if (peicesIdx.length >= ship.length) return false;
    const peicesIdxLenght = peicesIdx.length;
    if (peicesIdxLenght === 1) {
      if (
        ([peicesIdx[0].row + 1, peicesIdx[0].row - 1].includes(row) &&
          col === peicesIdx[0].col) ||
        ([peicesIdx[0].col + 1, peicesIdx[0].col - 1].includes(col) &&
          row === peicesIdx[0].row)
      )
        return true;
      else return false;
    } else if (peicesIdx.length > 1) {
      if (peicesIdx[0].row === peicesIdx[1].row) {
        if (
          ([peicesIdx[0].col + 1, peicesIdx[0].col - 1].includes(col) &&
            row === peicesIdx[0].row) ||
          ([
            peicesIdx[peicesIdxLenght - 1].col + 1,
            peicesIdx[peicesIdxLenght - 1].col - 1,
          ].includes(col) &&
            row === peicesIdx[0].row)
        )
          return true;
        else return false;
      } else if (peicesIdx[0].col === peicesIdx[1].col) {
        if (
          ([peicesIdx[0].row + 1, peicesIdx[0].row - 1].includes(row) &&
            col === peicesIdx[0].col) ||
          ([
            peicesIdx[peicesIdxLenght - 1].row + 1,
            peicesIdx[peicesIdxLenght - 1].row - 1,
          ].includes(row) &&
            col === peicesIdx[0].col)
        )
          return true;
        else return false;
      }
    }
    return true;
  }

  receiveAttack(row, col) {
    if (row > 9 || row < 0 || col > 9 || col < 0) return;
    const attackPos = this.#board[row][col];
    if (attackPos === "") {
      this.#missIdx.push([row, col]);
      this.#board[row][col] = "X";
    } else if (attackPos !== "X"){
      attackPos.hit();
      if(attackPos.isSunk()) 
      
    }
  }

  get missedIndices() {
    return this.#missIdx;
  }
}
