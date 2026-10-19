/**
 * Stores items of any one type.
 *
 * @template T
 */
export class Repository {
  /**
   * @type {T[]}
   */
  #items = []

  /**
   * @type {new (...args: any[]) => T}
   */
  #itemType

  /**
   * Constructor
   *
   * @param {new (...args: any[]) => T} itemType - The class every item must be an instance of.
   */
  constructor(itemType) {
    this.#itemType = itemType
  }

  /**
   * Add object from repository
   *
   * @param {*} item Any object
   */
  add(item) {
    if (!(item instanceof this.#itemType)) {
      throw new TypeError(`item must be a ${this.#itemType.name}, but was ${typeof item}`)
    }

    if (this.has(item)) {
      throw new Error(`${this.#itemType.name} has already been added.`)
    }

    this.#items.push(item)
  }

  /**
   * Check if object exists in repository
   *
   * @param {T} item - The item to look for.
   * @returns {boolean} true if the item exists, otherwise false.
   */
  has(item) {
    return this.#items.includes(item)
  }

  /**
   * Return index of an item in the list.
   *
   * @param {T} item - The item to find
   * @returns {number} the index of the item
   */
  #getIndex(item) {
    const index = this.#items.indexOf(item)

    if (index === -1) {
      throw new Error(`${this.#itemType.name} does not exist.`)
    }

    return index
  }

  /**
   * Remove item from repository
   *
   * @param {T} item Any object
   */
  remove(item) {
    this.#items.splice(this.#getIndex(item), 1)
  }

  /**
   * Returns a copy of the list
   *
   * @returns {Array<T>} all items from list
   */
  getAllItems() {
    return Array.from(this.#items)
  }
}
