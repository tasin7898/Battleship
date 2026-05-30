export class Ship {
  #hits = 0;
  #length;
  #name;
  constructor(length, name = "shipX") {
    this.#name = name;
    this.#length = length;
  }

  hit() {
    this.#hits++;
  }
  isSunk() {
    return this.#length <= this.#hits;
  }
  get hits() {
    return this.#hits;
  }
  get length () {
    return this.#length;
  }

  get name () {
    return this.#name;
  }
}

