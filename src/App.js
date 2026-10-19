import { SpriteRenderer } from "2d-sprite-renderer"
import { SoundController } from "./controller/SoundController"
import { ClickController } from "./controller/ClickController"
import { DragController } from "./controller/DragController"

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
  #canvas

  #renderer

  #game

  #sounds

  #gameView

  #currentScreen

  #previousTimestamp = null

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
}