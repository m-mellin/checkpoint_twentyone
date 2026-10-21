import { SpriteRenderer } from '2d-sprite-renderer'
import { InspectableItemView } from './InspectableItemView.js'
import { TextLine } from './TextLine.js'

/**
 * The citation's images, closed on the counter and open on the inspection desk.
 */
const OPEN_SRC = 'assets/citation_open.png'
const CLOSED_SRC = 'assets/citation_closed.png'

/**
 * How much smaller than the image files the citation is drawn.
 */
const DOCUMENT_SCALE = 0.3

/**
 * The size of the open and the closed citation, in pixels.
 */
const OPEN_WIDTH = 2098 * DOCUMENT_SCALE
const OPEN_HEIGHT = 316 * DOCUMENT_SCALE
const CLOSED_WIDTH = 644 * DOCUMENT_SCALE
const CLOSED_HEIGHT = 157 * DOCUMENT_SCALE

/**
 * Where a new citation lies on the counter when it appears, in pixels.
 */
const START_X = 300
const START_Y = 700

/**
 * The colour of the title and the discrepancy text
 */
const TITLE_COLOR = '#A31800'
const TEXT_COLOR = '#1A0400'

/**
 * The heading above the possible discrepancies on the open list.
 */
const TITLE_TEXT = 'CITATION'

/**
 * The font of the title and the text.
 */
const TITLE_FONT = '16px "Press Start 2P"'
const TEXT_FONT = '14px "Press Start 2P"'

/**
 * Where the title and the reason are printed, measured from the citation's top left corner, in pixels.
 */
const TITLE_OFFSET_X = 40
const TITLE_OFFSET_Y = 30
const REASON_OFFSET_X = 40
const REASON_OFFSET_Y = 50

/**
 * A citation the player gets for a wrong decision, showing what they missed.
 * Hidden until printed, closed on the counter and open with its reason on the inspection desk.
 */
export class CitationView extends InspectableItemView {
  /**
   * The heading on the open citation.
   *
   * @type {TextLine}
   */
  #title = new TextLine(TITLE_TEXT, { color: TITLE_COLOR, font: TITLE_FONT })

  /**
   * The line that tells why the citation was given.
   *
   * @type {TextLine}
   */
  #reasonLine = new TextLine('', { color: TEXT_COLOR, font: TEXT_FONT })

  /**
   * Why the citation was given, or an empty string if it has not been printed.
   *
   * @type {string}
   */
  #reason = ''

  /**
   * Creates an unused citation and adds it to the renderer. It stays hidden until it is printed.
   *
   * @param {SpriteRenderer} renderer - The renderer to draw with.
   */
  constructor(renderer) {
    super(renderer, {
      counter: { src: CLOSED_SRC, width: CLOSED_WIDTH, height: CLOSED_HEIGHT },
      inspectionDesk: { src: OPEN_SRC, width: OPEN_WIDTH, height: OPEN_HEIGHT },
      x: START_X,
      y: START_Y
    })

    renderer.add(this.#title.sprite)
    renderer.add(this.#reasonLine.sprite)

    this.hide()
  }

  /**
   * Returns whether the citation has been printed.
   *
   * @returns {boolean} True if it has a reason and is shown.
   */
  get isInUse() {
    return this.#reason !== ''
  }

  /**
   * Prints the citation onto the counter with the reason it was given.
   *
   * @param {string} reason - What the player missed, for example "WRONG ISSUING CITY".
   */
  print(reason) {
    this.#reason = reason
    this.moveTo(START_X, START_Y)
    this.show()
  }

  /**
   * Hides the citation and makes it unused again, for example when a new day starts.
   */
  hide() {
    this.#reason = ''
    super.hide()
  }

  /**
   * Places the title and the reason on the citation.
   *
   * @protected
   */
  placeContent() {
    this.#title.x = this.x + TITLE_OFFSET_X
    this.#title.y = this.y + TITLE_OFFSET_Y
    this.#reasonLine.x = this.x + REASON_OFFSET_X
    this.#reasonLine.y = this.y + REASON_OFFSET_Y
  }

  /**
   * Shows the title and the reason on the inspection desk, and hides them on the counter.
   *
   * @protected
   */
  updateContent() {
    const isOpen = this.isOnInspectionDesk

    this.#title.text = isOpen ? TITLE_TEXT : ''
    this.#reasonLine.text = isOpen ? this.#reason : ''
  }
}
