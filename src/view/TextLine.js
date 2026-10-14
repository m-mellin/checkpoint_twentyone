import { TextSprite } from "2d-sprite-renderer"

export class TextLine {
  #sprite
  #width = 0
  #height = 0
  
  static #context = document.createElement('canvas').getContext('2d')

  /**
   * -
   * 
   * @param {string} text 
   * @param {object} [options]
   * @param {string} [options.color] 
   * @param {string} [options.font]
   */
  constructor(text, {color = '#000000', font = '12px "Press Start 2P"'} = {}) {
    this.#sprite = new TextSprite(text, { color, font })
    this.#measureTextAndSetSize()
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
    this.#measureTextAndSetSize()
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
    return this.#width
  }

  /**
   * Returns the height of the text.
   *
   * @returns {number} The height in pixels.
   */
  get height() {
    return this.#height
  }

  /**
   * Measures the text with the sprite's font and stores its width and height.
   */
  #measureTextAndSetSize() {
    const context = TextLine.#context

    if (context === null)
      throw new Error('Could not create a 2D context for measuring text')

    context.font = this.#sprite.font
    const metrics = context.measureText(this.#sprite.text)

    this.#width = Math.ceil(metrics.width)
    this.#height = Math.ceil(
      metrics.fontBoundingBoxAscent + metrics.fontBoundingBoxDescent
    )
  }
}