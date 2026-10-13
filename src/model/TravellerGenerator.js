import { Random } from "./Random.js"
import { Person, Sex } from "./Person.js"
import { Nation } from "./Nation.js"

const DAY_IN_MS = 24 * 60 * 60 * 1000
const MIN_AGE = 10
const MAX_AGE = 80
const MIN_HEIGHT_IN_CM = 150
const MAX_HEIGHT_IN_CM = 210

export class TravellerGenerator {
  #gameDate
  #random

  /**
   * 
   * @param {Date} gameDate 
   * @param {Random} random 
   */
  constructor (gameDate, random = new Random()) {
    this.#gameDate = new Date(gameDate)
    this.#random = random
  }

  /**
   * 
   * @param {number} count 
   * @param {Nation[]} nations 
   */
  createPeople (count, nations) {
    const people = []

    for (let i = 1; i <= count; i++) {
      people.push(this.createPerson(this.#random.pick(nations)))
    }
  }

  /**
   * 
   * @param {Nation} nation 
   * @returns {Person}
   */
  createPerson (nation) {
    const sex = this.#random.pick(Object.values(Sex))
    const firstNames = sex === Sex.MALE ? nation.maleFirstNames : nation.femaleFirstNames

    return new Person({
      firstName: this.#random.pick(firstNames),
      surname: this.#random.pick(nation.surnames),
      heightInCm: this.#random.integer(MIN_HEIGHT_IN_CM, MAX_HEIGHT_IN_CM),
      nationality: nation,
      dateOfBirth: this.#randomDateOfBirth(),
      birthplace: this.#random.pick(nation.issuingCities),
      sex
    })
  }

  /**
   * 
   * @returns {Date}
   */
  #randomDateOfBirth () {
    const youngest = this.#yearsBefore(this.#gameDate, MIN_AGE)
    const oldest = this.#yearsBefore(this.#gameDate, MAX_AGE)
    const daysBetween = Math.round((youngest.getTime() - oldest.getTime()) / DAY_IN_MS)

    return new Date(oldest.getTime() + this.#random.integer(0, daysBetween) * DAY_IN_MS)
  }

  /**
   * 
   * @param {Date} date 
   * @param {number} years 
   * @returns {Date}
   */
  #yearsBefore (date, years) {
    const earlier = new Date(date)
    earlier.setUTCFullYear(earlier.getUTCFullYear() - years)

    return earlier
  }
}