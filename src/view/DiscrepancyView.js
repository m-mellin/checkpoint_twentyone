import { Sprite } from "2d-sprite-renderer"

const DISCREPANCY_SRC = '/assets/discrepancy_open.png'
const CLOSED_DISCREPANCY_SRC = '/assets/discrepancy_closed.png'

const COUNTER_Y = 700
const FALL_SPEED = 4

const DESK_CENTER_X = 600
const DESK_CENTER_Y = 700

const DESK_LEFT_X = 1370

const DOCUMENT_X = 1400
const DOCUMENT_Y = 0

const DOCUMENT_SCALE = 0.5

const CLOSED_WIDTH = 1047 / 2 * DOCUMENT_SCALE
const CLOSED_HEIGHT = 1502 / 2 * DOCUMENT_SCALE

const OPEN_WIDTH = 1047 * DOCUMENT_SCALE
const OPEN_HEIGHT = 1502 * DOCUMENT_SCALE

export class DiscrepancyView {
  #openPaper = new Sprite(DISCREPANCY_SRC)
  #closedPaper = new Sprite(CLOSED_DISCREPANCY_SRC)

  #x = DOCUMENT_X
  #y = DOCUMENT_Y

  #isOpen = true
  #isFalling = false

  constructor(renderer) {
    renderer.add(this.#openPaper)
    renderer.add(this.#closedPaper)

    this.#placeAll()
    this.#show()
  }

  #show() {
    this.#x = DESK_CENTER_X
    this.#y = DESK_CENTER_Y
    this.#close()
    this.#placeAll()
  }

  #open() {
    this.#isOpen = true
    this.#closedPaper.width = 0
    this.#closedPaper.height = 0
    this.#openPaper.width = OPEN_WIDTH
    this.#openPaper.height = OPEN_HEIGHT
  }

  #close() {
    this.#isOpen = false
    this.#openPaper.width = 0
    this.#openPaper.height = 0
    this.#closedPaper.width = CLOSED_WIDTH
    this.#closedPaper.height = CLOSED_HEIGHT
  }

  #placeAll() {
    this.#openPaper.x = this.#x
    this.#openPaper.y = this.#y
    this.#closedPaper.x = this.#x
    this.#closedPaper.y = this.#y
  }

  /**
   * Returns the x-coordinate of the document.
   *
   * @returns {number} The x-coordinate.
   */
  get x() {
    return this.#x
  }

  /**
   * Returns the y-coordinate of the document.
   *
   * @returns {number} The y-coordinate.
   */
  get y() {
    return this.#y
  }

  /**
   * Returns the width of the document based on if its open or closed.
   *
   * @returns {number} The width of the document.
   */
  get width() {
    return this.#isOpen ? OPEN_WIDTH : CLOSED_WIDTH
  }

  /**
   * Returns the height of the document based on if its open or closed.
   *
   * @returns {number} The height of the document.
   */
  get height() {
    return this.#isOpen ? OPEN_HEIGHT : CLOSED_HEIGHT
  }

  /**
   * Returns whether a passport is shown and lies closed in the booth.
   *
   * @returns {boolean} True if the passport is in the booth.
   */
  get isInBooth() {
    return !this.#isOpen
  }

  moveTo(x, y) {
    this.#isFalling = false
    this.#x = x
    this.#y = y
    this.#updateMode()
    this.#placeAll()
  }

  #updateMode() {
    const centerX = this.#x + this.width / 2
    const shouldBeOpen = centerX >= DESK_LEFT_X

    if (shouldBeOpen && !this.#isOpen) {
      this.#open()
    } else if (!shouldBeOpen && this.#isOpen) {
      this.#close()
    }
  }

  contains(x, y) {
    return (
      x >= this.#x &&
      x <= this.#x + this.width &&
      y >= this.#y &&
      y <= this.#y + this.height
    )
  }

  /**
   * Set that the document is currently falling.
   */
  fall() {
    this.#isFalling = true
  }

  /**
   * Moves a falling passport towards the booth counter, without falling past it.
   * Does nothing if the passport is not falling.
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
}