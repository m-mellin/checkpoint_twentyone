import { TextSprite } from '2d-sprite-renderer'

/**
 * A line of text that knows its own size. Wraps a TextSprite and measures the text
 * whenever it changes, so it can be centred or stacked under other lines.
 */
export class TextLine {
  /**
   * The sprite that draws the text.
   *
   * @type {TextSprite}
   */
  #sprite

  /**
   * Creates a line of text and measures it.
   *
   * @param {string} text - The text to draw.
   * @param {object} [options] - How the text looks.
   * @param {string} [options.color="#000000"] - The CSS color of the text.
   * @param {string} [options.font='12px "Press Start 2P"'] - The CSS font of the text.
   * @throws {Error} If the browser cannot create a context for measuring text.
   */
  constructor(
    text,
    { color = '#000000', font = '12px "Press Start 2P"' } = {}
  ) {
    this.#sprite = new TextSprite(text, { color, font })
  }

  /**
   * Returns the sprite that draws the text.
   *
   * @returns {TextSprite} The sprite.
   */
  get sprite() {
    return this.#sprite
  }

  /**
   * Returns the text.
   *
   * @returns {string} The text.
   */
  get text() {
    return this.#sprite.text
  }

  /**
   * Sets the text and measures its new size.
   *
   * @param {string} text - The text to draw.
   */
  set text(text) {
    this.#sprite.text = text
  }

  /**
   * Returns the CSS color of the text.
   *
   * @returns {string} The CSS color.
   */
  get textColor() {
    return this.#sprite.color
  }

  /**
   * Sets the CSS color of the text.
   *
   * @param {string} textColor - The CSS color.
   */
  set textColor(textColor) {
    this.#sprite.color = textColor
  }

  /**
   * Returns the X coordinate of the text.
   *
   * @returns {number} The X coordinate in pixels.
   */
  get x() {
    return this.#sprite.x
  }

  /**
   * Sets the X coordinate of the text.
   *
   * @param {number} x - The X coordinate in pixels.
   */
  set x(x) {
    this.#sprite.x = x
  }

  /**
   * Returns the Y coordinate of the top of the text.
   *
   * @returns {number} The Y coordinate in pixels.
   */
  get y() {
    return this.#sprite.y
  }

  /**
   * Sets the Y coordinate of the top of the text.
   *
   * @param {number} y - The Y coordinate in pixels.
   */
  set y(y) {
    this.#sprite.y = y
  }

  /**
   * Returns the width of the text.
   *
   * @returns {number} The width in pixels.
   */
  get width() {
    return this.#sprite.width
  }

  /**
   * Returns the height of the text.
   *
   * @returns {number} The height in pixels.
   */
  get height() {
    return this.#sprite.height
  }
}
