import { Sprite, SpriteRenderer } from "2d-sprite-renderer";

const STAMP_WIDTH = 505 / 2
const STAMP_HEIGHT = 593 / 2

/**
 * 
 */
export class StampView {
  #sprite
  #x
  #y
  #approves = false

  /**
   * Creates a stamp and adds it to the renderer.
   *
   * @param {SpriteRenderer} renderer - The renderer to draw with.
   * @param {object} options - What makes this stamp different from the others.
   * @param {string} options.src - The stamp's image.
   * @param {number} options.x - The x coordinate it starts at.
   * @param {number} options.y - The y coordinate it starts at.
   * @param {boolean} options.approves - True for the approve stamp, false for the deny stamp.
   */
  constructor(renderer, {src, x, y, approves}) {
    this.#sprite = new Sprite(src, {width: STAMP_WIDTH, height: STAMP_HEIGHT})
    this.#x = x
    this.#y = y
    this.#approves = approves

    renderer.add(this.#sprite)
    this.#placeAll()
  }

  /**
   * Returns a boolean if the stamp approves passports.
   * 
   * @returns {boolean} True if it approves, else false.
   */
  get approves() {
    return this.#approves
  }

  /**
   * Moves the sprite to the stamp's position, so the stamp is drawn where it is.
   */
  #placeAll() {
    this.#sprite.x = this.#x
    this.#sprite.y = this.#y
  }

  /**
   * Returns the x-coordinate of the stamp.
   *
   * @returns {number} The x-coordinate.
   */
  get x() {
    return this.#x
  }

  /**
   * Returns the y-coordinate of the stamp.
   *
   * @returns {number} The y-coordinate.
   */
  get y() {
    return this.#y
  }

  /**
   * Returns the width of the stamp.
   *
   * @returns {number} The width in pixels.
   */
  get width() {
    return STAMP_WIDTH
  }

  /**
   * Returns the height of the stamp.
   *
   * @returns {number} The height in pixels.
   */
  get height() {
    return STAMP_HEIGHT
  }

  /**
   * Moves the stamp.
   *
   * @param {number} x - The x-coordinate to move.
   * @param {number} y - The y-coordinate to move.
   */
  moveTo(x, y) {
    this.#x = x
    this.#y = y
    this.#placeAll()
  }

  /**
   * Returns whether a point is on the stamp, in its current size.
   *
   * @param {number} x - The x coordinate of the point, in canvas pixels.
   * @param {number} y - The y coordinate of the point, in canvas pixels.
   * @returns {boolean} True if the point is on the stamp.
   */
  contains(x, y) {
    return (
      x >= this.#x &&
      x <= this.#x + this.width &&
      y >= this.#y &&
      y <= this.#y + this.height
    )
  }
}
