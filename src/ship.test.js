import { Ship } from "./ship.js";

describe("ship class", () => {
  let ship1;
  beforeEach(() => {
    ship1 = new Ship(3);
  });

  test("hit increments", () => {
    ship1.hit();
    ship1.hit();
    expect(ship1.hits).toBe(2);
  });

  test("isSunk is false", () => {
    ship1.hit();
    ship1.hit();
    expect(ship1.isSunk()).toBe(false);
  });

  test("isSunk is true", () => {
    ship1.hit();
    ship1.hit();
    ship1.hit();
    expect(ship1.isSunk()).toBe(true);
  });
});
