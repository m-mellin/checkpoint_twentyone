import { Sprite, SpriteRenderer } from '2d-sprite-renderer'

/**
 * The image of the inspection desk.
 */
const DESK_SRC = 'assets/inspection_desk.png'

/**
 * The x coordinate of the inspection desk's left edge, in pixels. Items to the right of it are
 * shown large and open, and items to the left of it small and closed on the counter.
 */
export const INSPECTION_DESK_X = 1370

/**
 * The size of the inspection desk, in pixels.
 */
const DESK_WIDTH = 950
const DESK_HEIGHT = 1150

/**
 * Shows the inspection desk to the right of the booth, where items are opened and inspected.
 */
export class InspectionDeskView {
  /**
   * The image of the inspection desk.
   *
   * @type {Sprite}
   */
  #desk = new Sprite(DESK_SRC, { x: INSPECTION_DESK_X, width: DESK_WIDTH, height: DESK_HEIGHT })

  /**
   * Adds the inspection desk to the renderer.
   *
   * @param {SpriteRenderer} renderer - The renderer to draw with.
   */
  constructor(renderer) {
    renderer.add(this.#desk)
  }
}