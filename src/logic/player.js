import { GameBoard } from "./gameBoard.js";
import { Ship } from "./ship.js";

export class Player {
  #score;
  #name;
  constructor(name) {
    this.#name = name;
    this.board = new GameBoard();
    this.#score = 0;
    this.ships = {
      Battleship: new Ship(4, "Battleship"),
      Destroyer: new Ship(3, "Destroyer"),
      Submarine: new Ship(3, "Submarine"),
      Patrol_Boat: new Ship(2, "Patrol_Boat"),
    };
  }

  placeRandShips() {
    const ships = Object.values(this.ships);
    const shuffledShips = Player.shuffle(ships);
    shuffledShips.forEach((ship) => {
      let done = false;
      let stuck = false;
      while (!done) {
        if (this.board.getShipsIdx(ship)?.pos === undefined) {
          let row, col;
          let run = 0;
          do {
            row = Math.floor(Math.random() * 10);
            col = Math.floor(Math.random() * 10);
            run++;
            if (run > 50) {
              this.board.removeShip(ship);
              run = 0;
              break;
            }
          } while (
            row > 9 ||
            row < 0 ||
            col > 9 ||
            col < 0 ||
            this.board.getBoardValues(row, col)
          );
          this.board.placeShip(row, col, ship);
        }
        let pos = this.board.getShipsIdx(ship).pos;

        while (pos.length < ship.length) {
          pos = this.board.getShipsIdx(ship).pos;
          if (pos.length === 1) {
            let row, col;
            const possibleIdx = [
              { row: pos[0].row + 1, col: pos[0].col },
              { row: pos[0].row - 1, col: pos[0].col },
              { col: pos[0].col + 1, row: pos[0].row },
              { col: pos[0].col - 1, row: pos[0].row },
            ];
            let run = 0;
            do {
              const idx = possibleIdx[Math.floor(Math.random() * 4)];
              row = idx.row;
              col = idx.col;
              run++;
              if (run > 50) {
                this.board.removeShip(ship);
                run = 0;
                stuck = true;
                break;
              }
            } while (
              row > 9 ||
              row < 0 ||
              col > 9 ||
              col < 0 ||
              this.board.getBoardValues(row, col)
            );
            if (stuck) break;
            this.board.placeShip(row, col, ship);
          }
          if (pos.length > 1) {
            let row, col;
            if (pos[0].row === pos[1].row) {
              const possibleIdx = [
                { row: pos[0].row, col: pos[0].col + 1 },
                { row: pos[0].row, col: pos[0].col - 1 },
                { row: pos[0].row, col: pos[pos.length - 1].col + 1 },
                { row: pos[0].row, col: pos[pos.length - 1].col - 1 },
              ];
              let run = 0;
              do {
                const idx = possibleIdx[Math.floor(Math.random() * 4)];
                row = idx.row;
                col = idx.col;
                run++;
                if (run > 50) {
                  this.board.removeShip(ship);

                  run = 0;
                  stuck = true;
                  break;
                }
              } while (
                row > 9 ||
                row < 0 ||
                col > 9 ||
                col < 0 ||
                this.board.getBoardValues(row, col)
              );
              if (stuck) break;
              this.board.placeShip(row, col, ship);
            }

            if (pos[0].col === pos[1].col) {
              let row, col;
              const possibleIdx = [
                { col: pos[0].col, row: pos[0].row + 1 },
                { col: pos[0].col, row: pos[0].row - 1 },
                { col: pos[0].col, row: pos[pos.length - 1].row + 1 },
                { col: pos[0].col, row: pos[pos.length - 1].row - 1 },
              ];
              let run = 0;
              do {
                const idx = possibleIdx[Math.floor(Math.random() * 4)];
                row = idx.row;
                col = idx.col;
                run++;
                if (run > 50) {
                  this.board.removeShip(ship);
                  run = 0;
                  stuck = true;
                  break;
                }
              } while (
                row > 9 ||
                row < 0 ||
                col > 9 ||
                col < 0 ||
                this.board.getBoardValues(row, col)
              );
              if (stuck) break;

              this.board.placeShip(row, col, ship);
            }
          }
        }
        if (stuck) {
          stuck = false;
          continue;
        }
        done = true;
      }
    });
    // console.log(
    //   JSON.stringify(this.board.shipObj, null, 2),
    //   this.board.shipObj[0].ship.name,
    //   this.board.shipObj[1].ship.name,
    //   this.board.shipObj[2].ship.name,
    //   this.board.shipObj[3].ship.name,
    // );
  }

  static shuffle(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      const temp = arr[i];
      arr[i] = arr[j];
      arr[j] = temp;
    }
    return arr;
  }
  attack(row, col, board) {
    return board.receiveAttack(row, col);
  }

  addScore() {
    this.#score++;
  }

  get score() {
    return this.#score;
  }

  get name() {
    return this.#name;
  }
}

export class ComputerPlayer extends Player {
  #queue = [];
  #visited = [];
  #backTrack = false;
  #hitAnotherShip = false;
  constructor(name = "Computer") {
    super(name);
  }
  attack(board) {
    const attackedPos = board.attackedIndices;
    const activeHitPos = board.activeHitIndices;
    let result;
    if (activeHitPos.length === 0) {
      let row, col;
      do {
        row = Math.floor(Math.random() * 10);
        col = Math.floor(Math.random() * 10);
      } while (
        attackedPos.some(([r, c]) => r === row && c === col) ||
        (row + col) % 2 !== 0
      );
      console.log(row, col);
      return board.receiveAttack(row, col);
    }
    if (activeHitPos.length === 1) {
      const [row, col] = Player.shuffle(
        this.#paths(activeHitPos[0], attackedPos),
      )[0];
      //console.log("afterHit activeHitPos.length === 1", [row, col])
      //console.log("attackedPos activeHitPos.length === 1", attackedPos)
      console.log(row, col);

      return board.receiveAttack(row, col);
    }
    const [r0, c0] = activeHitPos[0];
    const [r1, c1] = activeHitPos[activeHitPos.length - 2];
    const [r2, c2] = activeHitPos[activeHitPos.length - 1];
    const rowDiff = r2 - r1;
    const colDiff = c2 - c1;
    const nextRow = r2 + rowDiff;
    const nextCol = c2 + colDiff;

    if (
      nextRow > 9 ||
      nextRow < 0 ||
      nextCol > 9 ||
      nextCol < 0 ||
      attackedPos.some(([r, c]) => r === nextRow && c === nextCol)
    ) {
      this.#backTrack = true;
    }

    if (this.#backTrack) {
      const nextRow = r0 - rowDiff;
      const nextCol = c0 - colDiff;
      if (
        nextRow > 9 ||
        nextRow < 0 ||
        nextCol > 9 ||
        nextCol < 0 ||
        attackedPos.some(([r, c]) => r === nextRow && c === nextCol)
      ) {
        this.#hitAnotherShip = true;
        this.#backTrack = false;
      }
      if (this.#backTrack) {
        result = board.receiveAttack(nextRow, nextCol);
        if (result === "miss") {
          this.#hitAnotherShip = true;
          this.#backTrack = false;
          return;
        }
        if (result instanceof Ship || result === "hit") {
          this.#backTrack = false;
          return;
        }
      }
    }
    if (this.#hitAnotherShip) {
      const paths = Player.shuffle(this.#paths([r2, c2], attackedPos));
      let row, col;

      if (paths.length === 0) {
        do {
          row = Math.floor(Math.random() * 10);
          col = Math.floor(Math.random() * 10);
        } while (
          attackedPos.some(([r, c]) => r === row && c === col) ||
          (row + col) % 2 !== 0
        );
        console.log(row, col);

        return board.receiveAttack(row, col);
      }
      //console.log([row, col]);
      [row, col] = paths[0];
      this.#hitAnotherShip = false;
      return board.receiveAttack(row, col);
    }
    console.log(nextRow, nextCol);
    result = board.receiveAttack(nextRow, nextCol);
    if (result === "miss") this.#backTrack = true;
    return result;
  }
  #paths([row, col], attackedPos) {
    return [
      [row + 1, col],
      [row - 1, col],
      [row, col + 1],
      [row, col - 1],
    ]
      .filter(([a, b]) => a <= 9 && a >= 0 && b <= 9 && b >= 0)
      .filter(
        ([row, col]) => !attackedPos.some(([r, c]) => r === row && c === col),
      );
  }
}

const player1 = new Player("tasin");
const comp = new ComputerPlayer();
player1.placeRandShips();

// print board
for (let i = 0; i < 10; i++) {
  const row = [];
  for (let j = 0; j < 10; j++) {
    const val = player1.board.getBoardValues(i, j);
    row.push(val ? (val.name[0] ?? val) : ".");
  }
  console.log(row.join("   "));
}

let moves = 0;
while (!player1.board.allSunk()) {
  comp.attack(player1.board);
  moves++;
  console.log(`Move ${moves}:`, player1.board.attackedIndices.at(-1));
}
console.log(`Sunk all ships in ${moves} moves`);
