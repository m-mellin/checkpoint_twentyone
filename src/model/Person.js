import { Nation } from "./Nation"
import { assertInstanceOf, assertNonEmptyString, assertNumberIsFinite, assertValidDate } from "./validation"

export const Sex = Object.freeze({ MALE: 'M', FEMALE: 'F' })

export class Person {
  #firstName
  #surname
  #heightInCm
  #nationality
  #dateOfBirth
  #birthplace
  #sex
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
   * @param {string} options.apperance - The apperance of the Person.
   * @throws {TypeError} If a value has the wrong type.
   * @throws {RangeError} If the height or sex is out of range.
   */
  constructor ({ firstName, surname, heightInCm, nationality, dateOfBirth, birthplace, sex, apperance }) {
    assertNonEmptyString(firstName, 'firstName')
    assertNonEmptyString(surname, 'surname')
    assertNonEmptyString(birthplace, 'birthplace')
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

  get apperance () {
    return this.#apperance
  }
}