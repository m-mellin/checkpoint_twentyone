import { Person } from './Person.js'
import { Passport } from './Passport.js'
import { Discrepancy } from './Discrepancy.js'
import { assertInstanceOf } from './validation.js'

/**
 * A person arriving at the checkpoint, carrying a passport that may be forged.
 */
export class Traveller {
  /**
   * Who the traveller really is.
   *
   * @type {Person}
   */
  #person

  /**
   * The passport the traveller carries.
   *
   * @type {Passport}
   */
  #passport

  /**
   * The error in the passport, or null if the passport is genuine.
   *
   * @type {Discrepancy | null}
   */
  #discrepancy

  /**
   * Creates a traveller.
   *
   * @param {Person} person - Who the traveller really is.
   * @param {Passport} passport - The passport the traveller carries.
   * @param {Discrepancy | null} [discrepancy=null] - The error in the passport, or null if it is genuine.
   * @throws {TypeError} If a value has the wrong type.
   */
  constructor(person, passport, discrepancy = null) {
    assertInstanceOf(person, Person, 'person')
    assertInstanceOf(passport, Passport, 'passport')

    if (discrepancy !== null) {
      assertInstanceOf(discrepancy, Discrepancy, 'discrepancy')
    }

    this.#person = person
    this.#passport = passport
    this.#discrepancy = discrepancy
  }

  /**
   * Returns who the traveller really is.
   *
   * @returns {Person} The person.
   */
  get person() {
    return this.#person
  }

  /**
   * Returns the passport the traveller carries.
   *
   * @returns {Passport} The passport.
   */
  get passport() {
    return this.#passport
  }

  /**
   * Returns the error in the passport.
   *
   * @returns {Discrepancy | null} The discrepancy, or null if the passport is genuine.
   */
  get discrepancy() {
    return this.#discrepancy
  }

  /**
   * Returns true if the traveller has a genuine passport.
   * 
   * @returns {boolean} True if genuine, false if not.
   */
  get hasGenuinePassport() {
    return this.#discrepancy === null
  }
}
