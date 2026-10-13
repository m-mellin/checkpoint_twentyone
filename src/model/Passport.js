import { Nation } from "./Nation";
import { Sex } from "./Person";
import { assertInstanceOf, assertNonEmptyString, assertNumberIsFinite, assertValidDate } from "./validation";

/**
 * A passport with data stored on it. 
 * 
 * The passport can match the person it is issued to, or not.
 */
export class Passport {
  #firstName
  #surname
  #heightInCm
  #nationality
  #dateOfBirth
  #sex
  #birthplace
  #issuingCity
  #issueDate
  #expiryDate
  #identificationString
  #photo

  /**
   * Creates a passport.
   *
   * @param {object} data - The data printed in the passport.
   * @param {string} data.firstName - The first name.
   * @param {string} data.surname - The surname.
   * @param {number} data.heightInCm - The height of the traveller
   * @param {Nation} data.nationality - The issuing nation.
   * @param {Date} data.dateOfBirth - The date of birth.
   * @param {'M' | 'F'} data.sex - The sex.
   * @param {string} data.birthplace - The city of birth.
   * @param {string} data.issuingCity - The city that issued the passport.
   * @param {Date} data.issueDate - The date it was issued.
   * @param {Date} data.expiryDate - The last day it is valid.
   * @param {string} data.identificationString - The passport identification string.
   * @param {string} data.photo - The appearance shown in the photo, for example "M1".
   * @throws {TypeError} If a value has the wrong type.
   * @throws {RangeError} If the sex is unknown or the passport expires before it is issued.
   */
  constructor({
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
    photo,
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

    if (expiryDate <= issueDate) {
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
   * @returns {string} first name
   */
  get firstName () {
    return this.#firstName
  }

  /**
   * Returns the surname stated on the passport.
   * 
   * @returns {string} surname
   */
  get surname () {
    return this.#surname
  }

  /**
   * Returns the height stated on the passport.
   * 
   * @returns {number} the height in cm
   */
  get heightInCm () {
    return this.#heightInCm
  }

  /**
   * Returns the nationality stated on the passport.
   * 
   * @returns {Nation} nationality
   */
  get nationality () {
    return this.#nationality
  }

  /**
   * Returns the date of birth stated on the passport.
   * 
   * @returns {Date} the date of birth
   */
  get dateOfBirth () {
    return new Date(this.#dateOfBirth)
  }

  /**
   * Returns the sex stated on the passport.
   * 
   * @returns {'M' | 'F'} "M" for Male and "F" for Female
   */
  get sex () {
    return this.#sex
  }

  /**
   * Returns the birthplace stated on the passport.
   * 
   * @returns {string} the birthplace
   */
  get birthplace () {
    return this.#birthplace
  }

  /**
   * Returns the city that issued the passport.
   * 
   * @returns {string} issuing city
   */
  get issuingCity () {
    return this.#issuingCity
  }

  /**
   * Returns the date of issue stated on the passport.
   * 
   * @returns {Date} the date of issue
   */
  get issueDate () {
    return new Date(this.#issueDate)
  }

  /**
   * Returns the expiry date of the passport.
   * 
   * @returns {Date} the expiry date
   */
  get expiryDate () {
    return new Date(this.#expiryDate)
  }

  /**
   * Returns the passport identification string.
   * 
   * @returns {string} the idenficiation string
   */
  get identificationString () {
    return this.#identificationString
  }

  /**
   * Returns the passport photo id
   * 
   * @returns {string} the photo id
   */
  get photo () {
    return this.#photo
  }
}
