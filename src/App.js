import { SpriteRenderer } from "2d-sprite-renderer"
import { SoundController } from "./controller/SoundController"
import { ClickController } from "./controller/ClickController"
import { DragController } from "./controller/DragController"
import { GameController } from "./controller/GameController"
import { StartView } from "./view/StartView"
import { GameView } from "./view/GameView"
import { EndView } from "./view/EndView"
import { DISCREPANCY_TEXTS } from "./view/DiscrepancyView"

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
   * The soundController
   * 
   * @type {SoundController}
   */
  #soundController

  /**
   * Every sound in the game.
   *
   * @type {SoundController}
   */
  #sounds

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
   * Creates the application on a canvas and starts listening for clicks and drags.
   *
   * @param {HTMLCanvasElement} canvas - The canvas to draw the game on.
   */
  constructor(canvas) {
    this.#canvas = canvas
    this.#renderer = new SpriteRenderer(canvas)
    this.#sounds = this.#createSounds()

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
    this.#showStartScreen()

    requestAnimationFrame((timestamp) => {
      this.#runFrame(timestamp)
    })
  }

  /**
   * Shows the start screen, where the player chooses a difficulty.
   */
  #showStartScreen() {
    this.#currentScreen = new StartView(this.#renderer, {
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

  #startGame(difficulty) {
    this.#renderer.clear()
    this.#gameController.startGame(difficulty)

    const view = new GameView(this.#renderer, {
      gameWidth: this.#canvas.width,
      gameHeight: this.#canvas.height,
      difficulty: this.#gameController.difficulty,
      volumeSettings: this.#volumeSettings()
    })

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
      this.#sounds.play(SOUNDS.STAMP)
    }

    /**
     * Plays the voice asking for the passport when the traveller reaches the window.
     */
    view.onPassportShown = () => {
      this.#sounds.play(SOUNDS.DOCUMENT)
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
          this.#sounds.setVolume(SOUNDS.AMBIENT_TALKING, value)
          this.#sounds.setVolume(SOUNDS.AMBIENT_MUSIC, value)
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
          this.#sounds.setVolume(SOUNDS.DOCUMENT, value)
          this.#sounds.setVolume(SOUNDS.NEXT, value)
        }
      }
    ]
  }

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

  #callNextTraveller() {
    const view = this.#gameView

    if (view === null) return

    const traveller = this.#gameController.callNextTraveller()

    if (traveller === null) {
      this.#startNextDay(view)
      return
    }

    this.#sounds.play(SOUNDS.NEXT)
    view.showTraveller(traveller)
  }

  #startNextDay(view) {
    this.#gameController.startNextDay()

    view.startNextDay(this.#gameController.day, this.#gameController.gameDate, () => {
      this.#callNextTraveller()
    })
  }

  #gameOver() {
    this.#renderer.clear()
    this.#soundController.stopAllSounds()
    this.#gameView = null

    this.#currentScreen = new EndView(renderer, {
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

  #createSounds() {
    this.#soundController = new SoundController()

    this.#soundController.createSound(SOUNDS.AMBIENT_TALKING, 'assets/ambient_talking.wav')
    this.#soundController.createSound(SOUNDS.AMBIENT_MUSIC, 'assets/ambient.wav')
    this.#soundController.createSound(SOUNDS.DOCUMENT, 'assets/dokument_tack.wav')
    this.#soundController.createSound(SOUNDS.STAMP, 'assets/stamp.mp3')
    this.#soundController.createSound(SOUNDS.NEXT, 'assets/next_tack.wav')

    for (const name of Object.values(SOUNDS)) {
      this.#soundController.setVolume(name, START_VOLUME)
    }

    return this.#soundController
  }

  #startAmbientSounds() {
    for (const name of [SOUNDS.AMBIENT_TALKING, SOUNDS.AMBIENT_MUSIC]) {
      this.#sounds.loop(name)
      this.#sounds.play(name)
    }
  }

  #runFrame(timestamp) {
    const deltaTime = this.#previousTimestamp === null ? 0 : timestamp - this.#previousTimestamp
    this.#previousTimestamp = timestamp

    this.#gameView?.update(Math.min(deltaTime, MAX_DELTA_TIME))
    this.#renderer.render()

    requestAnimationFrame((nextTimestamp) => {
      this.#runFrame(nextTimestamp)
    })
  }
}