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
 * The space between two difficulty buttons, in pixels.
 */
const BUTTON_DISTANCE = 90

/**
 * The end screen, shown when the game is over. The player chooses a difficulty to play again.
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
   * @param {object} options - The size of the game and what happens when a difficulty is chosen.
   * @param {number} options.gameWidth - The width of the canvas.
   * @param {number} options.gameHeight - The height of the canvas.
   * @param {object} options.stats - How the game went.
   * @param {number} options.stats.days - How many days the player played.
   * @param {number} options.stats.correct - How many passports the player judged right.
   * @param {number} options.stats.incorrect - How many passports the player judged wrong.
   * @param {(difficulty: 'easy' | 'medium' | 'hard') => void} options.onRestart - Called with the chosen difficulty.
   */
  constructor(renderer, { gameWidth, gameHeight, stats, onRestart }) {
    renderer.add(new BlockSprite(gameWidth, gameHeight, { color: BACKGROUND_COLOR }))

    const image = new Sprite(IMAGE_SRC, { width: IMAGE_WIDTH, height: IMAGE_HEIGHT })
    image.x = (gameWidth - image.width) / 2
    image.y = 0
    renderer.add(image)
    
    const texts = [
      `DAYS PLAYED: ${stats.days}`,
      `CORRECT PASSPORTS: ${stats.correct}`,
      `INCORRECT STAMPED PASSPORTS: ${stats.incorrect}`
    ]

    for (const [index, text] of texts.entries()) {
      const line = new TextLine(text, { color: '#fff', font: '16px "Press Start 2P"'})
      line.x = (gameWidth - line.width) / 2
      line.y = index * 20
      renderer.add(line.sprite)
    }

    this.#buttons = Object.values(Difficulties).map(
      (difficulty, index) =>
        new TextButton(renderer, {
          text: difficulty.toUpperCase(),
          centerX: gameWidth / 2,
          y: gameHeight / 1.4 + index * BUTTON_DISTANCE,
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
}