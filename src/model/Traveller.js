import { Person } from './Person.js'
import { Passport } from './Passport.js'
import { Discrepancy } from './Discrepancy.js'
import { assertInstanceOf } from './validation.js'

/**
 * A person arriving at the checkpoint, carrying a passport that may be forged.
 */
export class Traveller {

  #person
  #passport
  #discrepancy

  /**
   * 
   * @param {import('./Person.js').Person} person 
   * @param {import('./Passport.js').Passport} passport 
   * @param {import('./Discrepancy.js').Discrepancy | null} discrepancy 
   */
  constructor (person, passport, discrepancy = null) {
    assertInstanceOf(person, Person, 'person')
    assertInstanceOf(passport, Passport, 'passport')

    if (discrepancy !== null) {
      assertInstanceOf(discrepancy, Discrepancy, 'discrepancy')
    }

    this.#person = person
    this.#passport = passport
    this.#discrepancy = discrepancy
  }

  get person () {
    return this.#person
  }

  get passport () {
    return this.#passport
  }

  get discrepancy () {
    return this.#discrepancy
  }
}