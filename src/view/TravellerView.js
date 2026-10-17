import { Sprite, SpriteRegion, SpriteRenderer } from '2d-sprite-renderer'
import portraitData from '../data/portraits.json'
import { Traveller } from '../model/Traveller.js'

/**
 * The image source of the desk, in front of the travellers.
 */
const DESK_SRC = 'assets/desk_final_2.png'

/**
 * The image source of the background, behind the travellers.
 */
const BG_SRC = 'assets/background_final_2.png'

/**
 * The image source of the traveller portraits.
 */
const TRAVELLERS_SRC = 'assets/travellers.png'

/**
 * How many times larger than in the sprite sheet a portrait is drawn.
 */
const PORTRAIT_SCALE = 2

/**
 * The y coordinate of the traveller's top edge when standin still, in pixels.
 */
const TRAVELLER_Y = 260

/**
 * How slowly the traveller breathes. A higher value gives slower breathing.
 */
const BOB_SPEED = 400

/**
 * How many pixels the traveller moves up and down when breathing.
 */
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
  /**
   * The background behind the traveller.
   *
   * @type {Sprite}
   */
  #background = new Sprite(BG_SRC, { x: 0, y: 0, width: 1367, height: 629 })

  /**
   * The booth desk in front of the traveller.
   *
   * @type {Sprite}
   */
  #desk = new Sprite(DESK_SRC, { x: 0, y: 520, width: 1367, height: 511 })

  /**
   * The traveller's portrait. Its region decides which person is shown.
   *
   * @type {Sprite}
   */
  #traveller = new Sprite(TRAVELLERS_SRC, { x: START_X, y: TRAVELLER_Y })

  /**
   * Milliseconds since the view was created. Drives the breathing.
   *
   * @type {number}
   */
  #elapsed = 0

  /**
   * The traveller walking in or standing at the window, or null if the booth is empty.
   *
   * @type {Traveller | null}
   */
  #current = null

  /**
   * The traveller who walks in when the current one has left, or null if nobody is waiting.
   *
   * @type {Traveller | null}
   */
  #next = null

  /**
   * The x coordinate the traveller is walking towards.
   *
   * @type {number}
   */
  #targetX = START_X

  /**
   * Adds the view's sprites to the renderer. The traveller is added between the background
   * and the desk, so they are drawn behind the desk.
   *
   * @param {SpriteRenderer} renderer - The renderer to draw with.
   */
  constructor(renderer) {
    renderer.add(this.#background)
    renderer.add(this.#traveller)
    renderer.add(this.#desk)
  }

  /**
   * Shows a traveller's portrait outside the booth and lets them walk to the window.
   *
   * @param {Traveller} traveller - The traveller who walks in.
   */
  #walkIn(traveller) {
    // Find the portrait that matches the person's appearance id
    const portrait = portraitData.find(
      (p) => p.id === traveller.person.appearance
    )

    if (!portrait) return

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
   * Lets a traveller walk up to the window. If someone is already there, they leave first.
   *
   * @param {Traveller} traveller - The traveller to show.
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

  /**
   * Moves the traveller towards the target, without walking past it.
   *
   * @param {number} deltaTime - Milliseconds since the last frame.
   */
  #walk(deltaTime) {
    // How far is left to the target. Positive means right, negative means left
    const distance = this.#targetX - this.#traveller.x

    // How far the traveller can walk this frame, but never further than
    // the distance left, so they stop exactly on the target
    const step = Math.min(Math.abs(distance), WALK_SPEED * deltaTime)

    // Math.sign gives the direction: 1 for right, -1 for left, 0 if already there
    this.#traveller.x += Math.sign(distance) * step
  }

  /**
   * Lets the waiting traveller walk in, or empties the booth if nobody is waiting.
   */
  #afterLeaving() {
    if (this.#next !== null) {
      this.#walkIn(this.#next)
      this.#next = null
      return
    }

    this.#emptyBooth()
  }

  /**
   * Empties the booth, if no one is waiting.
   */
  #emptyBooth() {
    this.#current = null
    this.#traveller.width = 0
    this.#traveller.height = 0
  }

  /**
   * Moves the traveller towards the target and lets them breathe.
   * Lets the next traveller in once the current one has left.
   *
   * @param {number} deltaTime - Milliseconds since the last frame.
   */
  update(deltaTime) {
    this.#elapsed += deltaTime
    this.#walk(deltaTime)

    this.#breathEffect()

    // The traveller has walked all the way out. The null check stops an
    // empty booth from running this every frame
    if (this.#current !== null && this.#traveller.x === EXIT_X) {
      this.#afterLeaving()
    }
  }

  /**
   * Makes the traveller look like they are breathing.
   */
  #breathEffect() {
    this.#traveller.y =
      TRAVELLER_Y + Math.round(Math.sin(this.#elapsed / BOB_SPEED) * BOB_HEIGHT)
  }

  /**
   * Lets the current traveller leave without anyone new coming in.
   */
  leave() {
    this.#next = null
    this.#targetX = EXIT_X
  }

  /**
   * Returns whether a traveller is standing at the window. False while they are walking.
   *
   * @returns {boolean} True if a traveller has arrived at the window.
   */
  get isAtWindow() {
    return (
      this.#current !== null &&
      this.#targetX === WINDOW_X &&
      this.#traveller.x === WINDOW_X
    )
  }
}
