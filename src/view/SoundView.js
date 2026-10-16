import { BlockSprite, TextSprite } from '2d-sprite-renderer'
import { TextLine } from './TextLine.js'
import { SliderView } from './SliderView.js'

const WINDOW_WIDTH = 1920
const WINDOW_HEIGHT = 1080

const SLIDER_WIDTH = 400
const SLIDER_DISTANCE = 100

const TITLE_TEXT = 'SOUND SETTINGS'

export class SoundView {
  #background
  #title = new TextLine(TITLE_TEXT, {
    color: 'rgba(255, 255, 255, 1)',
    font: '18px "Press Start 2P"'
  })
  #gameWidth
  #gameHeight
  #volumeSliders
  #isVisible = false

  constructor(renderer, gameWidth, gameHeight, volumeSettings) {
    this.#gameWidth = gameWidth
    this.#gameHeight = gameHeight

    this.#background = new BlockSprite(gameWidth, gameHeight, {
      color: 'rgba(0, 0, 0, 0.9)'
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
