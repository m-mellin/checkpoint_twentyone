import nationData from '../data/nations.json'
import difficulties from '../data/difficulties.json'
import portraitData from '../data/potraits.json'

import { Nation } from '../model/Nation.js'
import { Repository } from '../repository/Repository.js'
import { Sex } from '../model/Person.js'
import { TravellerGenerator } from '../model/TravellerGenerator.js'
import { Transcript } from '../model/Transcript.js'
import { Traveller } from '../model/Traveller'

export const Difficulties = Object.freeze({ EASY: 'easy', MEDIUM: 'medium', HARD: 'hard'})

export class GameController {
  /**
   * @type {Repository<Nation>}
   */
  #nations

  /**
   * @type {Repository<Traveller>}
   */
  #travellers

  /**
   * @type {Repository<Transcript>}
   */
  #transcripts

  /**
   * Constructor
   */
  constructor() {
    this.#nations = new Repository(Nation)
    this.#travellers = new Repository(Traveller)
    this.#transcripts = new Repository(Transcript)
  }

  /**
   * 
   * @param {'easy' | 'medium' | 'hard'} difficulty 
   */
  startGame(difficulty) {
    if (!Object.values(Difficulties).includes(difficulty)) {
      throw new RangeError('difficulty must be Difficulties.EASY ("easy"), Difficulties.MEDIUM ("medium") or Difficulties.HARD ("hard")')
    }

    const now = new Date()
    const gameDate = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()))

    this.#generateNations(difficulty)
    this.#generateTravellers(gameDate)

    console.log(this.#travellers.getAllItems())

  }

  /**
   * 
   * @param {'easy' | 'medium' | 'hard'} difficulty 
   */
  #generateNations(difficulty) {
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

  /**
   * @returns {Nation[]}
   */
  get nations () {
    return this.#nations.getAllItems()
  }

  /**
   * 
   * @param {Date} gameDate 
   */
  #generateTravellers(gameDate) {
    const apperances = {
      [Sex.MALE]: portraitData.filter((portrait) => portrait.sex === Sex.MALE).map((portrait) => portrait.id),
      [Sex.FEMALE]: portraitData.filter((portrait) => portrait.sex === Sex.FEMALE).map((portrait) => portrait.id)
    }

    const generator = new TravellerGenerator(gameDate, apperances)

    for (const traveller of generator.createTravellers(10, this.nations)) {
      this.#travellers.add(traveller)
    }
  }
}