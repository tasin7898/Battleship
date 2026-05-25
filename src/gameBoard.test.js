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

  describe("receiveAttack", () => {
    test.each([
      [-1, 4],
      [4, -1],
      [10, 3],
      [3, 10],
    ])("invalid positions returns false", (row, col) => {
      expect(board.receiveAttack(row, col)).toBe(undefined);
    });

    test.each([
      [0, 0],
      [3, 3],
      [6, 7],
      [9, 9],
    ])("attacking empty positions returns 'missed'", (row, col) => {
      board.placeShip(4, 5, ship);
      board.placeShip(4, 6, ship);
      board.placeShip(4, 7, ship);
      board.placeShip(4, 8, ship);

      expect(board.receiveAttack(row, col)).toBe("missed");
    });

    test("attacking empty positions injects 'X' in that position", () => {
      board.receiveAttack(0, 0);
      board.receiveAttack(3, 3);
      board.receiveAttack(4, 4);
      board.receiveAttack(10, 10);
      expect(board.missedIndices).toEqual([
        [0, 0],
        [3, 3],
        [4, 4],
      ]);
    });
    test.each([
      [0, 0],
      [3, 3],
      [6, 7],
      [9, 9],
    ])("attacking ship positions returns 'hit'", (row, col) => {
      const ship2 = new Ship(3);
      const ship3 = new Ship(3);
      const ship4 = new Ship(3);

      board.placeShip(0, 0, ship);
      board.placeShip(3, 3, ship2);
      board.placeShip(6, 7, ship3);
      board.placeShip(9, 9, ship4);

      expect(board.receiveAttack(row, col)).toBe("hit");
    });
    test("confirm correct ship placements", () => {
      const ship2 = new Ship(3);
      const ship3 = new Ship(3);
      const ship4 = new Ship(5);

      board.placeShip(0, 0, ship);
      board.placeShip(0, 1, ship);
      board.placeShip(0, 2, ship);

      board.placeShip(3, 3, ship2);
      board.placeShip(4, 3, ship2);
      board.placeShip(2, 3, ship2);

      board.placeShip(6, 7, ship3);
      board.placeShip(7, 7, ship3);

      board.placeShip(9, 9, ship4);
      board.placeShip(8, 9, ship4);
      board.placeShip(7, 9, ship4);
      board.placeShip(6, 9, ship4);
      board.placeShip(5, 9, ship4);

      expect(board.getShipIndices(ship)).toEqual([
        [0, 0],
        [0, 1],
        [0, 2],
      ]);
      expect(board.getShipIndices(ship2)).toEqual([
        [3, 3],
        [4, 3],
        [2, 3],
      ]);
      expect(board.getShipIndices(ship3)).toEqual([
        [6, 7],
        [7, 7],
      ]);
      expect(board.getShipIndices(ship4)).toEqual([
        [9, 9],
        [8, 9],
        [7, 9],
        [6, 9],
        [5, 9],
      ]);
    });

    test("sunk ship should print 'S'", () => {
      board.placeShip(0, 0, ship);
      board.placeShip(0, 1, ship);
      board.placeShip(0, 2, ship);

      board.receiveAttack(0, 0);
      board.receiveAttack(0, 1);
      board.receiveAttack(0, 2);

      expect(board.getBoardValues(0, 0)).toBe("S");
      expect(board.getBoardValues(0, 1)).toBe("S");
      expect(board.getBoardValues(0, 2)).toBe("S");
    });

    test("all shipd sunk", () => {
      const ship2 = new Ship(3);
      const ship3 = new Ship(2);
      const ship4 = new Ship(5);
      board.placeShip(0, 0, ship);
      board.placeShip(0, 1, ship);
      board.placeShip(0, 2, ship);

      board.placeShip(3, 3, ship2);
      board.placeShip(4, 3, ship2);
      board.placeShip(2, 3, ship2);

      board.placeShip(6, 7, ship3);
      board.placeShip(7, 7, ship3);

      board.placeShip(9, 9, ship4);
      board.placeShip(8, 9, ship4);
      board.placeShip(7, 9, ship4);
      board.placeShip(6, 9, ship4);
      board.placeShip(5, 9, ship4);

      board.receiveAttack(0, 0);
      board.receiveAttack(0, 1);
      board.receiveAttack(0, 2);
      board.receiveAttack(3, 3);
      board.receiveAttack(4, 3);
      board.receiveAttack(2, 3);
      board.receiveAttack(6, 7);
      board.receiveAttack(7, 7);
      board.receiveAttack(9, 9);
      board.receiveAttack(8, 9);
      board.receiveAttack(7, 9);
      board.receiveAttack(6, 9);
      board.receiveAttack(5, 9);
      expect(board.allSunk()).toBe(true)
    })
  });
});
