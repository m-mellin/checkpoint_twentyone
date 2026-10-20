import { SpriteRenderer } from '2d-sprite-renderer'
import { TextLine } from './TextLine.js'
import { InspectableItemView } from './InspectableItemView.js'
import discrepanciesData from '../data/discrepancies.json'

/**
 * The discrepancy list's images, closed on the counter and open on the inspection desk.
 */
const OPEN_SRC = 'assets/discrepancy_open.png'
const CLOSED_SRC = 'assets/discrepancy_closed.png'

/**
 * How much smaller than the image files the discrepancy list is drawn.
 */
const DOCUMENT_SCALE = 0.5

/**
 * The size of the open and the closed discrepancy list, in pixels.
 */
const OPEN_WIDTH = 1047 * DOCUMENT_SCALE
const OPEN_HEIGHT = 1502 * DOCUMENT_SCALE
const CLOSED_WIDTH = (1047 / 2) * DOCUMENT_SCALE
const CLOSED_HEIGHT = (1502 / 2) * DOCUMENT_SCALE

/**
 * Where the discrepancy list lies on the counter when the game starts, in pixels.
 */
const START_X = 600
const START_Y = 700

/**
 * The colour of the title and the possible discrepancies.
 */
const TEXT_COLOR = '#fff'

/**
 * The heading above the possible discrepancies on the open list.
 */
const TITLE_TEXT = 'POSSIBLE DISCREPANCIES'

/**
 * The font of the title.
 */
const TITLE_FONT = '16px "Press Start 2P"'

/**
 * Where the title is printed, measured from the list's top left corner, in pixels.
 */
const TITLE_OFFSET_X = 60
const TITLE_OFFSET_Y = 200

/**
 * Where the first possible discrepancy is printed, measured from the list's top left corner, in pixels.
 */
const TEXT_OFFSET_X = 60
const TEXT_OFFSET_Y = 250

/**
 * The space between two possible discrepancies, in pixels.
 */
const TEXT_DISTANCE = 16

/**
 * The text shown on the discrepancy list for each discrepancy code.
 *
 * @type {Readonly<Record<string, string>>}
 */
export const DISCREPANCY_TEXTS = Object.freeze({
  SUSPICIOUS_FIRSTNAME: 'FOREIGN FIRST NAME',
  SUSPICIOUS_SURNAME: 'FOREIGN SURNAME',
  INCORRECT_SEX: 'WRONG SEX',
  INCORRECT_ISSUING_CITY: 'WRONG ISSUING CITY',
  INCORRECT_BIRTHPLACE: 'WRONG BIRTHPLACE',
  INCORRECT_ISSUE_DATE: 'INVALID ISSUE DATE',
  FIRSTNAME_MISMATCHES_SEX: 'NAME DOES NOT MATCH SEX',
  INCORRECT_EXPIRY_DATE: 'PASSPORT EXPIRED',
  INCORRECT_HEIGHT: 'WRONG HEIGHT',
  INCORRECT_CODE: 'WRONG COUNTRY CODE',
  FIRSTNAME_MISSPELLED: 'MISSPELLED FIRST NAME',
  SURNAME_MISSPELLED: 'MISSPELLED SURNAME'
})

/**
 * The discrepancy list, showing every discrepancy a passport can have at the current difficulty.
 * Closed on the counter, and open with every possible discrepancy on the inspection desk.
 */
export class DiscrepancyView extends InspectableItemView {
  /**
   * The heading above the possible discrepancies.
   *
   * @type {TextLine}
   */
  #title = new TextLine('', {
    color: TEXT_COLOR,
    font: TITLE_FONT
  })

  /**
   * One text line per possible discrepancy, in the order they are shown from top to bottom.
   *
   * @type {TextLine[]}
   */
  #fields = []

  /**
   * The text for each possible discrepancy, in the same order as the text lines.
   *
   * @type {string[]}
   */
  #texts = []

  /**
   * Creates the discrepancy list with every discrepancy that can occur at the difficulty,
   * and adds it to the renderer, closed on the counter.
   *
   * @param {SpriteRenderer} renderer - The renderer to draw with.
   * @param {'easy' | 'medium' | 'hard'} difficulty - Decides which discrepancies are listed.
   */
  constructor(renderer, difficulty) {
    super(renderer, {
      counter: { src: CLOSED_SRC, width: CLOSED_WIDTH, height: CLOSED_HEIGHT },
      inspectionDesk: { src: OPEN_SRC, width: OPEN_WIDTH, height: OPEN_HEIGHT },
      x: START_X,
      y: START_Y
    })

    renderer.add(this.#title.sprite)

    for (const code of discrepanciesData[difficulty]) {
      this.#texts.push(DISCREPANCY_TEXTS[code] ?? code)

      const field = new TextLine('', { color: TEXT_COLOR })
      this.#fields.push(field)
      renderer.add(field.sprite)
    }

    this.show()
  }

  /**
   * Places the title and the possible discrepancies on the list, stacked from top to bottom.
   *
   * @protected
   */
  placeContent() {
    this.#title.x = this.x + TITLE_OFFSET_X
    this.#title.y = this.y + TITLE_OFFSET_Y

    let y = this.y + TEXT_OFFSET_Y

    for (const field of this.#fields) {
      field.x = this.x + TEXT_OFFSET_X
      field.y = y
      y += field.height + TEXT_DISTANCE
    }
  }

  /**
   * Shows the title and the possible discrepancies on the inspection desk, and hides them
   * on the counter, where the list is too small for text.
   *
   * @protected
   */
  updateContent() {
    const isOpen = this.isOnInspectionDesk

    this.#title.text = isOpen ? TITLE_TEXT : ''

    this.#fields.forEach((field, index) => {
      field.text = isOpen ? this.#texts[index] : ''
    })
  }
}
