import nationData from '../data/nations.json'
import difficulties from '../data/difficulties.json'
import portraitData from '../data/portraits.json'
import discrepanciesData from '../data/discrepancies.json'

import { Nation } from '../model/Nation.js'
import { Repository } from '../repository/Repository.js'
import { Sex } from '../model/Person.js'
import { TravellerGenerator } from '../model/TravellerGenerator.js'
import { Traveller } from '../model/Traveller.js'
import { Discrepancy } from '../model/Discrepancy.js'
import { addDays } from '../model/dates.js'

/**
 * How many travellers come to the checkpoint each day.
 */
const TRAVELLERS_PER_DAY = 15

/**
 * The share of passports that are forged, from 0 to 1.
 */
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
   * The position in the queue of the next traveller to call forward.
   *
   * @type {number}
   */
  #nextTravellerIndex = 0

  /**
   * Today's date in the game, at midnight UTC.
   *
   * @type {Date}
   */
  #gameDate = new Date()

  /**
   * Which day of the game it is, starting at 1.
   *
   * @type {number}
   */
  #day = 1

  /**
   * The difficulty the game was started at.
   *
   * @type {'easy' | 'medium' | 'hard'}
   */
  #gameDifficulty = Difficulties.EASY

  /**
   * The traveller at the window right now, or null if nobody has been called yet.
   *
   * @type {Traveller | null}
   */
  #currentTraveller = null

  /**
   * How many decisions the player has got right.
   *
   * @type {number}
   */
  #correctDecisions = 0
  
  /**
   * How many decisions the player has got wrong.
   *
   * @type {number}
   */
  #incorrectDecisions = 0

  /**
   * How many citations the player has today
   */
  #citations = 0

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

    this.#gameDifficulty = difficulty
    this.#gameDate = this.#today()
    this.#day = 1

    this.#nations = new Repository(Nation)
    this.#discrepancies = new Repository(Discrepancy)
    this.#travellers = new Repository(Traveller)

    this.#nextTravellerIndex = 0
    this.#currentTraveller = null
    this.#correctDecisions = 0
    this.#incorrectDecisions = 0
    this.#citations = 0

    this.#generateNations(difficulty)
    this.#generateDiscrepancies(difficulty)
    this.#generateTravellers(this.#gameDate)
  }
  
  /**
   * Starts the next day: moves the game date one day forward and lets a new queue of travellers in.
   * The nations, the discrepancies and the score are kept.
   */
  startNextDay() {
    this.#day++
    this.#gameDate = addDays(this.#gameDate, 1)
    this.#travellers = new Repository(Traveller)
    this.#nextTravellerIndex = 0
    this.#currentTraveller = null
    this.#citations = 0
    
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

  /**
   * Returns the difficulty the game was started at.
   *
   * @returns {'easy' | 'medium' | 'hard'} The difficulty.
   */
  get difficulty() {
    return this.#gameDifficulty
  }
  
  /**
   * Returns today's date in the game.
   *
   * @returns {Date} A copy of the game date.
   */
  get gameDate() {
    return new Date(this.#gameDate)
  }

  /**
   * Returns which day of the game it is.
   *
   * @returns {number} The day, starting at 1.
   */
  get day() {
    return this.#day
  }

  /**
   * Returns the current days citation amount.
   * 
   * @returns {number} The citation amount.
   */
  get citations() {
    return this.#citations
  }

  /**
   * Returns how many decisions the player has got right today.
   *
   * @returns {number} The number of correct decisions.
   */
  get correctDecisions() {
    return this.#correctDecisions
  }
  
  /**
   * Returns how many decisions the player has got wrong today.
   *
   * @returns {number} The number of mistakes.
   */
  get incorrectDecisions() {
    return this.#incorrectDecisions
  }

  /**
   * Calls the next traveller in the queue forward.
   *
   * @returns {Traveller | null} The next traveller, or null if everyone has already been called.
   */
  callNextTraveller() {
    const travellers = this.#travellers.getAllItems()

    // Everyone in today's queue has already been called
    if (this.#nextTravellerIndex >= travellers.length) {
      return null
    }

    const traveller = travellers[this.#nextTravellerIndex]
    this.#nextTravellerIndex++

    this.#currentTraveller = traveller

    return traveller
  }

  /**
   * Judges the player's decision for the traveller at the window, and counts it.
   *
   * @param {boolean} approved - True if the player approved the passport.
   * @returns {{isCorrect: boolean, discrepancy: Discrepancy | null}} Whether the decision was right,
   *   and the error in the passport, if it had one.
   * @throws {Error} If no traveller is at the window.
   */
  judge(approved) {
    if (this.#currentTraveller === null) {
      throw new Error('There is no current traveller to judge.')
    }

    const discrepancy = this.#currentTraveller.discrepancy
    const isCorrect = approved === this.#currentTraveller.hasGenuinePassport

    if (isCorrect) {
      this.#correctDecisions++
    } else {
      this.#incorrectDecisions++
      this.#citations++
    }

    return { isCorrect, discrepancy }
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
}
