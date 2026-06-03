import { el } from "./dom.js";
import {
  resetShipsOrientation,
  toggleHighlightClass,
  placeShipCells,
  resetBoardAndShips,
  updateDOM,
} from "./ui.js";
import { Player, ComputerPlayer } from "../logic/player.js";
import { Game } from "../logic/game.js";
import { update } from "lodash";

let selectedShip = null;
let gameActive = null;
const player1 = new Player("human");
const player2 = new ComputerPlayer("computer");
const startGame = new Game(player1, player2);
let dragStates = {
  idx: null,
  shipName: null,
  orientation: null,
};

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
    if (e.target.matches(".reset-ships")) {
      resetBoardAndShips();
      player1.board.clear();
    }
    if (e.target.matches(".confirm-fleet")) {
      if (
        !Object.values(player1.ships).every((ship) =>
          player1.board.getShipsIdx(ship),
        )
      )
        return;
      el.shipsAndbuttonsContainer.classList.add("cleared");
      el.confirmFleetBtn.classList.add("cleared");
      gameActive = true;
    }

    if (board === "player2" && gameActive) {
      const { resultP1, resultP2, winner } = startGame.handleAttack(
        Number(row),
        Number(col),
      );
      updateDOM(resultP1, row, col, el.opponentBoard, player2.board);
      setTimeout(() => {
        if (resultP2) updateDOM(resultP2, row, col, el.playerBoard, player1.board);
      }, 3000);
      if (winner) {
        winner.addScore();
        el.announcement.textContent = `${winner.name}`
      }
    }
  });

  document.addEventListener("dragstart", (e) => {
    const shipEl = e.target.closest(".ships");
    if (!shipEl) return;
    const ship = shipEl.querySelector("[data-ship]");
    const { ship: shipName, idx: idxStr } = e.target.dataset;
    const idx = Number(idxStr ?? 0);
    const orientation = e.target.closest(".ships").classList.contains("rotate")
      ? "vertical"
      : "horizontal";
    if (orientation === "vertical")
      e.dataTransfer.setDragImage(shipEl, e.offsetX, e.offsetY + idx * 50);
    if (orientation === "horizontal")
      e.dataTransfer.setDragImage(shipEl, e.offsetX + idx * 50, e.offsetY);

    e.dataTransfer.setData("shipName", shipName);
    e.dataTransfer.setData("idx", idx ?? "0");
    e.dataTransfer.setData("orientation", orientation);

    dragStates = { idx, shipName, orientation };
  });
  document.addEventListener("dragover", (e) => {
    if (!dragStates.shipName) return;
    const { row: rowStr, col: colStr, board } = e.target.dataset;
    if (board !== "player1") return;
    e.preventDefault();
    const row = Number(rowStr);
    const col = Number(colStr);
    const { idx, shipName, orientation } = dragStates;
    toggleHighlightClass(row, col, idx, shipName, orientation, true);
  });

  document.addEventListener("dragleave", (e) => {
    if (!dragStates.shipName) return;
    const { row: rowStr, col: colStr, board } = e.target.dataset;
    if (board !== "player1") return;
    e.preventDefault();
    const row = Number(rowStr);
    const col = Number(colStr);
    const { idx, shipName, orientation } = dragStates;
    toggleHighlightClass(row, col, idx, shipName, orientation, false);
  });
  document.addEventListener("drop", (e) => {
    const { row: rowStr, col: colStr, board } = e.target.dataset;
    if (board !== "player1") return;
    e.preventDefault();
    const row = Number(rowStr);
    const col = Number(colStr);
    const shipName = e.dataTransfer.getData("shipName");
    const idx = Number(e.dataTransfer.getData("idx"));
    const orientation = e.dataTransfer.getData("orientation");
    const ship = player1.ships[shipName];
    player1.board.placeShipFull(row, col, idx, orientation, ship);
    placeShipCells(row, col, idx, shipName, orientation, ship);
    dragStates = { idx: null, shipName: null, orientation: null };
    console.log(player1.board.getBoardValues(0, 0));
  });
};
