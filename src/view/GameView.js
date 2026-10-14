import { SpriteRenderer } from "2d-sprite-renderer"
import { Traveller } from "../model/Traveller"
import { TravellerView } from "./TravellerView"
import { DeskView } from "./DeskView"
import { Passport } from "../model/Passport"
import { PassportView } from "./PassportView"

export class GameView {
  #travellerView
  #deskView
  #passportView
  /**
   * @type {Passport | null}
   */
  #waitingPassport = null

  /**
   * 
   * @param {SpriteRenderer} renderer 
   */
  constructor(renderer) {
    this.#travellerView = new TravellerView(renderer)
    this.#deskView = new DeskView(renderer)
    this.#passportView = new PassportView(renderer)
  }

  /**
   * 
   * @param {Traveller} traveller 
   */
  showTraveller(traveller) {
    this.#passportView.hide()
    this.#travellerView.show(traveller)
    this.#waitingPassport = traveller.passport
  }

  travellerLeaves() {
    this.#passportView.hide()
    this.#waitingPassport = null
    this.#travellerView.leave()
  }

  update(deltaTime) {
    this.#travellerView.update(deltaTime)

    if (this.#waitingPassport !== null && this.#travellerView.isAtWindow) {
      this.#passportView.show(this.#waitingPassport)
      this.#waitingPassport = null
    }
  }


}