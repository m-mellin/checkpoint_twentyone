import { RandomGenerator, Randomizer } from 'dice-rng-toolkit'

/**
 * Picks random values. The source of randomness can be replaced.
 */
export class Random {
  /**
   * The seedable generator that all values come from.
   *
   * @type {RandomGenerator}
   */
  #generator

  /**
   * Picks random items from lists, using the generator.
   *
   * @type {Randomizer}
   */
  #randomizer = new Randomizer()

  /**
   * Creates a random picker.
   *
   * @param {number} [seed=Date.now()] - The seed.
   */
  constructor(seed = Date.now()) {
    this.#generator = new RandomGenerator(seed)
  }

  /**
   * Returns a random item from a list.
   *
   * @template T
   * @param {readonly T[]} items - The items to pick from.
   * @returns {T} One of the items.
   * @throws {RangeError} If the list is empty.
   */
  pick(items) {
    if (items.length === 0) {
      throw new RangeError('Cannot pick from an empty list')
    }

    return this.#randomizer.pick([...items], this.#generator)
  }

  /**
   * Returns a random whole number between min and max, both included.
   *
   * @param {number} min - The smallest possible number.
   * @param {number} max - The largest possible number.
   * @returns {number} The random number.
   */
  integer(min, max) {
    return this.#generator.nextInt(min, max)
  }

  /**
   * Returns true with the given probability.
   *
   * @param {number} probability - From 0 (never) to 1 (always).
   * @returns {boolean} True or false.
   */
  chance(probability) {
    return this.#generator.nextBoolean(probability)
  }
}
