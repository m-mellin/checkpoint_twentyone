import { assertNonEmptyString } from "./validation"

const COUNTRY_CODE_PATTERN = /^[A-Z]{3}$/

export class Nation {
  #name
  #countryCode

  /**
   * @type {readonly string[]}
   */
  #issuingCities

  /**
   * @type {readonly string[]}
   */
  #maleFirstnames

  /**
   * @type {readonly string[]}
   */
  #femaleFirstnames

  /**
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
   * @throws {TypeError} If the name is not a string.
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
    this.#maleFirstnames = Object.freeze([...maleFirstNames])
    this.#femaleFirstnames = Object.freeze([...femaleFirstNames])
    this.#surnames = Object.freeze([...surnames])
  }

  get name () {
    return this.#name
  }

  get countryCode () {
    return this.#countryCode
  }

  get issuingCities () {
    return this.#issuingCities
  }

  get maleFirstNames () {
    return this.#maleFirstnames
  }

  get femaleFirstNames () {
    return this.#femaleFirstnames;
  }

  get surnames () {
    return this.#surnames
  }
}