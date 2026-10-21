import { SpriteRenderer } from '2d-sprite-renderer'
import { Traveller } from '../model/Traveller.js'
import { TravellerView } from './TravellerView.js'
import { DeskView } from './DeskView.js'
import { Passport } from '../model/Passport.js'
import { PassportView } from './PassportView.js'
import { StampView } from './StampView.js'
import { SoundView } from './SoundView.js'
import { Button } from './Button.js'
import { DiscrepancyView } from './DiscrepancyView.js'
import { LcdDisplayView } from './LcdDisplayView.js'
import { formatDate } from './formatDate.js'
import { SliderView } from './SliderView.js'
import { InspectableItemView } from './InspectableItemView.js'
import { CitationView } from './CitationView.js'
import { NextDayView } from './NextDayView.js'

/**
 * The position of the approve and deny stamps.
 */
const APPROVE_STAMP_X_POS = 1400
const APPROVE_STAMP_Y_POS = 500
const DENY_STAMP_X_POS = 1500
const DENY_STAMP_Y_POS = 500

/**
 * The size of the settings button.
 */
const BUTTON_SETTING_SIZE = 60

/**
 * The x coordinate of the height display.
 */
const HEIGHT_DISPLAY_X = 1100

/**
 * The y coordinate of the lcd displays.
 */
const DISPLAY_Y = 1040

/**
 * The whole game screen. Creates every view in the order they are drawn,
 * and is the only view the rest of the game talks to.
 */
export class GameView {
  /**
   * The booth with the traveller walking up to the window.
   *
   * @type {TravellerView}
   */
  #travellerView

  /**
   * The passport on the desk.
   *
   * @type {PassportView}
   */
  #passportView

  /**
   * The list of discrepancies a passport can have.
   *
   * @type {DiscrepancyView}
   */
  #discrepancyView

  /**
   * The display showing the traveller's real height.
   *
   * @type {LcdDisplayView}
   */
  #heightDisplay

  /**
   * The display showing today's date in the game.
   *
   * @type {LcdDisplayView}
   */
  #dateDisplay

  /**
   * The sound settings, drawn on top of everything else.
   *
   * @type {SoundView}
   */
  #soundView

  /**
   * The citation slips. Hidden until a mistake prints one.
   *
   * @type {CitationView[]}
   */
  #citations = []

  /**
   * The stamp that approves the passport.
   *
   * @type {StampView}
   */
  #approveStamp

  /**
   * The stamp that denies the passport.
   *
   * @type {StampView}
   */
  #denyStamp

  /**
   * The button that opens and closes the sound settings.
   *
   * @type {Button}
   */
  #settingsButton

  /**
   * The screen shown between two days, drawn on top of everything else.
   *
   * @type {NextDayView}
   */
  #nextDayView

  /**
   * The passport to show when the traveller reaches the window, or null if there is none.
   *
   * @type {Passport | null}
   */
  #waitingPassport = null

  /**
   * Called when a stamp lands on the open passport.
   *
   * @type {() => void}
   */
  #onStamp = () => {}

  /**
   * Called when the traveller has reached the window and their passport is put on the counter.
   *
   * @type {() => void}
   */
  #onPassportShown = () => {}

  /**
   * Called when a stamped passport is handed back to the traveller, with true if it was approved.
   *
   * @type {(approved: boolean) => void}
   */
  #onPassportReturned = () => {}

  /**
   * Creates every view. The order is the drawing order: later views are drawn on top, so the items
   * lie on the desk, and the sound settings and their button cover everything else.
   *
   * @param {SpriteRenderer} renderer - The renderer to draw with.
   * @param {object} options - The size of the game, its difficulty and the volume settings.
   * @param {number} options.gameWidth - The width of the canvas.
   * @param {number} options.gameHeight - The height of the canvas.
   * @param {'easy' | 'medium' | 'hard'} options.difficulty - Decides which discrepancies are listed.
   * @param {number} options.maxCitations - The maximum number of citations to create.
   * @param {import('./SoundView.js').VolumeSetting[]} options.volumeSettings - One slider per setting.
   */
  constructor(
    renderer,
    { gameWidth, gameHeight, difficulty, maxCitations, volumeSettings }
  ) {
    this.#travellerView = new TravellerView(renderer)
    new DeskView(renderer)
    this.#passportView = new PassportView(renderer)
    this.#discrepancyView = new DiscrepancyView(renderer, difficulty)

    this.#approveStamp = new StampView(renderer, {
      counterSrc: 'assets/approve_stamp.png',
      inspectionDeskSrc: 'assets/approve_stamp.png',
      x: APPROVE_STAMP_X_POS,
      y: APPROVE_STAMP_Y_POS,
      approves: true
    })

    this.#denyStamp = new StampView(renderer, {
      counterSrc: 'assets/deny_stamp.png',
      inspectionDeskSrc: 'assets/deny_stamp.png',
      x: DENY_STAMP_X_POS,
      y: DENY_STAMP_Y_POS,
      approves: false
    })

    this.#citations = this.#createCitations(renderer, maxCitations)

    this.#dateDisplay = new LcdDisplayView(renderer, { y: DISPLAY_Y })
    this.#heightDisplay = new LcdDisplayView(renderer, { x: HEIGHT_DISPLAY_X, y: DISPLAY_Y })

    this.#soundView = new SoundView(renderer, {
      gameWidth,
      gameHeight,
      volumeSettings
    })

    this.#settingsButton = this.#createSettingsButton(renderer)

    this.#nextDayView = new NextDayView(renderer, { gameWidth, gameHeight })
  }

  /**
   * Sets the current game date to the passport view. It is shown on the stamp.
   *
   * @param {Date} date - The current game date.
   */
  set gameDate(date) {
    this.#dateDisplay.value = formatDate(date)
    this.#passportView.gameDate = date
  }

  /**
   * Sets what happens when a stamped passport is handed back to the traveller.
   *
   * @param {(approved: boolean) => void} callback - Called with true if the passport was approved.
   */
  set onPassportReturned(callback) {
    this.#onPassportReturned = callback
  }

  /**
   * Sets what happens when a stamp lands on the open passport.
   *
   * @param {() => void} callback - Called each time a stamp lands on the passport.
   */
  set onStamp(callback) {
    this.#onStamp = callback
  }

  /**
   * Sets what happens when the traveller reaches the window and their passport is put on the counter.
   *
   * @param {() => void} callback - Called once for each traveller.
   */
  set onPassportShown(callback) {
    this.#onPassportShown = callback
  }

  /**
   * Returns the passport view, for example to let the player drag it.
   *
   * @returns {PassportView} The passport view.
   */
  get passport() {
    return this.#passportView
  }

  /**
   * Returns the discrepancy list, for example to let the player drag it.
   *
   * @returns {DiscrepancyView} The discrepancy list.
   */
  get discrepancyList() {
    return this.#discrepancyView
  }

  /**
   * Returns the stamps on the desk, for example to let the player drag them.
   *
   * @returns {StampView[]} The approve stamp and the deny stamp.
   */
  get stamps() {
    return [this.#approveStamp, this.#denyStamp]
  }

  /**
   * Returns the sliders in the sound settings, for example to let the player drag them.
   *
   * @returns {SliderView[]} One slider per volume setting.
   */
  get volumeSliders() {
    return this.#soundView.volumeSliders
  }

  /**
   * Returns whether the day screen is shown. The player can't use the booth meanwhile.
   *
   * @returns {boolean} True while the day screen is shown.
   */
  get isShowingDay() {
    return this.#nextDayView.isPlaying
  }

  /**
   * Returns everything the player can drag right now, in the order they are drawn.
   * Nothing can be dragged while the day screen is shown.
   *
   * @returns {import('../controller/DragController.js').Draggable[]} The items and the volume sliders.
   */
  get draggables() {
    if (this.isShowingDay) return []

    return [
      this.#passportView,
      this.#discrepancyView,
      ...this.stamps,
      ...this.#citations,
      ...this.volumeSliders
    ]
  }

  /**
   * Returns the buttons the player can click right now. None while the day screen is shown.
   *
   * @returns {Button[]} The buttons.
   */
  get buttons() {
    if (this.isShowingDay) return []

    return [this.#settingsButton]
  }

  /**
   * Returns the citations, for example to let the player drag them.
   *
   * @returns {CitationView[]} Every citation slip.
   */
  get citations() {
    return this.#citations
  }

  /**
   * Lets a traveller walk up to the window, and shows their real height on the display.
   * Their passport is shown when they arrive. Takes the previous traveller's passport away first.
   *
   * @param {Traveller} traveller - The traveller to show.
   */
  showTraveller(traveller) {
    this.#passportView.hide()
    this.#travellerView.show(traveller)
    this.#heightDisplay.value = `${traveller.person.heightInCm} cm`
    this.#waitingPassport = traveller.passport
  }

  /**
   * Lets the current traveller leave without anyone new coming in, and takes their passport off the desk.
   */
  travellerLeaves() {
    this.#passportView.hide()
    this.#waitingPassport = null
    this.#travellerView.leave()
  }

  /**
   * Starts a day: the traveller leaves and the day screen is shown. While it covers the game,
   * the citations are removed, the items go back to where they started, and the date is shown.
   *
   * @param {number} day - The number of the day, starting at 1.
   * @param {Date} date - The game date of the day.
   * @param {() => void} onFinished - Called when the screen has faded out and the day can begin.
   * @param {boolean} [startCovered=false] - True to skip the fade in, for example when the game starts.
   */
  startNextDay(day, date, onFinished, startCovered = false) {
    this.travellerLeaves()

    this.#nextDayView.play(day, date, {
      /**
       * Clears the desk for the day while nobody can see it.
       */
      onCovered: () => {
        this.#clearDesk()
        this.gameDate = date
      },
      onFinished,
      startCovered
    })
  }

  /**
   * Moves the animations forward, and shows the waiting passport once the traveller has reached the window.
   *
   * @param {number} deltaTime - Milliseconds since the last frame.
   */
  update(deltaTime) {
    this.#nextDayView.update(deltaTime)
    this.#travellerView.update(deltaTime)

    for (const item of this.#items()) {
      item.update(deltaTime)
    }

    if (this.#waitingPassport !== null && this.#travellerView.isAtWindow) {
      this.#passportView.showPassport(this.#waitingPassport)
      this.#waitingPassport = null
      this.#onPassportShown()
    }
  }

  /**
   * Handles something the player released. A stamp dropped on the open passport stamps it, and a
   * stamped passport dropped in the booth is handed back. Any other item released on the counter
   * falls down onto it.
   *
   * @param {import('../controller/DragController.js').Draggable} dropped - The thing the player released.
   */
  dropped(dropped) {
    const item = this.#items().find((i) => i === dropped)

    if (!item) return

    if (this.#tryToStamp(item) || this.#tryToHandBack(item)) {
      return
    }

    if (item.isOnCounter) {
      item.fall()
    }
  }

  /**
   * Prints a citation for a mistake on the next unused slip. Does nothing if every slip is used.
   *
   * @param {string} reason - What the player missed, for example "WRONG ISSUING CITY".
   */
  addCitation(reason) {
    const citationSlip = this.#citations.find((citation) => !citation.isInUse)

    citationSlip?.print(reason)
  }

  /**
   * Creates the citation slips. They stay hidden until a mistake prints one.
   *
   * @param {SpriteRenderer} renderer - The renderer to draw with.
   * @param {number} amount - How many slips to create.
   * @returns {CitationView[]} The citation slips.
   */
  #createCitations(renderer, amount) {
    return Array.from({ length: amount }, () => new CitationView(renderer))
  }

  /**
   * Creates the button that opens and closes the sound settings.
   *
   * @param {SpriteRenderer} renderer - The renderer to draw with.
   * @returns {Button} The settings button.
   */
  #createSettingsButton(renderer) {
    return new Button(renderer, {
      src: 'assets/settings_button.png',
      width: BUTTON_SETTING_SIZE,
      height: BUTTON_SETTING_SIZE,
      /**
       * Opens the sound settings if they are closed, and closes them if they are open.
       */
      onClick: () => {
        this.#soundView.toggle()
      }
    })
  }

  /**
   * Stamps the passport if the item is a stamp released on the open passport.
   *
   * @param {InspectableItemView} item - The released item.
   * @returns {boolean} True if the passport was stamped.
   */
  #tryToStamp(item) {
    const stamp = this.stamps.find((s) => s === item)

    if (!stamp) return false

    const centerX = stamp.x + stamp.width / 2
    const centerY = stamp.y + stamp.height / 2
    const stamped = this.#passportView.stampAt(centerX, centerY, stamp.approves)

    if (stamped) {
      this.#onStamp()
    }

    return stamped
  }

  /**
   * Hands the passport back if it is stamped, released in the booth, and the traveller is at the window.
   *
   * @param {InspectableItemView} item - The released item.
   * @returns {boolean} True if the passport was handed back.
   */
  #tryToHandBack(item) {
    const canHandBack =
      item === this.#passportView &&
      this.#passportView.isOnCounter &&
      this.#passportView.isStamped &&
      this.#travellerView.isAtWindow

    if (!canHandBack) return false

    const approved = this.#passportView.isApproved

    this.#passportView.hide()
    this.#onPassportReturned(approved)

    return true
  }

  /**
   * Returns every item the player can move between the counter and the inspection desk.
   *
   * @returns {InspectableItemView[]} The passport, the discrepancy list and the stamps.
   */
  #items() {
    return [this.#passportView, this.#discrepancyView, ...this.stamps, ...this.#citations]
  }

  /**
   * Removes every citation and moves the discrepancy list and the stamps back to where they started.
   */
  #clearDesk() {
    for (const citation of this.#citations) {
      citation.hide()
    }

    for (const item of [this.#discrepancyView, ...this.stamps]) {
      item.moveToStart()
    }
  }
}
