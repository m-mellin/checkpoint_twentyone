import { Random } from './Random.js'
import { Person, Sex } from './Person.js'
import { Nation } from './Nation.js'
import { addDays, addYears, daysBetween } from './dates.js'
import { Passport } from './Passport.js'
import { Traveller } from './Traveller.js'
import { Discrepancy } from './Discrepancy.js'

const MIN_AGE = 10
const MAX_AGE = 80
const MIN_HEIGHT_IN_CM = 150
const MAX_HEIGHT_IN_CM = 210
const VALIDITY_IN_YEARS = 10

/**
 * Creates random travellers, each carrying a passport. Some passports are forged with one discrepancy.
 */
export class TravellerGenerator {
  /**
   * Today's date in the game
   *
   * @type {Date}
   */
  #gameDate

  /**
   * The source of randomness.
   *
   * @type {Random}
   */
  #random

  /**
   * The appearance ids available for each sex.
   *
   * @type {Record<'M' | 'F', readonly string[]>}
   */
  #apperances

  /**
   * The share of passports that are forged, from 0 to 1.
   *
   * @type {number}
   */
  #forgeryProbability

  /**
   * Creates a generator.
   *
   * @param {Date} gameDate - Today's date in the game, at midnight UTC.
   * @param {Record<'M' | 'F', readonly string[]>} apperances - The appearance ids available for each sex.
   * @param {number} [forgeryProbability=0.4] - The share of passports that are forged, from 0 to 1.
   * @param {Random} [random=new Random()] - The source of randomness.
   */
  constructor(
    gameDate,
    apperances,
    forgeryProbability = 0.4,
    random = new Random()
  ) {
    this.#gameDate = new Date(gameDate)
    this.#apperances = apperances
    this.#forgeryProbability = forgeryProbability
    this.#random = random
  }

  /**
   * Creates travellers from random nations. Some carry a passport with one discrepancy.
   *
   * @param {number} amount - How many travellers to create.
   * @param {Nation[]} nations - The nations they can come from.
   * @param {Discrepancy[]} discrepancies - The discrepancies a forged passport may have.
   * @returns {Traveller[]} The travellers.
   */
  createTravellers(amount, nations, discrepancies) {
    const travellers = []

    for (const person of this.#createPeople(amount, nations)) {
      const passportData = this.#createPassportData(person)
      let discrepancy = null

      if (this.#shouldForge(discrepancies)) {
        discrepancy = this.#random.pick(discrepancies)
        this.#createForgery(passportData, discrepancy.code, nations)
      }

      travellers.push(
        new Traveller(person, new Passport(passportData), discrepancy)
      )
    }

    return travellers
  }

  /**
   * Creates people from random nations.
   *
   * @param {number} count - How many people to create.
   * @param {Nation[]} nations - The nations they can come from.
   * @returns {Person[]} The people.
   */
  #createPeople(count, nations) {
    const people = []

    for (let i = 1; i <= count; i++) {
      people.push(this.#createPerson(this.#random.pick(nations)))
    }

    return people
  }

  /**
   * Creates a random person from a nation.
   *
   * @param {Nation} nation - The nation the person is a citizen of.
   * @returns {Person} The person.
   */
  #createPerson(nation) {
    const sex = this.#random.pick(Object.values(Sex))

    return new Person({
      firstName: this.#random.pick(this.#firstNamesFor(nation, sex)),
      surname: this.#random.pick(nation.surnames),
      heightInCm: this.#random.integer(MIN_HEIGHT_IN_CM, MAX_HEIGHT_IN_CM),
      nationality: nation,
      dateOfBirth: this.#randomDateOfBirth(),
      birthplace: this.#random.pick(nation.issuingCities),
      sex,
      apperance: this.#random.pick(this.#apperances[sex])
    })
  }

  /**
   * Returns a random date of birth for someone between MIN_AGE and MAX_AGE years old.
   *
   * @returns {Date} The date of birth, at midnight UTC.
   */
  #randomDateOfBirth() {
    const youngest = addYears(this.#gameDate, -MIN_AGE)
    const oldest = addYears(this.#gameDate, -MAX_AGE)

    return addDays(
      oldest,
      this.#random.integer(0, daysBetween(oldest, youngest))
    )
  }

  /**
   * Creates the data for a genuine passport that matches the
   * person and is valid on the current game date.
   *
   * @param {Person} person - The passport holder.
   * @returns {import('./Passport.js').PassportData} The data for new Passport().
   */
  #createPassportData(person) {
    const issueDate = this.#randomIssueDate(person.dateOfBirth)

    return {
      firstName: person.firstName,
      surname: person.surname,
      heightInCm: person.heightInCm,
      nationality: person.nationality,
      dateOfBirth: person.dateOfBirth,
      sex: person.sex,
      birthplace: person.birthplace,
      issuingCity: this.#random.pick(person.nationality.issuingCities),
      issueDate,
      expiryDate: addYears(issueDate, VALIDITY_IN_YEARS),
      identificationString: `P<${person.nationality.countryCode}<${person.surname.toUpperCase()}<<${person.firstName.toUpperCase()}<<`,
      photo: person.apperance
    }
  }

  /**
   * Returns an issue date no earlier than birth and recent enough
   * that the passport is still valid.
   *
   * @param {Date} dateOfBirth - The holder's date of birth.
   * @returns {Date} The issue date.
   */
  #randomIssueDate(dateOfBirth) {
    const earliestStillValid = addDays(
      addYears(this.#gameDate, -VALIDITY_IN_YEARS),
      1
    )
    const earliest = this.#later(dateOfBirth, earliestStillValid)

    return addDays(
      earliest,
      this.#random.integer(0, daysBetween(earliest, this.#gameDate))
    )
  }

  /**
   * Decides whether the next passport is forged.
   *
   * @param {Discrepancy[]} discrepancies - The discrepancies available.
   * @returns {boolean} True if the passport should be forged.
   */
  #shouldForge(discrepancies) {
    return (
      discrepancies.length > 0 && this.#random.chance(this.#forgeryProbability)
    )
  }

  /**
   * Changes genuine passport data so that it has the given discrepancy.
   *
   * @param {import('./Passport.js').PassportData} data - The passport data to change.
   * @param {string} code - The discrepancy code, for example "INCORRECT_SEX".
   * @param {Nation[]} nations - All nations in play, used to borrow foreign names and cities.
   */
  #createForgery(data, code, nations) {
    const otherNations = nations.filter((nation) => nation !== data.nationality)
    const randomNation = this.#random.pick(otherNations)

    switch (code) {
      case 'FIRSTNAME_MISSPELLED':
        data.firstName = this.#misspell(data.firstName)
        break
      case 'SURNAME_MISSPELLED':
        data.surname = this.#misspell(data.surname)
        break
      case 'FIRSTNAME_MISMATCHES_SEX':
        data.firstName = this.#random.pick(
          this.#firstNamesFor(data.nationality, this.#oppositeSex(data.sex))
        )
        break
      case 'SUSPICIOUS_FIRSTNAME':
        data.firstName = this.#random.pick(
          this.#foreignValues(data.nationality, otherNations, (nation) =>
            this.#firstNamesFor(nation, data.sex)
          )
        )
        break
      case 'SUSPICIOUS_SURNAME':
        data.surname = this.#random.pick(
          this.#foreignValues(
            data.nationality,
            otherNations,
            (nation) => nation.surnames
          )
        )
        break
      case 'INCORRECT_SEX':
        data.sex = this.#oppositeSex(data.sex)
        break
      case 'INCORRECT_ISSUING_CITY':
        data.issuingCity = this.#random.pick(randomNation.issuingCities)
        break
      case 'INCORRECT_BIRTHPLACE':
        data.birthplace = this.#random.pick(randomNation.issuingCities)
        break
      case 'INCORRECT_ISSUE_DATE':
        data.issueDate = addDays(
          data.dateOfBirth,
          -this.#random.integer(20, 255)
        )
        break
      case 'INCORRECT_EXPIRY_DATE':
        data.expiryDate = addDays(this.#gameDate, -this.#random.integer(1, 55))
        data.issueDate = this.#later(
          data.dateOfBirth,
          addYears(data.expiryDate, -VALIDITY_IN_YEARS)
        )
        break
      case 'INCORRECT_HEIGHT':
        data.heightInCm += this.#random.integer(5, 25)
        break
      case 'INCORRECT_CODE':
        data.identificationString = data.identificationString.replace(
          data.nationality.countryCode,
          randomNation.countryCode
        )
        break
      default:
        throw new RangeError(`Unknown discrepancy code: ${code}`)
    }
  }

  /**
   * Returns values that other nations use but the given nation
   * does not, for example foreign surnames.
   *
   * @param {Nation} nation - The nation the values must not belong to.
   * @param {Nation[]} otherNations - The nations to take the values from.
   * @param {(nation: Nation) => readonly string[]} valuesOf - Which list to look in.
   * @returns {string[]} The foreign values.
   */
  #foreignValues(nation, otherNations, valuesOf) {
    const own = valuesOf(nation)

    return otherNations
      .flatMap(valuesOf)
      .filter((value) => !own.includes(value))
  }

  /**
   * Returns the first names a nation uses for one sex.
   *
   * @param {Nation} nation - The nation to take the names from.
   * @param {'M' | 'F'} sex - Sex.MALE or Sex.FEMALE.
   * @returns {readonly string[]} The first names for that sex.
   */
  #firstNamesFor(nation, sex) {
    return sex === Sex.MALE ? nation.maleFirstNames : nation.femaleFirstNames
  }

  /**
   * Returns the other sex.
   *
   * @param {'M' | 'F'} sex - Sex.MALE or Sex.FEMALE.
   * @returns {'M' | 'F'} Sex.FEMALE for Sex.MALE, and the other way around.
   */
  #oppositeSex(sex) {
    return sex === Sex.MALE ? Sex.FEMALE : Sex.MALE
  }

  /**
   * Returns the name with one letter removed, never the first one.
   *
   * @param {string} name - The name to misspell, at least two letters long.
   * @returns {string} The misspelled name, for example "Eik" for "Erik".
   */
  #misspell(name) {
    const index = this.#random.integer(1, name.length - 1)

    return name.slice(0, index) + name.slice(index + 1)
  }

  /**
   * Returns the later of two dates.
   *
   * @param {Date} first - One date.
   * @param {Date} second - The other date.
   * @returns {Date} The date that comes last.
   */
  #later(first, second) {
    return first.getTime() > second.getTime() ? first : second
  }
}
