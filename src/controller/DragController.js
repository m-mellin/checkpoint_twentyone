export class DragController {
  #canvas
  #target
  /**
   * @type {{x: number, y: number} | null}
   */
  #grabOffset = null

  /**
   * 
   * @param {HTMLCanvasElement} canvas 
   * @param {*} target 
   */
  constructor(canvas, target) {
    this.#canvas = canvas
    this.#target = target

    canvas.addEventListener('pointerdown', (event) => this.#grab(event))
    canvas.addEventListener('pointermove', (event) => this.#drag(event))
    canvas.addEventListener('pointerup', () => this.#release())
    canvas.addEventListener('pointercancel', () => this.#release())
  }

  /**
   * 
   * @param {PointerEvent} event 
   * @returns {void}
   */
  #grab(event) {
    const { x, y } = this.#toCanvasPosition(event)

    if (!this.#target.contains(x, y)) return

    this.#grabOffset = {
      x: (x - this.#target.x) / this.#target.width,
      y: (y - this.#target.y) / this.#target.height
    }
    this.#canvas.setPointerCapture(event.pointerId)
  }

  /**
   * 
   * @param {PointerEvent} event 
   * @returns {void}
   */
  #drag(event) {
    if (this.#grabOffset === null) return

    const { x, y } = this.#toCanvasPosition(event)
    this.#target.moveTo(
      x - this.#grabOffset.x * this.#target.width,
      y - this.#grabOffset.y * this.#target.height
    )
  }

  /**
   * -
   */
  #release() {
    this.#grabOffset = null
  }

  /**
   * 
   * @param {PointerEvent} event 
   * @returns {{x: number, y: number}}
   */
  #toCanvasPosition(event) {
    const rect = this.#canvas.getBoundingClientRect()

    return {
      x: (event.clientX - rect.left) * (this.#canvas.width / rect.width),
      y: (event.clientY - rect.top) * (this.#canvas.height / rect.height)
    }
  }
}