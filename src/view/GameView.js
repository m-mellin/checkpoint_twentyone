import { SpriteRenderer } from "2d-sprite-renderer"
import { Traveller } from "../model/Traveller"
import { TravellerView } from "./TravellerView"
import { DeskView } from "./DeskView"
import { Passport } from "../model/Passport"
import { PassportView } from "./PassportView"
import { StampView } from "./StampView"

/**
 * The whole game screen. Creates every view in the order they are drawn,
 * and is the only view the rest of the game talks to.
 */
export class GameView {
  /**
   * The booth with the traveller walking up to the window.
   *
   * @type {TravellerView}
   */
  #travellerView

  /**
   * The passport on the desk.
   *
   * @type {PassportView}
   */
  #passportView

  /**
   * The stamp that approves the passport.
   *
   * @type {StampView}
   */
  #approveStamp

  /**
   * The stamp that denies the passport.
   *
   * @type {StampView}
   */
  #denyStamp

  /**
   * The passport to show when the traveller reaches the window, or null if there is none.
   *
   * @type {Passport | null}
   */
  #waitingPassport = null

  /**
   * Creates every view. The order is the drawing order: later views are drawn on top,
   * so the passport lies on the desk and the stamps on top of both.
   *
   * @param {SpriteRenderer} renderer - The renderer to draw with.
   */
  constructor(renderer) {
    this.#travellerView = new TravellerView(renderer)
    new DeskView(renderer)
    this.#passportView = new PassportView(renderer)
    this.#approveStamp = new StampView(renderer, {src: 'assets/approve_stamp.png', x: 1400, y: 500, approves: true})
    this.#denyStamp = new StampView(renderer, {src: 'assets/deny_stamp.png', x: 1500, y: 500, approves: false})
  }

  /**
   * Sets the current game date to the passport view. It is shown on the stamp.
   * 
   * @param {Date} date - The current game date.
   */
  set gameDate(date) {
    this.#passportView.gameDate = date
  } 

  /**
   * Lets a traveller walk up to the window. Their passport is shown on the desk when they arrive.
   * Takes the previous traveller's passport off the desk first.
   *
   * @param {Traveller} traveller - The traveller to show.
   */
  showTraveller(traveller) {
    this.#passportView.hide()
    this.#travellerView.show(traveller)
    this.#waitingPassport = traveller.passport
  }

  /**
   * Lets the current traveller leave without anyone new coming in, and takes their passport off the desk.
   */
  travellerLeaves() {
    this.#passportView.hide()
    this.#waitingPassport = null
    this.#travellerView.leave()
  }

  /**
   * Moves the animations forward, and shows the waiting passport once the traveller has reached the window.
   *
   * @param {number} deltaTime - Milliseconds since the last frame.
   */
  update(deltaTime) {
    this.#travellerView.update(deltaTime)
    this.#passportView.update(deltaTime)

    if (this.#waitingPassport !== null && this.#travellerView.isAtWindow) {
      this.#passportView.show(this.#waitingPassport)
      this.#waitingPassport = null
    }
  }

  /**
   * Returns the stamps on the desk, for example to let the player drag them.
   *
   * @returns {StampView[]} The approve stamp and the deny stamp.
   */
  get stamps() {
    return [this.#approveStamp, this.#denyStamp]
  }

  /**
   * Returns the passport view, for example to let the player drag it.
   *
   * @returns {PassportView} The passport view.
   */
  get passport() {
    return this.#passportView
  }

  /**
   * Called when a stamped passport is handed back to the traveller, with true if it was approved.
   *
   * @type {(approved: boolean) => void}
   */
  #onPassportReturned = () => {}

  /**
   * Sets what happens when a stamped passport is handed back to the traveller.
   *
   * @param {(approved: boolean) => void} callback - Called with true if the passport was approved.
   */
  set onPassportReturned(callback) {
    this.#onPassportReturned = callback
  }

  /**
   * Handles something the player released: a passport dropped in the booth is handed back or falls
   * onto the counter, and a stamp dropped on the open passport stamps it where it was released.
   *
   * @param {import('../controller/DragController.js').Draggable} dropped - The thing the player released.
   */
  dropped(dropped) {
    if (dropped === this.#passportView) {
      this.#passportDropped()
      return
    }

    const stamp = this.stamps.find((s) => s === dropped)

    if (!stamp) return

    const centerX = stamp.x + stamp.width / 2
    const centerY = stamp.y + stamp.height / 2

    this.#passportView.stampAt(centerX, centerY, stamp.approves)
  }

  /**
   * Hands a stamped passport back if the traveller is at the window, and otherwise lets it fall
   * onto the counter. Does nothing if the passport was released on the inspection desk.
   */
  #passportDropped() {
    if (!this.#passportView.isInBooth) return

    if (this.#passportView.isStamped && this.#travellerView.isAtWindow) {
      const approved = this.#passportView.isApproved

      this.#passportView.hide()
      this.#onPassportReturned(approved)
      return
    }

    this.#passportView.fall()
  }
}