import { BlockSprite, SpriteRenderer } from '2d-sprite-renderer'
import { TextLine } from './TextLine.js'
import { SliderView } from './SliderView.js'

/**
 * The width of every slider and the space between two sliders, in pixels.
 */
const SLIDER_WIDTH = 400
const SLIDER_DISTANCE = 100

/**
 * The heading above the sliders.
 */
const TITLE_TEXT = 'SOUND SETTINGS'
const TITLE_FONT = '18px "Press Start 2P"'

/**
 * The color of the title
 */
const TEXT_COLOR = '#fff'

/**
 * The color of the background that covers the game.
 */
const BACKGROUND_COLOR = 'rgba(0, 0, 0, 0.9)'

/**
 * One volume slider in the sound settings.
 *
 * @typedef {object} VolumeSetting
 * @property {string} label - The text shown above the slider.
 * @property {(volume: number) => void} onChange - Called with the new volume, from 0 to 1.
 */

/**
 * The sound settings, shown on top of the game with one slider per volume setting.
 * Hidden until the player opens them.
 */
export class SoundView {
  /**
   * The dark background that covers the game while the settings are open.
   *
   * @type {BlockSprite}
   */
  #background

  /**
   * The heading above the sliders.
   *
   * @type {TextLine}
   */
  #title = new TextLine(TITLE_TEXT, { color: TEXT_COLOR, font: TITLE_FONT })

  /**
   * The width of the game, used to cover all of it.
   *
   * @type {number}
   */
  #gameWidth

  /**
   * The height of the game, used to cover all of it.
   *
   * @type {number}
   */
  #gameHeight

  /**
   * The volume sliders, from top to bottom.
   *
   * @type {SliderView[]}
   */
  #volumeSliders

  /**
   * Whether the settings are shown.
   *
   * @type {boolean}
   */
  #isVisible = false

  /**
   * Creates the settings with one slider per volume setting, and adds them to the renderer.
   * They start hidden.
   *
   * @param {SpriteRenderer} renderer - The renderer to draw with.
   * @param {object} options - The size of the game and the volume settings.
   * @param {number} options.gameWidth - The width of the game, used to centre the settings.
   * @param {number} options.gameHeight - The height of the game, used to centre the settings.
   * @param {VolumeSetting[]} options.volumeSettings - One slider per setting.
   */
  constructor(renderer, { gameWidth, gameHeight, volumeSettings }) {
    this.#gameWidth = gameWidth
    this.#gameHeight = gameHeight

    this.#background = new BlockSprite({
      width: gameWidth,
      height: gameHeight,
      color: BACKGROUND_COLOR
    })

    this.#title.x = (gameWidth - this.#title.width) / 2
    this.#title.y = gameHeight / 4

    renderer.add(this.#background)
    renderer.add(this.#title.sprite)

    this.#volumeSliders = volumeSettings.map(
      (setting, index) =>
        new SliderView(renderer, {
          label: setting.label,
          x: (gameWidth - SLIDER_WIDTH) / 2,
          y: gameHeight / 2 + index * SLIDER_DISTANCE,
          width: SLIDER_WIDTH,
          onChange: setting.onChange
        })
    )

    this.hide()
  }

  /**
   * Returns the volume sliders, for example to let the player drag them.
   *
   * @returns {SliderView[]} The sliders, from top to bottom.
   */
  get volumeSliders() {
    return this.#volumeSliders
  }

  /**
   * Shows the settings on top of the game.
   */
  show() {
    this.#isVisible = true
    this.#background.width = this.#gameWidth
    this.#background.height = this.#gameHeight
    this.#title.text = TITLE_TEXT

    for (const slider of this.#volumeSliders) {
      slider.show()
    }
  }

  /**
   * Hides the settings: the background, the title and every slider.
   */
  hide() {
    this.#isVisible = false
    this.#background.width = 0
    this.#background.height = 0
    this.#title.text = ''

    for (const slider of this.#volumeSliders) {
      slider.hide()
    }
  }

  /**
   * Shows the settings if they are hidden, and hides them if they are shown.
   */
  toggle() {
    if (this.#isVisible) {
      this.hide()
    } else {
      this.show()
    }
  }
}
