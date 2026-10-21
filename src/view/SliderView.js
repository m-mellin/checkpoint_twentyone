import { BlockSprite, SpriteRenderer } from '2d-sprite-renderer'
import { TextLine } from './TextLine.js'

/**
 * The height and color of the track the handle slide along.
 */
const TRACK_HEIGHT = 8
const TRACK_COLOR = '#555'

/**
 * The size and color of the handle the player drags.
 */
const HANDLE_SIZE = 24
const HANDLE_COLOR = '#ddd'

/**
 * The colour and font of the label above the slider and the percentage beside it.
 */
const TEXT_COLOR = '#fff'
const TEXT_FONT = '16px "Press Start 2P"'

/**
 * The space between the label and the top of the handle, in pixels.
 */
const LABEL_DISTANCE = 20

/**
 * A horizontal slider the player can drag to choose a value from 0 to 1, for example a volume.
 * Shows a label above the track and the value as a percentage beside it.
 */
export class SliderView {
  /**
   * The text above the slider.
   *
   * @type {TextLine}
   */
  #label

  /**
   * What the label says, kept so it can be shown again after the slider has been hidden.
   *
   * @type {string}
   */
  #labelText

  /**
   * The value as a percentage, beside the track.
   *
   * @type {TextLine}
   */
  #percentLabel

  /**
   * The line the handle slides along.
   *
   * @type {BlockSprite}
   */
  #track

  /**
   * The handle the player drags.
   *
   * @type {BlockSprite}
   */
  #handle

  /**
   * The x coordinate of the track's left end.
   *
   * @type {number}
   */
  #trackX

  /**
   * The length of the track, in pixels.
   *
   * @type {number}
   */
  #trackWidth

  /**
   * The y coordinate of the track's centre line.
   *
   * @type {number}
   */
  #centerY

  /**
   * The slider's value, from 0 (left end) to 1 (right end).
   *
   * @type {number}
   */
  #value

  /**
   * Called with the new value whenever the handle moves.
   *
   * @type {(value: number) => void}
   */
  #onChange

  /**
   * Whether the slider is shown and can be dragged.
   *
   * @type {boolean}
   */
  #isVisible = true

  /**
   * Creates a slider and adds it to the renderer.
   *
   * @param {SpriteRenderer} renderer - The renderer to draw with.
   * @param {object} options - The slider's label, position, size and start value.
   * @param {string} options.label - The text shown above the slider.
   * @param {number} options.x - The x coordinate of the track's left end.
   * @param {number} options.y - The y coordinate of the track's centre line.
   * @param {number} options.width - The length of the track.
   * @param {number} [options.value=0.4] - The start value, from 0 to 1.
   * @param {(value: number) => void} [options.onChange] - Called with the new value when the handle moves.
   */
  constructor(renderer, { label, x, y, width, value = 0.4, onChange = () => {} }) {
    this.#trackX = x
    this.#trackWidth = width
    this.#centerY = y
    this.#value = value
    this.#onChange = onChange

    this.#track = new BlockSprite({
      width: width,
      height: TRACK_HEIGHT,
      x,
      y: y - TRACK_HEIGHT / 2,
      color: TRACK_COLOR
    })
    this.#handle = new BlockSprite({
      width: HANDLE_SIZE,
      height: HANDLE_SIZE,
      color: HANDLE_COLOR
    })
    this.#labelText = label.toUpperCase()
    this.#label = new TextLine(this.#labelText, {
      color: TEXT_COLOR,
      font: TEXT_FONT
    })
    this.#percentLabel = new TextLine(this.#valueAsPercent(), {
      color: TEXT_COLOR,
      font: TEXT_FONT
    })

    renderer.add(this.#label.sprite)
    renderer.add(this.#percentLabel.sprite)
    renderer.add(this.#track)
    renderer.add(this.#handle)

    this.#placeHandle()
    this.#placeLabels()
  }

  /**
   * Returns the slider's value.
   *
   * @returns {number} The value, from 0 (left end) to 1 (right end).
   */
  get value() {
    return this.#value
  }

  /**
   * Returns the x coordinate of the handle.
   *
   * @returns {number} The x coordinate of the handle's top left corner.
   */
  get x() {
    return this.#handle.x
  }

  /**
   * Returns the y coordinate of the handle.
   *
   * @returns {number} The y coordinate of the handle's top left corner.
   */
  get y() {
    return this.#handle.y
  }

  /**
   * Returns the width of the handle.
   *
   * @returns {number} The width in pixels.
   */
  get width() {
    return HANDLE_SIZE
  }

  /**
   * Returns the height of the handle.
   *
   * @returns {number} The height in pixels.
   */
  get height() {
    return HANDLE_SIZE
  }

  /**
   * Returns whether a point is on the handle. Always false when the slider is hidden.
   *
   * @param {number} x - The x coordinate of the point, in canvas pixels.
   * @param {number} y - The y coordinate of the point, in canvas pixels.
   * @returns {boolean} True if the point is on the handle.
   */
  contains(x, y) {
    if (!this.#isVisible) {
      return false
    }

    return (
      x >= this.x && x <= this.x + this.width && y >= this.y && y <= this.y + this.height
    )
  }

  /**
   * Moves the handle sideways, but never outside the track, and updates the value and the percentage.
   * Only the x coordinate is used, so the handle stays on the track.
   *
   * @param {number} x - The wanted x coordinate of the handle's top left corner.
   */
  moveTo(x) {
    const centerX = x + HANDLE_SIZE / 2
    const onTrack = Math.min(
      Math.max(centerX, this.#trackX),
      this.#trackX + this.#trackWidth
    )

    this.#value = (onTrack - this.#trackX) / this.#trackWidth
    this.#placeHandle()

    this.#percentLabel.text = this.#valueAsPercent()
    this.#onChange(this.#value)
  }

  /**
   * Shows the slider.
   */
  show() {
    this.#isVisible = true
    this.#track.width = this.#trackWidth
    this.#track.height = TRACK_HEIGHT
    this.#handle.width = HANDLE_SIZE
    this.#handle.height = HANDLE_SIZE
    this.#label.text = this.#labelText
    this.#percentLabel.text = this.#valueAsPercent()
  }

  /**
   * Hides the slider, so it is neither drawn nor draggable.
   */
  hide() {
    this.#isVisible = false
    this.#track.width = 0
    this.#track.height = 0
    this.#handle.width = 0
    this.#handle.height = 0
    this.#label.text = ''
    this.#percentLabel.text = ''
  }

  /**
   * Places the handle on the track according to the value.
   */
  #placeHandle() {
    this.#handle.x = this.#trackX + this.#value * this.#trackWidth - HANDLE_SIZE / 2
    this.#handle.y = this.#centerY - HANDLE_SIZE / 2
  }

  /**
   * Places the label above the left end of the track, and the percentage beside its right end.
   */
  #placeLabels() {
    this.#label.x = this.#trackX
    this.#label.y = this.#centerY - HANDLE_SIZE - LABEL_DISTANCE

    this.#percentLabel.x = this.#trackX + this.#trackWidth + HANDLE_SIZE
    this.#percentLabel.y = this.#centerY - this.#percentLabel.height / 2
  }

  /**
   * Returns the value as a percentage.
   *
   * @returns {string} The value in percent, for example "75 %".
   */
  #valueAsPercent() {
    return `${Math.round(this.#value * 100)} %`
  }
}
