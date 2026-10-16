import { Button } from '../view/Button.js'

/**
 * Lets the player click buttons on the canvas.
 */
export class ClickController {
  /**
   * The canvas the game is drawn on, where the clicks come from.
   *
   * @type {HTMLCanvasElement}
   */
  #canvas

  /**
   * The buttons that can be clicked.
   *
   * @type {Button[]}
   */
  #buttons

  /**
   * Starts listening for clicks on the canvas.
   *
   * @param {HTMLCanvasElement} canvas - The canvas the game is drawn on.
   * @param {Button[]} buttons - The buttons that can be clicked.
   */
  constructor(canvas, buttons) {
    this.#canvas = canvas
    this.#buttons = buttons

    canvas.addEventListener('click', (event) => this.#click(event))
  }
  
  /**
   * Clicks the button under the pointer, if there is one.
   *
   * @param {MouseEvent} event - The click event from the canvas.
   */
  #click(event) {
    const rect = this.#canvas.getBoundingClientRect()
    const x = (event.clientX - rect.left) * (this.#canvas.width / rect.width)
    const y = (event.clientY - rect.top) * (this.#canvas.height / rect.height)

    const button = this.#buttons.find((b) => b.contains(x, y))

    if (button) {
      button.click()
    }
  }
}
