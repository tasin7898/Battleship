export class Ship {
  #hits = 0;
  #length
  constructor(length) {
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
}
