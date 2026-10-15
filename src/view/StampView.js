import { Sprite, SpriteRenderer } from "2d-sprite-renderer";

const APPROVE_STAMP_SRC = 'assets/stamp.png'

const STAMP_WIDTH = 300
const STAMP_HEIGHT = 300

const STAMP_X = 1400
const STAMP_Y = 0

/**
 * 
 */
export class StampView {
  #approveStamp = new Sprite(APPROVE_STAMP_SRC, {x: STAMP_X, y: STAMP_Y, width: STAMP_WIDTH, height: STAMP_HEIGHT})
  #x = STAMP_X
  #y = STAMP_Y

  /**
   * -
   * 
   * @param {SpriteRenderer} renderer 
   */
  constructor(renderer) {
    renderer.add(this.#approveStamp)

    this.#placeAll()
  }

  get stamp() {
    return this.#approveStamp
  }

  #placeAll() {
    this.#approveStamp.x = this.#x
    this.#approveStamp.y = this.#y
  }

  /**
   * -
   * 
   * @returns {number}
   */
  get x() {
    return this.#x
  }

  /**
   * -
   * 
   * @returns {number}
   */
  get y() {
    return this.#y
  }

  /**
   * -
   * 
   * @param {number} x 
   * @param {number} y 
   */
  moveTo(x, y) {
    this.#x = x
    this.#y = y
    this.#placeAll()
  }

  /**
   * -
   * 
   * @param {number} x 
   * @param {number} y 
   * @returns {boolean} True if the point is on the passport.
   */
  contains(x, y) {
    return x >= this.#x && x <= this.#x + this.#approveStamp.width &&
      y >= this.#y && y <= this.#y + this.#approveStamp.height
  }
}