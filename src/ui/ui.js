import { AbstractCryptoEngine } from "pkijs";
import { Ship } from "../logic/ship.js";
import { el } from "./dom.js";

const shipColour = {
  Patrol_Boat: "red",
  Submarine: "yellow",
  Destroyer: "green",
  Battleship: "blue",
};

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

export const renderRandomisedShips = (player) => {
  player.board.shipObj.forEach(({ ship, pos }) => {
    pos.forEach(({ row, col }) => {
      const cell = document.querySelector(
        `[data-board="player1"][data-row="${row}"][data-col="${col}"]`,
      );
      cell.classList.add(shipColour[ship.name]);
    });
  });
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

export const resetBoardAndShips = () => {
  document
    .querySelectorAll(".ships")
    .forEach((ship) => ship.classList.remove("hidden"));
  document
    .querySelectorAll('[data-board="player1"]')
    .forEach((cell) =>
      cell.classList.remove(
        "highlight",
        "highlight-left",
        "highlight-right",
        "highlight-top",
        "highlight-bottom",
        "red",
        "yellow",
        "green",
        "blue",
      ),
    );
};

export const resetGame = () => {
  el.shipsAndbuttonsContainer.classList.remove("cleared");

  el.confirmFleetBtn.classList.remove("hidden");

  document.querySelectorAll('[data-board="player1"]').forEach((cell) => {
    cell.classList.remove(
      "highlight",
      "highlight-left",
      "highlight-right",
      "highlight-top",
      "highlight-bottom",
      "red",
      "yellow",
      "green",
      "blue",
    );
    if (["●", "❌", "☠️"].includes(cell.textContent)) cell.textContent = "";
  });
  document.querySelectorAll('[data-board="player2"]').forEach((cell) => {
    if (["●", "❌", "☠️"].includes(cell.textContent)) cell.textContent = "";
  });
};

export const renderScoreBoard = (playerEl, player, opponent) => {
  playerEl.innerHTML = "";
  const sunkShips = opponent.board.sunkShips;
  const wrapperNameScore = document.createElement("div");
  wrapperNameScore.classList.add("name-score");
  const playerName = document.createElement("div");
  playerName.textContent = player.name;
  const score = document.createElement("div");
  score.textContent = `Score: ${player.score}`;
  wrapperNameScore.append(playerName, score);
  const sunkShipsEl = document.createElement("div");
  const sunkLabel = document.createElement("div");
  sunkLabel.textContent = "Sunk Ships ☠️";
  sunkShipsEl.appendChild(sunkLabel);
  sunkShipsEl.classList.add("sunk-ships");
  for (let i = 0; i < sunkShips.length; i++) {
    const ship = document.createElement("div");
    ship.classList.add(shipColour[sunkShips[i].name]);
    ship.textContent = sunkShips[i].name;
    sunkShipsEl.appendChild(ship);
  }
  playerEl.append(wrapperNameScore, sunkShipsEl);
};

export const updateDOM = (
  result,
  boardEl,
  player,
  compRow = undefined,
  compCol = undefined,
) => {
  const [row, col] = player.board.attackedIndices.at(-1);
  const cell = boardEl.querySelector(
    `[data-row="${compRow ?? row}"][data-col="${compCol ?? col}"]`,
  );
  if (result === "missed") {
    cell.textContent = "●";
  }
  if (result === "hit") {
    cell.textContent = "❌";
  }
  if (result instanceof Ship) {
    player.board
      .getShipIndices(result)
      .forEach(
        ([row, col]) =>
          (boardEl.querySelector(
            `[data-row="${row}"][data-col="${col}"]`,
          ).textContent = "☠️"),
      );
  }
};

export const printBoard = (player) => {
  const grid = [];
  for (let i = 0; i < 10; i++) {
    const row = {};
    for (let j = 0; j < 10; j++) {
      const val = player.board.getBoardValues(i, j);
      row[j] = val ? (typeof val === "object" ? val.name[0] : val) : ".";
    }
    grid.push(row);
  }
  console.table(grid);
};

export const renderComputerAttackState = (el) => {
  const dots = ["", ".", "..", "..."];
  let i = 0;
  const interval = setInterval(() => {
    el.textContent = `Computer Attacking${dots[i % dots.length]}`;
    i++;
  }, 200);
  return interval;
};

