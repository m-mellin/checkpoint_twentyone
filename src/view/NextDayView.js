import { BlockSprite, SpriteRenderer, TextSprite} from '2d-sprite-renderer'
import { formatDate } from './formatDate.js'

/**
 * The colours of the screen and its text, as "red, green, blue". The opacity is added when drawn.
 */
const BACKGROUND_RGB = '3, 9, 12'
const TEXT_RGB = '255, 255, 255'

/**
 * The fonts of the day and the date.
 */
const TITLE_FONT = '48px "Press Start 2P"'
const DATE_FONT = '24px "Press Start 2P"'

/**
 * How far above and below the middle of the screen the day and the date are written, in pixels.
 */
const LINE_DISTANCE = 40

/**
 * How long the screen takes to fade in, stays, and takes to fade out, in milliseconds.
 */
const FADE_IN_TIME = 800
const SHOW_TIME = 4000
const FADE_OUT_TIME = 1000

/**
 * How long it takes for each letter of the day to appear, in milliseconds.
 */
const LETTER_TIME = 150

/**
 * The screen shown between two days. It fades in over the game, types the new day,
 * and fades out again so the new day can begin.
 */
export class NextDayView {
  /**
   * The dark block that covers the whole game.
   *
   * @type {BlockSprite}
   */
  #background

  /**
   * The line that shows the day, for example "DAY 2".
   *
   * @type {TextSprite}
   */
  #title = new TextSprite('', { font: TITLE_FONT })

  /**
   * The line that shows the new date.
   *
   * @type {TextSprite}
   */
  #dateLine = new TextSprite('', { font: DATE_FONT })

  /**
   * The whole day text, which is typed one letter at a time.
   *
   * @type {string}
   */
  #titleText = ''

  /**
   * The size of the game, used to centre the text.
   *
   * @type {{width: number, height: number}}
   */
  #gameSize

  /**
   * Milliseconds since the screen started to fade in.
   *
   * @type {number}
   */
  #elapsed = 0

  /**
   * Whether the screen is shown right now.
   *
   * @type {boolean}
   */
  #isPlaying = false

  /**
   * Whether onCovered has been called for this day.
   *
   * @type {boolean}
   */
  #hasCovered = false

  /**
   * Called once when the screen fully covers the game.
   *
   * @type {() => void}
   */
  #onCovered = () => {}

  /**
   * Called once when the screen has faded out.
   *
   * @type {() => void}
   */
  #onFinished = () => {}

  /**
   * Creates the screen and adds it to the renderer. It is invisible until play() is called.
   *
   * @param {SpriteRenderer} renderer - The renderer to draw with.
   * @param {object} options - The size of the game.
   * @param {number} options.gameWidth - The width of the canvas.
   * @param {number} options.gameHeight - The height of the canvas.
   */
  constructor(renderer, { gameWidth, gameHeight }) {
    this.#gameSize = { width: gameWidth, height: gameHeight }
    this.#background = new BlockSprite({
      width: gameWidth,
      height: gameHeight,
      color: `rgba(${BACKGROUND_RGB}, 0)`
    })

    renderer.add(this.#background)
    renderer.add(this.#title)
    renderer.add(this.#dateLine)
  }

  /**
   * Returns whether the screen is shown right now.
   *
   * @returns {boolean} True from when it starts to fade in until it has faded out.
   */
  get isPlaying() {
    return this.#isPlaying
  }

  /**
   * Fades in the screen with the new day and date, then fades it out again.
   * It fades in first, unless it should start by covering the game.
   *
   * @param {number} day - The number of the new day, starting at 1.
   * @param {Date} date - The new game date.
   * @param {object} options - What happens during the animation.
   * @param {() => void} options.onCovered - Called when the screen fully covers the game.
   * @param {() => void} options.onFinished - Called when the screen has faded out.
   * @param {boolean} [options.startCovered=false] - True to skip the fade in, for example when the game starts.
   */
  play(day, date, { onCovered, onFinished, startCovered = false }) {
    this.#titleText = `DAY ${day}`
    this.#centre(this.#title, this.#titleText, this.#gameSize.height / 2 - LINE_DISTANCE)
    this.#title.text = ''

    this.#centre(
      this.#dateLine,
      formatDate(date),
      this.#gameSize.height / 2 + LINE_DISTANCE
    )

    this.#onCovered = onCovered
    this.#onFinished = onFinished
    this.#elapsed = startCovered ? FADE_IN_TIME : 0
    this.#hasCovered = false
    this.#isPlaying = true

    this.#setOpacity(startCovered ? 1 : 0)
  }

  /**
   * Moves the animation forward: fades the screen, types the day,
   * and calls onCovered and onFinished at the right moments.
   *
   * @param {number} deltaTime - Milliseconds since the last frame.
   */
  update(deltaTime) {
    if (!this.#isPlaying) return

    this.#elapsed += deltaTime
    this.#setOpacity(this.#opacity())

    // The day is typed one letter at a time once the screen has faded in
    const letters = Math.floor((this.#elapsed - FADE_IN_TIME) / LETTER_TIME)
    this.#title.text = this.#titleText.slice(0, Math.max(0, letters))

    if (!this.#hasCovered && this.#elapsed >= FADE_IN_TIME) {
      this.#hasCovered = true
      this.#onCovered()
    }

    if (this.#elapsed >= FADE_IN_TIME + SHOW_TIME + FADE_OUT_TIME) {
      this.#isPlaying = false
      this.#title.text = ''
      this.#dateLine.text = ''
      this.#onFinished()
    }
  }

  /**
   * Returns how visible the screen is right now.
   *
   * @returns {number} The opacity, from 0 (invisible) to 1 (covers the game).
   */
  #opacity() {
    const fadeOutStart = FADE_IN_TIME + SHOW_TIME

    if (this.#elapsed < FADE_IN_TIME) {
      return this.#elapsed / FADE_IN_TIME
    }

    if (this.#elapsed < fadeOutStart) {
      return 1
    }

    return Math.max(0, 1 - (this.#elapsed - fadeOutStart) / FADE_OUT_TIME)
  }

  /**
   * Makes the screen and its text as visible as the opacity says.
   *
   * @param {number} opacity - From 0 (invisible) to 1 (covers the game).
   */
  #setOpacity(opacity) {
    this.#background.color = `rgba(${BACKGROUND_RGB}, ${opacity})`
    this.#title.color = `rgba(${TEXT_RGB}, ${opacity})`
    this.#dateLine.color = `rgba(${TEXT_RGB}, ${opacity})`
  }

  /**
   * Gives a line its text and centres it across the screen.
   *
   * @param {TextSprite} line - The line to place.
   * @param {string} text - The text to write.
   * @param {number} y - The y coordinate of the top of the line.
   */
  #centre(line, text, y) {
    line.text = text
    line.x = (this.#gameSize.width - line.width) / 2
    line.y = y
  }
}
