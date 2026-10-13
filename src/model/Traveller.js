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