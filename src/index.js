import "./styles/main.css";
import { Player, ComputerPlayer, Game, el, renderBoard, renderShips } from "./barrel.js";

document.addEventListener("DOMContentLoaded", () => {
  renderBoard(el.playerBoard);
  renderBoard(el.opponentBoard);
})