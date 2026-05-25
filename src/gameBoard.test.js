import { GameBoard } from "./gameBoard.js";
import { Ship } from "./ship.js";
describe("GameBoard class", () => {
  let board, ship;
  beforeEach(() => {
    board = new GameBoard();
    ship = new Ship(3);
  });
  describe("validatePlacement", () => {
    test("valid initial position returns true", () =>
      expect(board.validatePlacement(5, 5, ship)).toBe(true));

    test("if the position is occupied return false", () => {
      board.placeShip(5, 5, ship);
      expect(board.validatePlacement(5, 5, ship)).toBe(false);
    });

    test.each([
      [-1, 4],
      [4, -1],
      [10, 3],
      [3, 10],
    ])("invalid positions returns false", (row, col) => {
      expect(board.validatePlacement(row, col, ship)).toBe(false);
    });

    test.each([
      [6, 5],
      [5, 6],
      [4, 5],
      [5, 4],
    ])("valid adjacent second moves returns true", (row, col) => {
      board.placeShip(5, 5, ship);
      expect(board.validatePlacement(row, col, ship)).toBe(true);
    });

    test.each([
      [7, 5],
      [5, 7],
      [3, 5],
      [5, 3],
    ])("invalid adjacent second moves returns false", (row, col) => {
      board.placeShip(5, 5, ship);
      expect(board.validatePlacement(row, col, ship)).toBe(false);
    });

    test.each([
      [7, 5],
      [4, 5],
    ])("valid adjacent third moves in same column returns true", (row, col) => {
      board.placeShip(5, 5, ship);
      board.placeShip(6, 5, ship);
      expect(board.validatePlacement(row, col, ship)).toBe(true);
    });

    test.each([
      [5, 7],
      [5, 4],
    ])("valid adjacent third moves in same row returns true", (row, col) => {
      board.placeShip(5, 5, ship);
      board.placeShip(5, 6, ship);
      expect(board.validatePlacement(row, col, ship)).toBe(true);
    });

    test("when placement number exceeds ship length returns false", () => {
      board.placeShip(5, 5, ship);
      board.placeShip(5, 6, ship);
      board.placeShip(5, 7, ship);
      expect(board.validatePlacement(5, 8, ship)).toBe(false);
    });

    test.each([
      [8, 5],
      [3, 5],
    ])(
      "invalid adjacent third moves in same column returns false",
      (row, col) => {
        board.placeShip(5, 5, ship);
        board.placeShip(6, 5, ship);
        expect(board.validatePlacement(row, col, ship)).toBe(false);
      },
    );

    test.each([
      [5, 8],
      [5, 0],
    ])("invalid adjacent third moves in same row returns false", (row, col) => {
      board.placeShip(5, 5, ship);
      board.placeShip(5, 6, ship);
      expect(board.validatePlacement(row, col, ship)).toBe(false);
    });

    test("diagonal placements return false", () => {
      board.placeShip(5, 5, ship);
      expect(board.validatePlacement(4, 6, ship)).toBe(false);
      expect(board.validatePlacement(6, 4, ship)).toBe(false);
    });

    test("longer length ship, forth move test", () => {
      const ship5 = new Ship(5);

      board.placeShip(5, 5, ship5);
      board.placeShip(5, 6, ship5);
      board.placeShip(5, 7, ship5);
      expect(board.validatePlacement(5, 8, ship5)).toBe(true);
    });

    test("longer length ship, when placement number exceeds ship length returns false", () => {
      const ship5 = new Ship(5);

      board.placeShip(5, 4, ship5);
      board.placeShip(5, 5, ship5);
      board.placeShip(5, 6, ship5);
      board.placeShip(5, 7, ship5);
      board.placeShip(5, 8, ship5);

      expect(board.validatePlacement(5, 9, ship5)).toBe(false);
    });
  });
});
