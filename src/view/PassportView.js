import { Sprite, SpriteRegion, SpriteRenderer } from '2d-sprite-renderer'
import { TextLine } from './TextLine'
import { Passport } from '../model/Passport'

import portraitData from '../data/potraits.json'

const PASSPORT_SRC = 'assets/passport.png'
const TRAVELLERS_SRC = 'assets/travellers.png'
const CLOSED_PASSPORT_SRC = 'assets/passport_small.png'
const APPROVE_STAMP_SRC = 'assets/approve_stamp_marker.png'
const DENY_STAMP_SRC = 'assets/deny_stamp_marker.png'

const STAMP_WIDTH = 200
const STAMP_HEIGHT = 200
const STAMP_OFFSET_X = 100
const STAMP_OFFSET_Y = 200

const CLOSED_WIDTH = 169
const CLOSED_HEIGHT = 186

const DESK_LEFT_X = 1370
const DESK_CENTER_X = 600
const DESK_CENTER_Y = 700

const PASSPORT_X = 1400
const PASSPORT_Y = 0
const PASSPORT_WIDTH = 1404 / 1.7
const PASSPORT_HEIGHT = 1120 / 1.7

const PHOTO_SCALE = 1
const PHOTO_OFFSET_X = 450
const PHOTO_OFFSET_Y = 100

const TEXT_OFFSET_X = 450
const TEXT_OFFSET_Y = 300
const TEXT_DISTANCE = 10
const TEXT_COLOR = '#2a1a1a'

/**
 * Shows the passport on the screen. It is hidden until a traveller hands it over, and can be
 * dragged: open with all its details on the inspection desk, and closed and small in the booth.
 */
export class PassportView {
  /**
   * The open passport sprite.
   *
   * @type {Sprite}
   */
  #openPassport = new Sprite(PASSPORT_SRC, { x: PASSPORT_X, y: PASSPORT_Y })

  /**
   * The open passport photo sprite.
   *
   * @type {Sprite}
   */
  #passportPhoto = new Sprite(TRAVELLERS_SRC, {
    x: PHOTO_OFFSET_X,
    y: PHOTO_OFFSET_Y
  })

  /**
   * The closed passport sprite.
   *
   * @type {Sprite}
   */
  #closedPassport = new Sprite(CLOSED_PASSPORT_SRC)

  /**
   * 
   */
  #approveStamp = new Sprite(APPROVE_STAMP_SRC)

  /**
   * 
   */
  #denyStamp = new Sprite(DENY_STAMP_SRC)

  #approved = false

  /**
   * The current passport.
   *
   * @type {Passport | null}
   */
  #passport = null

  /**
   * The passport state, if its open or closed.
   *
   * @type {boolean}
   */
  #isOpen = true

  /**
   * The text lines on the open passport, one per field,
   * in the order they are shown from top to bottom.
   */
  #fields = {
    name: new TextLine('', { color: TEXT_COLOR }),
    dateOfBirth: new TextLine('', { color: TEXT_COLOR }),
    sex: new TextLine('', { color: TEXT_COLOR }),
    nationality: new TextLine('', { color: TEXT_COLOR }),
    birthplace: new TextLine('', { color: TEXT_COLOR }),
    height: new TextLine('', { color: TEXT_COLOR }),
    issuingCity: new TextLine('', { color: TEXT_COLOR }),
    issueDate: new TextLine('', { color: TEXT_COLOR }),
    expiryDate: new TextLine('', { color: TEXT_COLOR }),
    identification: new TextLine('', { color: TEXT_COLOR })
  }

  /**
   * The passports x-coordinate.
   *
   * @type {number}
   */
  #x = PASSPORT_X

  /**
   * The passports y-coordinate.
   *
   * @type {number}
   */
  #y = PASSPORT_Y

  /**
   * Adds the open passport, the closed passport, the photo and the text fields to the renderer,
   * in the order they are drawn. The passport stays hidden until a traveller hands it over.
   *
   * @param {SpriteRenderer} renderer - The renderer to draw with.
   */
  constructor(renderer) {
    renderer.add(this.#openPassport)
    renderer.add(this.#closedPassport)
    renderer.add(this.#passportPhoto)

    for (const field of Object.values(this.#fields)) {
      renderer.add(field.sprite)
    }

    renderer.add(this.#approveStamp)
    renderer.add(this.#denyStamp)

    this.#placeAll()
    this.hide()
  }

  /**
   * Shows the passport when traveller is in front of window.
   * Places the passport in the center of the desk in a closed state.
   *
   * @param {Passport | null} passport - The passport.
   */
  show(passport) {
    this.#passport = passport
    this.#approved = false
    this.#x = DESK_CENTER_X
    this.#y = DESK_CENTER_Y
    this.#close()
    this.#placeAll()
  }

  /**
   * Changes the passport from the closed variant to the open variant.
   */
  #open() {
    this.#isOpen = true
    this.#closedPassport.width = 0
    this.#closedPassport.height = 0
    this.#openPassport.width = PASSPORT_WIDTH
    this.#openPassport.height = PASSPORT_HEIGHT

    if (this.#approved) {
      this.#approveStamp.width = STAMP_WIDTH
      this.#approveStamp.height = STAMP_HEIGHT
    }

    if (this.#passport !== null) {
      this.#showPhoto(this.#passport.photo)
    }

    this.#setFields()
  }

  /**
   * Sets the text fields of the passport if the passport exists.
   */
  #setFields() {
    if (this.#passport !== null) {
      this.#fields.name.text =
        `NAME: ${this.#passport.surname} ${this.#passport.firstName}`.toUpperCase()
      this.#fields.dateOfBirth.text = `BORN: ${this.#formatDate(this.#passport.dateOfBirth)}`
      this.#fields.sex.text = `SEX: ${this.#passport.sex}`
      this.#fields.nationality.text =
        `NATIONALITY: ${this.#passport.nationality.name}`.toUpperCase()
      this.#fields.birthplace.text =
        `BIRTHPLACE: ${this.#passport.birthplace}`.toUpperCase()
      this.#fields.height.text = `HEIGHT: ${this.#passport.heightInCm} CM`
      this.#fields.issuingCity.text =
        `ISSUED IN: ${this.#passport.issuingCity}`.toUpperCase()
      this.#fields.issueDate.text = `ISSUED: ${this.#formatDate(this.#passport.issueDate)}`
      this.#fields.expiryDate.text = `EXPIRES: ${this.#formatDate(this.#passport.expiryDate)}`
      this.#fields.identification.text = `ID: ${this.#passport.identificationString}`
    }
  }

  /**
   * Empties all text fields in the passport.
   *
   * Used when either the passport is in its closed state or when hiding the passport.
   */
  #emptyFields() {
    for (const field of Object.values(this.#fields)) {
      field.text = ''
    }
  }

  /**
   * Changes the passport from the open variant to the closed variant.
   */
  #close() {
    this.#isOpen = false
    this.#openPassport.width = 0
    this.#openPassport.height = 0
    this.#passportPhoto.width = 0
    this.#passportPhoto.height = 0
    this.#approveStamp.width = 0
    this.#approveStamp.height = 0
    this.#closedPassport.width = CLOSED_WIDTH
    this.#closedPassport.height = CLOSED_HEIGHT

    this.#emptyFields()
  }

  /**
   * Hides passport, both open and closed. Used when travellers are changing.
   */
  hide() {
    this.#openPassport.width = 0
    this.#openPassport.height = 0
    this.#passportPhoto.width = 0
    this.#passportPhoto.height = 0
    this.#closedPassport.width = 0
    this.#closedPassport.height = 0
    this.#approveStamp.width = 0
    this.#approveStamp.height = 0
    this.#passport = null

    this.#emptyFields()
  }

  /**
   * Retrieves the photo of the traveller and displays it on the passport,
   * based on the id of the traveller.apperance attribute.
   *
   * @param {string} photoId - The photo id of the traveller.
   */
  #showPhoto(photoId) {
    const portrait = portraitData.find((p) => p.id === photoId)

    if (!portrait) {
      throw new RangeError(`No portrait with id ${photoId}`)
    }

    this.#passportPhoto.region = new SpriteRegion(portrait.region)
    this.#passportPhoto.width = portrait.region.width * PHOTO_SCALE
    this.#passportPhoto.height = portrait.region.height * PHOTO_SCALE
  }

  /**
   * Places the paper, the photo and every text line relative to the passport's position,
   * so they move together. The text lines are stacked from top to bottom.
   */
  #placeAll() {
    this.#openPassport.x = this.#x
    this.#openPassport.y = this.#y
    this.#passportPhoto.x = this.#x + PHOTO_OFFSET_X
    this.#passportPhoto.y = this.#y + PHOTO_OFFSET_Y
    this.#closedPassport.x = this.#x
    this.#closedPassport.y = this.#y
    this.#approveStamp.x = this.#x + STAMP_OFFSET_X
    this.#approveStamp.y = this.#y + STAMP_OFFSET_Y

    let y = this.#y + TEXT_OFFSET_Y

    for (const field of Object.values(this.#fields)) {
      field.x = this.#x + TEXT_OFFSET_X
      field.y = y
      y += field.height + TEXT_DISTANCE
    }
  }

  /**
   * Formats the date to YEAR-MONTH-DAY format.
   *
   * @param {Date} date - The date to format.
   * @returns {string} The formatted date.
   */
  #formatDate(date) {
    const day = String(date.getUTCDate()).padStart(2, '0')
    const month = String(date.getUTCMonth() + 1).padStart(2, '0')
    const year = String(date.getUTCFullYear()).slice()

    return `${year}.${month}.${day}`
  }

  /**
   * Returns the x-coordinate of the passport.
   *
   * @returns {number} The x-coordinate.
   */
  get x() {
    return this.#x
  }

  /**
   * Returns the y-coordinate of the passport.
   *
   * @returns {number} The y-coordinate.
   */
  get y() {
    return this.#y
  }

  /**
   * Returns the width of the passport based on if its open or closed.
   *
   * @returns {number} The width of the passport.
   */
  get width() {
    return this.#isOpen ? PASSPORT_WIDTH : CLOSED_WIDTH
  }

  /**
   * Returns the height of the passport based on if its open or closed.
   *
   * @returns {number} The height of the passport.
   */
  get height() {
    return this.#isOpen ? PASSPORT_HEIGHT : CLOSED_HEIGHT
  }

  /**
   * Moves the passport.
   *
   * @param {number} x - The x-coordinate to move.
   * @param {number} y - The y-coordinate to move.
   */
  moveTo(x, y) {
    this.#x = x
    this.#y = y
    this.#updateMode()
    this.#placeAll()
  }

  /**
   * Opens the passport when its centre is on the inspection desk, and closes it when it is in the booth.
   * Does nothing if no passport is shown, or if it is already in the right mode.
   *
   * @returns {void}
   */
  #updateMode() {
    if (this.#passport === null) {
      return
    }

    const centerX = this.#x + this.width / 2
    const shouldBeOpen = centerX >= DESK_LEFT_X

    if (shouldBeOpen && !this.#isOpen) {
      this.#open()
    } else if (!shouldBeOpen && this.#isOpen) {
      this.#close()
    }
  }

  /**
   * Returns whether a point is on the passport, in its current size.
   * Always false when no passport is shown.
   *
   * @param {number} x - The x coordinate of the point, in canvas pixels.
   * @param {number} y - The y coordinate of the point, in canvas pixels.
   * @returns {boolean} True if the point is on the passport.
   */
  contains(x, y) {
    if (this.#passport === null) {
      return false
    }

    return (
      x >= this.#x &&
      x <= this.#x + this.width &&
      y >= this.#y &&
      y <= this.#y + this.height
    )
  }

  approve() {
    this.#approved = true

    if (this.#isOpen) {
      this.#approveStamp.width = STAMP_WIDTH
      this.#approveStamp.height = STAMP_HEIGHT
    }
  }
}
