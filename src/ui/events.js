import { el } from "./dom.js";
import {
  resetShipsOrientation,
  toggleHighlightClass,
  placeShipCells,
  resetBoardAndShips,
  updateDOM,
  printBoard,
  renderScoreBoard,
  renderRandomisedShips,
  resetGame,
  renderComputerAttackState,
} from "./ui.js";
import { Player, ComputerPlayer } from "../logic/player.js";
import { Game } from "../logic/game.js";
import { Ship } from "../logic/ship.js";
import { player1, player2, startGame } from "../barrel.js";

let selectedShip = null;
let gameActive = null;
let dragStates = {
  idx: null,
  shipName: null,
  orientation: null,
};

export const initEvents = () => {
  document.addEventListener("click", (e) => {
    const {
      row: rowStr,
      col: colStr,
      board,
      ship,
      idx: idxStr,
    } = e.target.dataset;
    const row = Number(rowStr);
    const col = Number(colStr);
    const idx = Number(idxStr);

    if (!ship && selectedShip) selectedShip.classList.remove("selected");

    if (
      !e.target.closest(".all-ships-container") &&
      !e.target.matches(".rotate-button")
    ) {
      selectedShip = null;
    }

    if (ship) {
      if (selectedShip && selectedShip !== e.target.closest(".ships"))
        selectedShip.classList.remove("selected");
      selectedShip = e.target.closest(".ships");
      selectedShip.classList.add("selected");
    }

    if (e.target.matches(".rotate-button") && selectedShip) {
      selectedShip.classList.toggle("rotate");
    }

    if (e.target.matches(".reset-button")) {
      resetShipsOrientation();
    }

    if (e.target.matches(".reset-ships")) {
      resetBoardAndShips();
      player1.board.clear();
    }

    if (e.target === el.confirmFleetBtn) {
      if (
        !Object.values(player1.ships).every((ship) =>
          player1.board.getShipsIdx(ship),
        )
      )
        return;
      el.restartBtn.classList.remove("hidden");
      el.shipsAndbuttonsContainer.classList.add("cleared");
      el.confirmFleetBtn.classList.add("hidden");
      player2.placeRandShips();
      gameActive = true;
      printBoard(player1);
      printBoard(player2);
    }

    if (e.target === el.cancelDialogBtn || !el.dialogInner.contains(e.target)) {
      el.dialogBox.close();
    }
    if (e.target === el.confirmDialogBtn) {
      const name = el.nameInput.value.trim();
      if (name) player1.name_ = name;
      renderScoreBoard(el.player1ScoreBoard, player1, player2);
      el.dialogBox.close();
    }
    if (e.target === el.RandomiseShipsBtn) {
      resetBoardAndShips();
      player1.board.clear();
      player1.placeRandShips();
      renderRandomisedShips(player1);
    }

    if (e.target === el.restartBtn) {
      resetGame();
      player1.board.clear();
      player2.board.clear();
      renderScoreBoard(el.player1ScoreBoard, player1, player2);
      renderScoreBoard(el.player2ScoreBoard, player2, player1);
      gameActive = null;
      el.restartBtn.classList.add("hidden");
    }

    if (e.target === el.resetScoresBtn) {
      startGame.resetScores();
      console.log(player1.score, player2.score);
      renderScoreBoard(el.player1ScoreBoard, player1, player2);

      renderScoreBoard(el.player2ScoreBoard, player2, player1);
    }

    if (board === "player2" && gameActive) {
      gameActive = null;
      if (rowStr === undefined || colStr === undefined) return;
      const result = startGame.handleAttack(row, col);
      if (!result) return;
      const { resultP1, resultP2, winner } = result;

      updateDOM(resultP1, el.opponentBoard, player2);
      if (resultP1 instanceof Ship)
        renderScoreBoard(el.player1ScoreBoard, player1, player2);
      const [compRow, compCol] = player1.board.attackedIndices.at(-1);
      el.computerThinking.classList.remove("cleared");
      const interval = renderComputerAttackState(el.computerThinking);
      if (winner !== player1) {
        setTimeout(() => {
          if (!winner) gameActive = true;

          clearInterval(interval);
          el.computerThinking.classList.add("cleared");

          if (resultP2) {
            updateDOM(resultP2, el.playerBoard, player1, compRow, compCol);
            if (resultP2 instanceof Ship)
              renderScoreBoard(el.player2ScoreBoard, player2, player1);
          }
        }, 1000);
      }
      if (winner) {
        clearInterval(interval);
        el.computerThinking.classList.add("cleared");

        winner.addScore();
        renderScoreBoard(el.player1ScoreBoard, player1, player2);
        renderScoreBoard(el.player2ScoreBoard, player2, player1);
        el.announcement.textContent = `${winner.name} Wins this Naval Battle`;
        el.announcement.classList.remove("hidden");
        el.announcement.classList.add("appear");
        el.announcement.addEventListener(
          "animationend",
          () => {
            el.announcement.classList.remove("appear");
            el.announcement.classList.add("hidden");
          },
          { once: true },
        );
        el.restartBtn.textContent = "New Voyage";
        gameActive = null;
      }
    }
  });

  el.dialogBox.addEventListener("cancel", () => {});
  el.dialogBox.addEventListener("keydown", (e) => {
    if ((e.key === "Enter")) {
      const name = el.nameInput.value.trim();
      if (name) player1.name_ = name;
      renderScoreBoard(el.player1ScoreBoard, player1, player2);
      el.dialogBox.close();
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
    toggleHighlightClass(row, col, idx, shipName, orientation, false);
    placeShipCells(row, col, idx, shipName, orientation, ship);
    dragStates = { idx: null, shipName: null, orientation: null };
    console.log(player1.board.getBoardValues(0, 0));
  });
};
