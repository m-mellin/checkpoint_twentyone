import { assertNonEmptyString } from "./validation"

/**
 * A kind of error a forged passport can have, for example a misspelled surname or an expired date.
 */
export class Discrepancy {
  /**
   * The discrepancy code.
   *
   * @type {string}
   */
  #code

  /**
   * Creates a discrepancy.
   *
   * @param {string} code - The discrepancy code, for example "INCORRECT_SEX".
   */
  constructor (code) {
    assertNonEmptyString(code, 'code')
    
    this.#code = code
  }

  /**
   * Returns the discrepancy code.
   *
   * @returns {string} The code, for example "INCORRECT_SEX".
   */
  get code () {
    return this.#code
  }
}