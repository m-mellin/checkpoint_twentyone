import { SpriteRenderer } from "2d-sprite-renderer";
import { InspectableItemView } from "./InspectableItemView";
import { TextLine } from "./TextLine";

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
const CLOSED_WIDTH = 644  * DOCUMENT_SCALE
const CLOSED_HEIGHT = 157 * DOCUMENT_SCALE

/**
 * Where the citation lies on the counter when it appears, in pixels.
 */
const START_X = 300
const START_Y = 700

/**
 * The colour of the title and the discrepancy text
 */
const TITLE_COLOR = 'red'
const TEXT_COLOR = 'black'
/**
 * The heading above the possible discrepancies on the open list.
 */
const TITLE_TEXT = 'CITATION'

/**
 * The font of the title and the text.
 */
const TITLE_FONT = '16px "Press Start 2P"'
const TEXT_FONT = '14px "Press Start 2P"'

const TITLE_OFFSET_X = 40
const TITLE_OFFSET_Y = 30

const REASON_OFFSET_X = 40
const REASON_OFFSET_Y = 50

/**
 * 
 */
export class CitationView extends InspectableItemView {

  #title = new TextLine(TITLE_TEXT, { color: TITLE_COLOR, font: TITLE_FONT})
  #reasonLine = new TextLine('', { color: TEXT_COLOR, font: TEXT_FONT})
  #reason = ''

  /**
   * 
   * @param {SpriteRenderer} renderer 
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

  get isInUse() {
    return this.#reason !== ''
  }

  /**
   * 
   * @param {string} reason 
   */
  print(reason) {
    this.#reason = reason
    this.moveTo(START_X, START_Y)
    this.show()
  }

  hide() {
    this.#reason = ''
    super.hide()
  }

  placeContent() {
    this.#title.x = this.x + TITLE_OFFSET_X
    this.#title.y = this.y + TITLE_OFFSET_Y
    this.#reasonLine.x = this.x + REASON_OFFSET_X
    this.#reasonLine.y = this.y + REASON_OFFSET_Y
  }

  updateContent() {
    const isOpen = this.isOnInspectionDesk

    this.#title.text = isOpen ? TITLE_TEXT : ''
    this.#reasonLine.text = isOpen ? this.#reason : ''
  }

}