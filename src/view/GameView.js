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
   * Returns an array of StampViews.
   * 
   * @returns {StampView[]} - The array of StampViews.
   */
  get stamps() {
    return [this.#approveStamp, this.#denyStamp]
  }

  /**
   * Returns the PassportView.
   * 
   * @returns {PassportView} - The PassportView.
   */
  get passport() {
    return this.#passportView
  }

  /**
   * Stamps the passport if a stamp was dropped on it, centred where the stamp was released.
   * Does nothing if something other than a stamp was dropped.
   *
   * @param {import('../controller/DragController.js').Draggable} dropped - The thing the player released.
   */
  dropped(dropped) {
    const stamp = this.stamps.find((s) => s === dropped)

    if (!stamp) return

    const centerX = stamp.x + stamp.width / 2
    const centerY = stamp.y + stamp.height / 2

    this.#passportView.stampAt(centerX, centerY, stamp.approves)
  }
}