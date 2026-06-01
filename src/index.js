import "./styles/main.css";
import { Player, ComputerPlayer, Game, el, renderBoard, renderShips, initShips, initEvents } from "./barrel.js";

document.addEventListener("DOMContentLoaded", () => {
  renderBoard(el.playerBoard);
  renderBoard(el.opponentBoard);
  initShips();
  initEvents();
})