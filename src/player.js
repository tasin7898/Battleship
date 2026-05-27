import { val } from "thingies";
import { GameBoard } from "./gameBoard.js";
import { Ship } from "./ship.js";
export class Player {
  #score;

  constructor(name) {
    this.name = name;
    this.board = new GameBoard();
    this.#score = 0;
  }

  addScore() {
    this.#score++;
  }

  get score() {
    return this.#score;
  }
}

export class ComputerPlayer extends Player {
  #queue = [];
  #visited = [];
  constructor(name = "Computer") {
    super(name);
  }

  placeRandShips() {
    const ships = [
      new Ship(4, "Battleship"),
      new Ship(3, "Destroyer"),
      new Ship(3, "Submarine"),
      new Ship(2, "Patrol_Boat"),
    ];
    //console.log(this.board.getShipsIdx(ships[0]))
    //console.log(ships)
    const shuffledShips = this.#shuffle(ships);
    //console.log(shuffledShips);
    // console.log(this.board.shipObj)
    shuffledShips.forEach((ship) => {
      //console.log(ship)
      //console.log(this.board.getShipsIdx(ship))
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
              //console.log(this.board.getShipsIdx(ship));
              run = 0;
              break;
            }
            //console.log(row, col)
          } while (
            row > 9 ||
            row < 0 ||
            col > 9 ||
            col < 0 ||
            this.board.getBoardValues(row, col)
          );
          this.board.placeShip(row, col, ship);
          //console.log(this.board.getShipsIdx(ship).pos);
        }
        //console.log(this.board.getShipsIdx(ship));

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
              //console.log(row, col);
              run++;
              if (run > 50) {
                this.board.removeShip(ship);
                //console.log(this.board.getShipsIdx(ship));

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
                  //console.log(this.board.getShipsIdx(ship));

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
                  //console.log(this.board.getShipsIdx(ship));

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
        //console.log(stuck)
        if (stuck) {
          stuck = false;
          continue;
        }
        done = true;
      }
    });
    console.log(
      JSON.stringify(this.board.shipObj, null, 2),
      this.board.shipObj[0].ship.name,
      this.board.shipObj[1].ship.name,
      this.board.shipObj[2].ship.name,
      this.board.shipObj[3].ship.name,
    );
  }

  #shuffle(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      const temp = arr[i];
      arr[i] = arr[j];
      arr[j] = temp;
    }
    return arr;
  }

  attack() {
    let row,
      col,
      ships = [...this.board.shipObj.ship];
    const attackedPos = this.board.attackedIndices;
    const hitPos = this.board.hitIndices;

    if (hitPos.length === 0) {
      row = Math.floor(Math.random() * 10);
      col = Math.floor(Math.random() * 10);
      this.board.receiveAttack(row, col);
      return;
    }
    if (this.#queue.length === 0) {
      if (hitPos.length === 1) {
        this.#queue.push(hitPos[0]);
      }
    }
    if (hitPos.length >= 1) {
      //if(){}
      let [row, col] = queue.shift();
      this.#visited.push([row, col]);
      const possibleAttacks = this.#paths([row, col], visited);
      possibleAttacks.forEach((attack) => queue.push(attack));
      [row, col] = queue.shift();
      this.board.receiveAttack(row, col);
    }
  }

  #paths([row, col], visited) {
    return [
      [row + 1, col],
      [row - 1, col],
      [row, col + 1],
      [row, col - 1],
    ]
      .filter(([a, b]) => a <= 9 && a >= 0 && b <= 9 && b >= 0)
      .filter(
        (entry) =>
          !visited.some((item) => item.every((val, idx) => val === entry[idx])),
      );
  }
}

const player1 = new Player("tasin");
const comp = new ComputerPlayer();
comp.placeRandShips();
