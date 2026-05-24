export class GameBoard {
  #board = Array.from({ length: 10 }, () => Array(10).fill(""));

  placeShip(x, y, ship) {
    if (this.validatePlacement) {
      this.#board[x][y] = ship;
    }
  }

  validatePlacement(x, y, ship) {
    if (x > 9 || x < 0 || y > 0 || y < 0 || this.#board[x][y]) return false;
    const peicesIdx = [];
    for (let i = 0; i < 10; i++) {
      for (let j = 0; j < 10; j++) {
        if (this.#board[i][j] === ship) {
          peicesIdx.push({ row: i, col: j });
        }
      }
    }
    if(peicesIdx.length >= ship.length) return false;
    if (peicesIdx.length === 1) {
      if (
        [peicesIdx.row + 1, peicesIdx.row - 1].includes(x) &&
        [peicesIdx.col + 1, peicesIdx.col - 1].includes(y)
      )
        return true;
      else return false;
    } else if (peicesIdx.length > 1) {
      if(peicesIdx[0].row === peicesIdx[1].row){
        if([peicesIdx[0].row + 1, peicesIdx[0].row -1].includes(x) && y === peicesIdx.col) return true;
      }
      else if(peicesIdx[0].col === peicesIdx[1].col){
        if([peicesIdx[0].col + 1, peicesIdx[0].col -1].includes(y) && x === peicesIdx.row) return true;
      }
    }
    return false;
  }
}
