import nationData from '../data/nations.json'
import difficulties from '../data/difficulties.json'
import { Nation } from '../model/Nation.js'
import { Repository } from '../repository/Repository.js'

export class NationController {
  /**
   * @type {Repository<Nation>}
   */
  #nations

  constructor() {
    this.#nations = new Repository(Nation)
    this.#createNations("easy")
  }

  #createNations (difficulty) {
    const countryCodes = difficulties[difficulty]

    if (!countryCodes) {
      throw new RangeError(`Unkown difficulty: ${difficulty}`)
    }

    for (const data of nationData) {
      if (countryCodes.includes(data.countryCode)) {
        this.#nations.add(new Nation(data))
      }
    }
  }

  get nations () {
    return this.#nations.getAllItems()
  }
}