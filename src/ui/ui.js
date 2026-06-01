
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
  for (let i = 0; i < ship.length; i++) {
    const div = document.createElement("div");
    div.classList.add(shipColour[ship.name]);
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

