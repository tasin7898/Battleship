import "./styles/main.css";
import {
  Player,
  ComputerPlayer,
  Game,
  el,
  renderBoard,
  initShips,
  initEvents,
  renderScoreBoard,
} from "./barrel.js";

export const player1 = new Player();
export const player2 = new ComputerPlayer("Computer");
export const startGame = new Game(player1, player2);

document.addEventListener("DOMContentLoaded", () => {
  renderBoard(el.playerBoard);
  renderBoard(el.opponentBoard);
  initShips();
  initEvents();
  renderScoreBoard(el.player1ScoreBoard, player1, player2);
  renderScoreBoard(el.player2ScoreBoard, player2, player1);
  el.dialogBox.showModal();
});
