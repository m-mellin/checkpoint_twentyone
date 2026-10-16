import { Sprite, SpriteRenderer } from '2d-sprite-renderer'

/**
 * The image of the inspection desk.
 */
const DESK_SRC = 'assets/inspection_desk.png'

/**
 * Shows the inspection desk to the right of the booth, where items are opened and inspected.
 */
export class DeskView {
  /**
   * The image of the inspection desk.
   *
   * @type {Sprite}
   */
  #desk = new Sprite(DESK_SRC, { x: 1370, y: 0, width: 950, height: 1150 })

  /**
   * Adds the inspection desk to the renderer.
   *
   * @param {SpriteRenderer} renderer - The renderer to draw with.
   */
  constructor(renderer) {
    renderer.add(this.#desk)
  }
}
