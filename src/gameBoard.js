import { Ship } from "./ship.js";

export class GameBoard {
  #board = Array.from({ length: 10 }, () => Array(10).fill(""));
  #missIdx = [];
  #ships = new Set();
  #hitIdx = [];
  #activeHitIdx = [];
  placeShip(row, col, ship) {
    if (this.validatePlacement(row, col, ship)) {
      this.#board[row][col] = ship;
      const peicesIdx = [];
      peicesIdx.push({ row, col });
      const shipObj = [...this.#ships].find(
        (currShip) => currShip.ship === ship,
      );
      if (shipObj) shipObj.pos.push({ row, col });
      else this.#ships.add({ ship, pos: peicesIdx });
    }
  }

  validatePlacement(row, col, ship) {
    if (row > 9 || row < 0 || col > 9 || col < 0 || this.#board[row][col])
      return false;
    const shipObj = [...this.#ships].find((currShip) => currShip.ship === ship);
    if (shipObj === undefined) return true;
    const peicesIdx = shipObj.pos;
    // for (let i = 0; i < 10; i++) {
    //   for (let j = 0; j < 10; j++) {
    //     if (this.#board[i][j] === ship) {
    //       peicesIdx.push({ row: i, col: j });
    //     }
    //   }
    // }
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
      return "missed";
    } else if ((attackPos !== "X") & (attackPos !== "S")) {
      this.#hitIdx.push([row, col]);
      this.#activeHitIdx.push([row, col]);
      attackPos.hit();
      if (this.#modifySunkShips(attackPos)) return "sunk";
      return "hit";
    }
  }

  #modifySunkShips(attackPos) {
    if (attackPos.isSunk()) {
      const sunkIdx = [...this.#ships].find(
        (currShip) => currShip.ship === attackPos,
      ).pos;
      sunkIdx.forEach(({ row, col }) => {
        this.#board[row][col] = "S";
      });
      this.#activeHitIdx = this.#activeHitIdx.filter(
        ([r, c]) => !sunkIdx.some(({ row, col }) => r === row && c === col),
      );

      return true;
    }
  }

  allSunk() {
    return [...this.#ships].every(({ ship }) => ship.isSunk());
  }
  get missedIndices() {
    return [...this.#missIdx];
  }

  get attackedIndices() {
    return [...this.#missIdx, ...this.#hitIdx];
  }

  get hitIndices() {
    return [...this.#hitIdx];
  }

  get activeHitIndices() {
    return [...this.#activeHitIdx];
  }
  getShipIndices(ship) {
    return [...this.#ships]
      .find((currShip) => currShip.ship === ship)
      .pos.map(({ row, col }) => [row, col]);
  }

  getShipsIdx(ship) {
    return [...this.#ships].find((currShip) => currShip.ship === ship);
  }
  getBoardValues(row, col) {
    return this.#board[row][col];
  }

  get shipObj() {
    return [...this.#ships];
  }

  removeShip(ship) {
    const deleteShip = [...this.#ships].find(
      (currShip) => currShip.ship === ship,
    ).pos;
    deleteShip.forEach(({ row, col }) => (this.#board[row][col] = ""));
    this.#ships.delete([...this.#ships].find((entry) => entry.ship === ship));
  }
}
