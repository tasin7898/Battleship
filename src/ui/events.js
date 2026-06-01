import { el } from "./dom.js";
import { resetShipsOrientation } from "./ui.js";
import { Player } from "../logic/player.js";

let selectedShip = null;
const player1 = new Player("human");

export const initEvents = () => {
  document.addEventListener("click", (e) => {
    const { row, col, board, ship, idx } = e.target.dataset;
    if (!ship && selectedShip) selectedShip.classList.remove("selected");
    if (
      !e.target.closest(".all-ships-container") &&
      !e.target.matches(".rotate-button")
    )
      selectedShip = null;
    if (ship) {
      if (selectedShip && selectedShip !== e.target.closest(".ships"))
        selectedShip.classList.remove("selected");
      selectedShip = e.target.closest(".ships");
      selectedShip.classList.add("selected");
    }
    if (e.target.matches(".rotate-button") && selectedShip) {
      selectedShip.classList.toggle("rotate");
    }
    if (e.target.matches(".reset-button")) resetShipsOrientation();
  });

  document.addEventListener("dragstart", (e) => {
    const { ship, idx } = e.target.dataset;
    if (!ship) return;
    e.dataTransfer.setData("shipName", ship);
    e.dataTransfer.setData("idx", idx);
    e.dataTransfer.setData(
      "orientation",
      e.target.closest(".ships").classList.contains("rotate")
        ? "vertical"
        : "horizontal",
    );
  });
  document.addEventListener("dragover", (e) => {
    const { board } = e.target.dataset;
    if (board !== "player1") return;
    e.preventDefault();
  });
  document.addEventListener("drop", (e) => {
    const { row: rowStr, col: colStr, board } = e.target.dataset;
    const row = Number(rowStr);
    const col = Number(colStr);
    if (board !== "player1") return;
    const shipName = e.dataTransfer.getData("shipName");
    const idx = Number(e.dataTransfer.getData("idx"));
    const orientation = e.dataTransfer.getData("orientation");
    const shipEl = document.querySelector(`[data-ship="${shipName}"]`);
    const shipLength = shipEl.children.length;
    const ship = player1.ships[shipName];
    if (orientation === "horizontal") {
      for (let i = -idx; i < shipLength - idx; i++) {
        player1.board.placeShip(row, col + i, ship);
      }
    }
    if (orientation === "vertical") {
      for (let i = -idx; i < shipLength -idx ; i++) {
        player1.board.placeShip(row + i, col, ship);
      }
    }
  });
};
