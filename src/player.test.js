import { Player, ComputerPlayer } from "./player.js";

describe("Player class", () => {
  let player1;
  beforeEach(() => {
    player1 = new Player("Tasin");
  });
  describe("ComputerPlayer subclass", () => {
    let computerPlayer;
    beforeEach(() => (computerPlayer = new ComputerPlayer()));
    describe("placeRandShips", () => {
      test("number of ships must be 4", () => {
        computerPlayer.placeRandShips();
        expect(computerPlayer.board.shipObj.length).toBe(4);
      });
      test("check if ships have been placed at correct indices on the board", () => {
        computerPlayer.placeRandShips();
        computerPlayer.board.shipObj.forEach(({ ship, pos }) =>
          pos.forEach(({ row, col }) =>
            expect(computerPlayer.board.getBoardValues(row, col)).toBe(ship),
          ),
        );
      });
    });
    describe("attack", () => {
      beforeEach(() => {
        computerPlayer.placeRandShips();
      });

      test("never attacks the same cell twice", () => {
        for (let i = 0; i < 50; i++) computerPlayer.attack();
        const attacked = computerPlayer.board.attackedIndices;
        const unique = new Set(attacked.map(([r, c]) => `${r},${c}`));
        expect(unique.size).toBe(attacked.length);
      });

      test("sinks all ships within 100 moves", () => {
        for (let i = 0; i < 70; i++) {
          computerPlayer.attack();
          if (computerPlayer.board.allSunk()) break;
        }
        expect(computerPlayer.board.allSunk()).toBe(true);
      });

      test("each attack adds exactly one attacked cell", () => {
        for (let i = 1; i <= 10; i++) {
          computerPlayer.attack();
          expect(computerPlayer.board.attackedIndices.length).toBe(i);
        }
      });
    });
  });
});




















