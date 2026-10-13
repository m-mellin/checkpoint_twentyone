import { Nation } from './Nation.js'
import { Sex } from './Person.js'
import { assertInstanceOf, assertNonEmptyString, assertNumberIsFinite, assertValidDate } from './validation.js'

/**
 * The data printed in a passport. It may or may not match the person carrying it.
 */
export class Passport {
  /**
   * The first name of the bearer, stated on the passport.
   *
   * @type {string}
   */
  #firstName

  /**
   * The surname of the bearer, stated on the passport.
   *
   * @type {string}
   */
  #surname

  /**
   * The height of the bearer in centimetres, stated on the passport.
   *
   * @type {number}
   */
  #heightInCm

  /**
   * The nation that issued the passport.
   *
   * @type {Nation}
   */
  #nationality

  /**
   * The date of birth of the bearer, stated on the passport.
   *
   * @type {Date}
   */
  #dateOfBirth

  /**
   * The sex of the bearer, stated on the passport.
   *
   * @type {'M' | 'F'}
   */
  #sex

  /**
   * The birthplace of the bearer, stated on the passport.
   *
   * @type {string}
   */
  #birthplace

  /**
   * The city that issued the passport.
   *
   * @type {string}
   */
  #issuingCity

  /**
   * The date the passport was issued.
   *
   * @type {Date}
   */
  #issueDate

  /**
   * The last day the passport is valid.
   *
   * @type {Date}
   */
  #expiryDate

  /**
   * The identification string, stated on the passport.
   *
   * @type {string}
   */
  #identificationString

  /**
   * The appearance shown in the photo, for example "M1".
   *
   * @type {string}
   */
  #photo

  /**
   * Creates a passport.
   *
   * @param {object} data - The data printed in the passport.
   * @param {string} data.firstName - The first name.
   * @param {string} data.surname - The surname.
   * @param {number} data.heightInCm - The height in centimetres.
   * @param {Nation} data.nationality - The issuing nation.
   * @param {Date} data.dateOfBirth - The date of birth.
   * @param {'M' | 'F'} data.sex - Sex.MALE or Sex.FEMALE.
   * @param {string} data.birthplace - The city of birth.
   * @param {string} data.issuingCity - The city that issued the passport.
   * @param {Date} data.issueDate - The date it was issued.
   * @param {Date} data.expiryDate - The last day it is valid.
   * @param {string} data.identificationString - The passport identification string.
   * @param {string} data.photo - The appearance shown in the photo, for example "M1".
   * @throws {TypeError} If a value has the wrong type.
   * @throws {RangeError} If the sex is unknown or the passport expires before it is issued.
   */
  constructor ({
    firstName,
    surname,
    heightInCm,
    nationality,
    dateOfBirth,
    sex,
    birthplace,
    issuingCity,
    issueDate,
    expiryDate,
    identificationString,
    photo
  }) {
    for (const [name, value] of Object.entries({ firstName, surname, birthplace, issuingCity, identificationString, photo })) {
      assertNonEmptyString(value, name)
    }

    for (const [name, value] of Object.entries({ dateOfBirth, issueDate, expiryDate })) {
      assertValidDate(value, name)
    }

    assertNumberIsFinite(heightInCm, 'heightInCm')
    assertInstanceOf(nationality, Nation, 'nationality')

    if (!Object.values(Sex).includes(sex)) {
      throw new RangeError('sex must be Sex.MALE ("M") or Sex.FEMALE ("F")')
    }

    if (expiryDate.getTime() <= issueDate.getTime()) {
      throw new RangeError('expiryDate must be after issueDate')
    }

    this.#firstName = firstName
    this.#surname = surname
    this.#heightInCm = heightInCm
    this.#nationality = nationality
    this.#dateOfBirth = new Date(dateOfBirth)
    this.#sex = sex
    this.#birthplace = birthplace
    this.#issuingCity = issuingCity
    this.#issueDate = new Date(issueDate)
    this.#expiryDate = new Date(expiryDate)
    this.#identificationString = identificationString
    this.#photo = photo
  }

  /**
   * Returns the first name stated on the passport.
   *
   * @returns {string} The first name.
   */
  get firstName () {
    return this.#firstName
  }

  /**
   * Returns the surname stated on the passport.
   *
   * @returns {string} The surname.
   */
  get surname () {
    return this.#surname
  }

  /**
   * Returns the height stated on the passport.
   *
   * @returns {number} The height in centimetres.
   */
  get heightInCm () {
    return this.#heightInCm
  }

  /**
   * Returns the nation that issued the passport.
   *
   * @returns {Nation} The issuing nation.
   */
  get nationality () {
    return this.#nationality
  }

  /**
   * Returns the date of birth stated on the passport.
   *
   * @returns {Date} A copy of the date of birth.
   */
  get dateOfBirth () {
    return new Date(this.#dateOfBirth)
  }

  /**
   * Returns the sex stated on the passport.
   *
   * @returns {'M' | 'F'} "M" for male or "F" for female.
   */
  get sex () {
    return this.#sex
  }

  /**
   * Returns the birthplace stated on the passport.
   *
   * @returns {string} The city of birth.
   */
  get birthplace () {
    return this.#birthplace
  }

  /**
   * Returns the city that issued the passport.
   *
   * @returns {string} The issuing city.
   */
  get issuingCity () {
    return this.#issuingCity
  }

  /**
   * Returns the date the passport was issued.
   *
   * @returns {Date} A copy of the issue date.
   */
  get issueDate () {
    return new Date(this.#issueDate)
  }

  /**
   * Returns the last day the passport is valid.
   *
   * @returns {Date} A copy of the expiry date.
   */
  get expiryDate () {
    return new Date(this.#expiryDate)
  }

  /**
   * Returns the identification string stated on the passport.
   *
   * @returns {string} The identification string.
   */
  get identificationString () {
    return this.#identificationString
  }

  /**
   * Returns the appearance shown in the photo.
   *
   * @returns {string} The appearance id, for example "M1".
   */
  get photo () {
    return this.#photo
  }
}
