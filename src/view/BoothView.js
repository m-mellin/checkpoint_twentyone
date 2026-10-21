import { Sprite, SpriteRegion, SpriteRenderer } from '2d-sprite-renderer'
import portraitData from '../data/portraits.json'
import { Traveller } from '../model/Traveller.js'

/**
 * The counter's image, position and size.
 */
const COUNTER_SRC = 'assets/desk_final_2.png'
const COUNTER_Y = 520
const COUNTER_WIDTH = 1367
const COUNTER_HEIGHT = 511

/**
 * The background image and size.
 */
const BACKGROUND_SRC = 'assets/background_final_2.png'
const BACKGROUND_WIDTH = 1367
const BACKGROUND_HEIGHT = 629

/**
 * The sprite sheet's image, and the traveller's position and scale.
 */
const TRAVELLERS_SRC = 'assets/travellers.png'
const TRAVELLER_Y = 320
const PORTRAIT_SCALE = 2

/**
 * Controls the breathing animation of the traveller.
 *
 * A higher speed gives slower breathing, and the height is how far the traveller moves, in pixels.
 */
const BOB_SPEED = 400
const BOB_HEIGHT = 3

/**
 * The x coordinates the traveller walks between: start, window and exit.
 */
const TRAVELLER_START_X = -500
const TRAVELLER_STOP_X = 480
const TRAVELLER_EXIT_X = 1400

/**
 * How fast the traveller moves, in pixels per millisecond.
 */
const WALK_SPEED = 0.4

/**
 * The booth seen through the window: the background, the counter in front, and the traveller
 * who walks up to the window, breathes while waiting, and leaves when their passport is handed back.
 */
export class BoothView {
  /**
   * The background behind the traveller.
   *
   * @type {Sprite}
   */
  #background = new Sprite(BACKGROUND_SRC, {
    width: BACKGROUND_WIDTH,
    height: BACKGROUND_HEIGHT
  })

  /**
   * The counter in front of the traveller.
   *
   * @type {Sprite}
   */
  #counter = new Sprite(COUNTER_SRC, {
    y: COUNTER_Y,
    width: COUNTER_WIDTH,
    height: COUNTER_HEIGHT
  })

  /**
   * The traveller's portrait. Its region decides which person is shown.
   *
   * @type {Sprite}
   */
  #traveller = new Sprite(TRAVELLERS_SRC, { x: TRAVELLER_START_X, y: TRAVELLER_Y })

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
  #targetX = TRAVELLER_STOP_X

  /**
   * Adds the view's sprites to the renderer. The traveller is added between the background
   * and the counter, so they are drawn behind the counter.
   *
   * @param {SpriteRenderer} renderer - The renderer to draw with.
   */
  constructor(renderer) {
    renderer.add(this.#background)
    renderer.add(this.#traveller)
    renderer.add(this.#counter)
  }

  /**
   * Shows a traveller's portrait outside the booth and lets them walk to the window.
   * Does nothing if there is no portrait for the traveller's appearance.
   *
   * @param {Traveller} traveller - The traveller who walks in.
   */
  #walkIn(traveller) {
    const portrait = portraitData.find((p) => p.id === traveller.person.appearance)

    if (!portrait) return

    this.#current = traveller

    this.#traveller.region = new SpriteRegion(portrait.region)

    this.#traveller.width = portrait.region.width * PORTRAIT_SCALE
    this.#traveller.height = portrait.region.height * PORTRAIT_SCALE

    this.#traveller.x = TRAVELLER_START_X
    this.#targetX = TRAVELLER_STOP_X
  }

  /**
   * Lets a traveller walk up to the window. If someone is already there, they leave first.
   *
   * @param {Traveller} traveller - The traveller to show.
   */
  show(traveller) {
    if (this.#current === null) {
      this.#walkIn(traveller)
      return
    }

    this.#next = traveller
    this.#targetX = TRAVELLER_EXIT_X
  }

  /**
   * Moves the traveller towards the target, without walking past it.
   *
   * @param {number} deltaTime - Milliseconds since the last frame.
   */
  #walk(deltaTime) {
    const distanceLeft = this.#targetX - this.#traveller.x
    const direction = Math.sign(distanceLeft)

    // Never further than the distance left, so the traveller stops exactly on the target
    const stepLength = Math.min(Math.abs(distanceLeft), WALK_SPEED * deltaTime)

    this.#traveller.x += direction * stepLength
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
   * Empties the booth and hides the portrait.
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

    if (this.#current !== null && this.#traveller.x === TRAVELLER_EXIT_X) {
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
    this.#targetX = TRAVELLER_EXIT_X
  }

  /**
   * Returns whether a traveller is standing at the window. False while they are walking.
   *
   * @returns {boolean} True if a traveller has arrived at the window.
   */
  get isAtWindow() {
    return (
      this.#current !== null &&
      this.#targetX === TRAVELLER_STOP_X &&
      this.#traveller.x === TRAVELLER_STOP_X
    )
  }
}
