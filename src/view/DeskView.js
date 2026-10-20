import { Sprite, SpriteRenderer } from '2d-sprite-renderer'

/**
 * The image of the inspection desk.
 */
const DESK_SRC = 'assets/inspection_desk.png'

/**
 * The positon of the desk, in pixels.
 */
const DESK_X = 1370
const DESK_Y = 0

/**
 * The size of the desk, in pixels.
 */
const DESK_WIDTH = 950
const DESK_HEIGHT = 1150

/**
 * Shows the inspection desk to the right of the booth, where items are opened and inspected.
 */
export class DeskView {
  /**
   * The image of the inspection desk.
   *
   * @type {Sprite}
   */
  #desk = new Sprite(DESK_SRC, { x: DESK_X, y: DESK_Y, width: DESK_WIDTH, height: DESK_HEIGHT })

  /**
   * Adds the inspection desk to the renderer.
   *
   * @param {SpriteRenderer} renderer - The renderer to draw with.
   */
  constructor(renderer) {
    renderer.add(this.#desk)
  }
}
