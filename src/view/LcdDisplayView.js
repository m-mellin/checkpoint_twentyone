import { Sprite, SpriteRenderer } from "2d-sprite-renderer";
import { TextLine } from "./TextLine";

const LCD_SRC = '/assets/lcd_panel.png'

const IMAGE_SCALE = 0.2

const WIDTH = 1360 * IMAGE_SCALE
const HEIGHT = 455 * IMAGE_SCALE

const TEXT_OFFSET_X = 45
const TEXT_OFFSET_Y = 37

export class LcdDisplayView {
  #background
  #text = new TextLine('', {color: '#fff', font: '18px "Press Start 2P"'})

  /**
   * 
   * @param {SpriteRenderer} renderer 
   */
  constructor(renderer, {x = 0, y = 0, width = WIDTH, height = HEIGHT} = {}) {
    this.#background = new Sprite(LCD_SRC, {x, y, width, height})
    this.#text.x = x + TEXT_OFFSET_X
    this.#text.y = y + TEXT_OFFSET_Y

    renderer.add(this.#background)
    renderer.add(this.#text.sprite)
  }

  get value() {
    return this.#text.text
  }

  set value(value) {
    this.#text.text = value
  }
}