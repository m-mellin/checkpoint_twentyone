export class Random {
  #next

  /**
   * 
   * @param {{} => number} next 
   */
  constructor (next = Math.random) {
    this.#next = next
  }
  /**
   * @template T
   * @param {readonly T[]} items 
   * @returns {T}
   * @throws {RangeError}
   */
  pick (items) {
    if (items.length === 0) {
      throw new RangeError('Cannot pick from an empty list')
    }

    return items[Math.floor(this.#next() * (items.length))]
  }

  /**
   * 
   * @param {number} min 
   * @param {number} max 
   * @returns {number}
   */
  integer (min, max) {
    return min + Math.floor(this.#next() * (max - min + 1))
  }

  /**
   *
   * @param {number} probability
   * @returns {boolean}
   */
  chance (probability) {
    return this.#next() < probability
  }
}