import { BlockSprite } from "2d-sprite-renderer"
import { TextLine } from "./TextLine"

const TRACK_HEIGHT = 8
const TRACK_COLOR = '#555'

const HANDLE_SIZE = 24
const HANDLE_COLOR = '#ddd'

export class SliderView {
  #label
  #labelText
  #procentualLabel
  #track
  #handle
  #trackX
  #trackWidth
  #centerY
  #value
  #onChange
  #isVisible = true

  constructor(renderer, {label, x, y, width, value = 0.1, onChange = () => {} }) {
    this.#trackX = x
    this.#trackWidth = width
    this.#centerY = y
    this.#value = value
    this.#onChange = onChange

    this.#track = new BlockSprite(width, TRACK_HEIGHT, {x, y: y - TRACK_HEIGHT / 2, color: TRACK_COLOR})
    this.#handle = new BlockSprite(HANDLE_SIZE, HANDLE_SIZE, { color: HANDLE_COLOR })
    this.#labelText = label.toUpperCase()
    this.#label = new TextLine(this.#labelText.toUpperCase(), {color: '#fff', font: '16px "Press Start 2P"'})
    this.#procentualLabel = new TextLine(this.#valueAsPercent(), {color: '#fff', font: '16px "Press Start 2P"'})

    renderer.add(this.#label.sprite)
    renderer.add(this.#procentualLabel.sprite)
    renderer.add(this.#track)
    renderer.add(this.#handle)

    this.#placeHandle()
    this.#placeLabel()
  }

  get value() {
    return this.#value
  }

  get x() {
    return this.#handle.x
  }

  get y() {
    return this.#handle.y
  }

  get width() {
    return HANDLE_SIZE
  }

  get height() {
    return HANDLE_SIZE
  }

  contains(x, y) {
    if (!this.#isVisible) {
      return false
    }

    return (
      x >= this.x &&
      x <= this.x + this.width &&
      y >= this.y &&
      y <= this.y + this.height
    )
  }

  moveTo(x) {
    const centerX = x + HANDLE_SIZE / 2
    const onTrack = Math.min(Math.max(centerX, this.#trackX), this.#trackX + this.#trackWidth)

    this.#value = (onTrack - this.#trackX) / this.#trackWidth
    this.#placeHandle()

    this.#procentualLabel.text = this.#valueAsPercent()
    this.#onChange(this.#value)
  }

  #placeHandle() {
    this.#handle.x = this.#trackX + this.#value * this.#trackWidth - HANDLE_SIZE / 2
    this.#handle.y = this.#centerY - HANDLE_SIZE / 2
  }

  #placeLabel() {
    this.#label.x = this.#trackX
    this.#label.y = this.#centerY - HANDLE_SIZE - 20

    this.#procentualLabel.x = this.#trackX + this.#trackWidth + HANDLE_SIZE
    this.#procentualLabel.y = this.#centerY - this.#procentualLabel.height / 2
  }

  #valueAsPercent() {
    return `${Math.round(this.#value * 100)} %`
  }

  show() {
    this.#isVisible = true
    this.#track.width = this.#trackWidth
    this.#track.height = TRACK_HEIGHT
    this.#handle.width = HANDLE_SIZE
    this.#handle.height = HANDLE_SIZE
    this.#label.text = this.#labelText
    this.#procentualLabel.text = this.#valueAsPercent()
  }

  hide() {
    this.#isVisible = false
    this.#track.width = 0
    this.#track.height = 0
    this.#handle.width = 0
    this.#handle.height = 0
    this.#label.text = ''
    this.#procentualLabel.text = ''
  }
}