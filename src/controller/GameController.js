import nationData from '../data/nations.json'
import difficulties from '../data/difficulties.json'
import { Nation } from '../model/Nation.js'
import { Repository } from '../repository/Repository.js'
import { Person } from '../model/Person.js'
import { TravellerGenerator } from '../model/TravellerGenerator.js'
import { Transcript } from '../model/Transcript.js'

export const Difficulties = Object.freeze({ EASY: 'easy', MEDIUM: 'medium', HARD: 'hard'})

export class GameController {
  /**
   * @type {Repository<Nation>}
   */
  #nations

  /**
   * @type {Repository<Person>}
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
    this.#travellers = new Repository(Person)
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

    this.#createNations(difficulty)
    this.#createTravellers(gameDate)
  }

  /**
   * 
   * @param {'easy' | 'medium' | 'hard'} difficulty 
   */
  #createNations(difficulty) {
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

  #createTravellers(gameDate) {
    const generator = new TravellerGenerator(gameDate)

    for (const person of generator.createPeople(10, this.nations)) {
      this.#travellers.add(person)
    }
  }
}