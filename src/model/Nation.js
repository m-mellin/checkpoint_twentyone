import { assertNonEmptyString } from './validation'

const COUNTRY_CODE_PATTERN = /^[A-Z]{3}$/

/**
 * A nation that travellers can come from, with the cities that issue its passports
 * and the names that are common among its citizens.
 */
export class Nation {
  /**
   * Name of the nation.
   * 
   * @type {string}
   */
  #name

  /**
   * The ISO 3166-1 alpha-3 country code, for example "SWE".
   *
   * @type {string}
   */
  #countryCode

  /**
   * Cities in the nation that can issue passports.
   * 
   * @type {readonly string[]}
   */
  #issuingCities

  /**
   * Common male first names in the nation.
   * 
   * @type {readonly string[]}
   */
  #maleFirstNames

  /**
   * Common female first names in the nation.
   * 
   * @type {readonly string[]}
   */
  #femaleFirstNames

  /**
   * Common surnames in the nation.
   * 
   * @type {readonly string[]}
   */
  #surnames

  /**
   * Creates a nation.
   *
   * @param {object} options - The nation's data.
   * @param {string} options.name - The name, for example "Sweden".
   * @param {string} options.countryCode - The ISO 3166-1 alpha-3 code, for example "SWE".
   * @param {string[]} [options.issuingCities=[]] - Cities that issue passports.
   * @param {string[]} [options.maleFirstNames=[]] - First names for male citizens.
   * @param {string[]} [options.femaleFirstNames=[]] - First names for female citizens.
   * @param {string[]} [options.surnames=[]] - Surnames for all citizens.
   * @throws {TypeError} If the name is not a non-empty string.
   * @throws {RangeError} If the country code is not three capital letters.
   */
  constructor ({ name, countryCode, issuingCities = [], maleFirstNames = [], femaleFirstNames = [], surnames = [] }) {
    assertNonEmptyString(name, 'name')

    if (!COUNTRY_CODE_PATTERN.test(countryCode)) {
      throw new RangeError('countryCode must have three capital letters, for example "SWE"')
    }

    this.#name = name
    this.#countryCode = countryCode
    this.#issuingCities = Object.freeze([...issuingCities])
    this.#maleFirstNames = Object.freeze([...maleFirstNames])
    this.#femaleFirstNames = Object.freeze([...femaleFirstNames])
    this.#surnames = Object.freeze([...surnames])
  }

  /**
   * Returns the name of the nation.
   * 
   * @returns {string} The name.
   */
  get name () {
    return this.#name
  }

  /**
   * Returns the country code of the nation.
   * 
   * @returns {string} The country code.
   */
  get countryCode () {
    return this.#countryCode
  }

  /**
   * Returns the cities that can issue passports in the nation.
   * 
   * @returns {readonly string[]} The issuing cities.
   */
  get issuingCities () {
    return this.#issuingCities
  }

  /**
   * Returns the male first names, common in the nation.
   * 
   * @returns {readonly string[]} Male first names.
   */
  get maleFirstNames () {
    return this.#maleFirstNames
  }

  /**
   * Returns the female first names, common in the nation.
   * 
   * @returns {readonly string[]} Female first names.
   */
  get femaleFirstNames () {
    return this.#femaleFirstNames
  }

  /**
   * Returns the surnames, common in the nation.
   * 
   * @returns {readonly string[]} Surnames.
   */
  get surnames () {
    return this.#surnames
  }
}