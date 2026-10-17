import { BlockSprite, SpriteRenderer } from '2d-sprite-renderer'
import { TextLine } from './TextLine.js'
import { TextButton } from './TextButton.js'
import { Difficulties } from '../controller/GameController.js'

/**
 * The colour of the background that covers the whole screen.
 */
const BACKGROUND_COLOR = '#111'
/**
 * The game's title and how it is written.
 */
const TITLE_TEXT = 'CHECKPOINT TWENTYONE'
const TITLE_FONT = '32px "Press Start 2P"'
const TITLE_COLOR = '#fff'

/**
 * The space between two difficulty buttons, in pixels.
 */
const BUTTON_DISTANCE = 90 

/**
 * The start screen, where the player chooses a difficulty to begin the game.
 */
export class StartView {
  /**
   * One button per difficulty, from top to bottom.
   *
   * @type {TextButton[]}
   */
  #buttons

  /**
   * Creates the start screen and adds it to the renderer.
   *
   * @param {SpriteRenderer} renderer - The renderer to draw with.
   * @param {object} options - The size of the game and what happens when a difficulty is chosen.
   * @param {number} options.gameWidth - The width of the canvas.
   * @param {number} options.gameHeight - The height of the canvas.
   * @param {(difficulty: 'easy' | 'medium' | 'hard') => void} options.onStart - Called with the chosen difficulty.
   */
  constructor(renderer, { gameWidth, gameHeight, onStart }) {
    renderer.add(new BlockSprite(gameWidth, gameHeight, { color: BACKGROUND_COLOR }))

    const title = new TextLine(TITLE_TEXT, { color: TITLE_COLOR, font: TITLE_FONT })
    title.x = (gameWidth - title.width) / 2
    title.y = gameHeight / 4
    renderer.add(title.sprite)

    this.#buttons = Object.values(Difficulties).map(
      (difficulty, index) =>
        new TextButton(renderer, {
          text: difficulty.toUpperCase(),
          centerX: gameWidth / 2,
          y: gameHeight / 2 + index * BUTTON_DISTANCE,
          /**
           * Starts the game at this button's difficulty.
           */
          onClick: () => {
            onStart(difficulty)
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