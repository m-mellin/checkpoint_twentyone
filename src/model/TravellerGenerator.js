import { Random } from "./Random.js"
import { Person, Sex } from "./Person.js"
import { Nation } from "./Nation.js"
import { addDays, addYears, daysBetween } from './dates.js'
import { Passport } from "./Passport.js"
import { Traveller } from "./Traveller.js"
import { Discrepancy } from "./Discrepancy.js"

const DAY_IN_MS = 24 * 60 * 60 * 1000
const MIN_AGE = 10
const MAX_AGE = 80
const MIN_HEIGHT_IN_CM = 150
const MAX_HEIGHT_IN_CM = 210
const VALIDITY_IN_YEARS = 10

export class TravellerGenerator {
  #gameDate
  #random
  #apperances
  #forgeryProbability

  /**
   * 
   * @param {Date} gameDate 
   * @param {Record<'M' | 'F', readonly string[]>} apperances
   * @param {Random} random 
   */
  constructor (gameDate, apperances, forgeryProbability = 0.4, random = new Random()) {
    this.#gameDate = new Date(gameDate)
    this.#apperances = apperances
    this.#forgeryProbability = forgeryProbability
    this.#random = random
  }

  /**
   * 
   * @param {number} amount 
   * @param {Nation[]} nations 
   * @param {Discrepancy[]} discrepancies
   */
  createTravellers (amount, nations, discrepancies) {
    const travellers = []

    for (const person of this.#createPeople(amount, nations)) {
      const passportData = this.#createPassportData(person)
      let discrepancy = null

      if (this.#random.chance(this.#forgeryProbability)) {
        discrepancy = this.#random.pick(discrepancies)
        this.#createForgery(passportData, discrepancy.code, nations)
      }
      travellers.push(new Traveller(person, new Passport(passportData), discrepancy))
    }

    return travellers
  }

  /**
   * 
   * @param {number} count 
   * @param {Nation[]} nations 
   */
  #createPeople (count, nations) {
    const people = []

    for (let i = 1; i <= count; i++) {
      people.push(this.#createPerson(this.#random.pick(nations)))
    }

    return people
  }

  /**
   * 
   * @param {Nation} nation 
   * @returns {Person}
   */
  #createPerson (nation) {
    const sex = this.#random.pick(Object.values(Sex))
    const firstNames = sex === Sex.MALE ? nation.maleFirstNames : nation.femaleFirstNames

    return new Person({
      firstName: this.#random.pick(firstNames),
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
   *
   * @param {Date} dateOfBirth - The holder's date of birth.
   * @returns {Date} The issue date.
   */
  #randomIssueDate (dateOfBirth) {
    const earliestStillValid = addDays(addYears(this.#gameDate, -VALIDITY_IN_YEARS), 1)
    const earliest = dateOfBirth > earliestStillValid ? dateOfBirth : earliestStillValid

    return addDays(earliest, this.#random.integer(0, daysBetween(earliest, this.#gameDate)))
  }

  /**
   * 
   * @returns {Date}
   */
  #randomDateOfBirth () {
    const youngest = this.#yearsBefore(this.#gameDate, MIN_AGE)
    const oldest = this.#yearsBefore(this.#gameDate, MAX_AGE)
    const daysBetween = Math.round((youngest.getTime() - oldest.getTime()) / DAY_IN_MS)

    return new Date(oldest.getTime() + this.#random.integer(0, daysBetween) * DAY_IN_MS)
  }

  /**
   * 
   * @param {Date} date 
   * @param {number} years 
   * @returns {Date}
   */
  #yearsBefore (date, years) {
    const earlier = new Date(date)
    earlier.setUTCFullYear(earlier.getUTCFullYear() - years)

    return earlier
  }

  #createPassportData (person) {
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
      identificationString: `${person.nationality.countryCode}_${person.firstName.toUpperCase()}_${person.surname.toUpperCase()}`,
      photo: person.apperance
    }
  }

  /**
   * 
   * @param {*} data 
   * @param {string} code 
   * @param {Nation[]} nations 
   */
  #createForgery (data, code, nations) {
    const randomNation = this.#random.pick(nations.filter((nation) => nation !== data.nationality))

    switch (code) {
      case 'FIRSTNAME_MISSPELLED':
        data.firstName = this.#misspell(data.firstName)
        break
      case 'SURNAME_MISSPELLED': 
        data.surname = this.#misspell(data.surname)
        break
      case 'FIRSTNAME_MISMATCHES_SEX': {
        const oppositeSex = data.sex === Sex.MALE ? Sex.FEMALE : Sex.MALE
        data.firstName = this.#random.pick(this.#firstNameFor(data.nationality, oppositeSex))
        break
      }
      case 'SUSPICIOUS_FIRSTNAME':
        data.firstName = this.#random.pick(this.#firstNameFor(randomNation, data.sex))
        break
      case 'SUSPICIOUS_SURNAME':
        data.surname = this.#random.pick(randomNation.surnames)
        break
      case 'INCORRECT_SEX':
        data.sex = data.sex === Sex.MALE ? Sex.FEMALE : Sex.MALE
        break
      case 'INCORRECT_ISSUING_CITY':
        data.issuingCity = this.#random.pick(randomNation.issuingCities)
        break
      case 'INCORRECT_BIRTHPLACE':
        data.birthplace = this.#random.pick(randomNation.issuingCities)
        break
      case 'INCORRECT_ISSUE_DATE':
        data.issueDate = addDays(data.dateOfBirth, - this.#random.integer(20, 255))
        break
      case 'INCORRECT_EXPIRY_DATE':
        data.expiryDate = addDays(this.#gameDate, - this.#random.integer(1, 55))
        data.issueDate = addYears(data.expiryDate, -VALIDITY_IN_YEARS)
        break
      case 'INCORRECT_HEIGHT':
        data.heightInCm += this.#random.integer(5, 25)
        break
      case 'INCORRECT_CODE':
        data.countryCode = randomNation.countryCode
        break
    }
  }

  /**
   * 
   * @param {Nation} nation 
   * @param {'M' | 'F'} sex 
   * @returns {readonly string[]}
   */
  #firstNameFor (nation, sex) {
    return sex === Sex.MALE ? nation.maleFirstNames : nation.femaleFirstNames
  }

  /**
   * 
   * @param {string} name 
   * @returns {string}
   */
  #misspell (name) {
    const index = this.#random.integer(1, name.length - 1)
    return name.slice(0, index) + name.slice(index + 1)
  }
}