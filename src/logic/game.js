import { Ship } from "./ship.js";
import { GameBoard } from "./gameBoard.js";
import { Player, ComputerPlayer } from "./player.js";

export class Game {
  constructor(player1, player2) {
    this.player1 = player1;
    this.player2 = player2;
  }
  handleAttack(row, col) {
    if (row === undefined || col === undefined) return;
     let resultP1, resultP2;
     resultP1 = this.player1.attack(row, col, this.player2.board);
     if(!resultP1) return;
    if (resultP1 instanceof Ship) {
      if (this.player2.board.allSunk()) return { resultP1, resultP2 : null, winner: this.player1 };
    }
     resultP2 = this.player2.attack(this.player1.board);
    if (resultP2 instanceof Ship) {
      if (this.player1.board.allSunk()) return { resultP1, resultP2, winner: this.player2 };
    }
    return { resultP1, resultP2, winner : null };
  }
}
