export class Discrepancy {
  #name

  constructor (name) {
    this.#name = name
  }

  get name () {
    return this.#name
  }
}