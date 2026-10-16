import { Sprite, SpriteRenderer } from '2d-sprite-renderer'

/**
 * The image source of the Inspection desk.
 */
const DESK_SRC = 'assets/inspection_desk.png'

/**
 *
 */
export class DeskView {
  #desk = new Sprite(DESK_SRC, { x: 1370, y: 0, width: 950, height: 1150 })

  /**
   * Adds the inspection desk to the renderer.
   *
   * @param {SpriteRenderer} renderer - The renderer used.
   */
  constructor(renderer) {
    renderer.add(this.#desk)
  }
}
