import { SpriteRenderer } from '2d-sprite-renderer'
import { SoundController } from './controller/SoundController.js'
import { ClickController } from './controller/ClickController.js'
import { DragController } from './controller/DragController.js'
import { GameController } from './controller/GameController.js'
import { StartView } from './view/StartView.js'
import { GameView } from './view/GameView.js'
import { EndView } from './view/EndView.js'
import { DISCREPANCY_TEXTS } from './view/DiscrepancyView.js'

/**
 * The longest time step one frame may take, so animations don't jump after the tab was hidden.
 */
const MAX_DELTA_TIME = 100

/**
 * How many citations the player can get in one day before the game is over.
 */
const MAX_CITATIONS_PER_DAY = 3

/**
 * The volume every sound starts at, from 0 to 1.
 */
const START_VOLUME = 0.4

/**
 * The reason on a citation when the player denied a genuine passport.
 */
const DENIED_VALID_PASSPORT = 'DENIED A VALID PASSPORT'

/**
 * The names of the game's sounds.
 *
 * @readonly
 * @enum {string}
 */
const SOUNDS = Object.freeze({
  AMBIENT_TALKING: 'Ambient_Talking',
  AMBIENT_MUSIC: 'Ambient_Music',
  DOCUMENT: 'Document',
  STAMP: 'Stamp',
  NEXT: 'Next'
})

/**
 * The whole application. Shows the start screen, runs the game day by day, and shows the end screen.
 */
export class App {
  /**
   * The canvas the game is drawn on.
   *
   * @type {HTMLCanvasElement}
   */
  #canvas

  /**
   * Draws every screen on the canvas.
   *
   * @type {SpriteRenderer}
   */
  #renderer

  /**
   * The rules of the game: the travellers, the days and the player's decisions.
   *
   * @type {GameController}
   */
  #gameController = new GameController()

  /**
   * Every sound in the game.
   *
   * @type {SoundController}
   */
  #soundController

  /**
   * The game screen, or null while the start or end screen is shown.
   *
   * @type {GameView | null}
   */
  #gameView = null

  /**
   * The screen whose buttons can be clicked right now.
   *
   * @type {StartView | GameView | EndView}
   */
  #currentScreen

  /**
   * The time of the previous frame, or null before the first frame.
   *
   * @type {number | null}
   */
  #previousTimestamp = null

  /**
   * Creates the application on a canvas with the start screen, and starts listening for clicks and drags.
   *
   * @param {HTMLCanvasElement} canvas - The canvas to draw the game on.
   */
  constructor(canvas) {
    this.#canvas = canvas
    this.#renderer = new SpriteRenderer(canvas)
    this.#soundController = this.#createSounds()
    this.#currentScreen = this.#createStartScreen()

    new ClickController(canvas, () => {
      return this.#currentScreen.buttons
    })

    new DragController(
      canvas,
      () => {
        return this.#gameView ? this.#gameView.draggables : []
      },
      (dropped) => {
        this.#gameView?.dropped(dropped)
      }
    )
  }

  /**
   * Shows the start screen and starts drawing.
   */
  start() {
    requestAnimationFrame((timestamp) => {
      this.#runFrame(timestamp)
    })
  }

  /**
   * Creates the start screen, where the player chooses a difficulty.
   *
   * @returns {StartView} The start screen.
   */
  #createStartScreen() {
    return new StartView(this.#renderer, {
      gameWidth: this.#canvas.width,
      gameHeight: this.#canvas.height,
      /**
       * Starts the game at the difficulty the player chose.
       *
       * @param {'easy' | 'medium' | 'hard'} difficulty - The chosen difficulty.
       */
      onStart: (difficulty) => {
        this.#startGame(difficulty)
      }
    })
  }

  /**
   * Removes the current screen and starts a game at the chosen difficulty, beginning with the day screen.
   *
   * @param {'easy' | 'medium' | 'hard'} difficulty - The chosen difficulty.
   */
  #startGame(difficulty) {
    this.#renderer.clear()
    this.#gameController.startGame(difficulty)

    const view = this.#createGameView()

    this.#gameView = view
    this.#currentScreen = view

    this.#startAmbientSounds()

    view.startNextDay(
      this.#gameController.day,
      this.#gameController.gameDate,
      () => {
        this.#callNextTraveller()
      },
      true
    )
  }

  /**
   * Creates the game screen and decides what happens when the player stamps or hands back a passport.
   *
   * @returns {GameView} The game screen.
   */
  #createGameView() {
    const view = new GameView(this.#renderer, {
      gameWidth: this.#canvas.width,
      gameHeight: this.#canvas.height,
      difficulty: this.#gameController.difficulty,
      volumeSettings: this.#volumeSettings()
    })

    view.gameDate = this.#gameController.gameDate

    /**
     * Plays the stamp sound when a stamp lands on the passport.
     */
    view.onStamp = () => {
      this.#soundController.play(SOUNDS.STAMP)
    }

    /**
     * Plays the voice asking for the passport when the traveller reaches the window.
     */
    view.onPassportShown = () => {
      this.#soundController.play(SOUNDS.DOCUMENT)
    }

    /**
     * Judges the decision when a stamped passport is handed back.
     *
     * @param {boolean} approved - True if the player approved the passport.
     */
    view.onPassportReturned = (approved) => {
      this.#judgeDecision(approved)
    }

    return view
  }

  /**
   * Returns the volume settings shown in the sound settings.
   *
   * @returns {import('./view/SoundView.js').VolumeSetting[]} One setting for the background and one for the voices.
   */
  #volumeSettings() {
    return [
      {
        label: 'Ambient volume',
        /**
         * Sets the volume of the background sounds.
         *
         * @param {number} value - The new volume, from 0 to 1.
         */
        onChange: (value) => {
          this.#soundController.setVolume(SOUNDS.AMBIENT_TALKING, value)
          this.#soundController.setVolume(SOUNDS.AMBIENT_MUSIC, value)
        }
      },
      {
        label: 'Voice volume',
        /**
         * Sets the volume of the voices.
         *
         * @param {number} value - The new volume, from 0 to 1.
         */
        onChange: (value) => {
          this.#soundController.setVolume(SOUNDS.DOCUMENT, value)
          this.#soundController.setVolume(SOUNDS.NEXT, value)
        }
      }
    ]
  }

  /**
   * Judges the player's decision and gives a citation for a mistake.
   * Calls the next traveller, or ends the game after too many citations in one day.
   *
   * @param {boolean} approved - True if the player approved the passport.
   */
  #judgeDecision(approved) {
    const { isCorrect, discrepancy } = this.#gameController.judge(approved)

    if (!isCorrect) {
      const reason = discrepancy
        ? DISCREPANCY_TEXTS[discrepancy.code]
        : DENIED_VALID_PASSPORT
      this.#gameView?.addCitation(reason)
    }

    if (this.#gameController.citations < MAX_CITATIONS_PER_DAY) {
      this.#callNextTraveller()
    } else {
      this.#gameOver()
    }
  }

  /**
   * Calls the next traveller to the window. When everyone in today's queue has been checked, a new day begins.
   */
  #callNextTraveller() {
    const view = this.#gameView

    if (view === null) return

    const traveller = this.#gameController.callNextTraveller()

    if (traveller === null) {
      this.#startNextDay(view)
      return
    }

    this.#soundController.play(SOUNDS.NEXT)
    view.showTraveller(traveller)
  }

  /**
   * Moves the game to the next day and shows the day screen. The next traveller is called when it has faded out.
   *
   * @param {GameView} view - The game screen to show the day screen on.
   */
  #startNextDay(view) {
    this.#gameController.startNextDay()

    view.startNextDay(
      this.#gameController.day,
      this.#gameController.gameDate,
      () => {
        this.#callNextTraveller()
      }
    )
  }

  /**
   * Stops the game and creates the EndView screen.
   */
  #gameOver() {
    this.#renderer.clear()
    this.#soundController.stopAllSounds()
    this.#gameView = null

    this.#currentScreen = this.#createEndView()
  }

  /**
   * Creates the end screen, where the player sees how the game went and can start a new game.
   *
   * @returns {EndView} The end screen.
   */
  #createEndView() {
    return new EndView(this.#renderer, {
      gameWidth: this.#canvas.width,
      gameHeight: this.#canvas.height,
      stats: {
        days: this.#gameController.day,
        correct: this.#gameController.correctDecisions,
        incorrect: this.#gameController.incorrectDecisions
      },
      /**
       * Starts a new game at the difficulty the player chose.
       *
       * @param {'easy' | 'medium' | 'hard'} difficulty - The chosen difficulty.
       */
      onRestart: (difficulty) => {
        this.#startGame(difficulty)
      }
    })
  }

  /**
   * Creates every sound and sets its start volume.
   *
   * @returns {SoundController} The controller holding the sounds.
   */
  #createSounds() {
    const sounds = new SoundController()

    sounds.createSound(SOUNDS.AMBIENT_TALKING, 'assets/ambient_talking.wav')
    sounds.createSound(SOUNDS.AMBIENT_MUSIC, 'assets/ambient.wav')
    sounds.createSound(SOUNDS.DOCUMENT, 'assets/dokument_tack.wav')
    sounds.createSound(SOUNDS.STAMP, 'assets/stamp.mp3')
    sounds.createSound(SOUNDS.NEXT, 'assets/next_tack.wav')

    for (const name of Object.values(SOUNDS)) {
      sounds.setVolume(name, START_VOLUME)
    }

    return sounds
  }

  /**
   * Starts the background sounds and lets them loop.
   */
  #startAmbientSounds() {
    for (const name of [SOUNDS.AMBIENT_TALKING, SOUNDS.AMBIENT_MUSIC]) {
      this.#soundController.loop(name)
      this.#soundController.play(name)
    }
  }

  /**
   * Runs once per frame: moves the animations forward, draws everything, and asks for the next frame.
   *
   * @param {number} timestamp - The current frame time.
   */
  #runFrame(timestamp) {
    const deltaTime =
      this.#previousTimestamp === null ? 0 : timestamp - this.#previousTimestamp
    this.#previousTimestamp = timestamp

    this.#gameView?.update(Math.min(deltaTime, MAX_DELTA_TIME))
    this.#renderer.render()

    requestAnimationFrame((nextTimestamp) => {
      this.#runFrame(nextTimestamp)
    })
  }
}
