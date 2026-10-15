
/**
 * Something on the screen that can be dragged, for example the passport or a stamp.
 *
 * @typedef {object} Draggable
 * @property {number} x - The x coordinate of the top left corner.
 * @property {number} y - The y coordinate of the top left corner.
 * @property {number} width - The current width.
 * @property {number} height - The current height.
 * @property {(x: number, y: number) => boolean} contains - Returns whether a point is on it.
 * @property {(x: number, y: number) => void} moveTo - Moves its top left corner to a point.
 */

/**
 * Lets the player drag things on the canvas.
 * When things overlap, only the one drawn on top is dragged.
 */
export class DragController {
  /**
   * The canvas the game is drawn on, where the pointer events come from.
   *
   * @type {HTMLCanvasElement}
   */
  #canvas

  /**
   * Everything that can be dragged, in the order they are drawn. The last one is on top.
   *
   * @type {Draggable[]}
   */
  #targets

  /**
   * The target being dragged right now, or null if nothing is.
   *
   * @type {Draggable | null}
   */
  #dragged = null

  /**
   * Where on the dragged target the player grabbed it, as a share of its width and height
   * (0 is the left or top edge, 1 the right or bottom edge). Null if nothing is being dragged.
   *
   * @type {{x: number, y: number} | null}
   */
  #grabOffset = null

  /**
   * Called with the target when the player releases it.
   *
   * @type {(target: Draggable) => void}
   */
  #onDrop

  /**
   * Starts listening for drags on the canvas.
   * 
   * @param {HTMLCanvasElement} canvas - The canvas the game is drawn on.
   * @param {Draggable[]} targets - Everything that can be dragged, in the order they are drawn.
   * @param {(target: Draggable) => void} [onDrop] - Called with the target when the player releases it.
   */
  constructor(canvas, targets, onDrop = () => {}) {
    this.#canvas = canvas
    this.#targets = targets
    this.#onDrop = onDrop

    canvas.addEventListener('pointerdown', (event) => this.#grab(event))
    canvas.addEventListener('pointermove', (event) => this.#drag(event))
    canvas.addEventListener('pointerup', () => this.#release())
    canvas.addEventListener('pointercancel', () => this.#release())
  }

  /**
   * Starts dragging the topmost target under the pointer, if there is one.
   * Remembers where on the target it was grabbed, so it doesn't jump to the pointer.
   * 
   * @param {PointerEvent} event - The pointer event from the canvas.
   */
  #grab(event) {
    const { x, y } = this.#toCanvasPosition(event)
    const target = this.#topmostAt(x, y)

    if (target === null) return

    this.#dragged = target
    this.#grabOffset = {
      x: (x - target.x) / target.width,
      y: (y - target.y) / target.height
    }

    this.#canvas.setPointerCapture(event.pointerId)
  }

  /**
   * Returns the target drawn on top at a point. Searches from the last drawn to the first.
   * 
   * @param {number} x - The x coordinate of the point, in canvas pixels.
   * @param {number} y - The y coordinate of the point, in canvas pixels.
   * @returns {Draggable | null} The topmost target at the point, or null if there is none.
   */
  #topmostAt(x, y) {
    for (let i = this.#targets.length - 1; i >= 0; i--) {
      if (this.#targets[i].contains(x, y)) {
        return this.#targets[i]
      }
    }

    return null
  }

  /**
   * Moves the dragged target with the pointer, keeping the grab point under the pointer.
   * Does nothing if nothing is being dragged.
   *
   * @param {PointerEvent} event - The pointer event from the canvas.
   */
  #drag(event) {
    if (this.#dragged === null || this.#grabOffset === null) return

    const { x, y } = this.#toCanvasPosition(event)
    this.#dragged.moveTo(
      x - this.#grabOffset.x * this.#dragged.width,
      y - this.#grabOffset.y * this.#dragged.height
    )
  }

  /**
   * Stops dragging. The target stays where it was released.
   */
  #release() {
    if (this.#dragged !== null) {
      this.#onDrop(this.#dragged)
    }
    
    this.#dragged = null
    this.#grabOffset = null
  }

  /**
   * Converts the pointer position on the page to coordinates on the canvas.
   * Needed when the canvas is shown at a different size than it is drawn in.
   * 
   * @param {PointerEvent} event - The pointer event.
   * @returns {{x: number, y: number}} The position in canvas pixels.
   */
  #toCanvasPosition(event) {
    const rect = this.#canvas.getBoundingClientRect()

    return {
      x: (event.clientX - rect.left) * (this.#canvas.width / rect.width),
      y: (event.clientY - rect.top) * (this.#canvas.height / rect.height)
    }
  }
}