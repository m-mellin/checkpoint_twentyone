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
  #number
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
   * @param {string} data.number - The passport number.
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
    number,
    photo,
  }) {
    for (const [name, value] of Object.entries({ firstName, surname, birthplace, issuingCity, number, photo })) {
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
    this.#nationality = nationality
    this.#dateOfBirth = new Date(dateOfBirth)
    this.#sex = sex
    this.#birthplace = birthplace
    this.#issuingCity = issuingCity
    this.#issueDate = new Date(issueDate)
    this.#expiryDate = new Date(expiryDate)
    this.#number = number
    this.#photo = photo
  }

  get firstName () {
    return this.#firstName
  }

  get surname () {
    return this.#surname
  }

  get heightInCm () {
    return this.#heightInCm
  }

  get nationality () {
    return this.#nationality
  }

  get dateOfBirth () {
    return new Date(this.#dateOfBirth)
  }

  get sex () {
    return this.#sex
  }

  get birthplace () {
    return this.#birthplace
  }

  get issuingCity () {
    return this.#issuingCity
  }

  get issueDate () {
    return new Date(this.#issueDate)
  }

  get expiryDate () {
    return new Date(this.#expiryDate)
  }

  get number () {
    return this.#number
  }

  get photo () {
    return this.#photo
  }
}
