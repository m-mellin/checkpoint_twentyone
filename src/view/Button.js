import { Sprite, SpriteRenderer } from '2d-sprite-renderer'

/**
 * A clickable image, for example the button that opens the sound settings.
 */
export class Button {
  /**
   * The image of the button.
   *
   * @type {Sprite}
   */
  #sprite

  /**
   * Called when the button is clicked.
   *
   * @type {() => void}
   */
  #onClick

  /**
   * Creates a button and adds it to the renderer.
   *
   * @param {SpriteRenderer} renderer - The renderer to draw with.
   * @param {object} options - The button's image, position, size and action.
   * @param {string} options.src - The image of the button.
   * @param {number} options.x - The x coordinate of the top left corner.
   * @param {number} options.y - The y coordinate of the top left corner.
   * @param {number} options.width - The width in pixels.
   * @param {number} options.height - The height in pixels.
   * @param {() => void} options.onClick - Called when the button is clicked.
   */
  constructor(renderer, { src, x, y, width, height, onClick }) {
    this.#sprite = new Sprite(src, { x, y, width, height })
    this.#onClick = onClick

    renderer.add(this.#sprite)
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
      x >= this.#sprite.x &&
      x <= this.#sprite.x + this.#sprite.width &&
      y >= this.#sprite.y &&
      y <= this.#sprite.y + this.#sprite.height
    )
  }

  /**
   * Does what the button is for, by calling its onClick function.
   */
  click() {
    this.#onClick()
  }
}
