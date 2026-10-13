import { Random } from "./Random.js"
import { Person, Sex } from "./Person.js"
import { Nation } from "./Nation.js"
import { addDays, addYears, daysBetween } from './dates.js'
import { Passport } from "./Passport.js"
import { Traveller } from "./Traveller.js"

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

  /**
   * 
   * @param {Date} gameDate 
   * @param {Record<'M' | 'F', readonly string[]>} apperances
   * @param {Random} random 
   */
  constructor (gameDate, apperances, random = new Random()) {
    this.#gameDate = new Date(gameDate)
    this.#apperances = apperances
    this.#random = random
  }

  /**
   * 
   * @param {number} amount 
   * @param {Nation[]} nations 
   */
  createTravellers (amount, nations) {
    const people = this.#createPeople(amount, nations)
    const travellers = []

    for (const person of people) {
      const traveller = new Traveller(person, this.#createPassport(person))
      travellers.push(traveller)
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
   * @param {Person} person 
   */
  #createPassport (person) {
    const issueDate = this.#randomIssueDate(person.dateOfBirth)
    
    return new Passport({
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
      number: `${person.nationality.countryCode}_${person.firstName.toUpperCase()}_${person.surname.toUpperCase()}`,
      photo: person.apperance
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
}