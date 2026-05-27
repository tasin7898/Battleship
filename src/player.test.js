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
  });
});
