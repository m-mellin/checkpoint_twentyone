import { Sprite, SpriteRenderer } from '2d-sprite-renderer'
import { INSPECTION_DESK_X } from './InspectionDeskView.js'

/**
 * The y coordinate items land on when they fall onto the booth counter.
 */
const COUNTER_Y = 700

/**
 * How fast items fall onto the counter, in pixels per millisecond.
 */
const FALL_SPEED = 1.2

/**
 * One of an item's two looks: its image and size on the counter or on the inspection desk.
 *
 * @typedef {object} ItemLook
 * @property {string} src - The image.
 * @property {number} width - The width in pixels.
 * @property {number} height - The height in pixels.
 */

/**
 * Something the player can drag between the booth counter, where it is small, and the inspection
 * desk, where it is shown large. Handles moving, dragging, switching look and falling onto the counter.
 *
 * Subclasses decide what is drawn on top of the item by overriding placeContent() and updateContent(),
 * and must call show() or hide() at the end of their constructor.
 */
export class InspectableItemView {
  /**
   * The item's small image, shown on the counter.
   *
   * @type {Sprite}
   */
  #counterSprite

  /**
   * The item's large image, shown on the inspection desk.
   *
   * @type {Sprite}
   */
  #inspectionDeskSprite

  /**
   * How the item looks on the counter.
   *
   * @type {ItemLook}
   */
  #counterLook

  /**
   * How the item looks on the inspection desk.
   *
   * @type {ItemLook}
   */
  #inspectionDeskLook

  /**
   * The x coordinate of the item's top left corner.
   *
   * @type {number}
   */
  #x

  /**
   * The y coordinate of the item's top left corner.
   *
   * @type {number}
   */
  #y

  /**
   * The x coordinate the item started at.
   *
   * @type {number}
   */
  #startX

  /**
   * The y coordinate the item started at.
   *
   * @type {number}
   */
  #startY

  /**
   * Whether the item lies on the inspection desk (true) or on the counter (false).
   *
   * @type {boolean}
   */
  #isOnInspectionDesk = false

  /**
   * Whether the item is shown at all. A hidden item is neither drawn nor draggable.
   *
   * @type {boolean}
   */
  #isVisible = true

  /**
   * Whether the item is falling onto the counter right now.
   *
   * @type {boolean}
   */
  #isFalling = false

  /**
   * Creates the item's two images and adds them to the renderer. They are not shown until
   * show() is called, which the subclass must do (or hide()) at the end of its constructor.
   *
   * @param {SpriteRenderer} renderer - The renderer to draw with.
   * @param {object} options - The item's looks and start position.
   * @param {ItemLook} options.counter - How the item looks on the counter.
   * @param {ItemLook} options.inspectionDesk - How the item looks on the inspection desk.
   * @param {number} options.x - The x coordinate it starts at.
   * @param {number} options.y - The y coordinate it starts at.
   */
  constructor(renderer, { counter, inspectionDesk, x, y }) {
    this.#counterLook = counter
    this.#inspectionDeskLook = inspectionDesk
    this.#counterSprite = new Sprite(counter.src)
    this.#inspectionDeskSprite = new Sprite(inspectionDesk.src)
    this.#x = x
    this.#y = y
    this.#startX = x
    this.#startY = y

    renderer.add(this.#counterSprite)
    renderer.add(this.#inspectionDeskSprite)
  }

  /**
   * Returns the x coordinate of the item.
   *
   * @returns {number} The x coordinate of the top left corner.
   */
  get x() {
    return this.#x
  }

  /**
   * Returns the y coordinate of the item.
   *
   * @returns {number} The y coordinate of the top left corner.
   */
  get y() {
    return this.#y
  }

  /**
   * Returns the width of the item in its current look.
   *
   * @returns {number} The width in pixels.
   */
  get width() {
    return this.#currentLook().width
  }

  /**
   * Returns the height of the item in its current look.
   *
   * @returns {number} The height in pixels.
   */
  get height() {
    return this.#currentLook().height
  }

  /**
   * Returns whether the item is shown and lies small on the counter.
   *
   * @returns {boolean} True if the item is on the counter.
   */
  get isOnCounter() {
    return this.#isVisible && !this.#isOnInspectionDesk
  }

  /**
   * Returns whether the item is shown and lies large on the inspection desk.
   *
   * @returns {boolean} True if the item is on the inspection desk.
   */
  get isOnInspectionDesk() {
    return this.#isVisible && this.#isOnInspectionDesk
  }

  /**
   * Shows the item where it is, in the look for that place.
   */
  show() {
    this.#isVisible = true
    this.#decidePlace()
    this.#refreshLook()
    this.#placeAll()
  }

  /**
   * Hides the item, so it is neither drawn nor draggable. Stops it from falling.
   */
  hide() {
    this.#isVisible = false
    this.#isFalling = false
    this.#refreshLook()
  }

  /**
   * Moves the item so its top left corner is at the given position, and switches between the
   * small and the large look when it crosses onto or off the inspection desk. Stops it from
   * falling, for example when the player grabs it.
   *
   * @param {number} x - The new x coordinate, in canvas pixels.
   * @param {number} y - The new y coordinate, in canvas pixels.
   */
  moveTo(x, y) {
    this.#isFalling = false
    this.#x = x
    this.#y = y

    if (this.#decidePlace()) {
      this.#refreshLook()
    }

    this.#placeAll()
  }

  /**
   * Moves the item back to where it started, for example when a new day begins.
   */
  moveToStart() {
    this.moveTo(this.#startX, this.#startY)
  }

  /**
   * Returns whether a point is on the item, in its current look. Always false when it is hidden.
   *
   * @param {number} x - The x coordinate of the point, in canvas pixels.
   * @param {number} y - The y coordinate of the point, in canvas pixels.
   * @returns {boolean} True if the point is on the item.
   */
  contains(x, y) {
    if (!this.#isVisible) {
      return false
    }

    return (
      x >= this.#x &&
      x <= this.#x + this.width &&
      y >= this.#y &&
      y <= this.#y + this.height
    )
  }

  /**
   * Lets the item fall down onto the booth counter.
   */
  fall() {
    this.#isFalling = true
  }

  /**
   * Moves a falling item towards the counter, without falling past it.
   * Does nothing if the item is not falling.
   *
   * @param {number} deltaTime - Milliseconds since the last frame.
   */
  update(deltaTime) {
    if (!this.#isFalling) return

    const distance = COUNTER_Y - this.#y
    const step = Math.min(Math.abs(distance), FALL_SPEED * deltaTime)

    this.#y += Math.sign(distance) * step
    this.#placeAll()

    if (this.#y === COUNTER_Y) {
      this.#isFalling = false
    }
  }

  /**
   * Places what the subclass draws on top of the item, relative to this.x and this.y.
   * Called every time the item moves.
   *
   * @protected
   */
  placeContent() {}

  /**
   * Shows or hides what the subclass draws on top of the item. Check this.isOnInspectionDesk.
   * Called when the item changes place, or is shown or hidden.
   *
   * @protected
   */
  updateContent() {}

  /**
   * Decides from the item's centre whether it lies on the inspection desk.
   *
   * @returns {boolean} True if the item changed place.
   */
  #decidePlace() {
    const shouldBeOnInspectionDesk = this.#x + this.width / 2 >= INSPECTION_DESK_X
    const changed = shouldBeOnInspectionDesk !== this.#isOnInspectionDesk

    this.#isOnInspectionDesk = shouldBeOnInspectionDesk

    return changed
  }

  /**
   * Shows the image for the current place, hides the other, and lets the subclass update its content.
   */
  #refreshLook() {
    this.#resize(
      this.#inspectionDeskSprite,
      this.isOnInspectionDesk ? this.#inspectionDeskLook : null
    )
    this.#resize(this.#counterSprite, this.isOnCounter ? this.#counterLook : null)
    this.updateContent()
  }

  /**
   * Gives an image the size of a look, or hides it.
   *
   * @param {Sprite} sprite - The image to resize.
   * @param {ItemLook | null} look - The look whose size to use, or null to hide the image.
   */
  #resize(sprite, look) {
    sprite.width = look ? look.width : 0
    sprite.height = look ? look.height : 0
  }

  /**
   * Places both images at the item's position, and lets the subclass place its content.
   */
  #placeAll() {
    for (const sprite of [this.#counterSprite, this.#inspectionDeskSprite]) {
      sprite.x = this.#x
      sprite.y = this.#y
    }

    this.placeContent()
  }

  /**
   * Returns the look for where the item lies now.
   *
   * @returns {ItemLook} The current look.
   */
  #currentLook() {
    return this.#isOnInspectionDesk ? this.#inspectionDeskLook : this.#counterLook
  }
}
