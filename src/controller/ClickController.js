/**
 * Something on the canvas the player can click, for example a Button or a TextButton.
 *
 * @typedef {object} Clickable
 * @property {(x: number, y: number) => boolean} contains - Returns true if the point is on it.
 * @property {() => void} click - Does what it is for.
 */

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
   * Returns the buttons that can be clicked right now.
   *
   * @type {() => Clickable[]}
   */
  #getButtons

  /**
   * Starts listening for clicks on the canvas.
   *
   * @param {HTMLCanvasElement} canvas - The canvas the game is drawn on.
   * @param {() => Clickable[]} getButtons - Returns the buttons that can be clicked right now.
   */
  constructor(canvas, getButtons) {
    this.#canvas = canvas
    this.#getButtons = getButtons

    canvas.addEventListener('click', (event) => {
      this.#click(event)
    })
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

    const button = this.#getButtons().find((b) => b.contains(x, y))

    if (button) {
      button.click()
    }
  }
}