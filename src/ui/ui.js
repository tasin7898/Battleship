import { Ship } from "../logic/ship.js";
import { el } from "./dom.js";
export const renderBoard = (container) => {
  for (let i = 0; i < 10; i++) {
    for (let j = 0; j < 10; j++) {
      const div = document.createElement("div");
      div.dataset.row = i;
      div.dataset.col = j;
      div.dataset.board = container.dataset.board;
      container.appendChild(div);
    }
  }
};

export const renderShips = (ship) => {
  const shipColour = {
    Patrol_Boat: "red",
    Submarine: "yellow",
    Destroyer: "green",
    Battleship: "blue",
  };
  const container = document.createElement("div");
  container.classList.add("ships");
  //container.draggable = true;
  for (let i = 0; i < ship.length; i++) {
    const div = document.createElement("div");
    div.classList.add(shipColour[ship.name]);
    div.draggable = true;
    div.dataset.idx = i;
    div.dataset.ship = ship.name;
    container.appendChild(div);
  }
  return container;
};

export const resetShipsOrientation = () => {
  document.querySelectorAll(".ships").forEach((ship) => {
    ship.classList.remove("rotate");
    ship.classList.remove("selected");
  });
};
export const initShips = () => {
  const ship1 = renderShips(new Ship(2, "Patrol_Boat"));
  const ship2 = renderShips(new Ship(3, "Submarine"));
  const ship3 = renderShips(new Ship(3, "Destroyer"));
  const ship4 = renderShips(new Ship(4, "Battleship"));
  el.shipsContainer.append(ship1, ship2, ship3, ship4);
};

export const toggleHighlightClass = (
  row,
  col,
  idx,
  shipName,
  orientation,
  add = true,
) => {
  const shipCellEl = document.querySelector(`[data-ship="${shipName}"]`);
  if (!shipCellEl) return;
  const shipEl = shipCellEl.closest(".ships");
  const shipLength = shipEl.children.length;
  if (orientation === "horizontal") {
    for (let i = -idx; i < shipLength - idx; i++) {
      const cell = document.querySelector(
        `[data-board="player1"][data-row="${row}"][data-col="${col + i}"]`,
      );
      if (!cell) continue;
      if (i === -idx) {
        add
          ? cell.classList.add("highlight-left")
          : cell.classList.remove("highlight-left");
      }
      if (i === shipLength - idx - 1) {
        add
          ? cell.classList.add("highlight-right")
          : cell.classList.remove("highlight-right");
      } else
        add
          ? cell.classList.add("highlight-horizontal")
          : cell.classList.remove("highlight-horizontal");
    }
  }
  if (orientation === "vertical") {
    for (let i = -idx; i < shipLength - idx; i++) {
      const cell = document.querySelector(
        `[data-board="player1"][data-row="${row + i}"][data-col="${col}"]`,
      );
      if (!cell) continue;
      if (i === -idx) {
        add
          ? cell.classList.add("highlight-top")
          : cell.classList.remove("highlight-top");
      }
      if (i === shipLength - idx - 1) {
        add
          ? cell.classList.add("highlight-bottom")
          : cell.classList.remove("highlight-bottom");
      } else
        add
          ? cell.classList.add("highlight-vertical")
          : cell.classList.remove("highlight-vertical");
    }
  }
};

export const placeShipCells = (row, col, idx, shipName, orientation, ship) => {
  const shipCellEl = document.querySelector(`[data-ship="${shipName}"]`);
  if (!shipCellEl) return;
  const shipEl = shipCellEl.closest(".ships");
  const shipLength = shipEl.children.length;

  if (orientation === "horizontal") {
    if (col - idx < 0 || col + (shipLength - 1 - idx) > 9) return;

    for (let i = -idx; i < shipLength - idx; i++) {
      //player.board.placeShip(row, col + i, ship);
      const cell = document.querySelector(
        `[data-board="player1"][data-row="${row}"][data-col="${col + i}"]`,
      );
      if (cell) cell.className = shipCellEl.className;
    }
  }
  if (orientation === "vertical") {
    if (row - idx < 0 || row + (shipLength - 1 - idx) > 9) return;

    for (let i = -idx; i < shipLength - idx; i++) {
      //player.board.placeShip(row + i, col, ship);
      const cell = document.querySelector(
        `[data-board="player1"][data-row="${row + i}"][data-col="${col}"]`,
      );
      if (cell) cell.className = shipCellEl.className;
    }
  }
  shipEl.classList.add("hidden");
};
