import { Sprite } from "2d-sprite-renderer";
import travellerData from "../data/traveller.json";
import nationData from "../data/nations.json";

import { Person } from "../model/Person";
import { Repository } from "../repository/Repository";
import { Nation } from "../model/Nation";

const DAY_IN_MS = 24 * 60 * 60 * 1000
const MIN_AGE = 10
const MAX_AGE = 80

export class TravellerController {
  #travellers;

  constructor() {
    this.#travellers = new Repository(Person);
  }

  /**
   *
   * @param {*} amount
   * @param {Array<Nation>} nations
   */
  createTraveller(amount, nations) {
    for (const nation of nations) {
      for (let i = 1; i <= amount; i++) {
        const sex = this.#setRandomSex()
        const nationality = nation;
        const firstName = this.#setRandomProperty(nation.maleFirstnames);
        const surname = this.#setRandomProperty(nation.surnames);
        const heightInCm = 189;
        const birthplace = this.#setRandomProperty(nation.issuingCities);
        const dateOfBirth = new Date(Date.UTC(2020, 1, 15));

        const person = new Person({
          firstName: this.#setRandomProperty(sex === "M" ? nation.maleFirstnames : nation.femaleFirstnames),
          surname: this.#setRandomProperty(nation.surnames),
          heightInCm: this.#random(150-210),
          nationality: nation,
          dateOfBirth: new Date(Date.UTC(2020, 1, 15)),
          birthplace: this.#setRandomProperty(nation.issuingCities),
          sex,
        });

        this.#travellers.add(person);

        this.#setRandomDate()
      }
    }
  }

  #setRandomSex() {
    return this.#random(2) === 1 ? "M" : "F"
  }

  #setRandomProperty(list) {
    return list[this.#random(list.length - 1)];
  }

  #setRandomDate() {
    const youngest = yearsBefore(gameDate, MIN_AGE)
    const oldest = yearsBefore(gameDate, MAX_AGE)
    const daysBetween = Math.round((youngest.getTime() - oldest.getTime()) / DAY_IN_MS)

    return new Date(oldest.getTime() + this.#random.integer(0, daysBetween) * DAY_IN_MS)
  }

  #yearsBefore (date, years) {
    const earlier = new Date(date)
    earlier.setUTCFullYear(earlier.getUTCFullYear() - years)

    return earlier
  }

  #random(maxAmount, minAmount = 0) {
    return Math.floor(Math.random() * (maxAmount - minAmount + 1));
  }

  get travellers() {
    return this.#travellers;
  }
}
