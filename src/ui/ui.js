
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

export const renderShips = (shipName, size) => {
  const shipColour = {
    Patrol_Boat: "red",
    Submarine: "yellow",
    Destroyer: "green",
    Battleship: "blue",
  };
  const container = document.createElement("div");
  container.classList.add("ships");
  for (let i = 0; i < size; i++) {
    const div = document.createElement("div");
    div.classList.add(shipColour[shipName]);
    div.dataset.idx = i;
    container.appendChild(div);
  }
  return container;
};

