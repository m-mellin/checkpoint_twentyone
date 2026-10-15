import nationData from '../data/nations.json'
import difficulties from '../data/difficulties.json'
import portraitData from '../data/potraits.json'
import discrepanciesData from '../data/discrepancies.json'

import { Nation } from '../model/Nation.js'
import { Repository } from '../repository/Repository.js'
import { Sex } from '../model/Person.js'
import { TravellerGenerator } from '../model/TravellerGenerator.js'
import { Traveller } from '../model/Traveller.js'
import { Discrepancy } from '../model/Discrepancy.js'

const TRAVELLERS_PER_DAY = 10
const FORGERY_PROBABILITY = 0.4

/**
 * The difficulties a game can be started at.
 *
 * @readonly
 * @enum {'easy' | 'medium' | 'hard'}
 */
export const Difficulties = Object.freeze({
  EASY: 'easy',
  MEDIUM: 'medium',
  HARD: 'hard'
})

/**
 * Sets up a game: the nations in play, the discrepancies that can occur and the travellers of the day.
 */
export class GameController {
  /**
   * The nations travellers can come from.
   *
   * @type {Repository<Nation>}
   */
  #nations = new Repository(Nation)

  /**
   * The discrepancies a forged passport can have.
   *
   * @type {Repository<Discrepancy>}
   */
  #discrepancies = new Repository(Discrepancy)

  /**
   * The travellers waiting at the checkpoint.
   *
   * @type {Repository<Traveller>}
   */
  #travellers = new Repository(Traveller)

  /**
   * Calls the next traveller in the queue forward.
   *
   * @returns {Traveller | null} The next traveller, or null if everyone has already been called.
   */
  #nextTravellerIndex = 0

  #gameDate = new Date()

  /**
   * Starts a new game. Anything from an earlier game is replaced.
   *
   * @param {'easy' | 'medium' | 'hard'} difficulty - Difficulties.EASY, Difficulties.MEDIUM or Difficulties.HARD.
   * @throws {RangeError} If the difficulty is unknown.
   */
  startGame(difficulty) {
    if (!Object.values(Difficulties).includes(difficulty)) {
      throw new RangeError(
        'difficulty must be Difficulties.EASY ("easy"), Difficulties.MEDIUM ("medium") or Difficulties.HARD ("hard")'
      )
    }

    this.#gameDate = this.#today()

    this.#nations = new Repository(Nation)
    this.#discrepancies = new Repository(Discrepancy)
    this.#travellers = new Repository(Traveller)

    this.#nextTravellerIndex = 0

    this.#generateNations(difficulty)
    this.#generateDiscrepancies(difficulty)
    this.#generateTravellers(this.#gameDate)
  }

  /**
   * Returns the travellers waiting at the checkpoint.
   *
   * @returns {Traveller[]} A copy of the list of travellers.
   */
  get travellers() {
    return this.#travellers.getAllItems()
  }

  callNextTraveller() {
    const travellers = this.#travellers.getAllItems()

    // Everyone in today's queue has already been called
    if (this.#nextTravellerIndex >= travellers.length) {
      return null
    }

    const traveller = travellers[this.#nextTravellerIndex]
    this.#nextTravellerIndex++

    return traveller
  }

  /**
   * Returns today's date at midnight UTC.
   *
   * @returns {Date} The date.
   */
  #today() {
    const now = new Date()

    return new Date(
      Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate())
    )
  }

  /**
   * Adds the nations that are in play at the difficulty.
   *
   * @param {'easy' | 'medium' | 'hard'} difficulty - The chosen difficulty.
   */
  #generateNations(difficulty) {
    const countryCodes = difficulties[difficulty]

    for (const data of nationData) {
      if (countryCodes.includes(data.countryCode)) {
        this.#nations.add(new Nation(data))
      }
    }
  }

  /**
   * Adds the discrepancies that can occur at the difficulty.
   *
   * @param {'easy' | 'medium' | 'hard'} difficulty - The chosen difficulty.
   */
  #generateDiscrepancies(difficulty) {
    for (const code of discrepanciesData[difficulty]) {
      this.#discrepancies.add(new Discrepancy(code))
    }
  }

  /**
   * Adds the travellers of the day, some of them with forged passports.
   *
   * @param {Date} gameDate - Today's date in the game, at midnight UTC.
   */
  #generateTravellers(gameDate) {
    const generator = new TravellerGenerator(
      gameDate,
      this.#appearancesBySex(),
      FORGERY_PROBABILITY
    )
    const travellers = generator.createTravellers(
      TRAVELLERS_PER_DAY,
      this.#nations.getAllItems(),
      this.#discrepancies.getAllItems()
    )

    for (const traveller of travellers) {
      this.#travellers.add(traveller)
    }
  }

  /**
   * Returns the portrait ids available for each sex.
   *
   * @returns {Record<'M' | 'F', string[]>} The portrait ids, grouped by sex.
   */
  #appearancesBySex() {
    return {
      [Sex.MALE]: this.#portraitIdsFor(Sex.MALE),
      [Sex.FEMALE]: this.#portraitIdsFor(Sex.FEMALE)
    }
  }

  /**
   * Returns the ids of the portraits of one sex.
   *
   * @param {'M' | 'F'} sex - Sex.MALE or Sex.FEMALE.
   * @returns {string[]} The portrait ids.
   */
  #portraitIdsFor(sex) {
    return portraitData
      .filter((portrait) => portrait.sex === sex)
      .map((portrait) => portrait.id)
  }

  get gameDate() {
    return new Date(this.#gameDate)
  }
}
