import { Sprite, SpriteRegion, SpriteRenderer } from "2d-sprite-renderer"
import portraitData from '../data/potraits.json'
import { Traveller } from "../model/Traveller"

const DESK_SRC = 'assets/desk_final_2.png'
const BG_SRC = 'assets/background_final_2.png'
const TRAVELLERS_SRC = 'assets/travellers.png'
const PORTRAIT_SCALE = 2
const TRAVELLER_Y = 260
const BOB_SPEED = 400
const BOB_HEIGHT = 3

/**
 * Where a new traveller starts. The value should be negative
 * so they start outside the screen on the left, in pixels.
 */
const START_X = -500

/**
 * Where the traveller stops in the window, in pixels.
 */
const WINDOW_X = 480

/**
 * Where the traveller walks to when leaving. The value should be
 * further than the screen width, in pixels.
 */
const EXIT_X = 1400

/**
 * How fast the traveller moves, in pixels per miliseconds.
 */
const WALK_SPEED = 0.4

/**
 *
 */
export class TravellerView {
  #background = new Sprite(BG_SRC, {x: 0, y: 0, width: 1367, height: 629})
  #desk = new Sprite(DESK_SRC, {x: 0, y: 520, width: 1367, height: 511 })
  #traveller = new Sprite(TRAVELLERS_SRC, {x: START_X, y: TRAVELLER_Y})
  #elapsed = 0

  /**
   * The current traveller walking in, or the traveller that is in the window.
   * 
   * @type {Traveller | null}
   */
  #current = null

  /**
   * The traveller who is waiting next. Null means there is no one waiting.
   * 
   * @type {Traveller | null}
   */
  #next = null

  /**
   * The x position the traveller moves to. Used in #walk method.
   * 
   * @type {number}
   */
  #targetX = START_X

  /**
   * 
   * @param {SpriteRenderer} renderer 
   */
  constructor(renderer) {
    renderer.add(this.#background)
    renderer.add(this.#traveller)
    renderer.add(this.#desk)
  }

  /**
   * 
   * @param {Traveller} traveller 
   */
  #walkIn(traveller) {
    // Find the portrait that matches the person's appearance id
    const portrait = portraitData.find((p) => p.id === traveller.person.apperance)

    this.#current = traveller

    // Show only this person's part of the sprite sheet
    this.#traveller.region = new SpriteRegion(portrait?.region)

    // Size the sprite after the portrait, since the portraits have different widths
    this.#traveller.width = portrait?.region.width * PORTRAIT_SCALE
    this.#traveller.height = portrait?.region.height * PORTRAIT_SCALE

    // Start outside the screen and walk towards the window
    this.#traveller.x = START_X
    this.#targetX = WINDOW_X
  }

  /**
   * 
   * @param {Traveller} traveller 
   */
  show(traveller) {
    // The booth is empty, so the new traveller can walk in at once
    if (this.#current === null) {
      this.#walkIn(traveller)
      return
    }

    // Someone is already at the window: let them leave first,
    // and let the new traveller wait until they are gone
    this.#next = traveller
    this.#targetX = EXIT_X
  }

  #walk(deltaTime) {
    // How far is left to the target. Positive means right, negative means left
    const distance = this.#targetX - this.#traveller.x

    // How far the traveller can walk this frame, but never further than
    // the distance left, so they stop exactly on the target
    const step = Math.min(Math.abs(distance), WALK_SPEED * deltaTime)

    // Math.sign gives the direction: 1 for right, -1 for left, 0 if already there
    this.#traveller.x += Math.sign(distance) * step
  }

  #afterLeaving() {
    // Someone is waiting, so they walk in now that the booth is free
    if (this.#next !== null) {
      this.#walkIn(this.#next)
      this.#next = null
      return
    }

    // Nobody is waiting: empty the booth and hide the sprite
    this.#current = null
    this.#traveller.width = 0
    this.#traveller.height = 0
  }

  /**
   * 
   * @param {number} deltaTime 
   */
  update(deltaTime) {
    this.#elapsed += deltaTime
    this.#walk(deltaTime)

    // Breathing: move up and down along a sine wave, whether walking or standing still
    this.#traveller.y = TRAVELLER_Y + Math.round(Math.sin(this.#elapsed / BOB_SPEED) * BOB_HEIGHT)

    // The traveller has walked all the way out. The null check stops an
    // empty booth from running this every frame
    if (this.#current !== null && this.#traveller.x === EXIT_X) {
      this.#afterLeaving()
    }
  }

  leave() {
    // Nobody should come in after this traveller, for example when the queue is empty
    this.#next = null
    this.#targetX = EXIT_X
  }

  get isAtWindow() {
    return (this.#current !== null && this.#targetX === WINDOW_X && this.#traveller.x === WINDOW_X)
  }
}