import { SpriteRenderer } from "2d-sprite-renderer"
import { Traveller } from "../model/Traveller"
import { TravellerView } from "./TravellerView"
import { DeskView } from "./DeskView"
import { Passport } from "../model/Passport"
import { PassportView } from "./PassportView"
import { StampView } from "./StampView"

export class GameView {
  #travellerView
  #deskView
  #passportView
  #approveStamp
  #denyStamp
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
    this.#approveStamp = new StampView(renderer, {src: 'assets/approve_stamp.png', x: 1400, y: 500, approves: true})
    this.#denyStamp = new StampView(renderer, {src: 'assets/deny_stamp.png', x: 1500, y: 500, approves: false})
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

  /**
   * @returns {StampView[]}
   */
  get stamps() {
    return [this.#approveStamp, this.#denyStamp]
  }

  get passport() {
    return this.#passportView
  }
}