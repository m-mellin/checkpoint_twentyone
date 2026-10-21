import { BlockSprite, SpriteRenderer, TextSprite } from '2d-sprite-renderer'

/**
 * The color of the button, the label's font and color.
 */
const BUTTON_COLOR = '#333'
const LABEL_FONT = '12px "Press Start 2P"'
const LABEL_COLOR = '#fff'

/**
 * The space between the text and the edge of the box, in pixels.
 */
const PADDING = 20

/**
 * A clickable box with a text on it, for example a difficulty on the start screen.
 */
export class TextButton {
  /**
   * The coloured box behind the text.
   *
   * @type {BlockSprite}
   */
  #box

  /**
   * The text on the button.
   *
   * @type {TextSprite}
   */
  #label = new TextSprite('', {color: LABEL_COLOR, font: LABEL_FONT})

  /**
   * Called when the button is clicked.
   *
   * @type {() => void}
   */
  #onClick

  /**
   * Creates the button and adds it to the renderer. The box is sized after the text.
   *
   * @param {SpriteRenderer} renderer - The renderer to draw with.
   * @param {object} options - The button's text, position and action.
   * @param {string} options.text - The text on the button.
   * @param {number} options.centerX - The x coordinate of the button's centre.
   * @param {number} options.y - The y coordinate of the button's top edge.
   * @param {() => void} options.onClick - Called when the button is clicked.
   */
  constructor(renderer, { text, centerX, y, onClick }) {
    this.#label.text = text

    this.#box = new BlockSprite({
      width: this.#label.width + PADDING * 2,
      height: this.#label.height + PADDING * 2,
      x: centerX - this.#label.width / 2 - PADDING,
      y,
      color: BUTTON_COLOR
    })

    this.#label.x = this.#box.x + PADDING
    this.#label.y = this.#box.y + PADDING
    this.#onClick = onClick

    renderer.add(this.#box)
    renderer.add(this.#label)
  }

  /**
   * Returns whether a point is on the button.
   *
   * @param {number} x - The x coordinate of the point, in canvas pixels.
   * @param {number} y - The y coordinate of the point, in canvas pixels.
   * @returns {boolean} True if the point is on the button.
   */
  contains(x, y) {
    return (
      x >= this.#box.x &&
      x <= this.#box.x + this.#box.width &&
      y >= this.#box.y &&
      y <= this.#box.y + this.#box.height
    )
  }

  /**
   * Does what the button is for, by calling its onClick function.
   */
  click() {
    this.#onClick()
  }
}
