import { Nation } from "./Nation"
import { assertInstanceOf, assertNonEmptyString, assertNumberIsFinite, assertValidDate } from "./validation"

const SEX_PATTERN = /^[MF]$/

export class Person {
  #firstName
  #surname
  #heightInCm
  #nationality
  #dateOfBirth
  #birthplace
  #sex

  constructor ({ firstName, surname, heightInCm, nationality, dateOfBirth, birthplace, sex }) {
    assertNonEmptyString(firstName, 'firstName')
    assertNonEmptyString(surname, 'surname')
    assertNonEmptyString(birthplace, 'birthplace')
    assertValidDate(dateOfBirth, 'dateOfBirth')
    assertNumberIsFinite(heightInCm, 'heightInCm')
    assertInstanceOf(nationality, Nation, 'nationality')

    if (!SEX_PATTERN.test(sex)) {
      throw new RangeError('sex must be one capital letter, either "M" for male or "F" for female.')
    }

    this.#firstName = firstName
    this.#surname = surname
    this.#heightInCm = heightInCm
    this.#nationality = nationality,
    this.#dateOfBirth = new Date(dateOfBirth)
    this.#birthplace = birthplace
    this.#sex = sex
  }

  /**
   * @returns {string} The first name.
   */
  get firstName () {
    return this.#firstName
  }

  /**
   * @returns {string} The surname.
   */
  get surname () {
    return this.#surname
  }

  /**
   * @returns {number} The height in centimetres.
   */
  get heightInCm () {
    return this.#heightInCm
  }

  /**
   * @returns {Nation} The nation the person is a citizen of.
   */
  get nationality () {
    return this.#nationality
  }

  /**
   * @returns {Date} A copy of the date of birth.
   */
  get dateOfBirth () {
    return new Date(this.#dateOfBirth)
  }

  /**
   * @returns {string} The city of birth.
   */
  get birthplace () {
    return this.#birthplace
  }

  /**
   * @returns {'M' | 'F'} The sex.
   */
  get sex () {
    return this.#sex
  }
}