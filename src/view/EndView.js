import { BlockSprite, Sprite, SpriteRenderer } from '2d-sprite-renderer'
import { TextButton } from './TextButton.js'
import { Difficulties } from '../controller/GameController.js'
import { TextLine } from './TextLine.js'

/**
 * The colour of the background that covers the whole screen.
 */
const BACKGROUND_COLOR = '#03090c'

/**
 * The image on the end screen.
 */
const IMAGE_SRC = '/assets/game_over.png'

/**
 * The size of the end screen image, in pixels.
 */
const IMAGE_WIDTH = 1536
const IMAGE_HEIGHT = 1024

/**
 * How the statistics are written.
 */
const STATS_FONT = '20px "Press Start 2P"'
const STATS_COLOR = '#fff'

/**
 * The y coordinate of the first statistics line, just under "GAME OVER" in the image.
 */
const STATS_Y = 630

/**
 * The space between two statistics lines, in pixels.
 */
const LINE_DISTANCE = 36

/**
 * The see-through box behind the statistics, which makes them easier to read.
 */
const BOX_COLOR = 'rgba(0, 0, 0, 0.6)'
const BOX_WIDTH = 600
const BOX_PADDING = 16

/**
 * The y coordinate of the first difficulty button, and the space between two buttons, in pixels.
 */
const BUTTONS_Y = 820
const BUTTON_DISTANCE = 70

/**
 * How a game went.
 *
 * @typedef {object} GameStats
 * @property {number} days - How many days the player played.
 * @property {number} correct - How many passports the player judged right.
 * @property {number} incorrect - How many passports the player judged wrong.
 */

/**
 * The end screen, shown when the game is over. Shows how the game went,
 * and lets the player choose a difficulty to play again.
 */
export class EndView {
  /**
   * One button per difficulty, from top to bottom.
   *
   * @type {TextButton[]}
   */
  #buttons

  /**
   * Creates the end screen and adds it to the renderer.
   *
   * @param {SpriteRenderer} renderer - The renderer to draw with.
   * @param {object} options - The size of the game, how it went, and what happens when a difficulty is chosen.
   * @param {number} options.gameWidth - The width of the canvas.
   * @param {number} options.gameHeight - The height of the canvas.
   * @param {GameStats} options.stats - How the game went.
   * @param {(difficulty: 'easy' | 'medium' | 'hard') => void} options.onRestart - Called with the chosen difficulty.
   */
  constructor(renderer, { gameWidth, gameHeight, stats, onRestart }) {
    renderer.add(
      new BlockSprite(gameWidth, gameHeight, { color: BACKGROUND_COLOR })
    )

    const image = new Sprite(IMAGE_SRC, {
      width: IMAGE_WIDTH,
      height: IMAGE_HEIGHT
    })
    image.x = (gameWidth - image.width) / 2
    image.y = 0
    renderer.add(image)

    this.#addStats(renderer, gameWidth, stats)

    this.#buttons = Object.values(Difficulties).map(
      (difficulty, index) =>
        new TextButton(renderer, {
          text: difficulty.toUpperCase(),
          centerX: gameWidth / 2,
          y: BUTTONS_Y + index * BUTTON_DISTANCE,
          /**
           * Starts a new game at this button's difficulty.
           */
          onClick: () => {
            onRestart(difficulty)
          }
        })
    )
  }

  /**
   * Returns the difficulty buttons, so they can be clicked.
   *
   * @returns {TextButton[]} One button per difficulty.
   */
  get buttons() {
    return this.#buttons
  }

  /**
   * Writes the statistics, one centred line each, on a see-through box.
   *
   * @param {SpriteRenderer} renderer - The renderer to draw with.
   * @param {number} gameWidth - The width of the canvas.
   * @param {{days: number, correct: number, incorrect: number}} stats - How the game went.
   */
  #addStats(renderer, gameWidth, stats) {
    const texts = [
      `DAYS PLAYED: ${stats.days}`,
      `CORRECT PASSPORTS: ${stats.correct}`,
      `INCORRECT STAMPED PASSPORTS: ${stats.incorrect}`
    ]

    renderer.add(
      new BlockSprite(
        BOX_WIDTH,
        texts.length * LINE_DISTANCE + BOX_PADDING * 2,
        {
          x: (gameWidth - BOX_WIDTH) / 2,
          y: STATS_Y - BOX_PADDING,
          color: BOX_COLOR
        }
      )
    )

    for (const [index, text] of texts.entries()) {
      const line = new TextLine(text, { color: STATS_COLOR, font: STATS_FONT })
      line.x = (gameWidth - line.width) / 2
      line.y = STATS_Y + index * LINE_DISTANCE
      renderer.add(line.sprite)
    }
  }
}
