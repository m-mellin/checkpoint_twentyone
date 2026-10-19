import { Sprite, SpriteRenderer } from '2d-sprite-renderer'
import { TextLine } from './TextLine.js'

/**
 * The image of the display panel.
 */
const LCD_SRC = '/assets/lcd_panel.png'

/**
 * The scale of the display panel is drawn.
 */
const IMAGE_SCALE = 0.2

/**
 * The default size of the panel, in pixels.
 */
const WIDTH = 1360 * IMAGE_SCALE
const HEIGHT = 455 * IMAGE_SCALE

/**
 * Where the text is printed, measure from the top-left corner of the panel, in pixels.
 */
const TEXT_OFFSET_X = 45
const TEXT_OFFSET_Y = 37

/**
 * The color and font of the text on the display.
 */
const TEXT_COLOR = '#fff'
const TEXT_FONT = '18px "Press Start 2P"'

/**
 * A small LCD panel that shows one line of text, for example today's date or the traveller's height.
 */
export class LcdDisplayView {
  /**
   * The image of the panel.
   *
   * @type {Sprite}
   */
  #background

  /**
   * The text shown on the panel.
   *
   * @type {TextLine}
   */
  #text = new TextLine('', { color: TEXT_COLOR, font: TEXT_FONT })

  /**
   * Creates an empty display and adds it to the renderer.
   *
   * @param {SpriteRenderer} renderer - The renderer to draw with.
   * @param {object} [options] - The display's position and size.
   * @param {number} [options.x=0] - The x coordinate of the top left corner.
   * @param {number} [options.y=0] - The y coordinate of the top left corner.
   * @param {number} [options.width] - The width in pixels. Defaults to the panel image's width at IMAGE_SCALE.
   * @param {number} [options.height] - The height in pixels. Defaults to the panel image's height at IMAGE_SCALE.
   */
  constructor(renderer, { x = 0, y = 0, width = WIDTH, height = HEIGHT } = {}) {
    this.#background = new Sprite(LCD_SRC, { x, y, width, height })
    this.#text.x = x + TEXT_OFFSET_X
    this.#text.y = y + TEXT_OFFSET_Y

    renderer.add(this.#background)
    renderer.add(this.#text.sprite)
  }

  /**
   * Returns the text shown on the display.
   *
   * @returns {string} The text.
   */
  get value() {
    return this.#text.text
  }

  /**
   * Sets the text shown on the display.
   *
   * @param {string} value - The text to show, for example "2026.10.16" or "182 cm".
   */
  set value(value) {
    this.#text.text = value
  }
}
