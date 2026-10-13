import nationData from '../data/nations.json'
import difficulties from '../data/difficulties.json'
import portraitData from '../data/potraits.json'
import discrepanciesData from '../data/discrepancies.json'

import { Nation } from '../model/Nation.js'
import { Repository } from '../repository/Repository.js'
import { Sex } from '../model/Person.js'
import { TravellerGenerator } from '../model/TravellerGenerator.js'
import { Transcript } from '../model/Transcript.js'
import { Traveller } from '../model/Traveller'
import { Discrepancy } from '../model/Discrepancy'

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
   * @type {Repository<Discrepancy>}
   */
  #discrepancies

  /**
   * Constructor
   */
  constructor () {
    this.#nations = new Repository(Nation)
    this.#travellers = new Repository(Traveller)
    this.#transcripts = new Repository(Transcript)
    this.#discrepancies = new Repository(Discrepancy)
  }

  /**
   * 
   * @param {'easy' | 'medium' | 'hard'} difficulty 
   */
  startGame (difficulty) {
    if (!Object.values(Difficulties).includes(difficulty)) {
      throw new RangeError('difficulty must be Difficulties.EASY ("easy"), Difficulties.MEDIUM ("medium") or Difficulties.HARD ("hard")')
    }

    const now = new Date()
    const gameDate = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()))
    const forgeryProbability = 0.4

    this.#generateNations(difficulty)
    this.#generateTravellers(gameDate, forgeryProbability)
    this.#generateDiscrepancies(difficulty)

    console.log(this.#travellers.getAllItems())
    console.log(this.#discrepancies.getAllItems())

  }

  /**
   * 
   * @param {'easy' | 'medium' | 'hard'} difficulty 
   */
  #generateNations (difficulty) {
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
   * 
   * @param {Date} gameDate 
   * @param {number} forgeryProbability
   */
  #generateTravellers (gameDate, forgeryProbability) {
    const apperances = {
      [Sex.MALE]: portraitData.filter((portrait) => portrait.sex === Sex.MALE).map((portrait) => portrait.id),
      [Sex.FEMALE]: portraitData.filter((portrait) => portrait.sex === Sex.FEMALE).map((portrait) => portrait.id)
    }

    const generator = new TravellerGenerator(gameDate, apperances, forgeryProbability)

    for (const traveller of generator.createTravellers(10, this.#nations.getAllItems())) {
      this.#travellers.add(traveller)
    }
  }

  /**
   * 
   * @param {'easy' | 'medium' | 'hard'} difficulty 
   */
  #generateDiscrepancies (difficulty) {
    const discrepancies = discrepanciesData[difficulty]

    for (const discrepancy of discrepancies) {
      this.#discrepancies.add(new Discrepancy(discrepancy))
    }
  }
}