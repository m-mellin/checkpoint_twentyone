/**
 * Picks random values. The source of randomness can be replaced.
 */
export class Random {
  /**
   * Returns a number from 0 (inclusive) to 1 (exclusive).
   *
   * @type {() => number}
   */
  #next

  /**
   * Creates a random picker.
   *
   * @param {() => number} [next=Math.random] - Returns a number from 0 (inclusive) to 1 (exclusive).
   */
  constructor (next = Math.random) {
    this.#next = next
  }

  /**
   * Returns a random item from a list.
   *
   * @template T
   * @param {readonly T[]} items - The items to pick from.
   * @returns {T} One of the items.
   * @throws {RangeError} If the list is empty.
   */
  pick (items) {
    if (items.length === 0) {
      throw new RangeError('Cannot pick from an empty list')
    }

    return items[Math.floor(this.#next() * items.length)]
  }

  /**
   * Returns a random whole number between min and max, both included.
   *
   * @param {number} min - The smallest possible number.
   * @param {number} max - The largest possible number.
   * @returns {number} The random number.
   */
  integer (min, max) {
    return min + Math.floor(this.#next() * (max - min + 1))
  }

  /**
   * Returns true with the given probability.
   *
   * @param {number} probability - From 0 (never) to 1 (always).
   * @returns {boolean} True or false.
   */
  chance (probability) {
    return this.#next() < probability
  }
}
