import { Game } from "../src/logic/game.js";
import { Player, ComputerPlayer } from "../src/logic/player.js";
import { Ship } from "../src/logic/ship.js";
describe("Game class", () => {
  let player1, player2, game;
  let p1Ship, p2Ship;

  beforeEach(() => {
    player1 = new Player("Tasin");
    player2 = new ComputerPlayer("Computer67");
    game = new Game(player1, player2);

    p1Ship = new Ship(2, "P1Ship");
    p2Ship = new Ship(2, "P2Ship");

    player1.board.placeShip(0, 0, p1Ship);
    player1.board.placeShip(0, 1, p1Ship);

    player2.board.placeShip(0, 0, p2Ship);
    player2.board.placeShip(0, 1, p2Ship);
  });

  describe("handleAttack", () => {
    test("returns 'missed' on a miss", () => {
      const { resultP1 } = game.handleAttack(9, 9);
      expect(resultP1).toBe("missed");
    });

    test("returns 'hit' on a hit", () => {
      const { resultP1 } = game.handleAttack(0, 0);
      expect(resultP1).toBe("hit");
    });

    test(" player1 attacks on the first move", () => {
      const before = player2.board.attackedIndices.length;
      game.handleAttack(9, 9);
      expect(player2.board.attackedIndices.length).toBe(before + 1);
    });

    test("computer attacks player1's board after player1 attacks", () => {
      const before = player1.board.attackedIndices.length;
      game.handleAttack(9, 9);
      expect(player1.board.attackedIndices.length).toBe(before + 1);
    });
    test("returns Ship instance when player1 sinks a ship", () => {
      game.handleAttack(0, 0);
      const { resultP1 } = game.handleAttack(0, 1);
      expect(resultP1).toBeInstanceOf(Ship);
    });

    test("returns player1 as winner when all of player2's ships are sunk", () => {
      game.handleAttack(0, 0);
      const { winner } = game.handleAttack(0, 1);
      expect(winner).toBe(player1);
    });
  });
});
