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
    });
    
  });
});
