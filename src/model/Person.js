import { Nation } from './Nation.js'
import {
  assertInstanceOf,
  assertNonEmptyString,
  assertNumberIsFinite,
  assertValidDate
} from './validation.js'

/**
 * The possible values for a person's sex.
 *
 * @readonly
 * @enum {'M' | 'F'}
 */
export const Sex = Object.freeze({ MALE: 'M', FEMALE: 'F' })

/**
 * Represents a real person, as they are, regardless of what their documents claim.
 */
export class Person {
  /**
   * The first name.
   *
   * @type {string}
   */
  #firstName

  /**
   * The surname.
   *
   * @type {string}
   */
  #surname

  /**
   * The height in centimetres.
   *
   * @type {number}
   */
  #heightInCm

  /**
   * The nation the person is a citizen of.
   *
   * @type {Nation}
   */
  #nationality

  /**
   * The date of birth, at midnight UTC.
   *
   * @type {Date}
   */
  #dateOfBirth

  /**
   * The city of birth.
   *
   * @type {string}
   */
  #birthplace

  /**
   * The sex, Sex.MALE or Sex.FEMALE.
   *
   * @type {'M' | 'F'}
   */
  #sex

  /**
   * The id of the portrait the person looks like, for example "M1".
   *
   * @type {string}
   */
  #apperance

  /**
   * Creates a person.
   *
   * @param {object} options - The person's data.
   * @param {string} options.firstName - The first name.
   * @param {string} options.surname - The surname.
   * @param {number} options.heightInCm - The height in centimetres.
   * @param {Nation} options.nationality - The nation the person is a citizen of.
   * @param {Date} options.dateOfBirth - The date of birth, at midnight UTC.
   * @param {string} options.birthplace - The city of birth.
   * @param {'M' | 'F'} options.sex - Sex.MALE or Sex.FEMALE.
   * @param {string} options.apperance - The id of the portrait the person looks like, for example "M1".
   * @throws {TypeError} If a value has the wrong type.
   * @throws {RangeError} If the sex is not Sex.MALE or Sex.FEMALE.
   */
  constructor({
    firstName,
    surname,
    heightInCm,
    nationality,
    dateOfBirth,
    birthplace,
    sex,
    apperance
  }) {
    for (const [name, value] of Object.entries({
      firstName,
      surname,
      birthplace,
      apperance
    })) {
      assertNonEmptyString(value, name)
    }

    assertValidDate(dateOfBirth, 'dateOfBirth')
    assertNumberIsFinite(heightInCm, 'heightInCm')
    assertInstanceOf(nationality, Nation, 'nationality')

    if (!Object.values(Sex).includes(sex)) {
      throw new RangeError('sex must be Sex.MALE ("M") or Sex.FEMALE ("F")')
    }

    this.#firstName = firstName
    this.#surname = surname
    this.#heightInCm = heightInCm
    this.#nationality = nationality
    this.#dateOfBirth = new Date(dateOfBirth)
    this.#birthplace = birthplace
    this.#sex = sex
    this.#apperance = apperance
  }

  /**
   * Returns the first name.
   *
   * @returns {string} The first name.
   */
  get firstName() {
    return this.#firstName
  }

  /**
   * Returns the surname.
   *
   * @returns {string} The surname.
   */
  get surname() {
    return this.#surname
  }

  /**
   * Returns the height.
   *
   * @returns {number} The height in centimetres.
   */
  get heightInCm() {
    return this.#heightInCm
  }

  /**
   * Returns the nation the person is a citizen of.
   *
   * @returns {Nation} The nationality.
   */
  get nationality() {
    return this.#nationality
  }

  /**
   * Returns the date of birth.
   *
   * @returns {Date} A copy of the date of birth, so callers can't change it.
   */
  get dateOfBirth() {
    return new Date(this.#dateOfBirth)
  }

  /**
   * Returns the city of birth.
   *
   * @returns {string} The city of birth.
   */
  get birthplace() {
    return this.#birthplace
  }

  /**
   * Returns the sex.
   *
   * @returns {'M' | 'F'} "M" for male or "F" for female.
   */
  get sex() {
    return this.#sex
  }

  /**
   * Returns the id of the portrait the person looks like.
   *
   * @returns {string} The appearance id, for example "M1".
   */
  get apperance() {
    return this.#apperance
  }
}
