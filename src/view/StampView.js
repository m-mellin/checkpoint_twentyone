import { SpriteRenderer } from '2d-sprite-renderer'
import { InspectableItemView } from './InspectableItemView.js'

/**
 * The size of the stamp on the inspection desk, in pixels. On the counter it is half as big.
 */
const STAMP_WIDTH = 505 / 2
const STAMP_HEIGHT = 593 / 2

/**
 * A stamp the player drags onto the open passport to approve or deny it.
 * Small on the counter and large on the inspection desk.
 */
export class StampView extends InspectableItemView {
  /**
   * Whether this stamp approves the passport.
   *
   * @type {boolean}
   */
  #approves = false

  /**
   * Creates a stamp and adds it to the renderer.
   *
   * @param {SpriteRenderer} renderer - The renderer to draw with.
   * @param {object} options - What makes this stamp different from the others.
   * @param {string} options.counterSrc - The stamp's image when on the counter.
   * @param {string} options.inspectionDeskSrc - The stamp's image when on the inspection desk.
   * @param {number} options.x - The x coordinate it starts at.
   * @param {number} options.y - The y coordinate it starts at.
   * @param {boolean} options.approves - True for the approve stamp, false for the deny stamp.
   */
  constructor(renderer, { counterSrc, inspectionDeskSrc, x, y, approves }) {
    super(renderer, {
      counter: {
        src: counterSrc,
        width: STAMP_WIDTH / 2,
        height: STAMP_HEIGHT / 2
      },
      inspectionDesk: {
        src: inspectionDeskSrc,
        width: STAMP_WIDTH,
        height: STAMP_HEIGHT
      },
      x,
      y
    })

    this.#approves = approves
    this.show()
  }

  /**
   * Returns whether stamping with this stamp approves the passport.
   *
   * @returns {boolean} True for the approve stamp, false for the deny stamp.
   */
  get approves() {
    return this.#approves
  }
}
