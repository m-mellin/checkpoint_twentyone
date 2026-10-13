export class Traveller {

  #person
  #passport

  constructor (person, passport) {
    this.#person = person
    this.#passport = passport
  }

  get passport () {
    return this.#passport
  }

}