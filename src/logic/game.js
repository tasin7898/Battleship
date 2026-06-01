import { Ship } from "./ship.js";
import { GameBoard } from "./gameBoard.js";
import { Player, ComputerPlayer } from "./player.js";

export class Game {
  #currentTurn;
  constructor(player1, player2) {
    this.player1 = player1;
    this.player2 = player2;
  }
}
