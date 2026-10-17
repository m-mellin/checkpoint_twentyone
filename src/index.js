import { SpriteRenderer } from '2d-sprite-renderer'
import './style.css'
import { GameController } from './controller/GameController.js'
import { GameView } from './view/GameView.js'
import { DragController } from './controller/DragController.js'
import { SoundController } from './controller/SoundController.js'
import { ClickController } from './controller/ClickController.js'
import { DISCREPANCY_TEXTS } from './view/DiscrepancyView.js'
import { StartView } from './view/StartView.js'
import { EndView } from './view/EndView.js'

/**
 * The pixel font used for all text. It must be loaded before any text is measured.
 */
const PIXEL_FONT = '16px "Press Start 2P"'

/**
 * The size of the game, which fills the browser window.
 */
const GAME_WIDTH = window.innerWidth
const GAME_HEIGHT = window.innerHeight

/**
 * The longest time step one frame may take, so animations don't jump after the tab was hidden.
 */
const MAX_DELTA_TIME = 100

/**
 * How many mistakes the player can make before no more travellers are called.
 */
const MAX_MISTAKES = 3

/**
 * The volume every sound starts at, from 0 to 1.
 */
const START_VOLUME = 0.4

/**
 * The reason on a citation when the player denied a genuine passport.
 */
const DENIED_VALID_PASSPORT = 'DENIED A VALID PASSPORT'

/**
 * How long after the next traveller is called the voice lines are played, in milliseconds.
 */
const NEXT_SOUND_DELAY = 1000
const DOCUMENT_SOUND_DELAY = 2100

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

await document.fonts.load(PIXEL_FONT)

const canvas = document.createElement('canvas')
canvas.width = GAME_WIDTH
canvas.height = GAME_HEIGHT
document.body.appendChild(canvas)

const renderer = new SpriteRenderer(canvas)
const gameController = new GameController()
const soundController = createSounds()

/**
 * The game screen, or null while the start screen is shown.
 *
 * @type {GameView | null}
 */
let gameView = null

/**
 * The screen whose buttons can be clicked right now: the start screen, the game or the end screen.
 *
 * @type {StartView | GameView | EndView}
 */
let currentScreen = new StartView(renderer, {
  gameWidth: GAME_WIDTH,
  gameHeight: GAME_HEIGHT,
  /**
   * Starts the game at the difficulty the player chose.
   *
   * @param {'easy' | 'medium' | 'hard'} difficulty - The chosen difficulty.
   */
  onStart: (difficulty) => {
    startGame(difficulty)
  }
})

new ClickController(canvas, () => {
  return currentScreen.buttons
})

/**
 * Stops the game and shows the end screen, where the player can start a new game.
 */
function gameOver() {
  renderer.clear()
  soundController.stopAllSounds()
  gameView = null

  currentScreen = new EndView(renderer, {
    gameWidth: GAME_WIDTH,
    gameHeight: GAME_HEIGHT,
    /**
     * Starts a new game at the difficulty the player chose.
     *
     * @param {'easy' | 'medium' | 'hard'} difficulty - The chosen difficulty.
     */
    onRestart: (difficulty) => {
      startGame(difficulty)
    }
  })
}

/**
 * Creates every sound and sets its start volume.
 *
 * @returns {SoundController} The controller holding the sounds.
 */
function createSounds() {
  const sounds = new SoundController()

  sounds.createSound(SOUNDS.AMBIENT_TALKING, '/assets/ambient_talking.wav')
  sounds.createSound(SOUNDS.AMBIENT_MUSIC, '/assets/ambient.wav')
  sounds.createSound(SOUNDS.DOCUMENT, '/assets/dokument_tack.wav')
  sounds.createSound(SOUNDS.STAMP, '/assets/stamp.mp3')
  sounds.createSound(SOUNDS.NEXT, '/assets/next_tack.wav')

  for (const name of Object.values(SOUNDS)) {
    sounds.setVolume(name, START_VOLUME)
  }

  return sounds
}

/**
 * Removes the start screen and starts a game at the chosen difficulty.
 *
 * @param {'easy' | 'medium' | 'hard'} difficulty - The chosen difficulty.
 */
function startGame(difficulty) {
  renderer.clear()
  gameController.startGame(difficulty)
  
  const view = new GameView(renderer, {
    gameWidth: GAME_WIDTH,
    gameHeight: GAME_HEIGHT,
    difficulty: gameController.difficulty,
    volumeSettings: [
      {
        label: 'Ambient volume',
        /**
         * Sets the volume of the background sounds.
         *
         * @param {number} value - The new volume, from 0 to 1.
         */
        onChange: (value) => {
          soundController.setVolume(SOUNDS.AMBIENT_TALKING, value)
          soundController.setVolume(SOUNDS.AMBIENT_MUSIC, value)
        }

      },
      {
        label: 'Voice volume',
        /**
         * Sets the volume of player's voice.
         *
         * @param {number} value - The new volume, from 0 to 1.
         */
        onChange: (value) => {
          soundController.setVolume(SOUNDS.DOCUMENT, value)
          soundController.setVolume(SOUNDS.NEXT, value)
        }
      }
    ]
  })

  new DragController(
    canvas,
    [
      view.passport,
      view.discrepancyList,
      ...view.stamps,
      ...view.citations,
      ...view.volumeSliders
    ],
    (dropped) => {
      view.dropped(dropped)
    }
  )


  view.gameDate = gameController.gameDate
  
  /**
   * Plays the stamp sound when a stamp lands on the passport.
   */
  view.onStamp = () => {
    soundController.play(SOUNDS.STAMP)
  }

  /**
   * Judges the decision when a stamped passport is handed back.
   *
   * @param {boolean} approved - True if the player approved the passport.
   */
  view.onPassportReturned = (approved) => {
    judgeDecision(approved)
  }

  gameView = view
  currentScreen = view

  startAmbientSounds()
  callNextTraveller()
}

/**
 * Judges the player's decision, gives a citation for a mistake,
 * and calls the next traveller unless the player has made too many mistakes.
 *
 * @param {boolean} approved - True if the player approved the passport.
 */
function judgeDecision(approved) {
  const { isCorrect, discrepancy } = gameController.judge(approved)

  if (!isCorrect) {
    const reason = discrepancy ? DISCREPANCY_TEXTS[discrepancy.code] : DENIED_VALID_PASSPORT
    gameView?.addCitation(reason)
  }

  if (gameController.incorrectDecisions < MAX_MISTAKES) {
    setTimeout(() => {
     soundController.play(SOUNDS.NEXT)
    }, NEXT_SOUND_DELAY)
    callNextTraveller()
  } else {
    gameOver()
  }
}

/**
 * Starts the background sounds and lets them loop.
 */
function startAmbientSounds() {
  for (const name of [SOUNDS.AMBIENT_TALKING, SOUNDS.AMBIENT_MUSIC]) {
    soundController.loop(name)
    soundController.play(name)
  }
}

/**
 * Calls the next traveller to the window, or lets the last one leave when the queue is empty.
 */
function callNextTraveller() {
  if (gameView === null) return

  const traveller = gameController.callNextTraveller()

  if (traveller === null) {
    gameView.travellerLeaves()
    return
  }

  gameView.showTraveller(traveller)
  setTimeout(() => {
    soundController.play(SOUNDS.DOCUMENT)
  }, DOCUMENT_SOUND_DELAY)
}

/**
 * The time of the previous frame, or null before the first frame.
 *
 * @type {number | null}
 */
let previousTimestamp = null

/**
 * Runs once per frame: moves the animations forward and draws everything.
 *
 * @param {number} timestamp - The current frame time, provided by requestAnimationFrame.
 */
function gameLoop(timestamp) {
  const deltaTime = previousTimestamp === null ? 0 : timestamp - previousTimestamp
  previousTimestamp = timestamp

  gameView?.update(Math.min(deltaTime, MAX_DELTA_TIME))
  renderer.render()

  requestAnimationFrame(gameLoop)
}

requestAnimationFrame(gameLoop)
