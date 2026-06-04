import "./styles/main.css";
import {
  Player,
  ComputerPlayer,
  Game,
  el,
  renderBoard,
  renderShips,
  initShips,
  initEvents,
  renderScoreBoard,
} from "./barrel.js";

export const player1 = new Player("human");
export const player2 = new ComputerPlayer("computer");
export const startGame = new Game(player1, player2);

document.addEventListener("DOMContentLoaded", () => {
  renderBoard(el.playerBoard);
  renderBoard(el.opponentBoard);
  initShips();
  initEvents();
  renderScoreBoard(el.player1ScoreBoard, player1, player2);
  renderScoreBoard(el.player2ScoreBoard, player2, player1);
});
