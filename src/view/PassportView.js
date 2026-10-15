import { Sprite, SpriteRegion, SpriteRenderer } from '2d-sprite-renderer'
import { TextLine } from './TextLine'
import { Passport } from '../model/Passport'

import portraitData from '../data/potraits.json'

const PASSPORT_SRC = 'assets/passport.png'
const TRAVELLERS_SRC = 'assets/travellers.png'
const CLOSED_PASSPORT_SRC = 'assets/passport_small.png'
const APPROVE_STAMP_SRC = 'assets/approve_stamp_marker.png'
const DENY_STAMP_SRC = 'assets/deny_stamp_marker.png'

const COUNTER_Y = 700
const FALL_SPEED = 4

const STAMP_WIDTH = 200
const STAMP_HEIGHT = 200

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
 * How far to the right of the stamp marker's left edge the date is printed, in pixels.
 */
const STAMP_DATE_OFFSET_X = 40

/**
 * How far below the stamp marker's top edge the date is printed, in pixels.
 */
const STAMP_DATE_OFFSET_Y = 150

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
   * The marker shown on the open passport when it has been approved.
   *
   * @type {Sprite}
   */
  #approveStamp = new Sprite(APPROVE_STAMP_SRC)

  /**
   * The marker shown on the open passport when it has been denied.
   *
   * @type {Sprite}
   */
  #denyStamp = new Sprite(DENY_STAMP_SRC)

  /**
   * Whether the latest stamp approves the passport. False if denied or not stamped.
   *
   * @type {boolean}
   */
  #approved = false

  /**
   * Where the stamp marker sits, measured from the passport's top left corner. Null if not stamped.
   *
   * @type {{x: number, y: number} | null}
   */
  #stampOffset = null

  /**
   * The current passport.
   *
   * @type {Passport | null}
   */
  #passport = null

  /**
   * Whether the passport is open on the inspection desk (true) or closed in the booth (false).
   *
   * @type {boolean}
   */
  #isOpen = true

  /**
   * Whether the passport is falling onto the booth counter right now.
   *
   * @type {boolean}
   */
  #isFalling = false

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
   * The date line on the stamps.
   */
  #dateStamp = new TextLine('', {color: TEXT_COLOR })

  /**
   * The current game date.
   */
  #gameDate = new Date()


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
   * Adds the open passport, the closed passport, the photo, the text fields and the stamp markers
   * to the renderer, in the order they are drawn. The passport stays hidden until a traveller hands it over.
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
    renderer.add(this.#dateStamp.sprite)

    this.#placeAll()
    this.hide()
  }

  /**
   * Sets the current game date. Used for setting the correct date on the stamp.
   * 
   * @param {Date} date - The current game date.
   */
  set gameDate(date) {
    this.#gameDate = new Date(date)
  }

  /**
   * Shows a new passport, closed on the booth counter and without stamps.
   *
   * @param {Passport} passport - The passport to show.
   */
  show(passport) {
    this.#passport = passport
    this.#approved = false
    this.#x = DESK_CENTER_X
    this.#y = DESK_CENTER_Y
    this.#stampOffset = null
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

    if (this.#stampOffset !== null) {
      this.#showStampMarker()
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
    this.#denyStamp.width = 0
    this.#denyStamp.height = 0
    this.#dateStamp.text = ''
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
    this.#denyStamp.width = 0
    this.#denyStamp.height = 0
    this.#dateStamp.text = ''
    this.#stampOffset = null
    this.#passport = null

    this.#emptyFields()
  }

  /**
   * Shows the portrait with the given id in the passport photo.
   *
   * @param {string} photoId - The appearance id printed in the passport, for example "M1".
   * @throws {RangeError} If there is no portrait with the id.
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
   * Places every part of the passport relative to its position, so they move together:
   * the open and closed paper, the photo, the stamp marker with its date, and the text lines,
   * which are stacked from top to bottom.
   */
  #placeAll() {
    this.#openPassport.x = this.#x
    this.#openPassport.y = this.#y
    this.#passportPhoto.x = this.#x + PHOTO_OFFSET_X
    this.#passportPhoto.y = this.#y + PHOTO_OFFSET_Y
    this.#closedPassport.x = this.#x
    this.#closedPassport.y = this.#y

    if (this.#stampOffset !== null) {
      for (const marker of [this.#approveStamp, this.#denyStamp]) {
        marker.x = this.#x + this.#stampOffset.x
        marker.y = this.#y + this.#stampOffset.y
      }

      this.#dateStamp.x = this.#x + this.#stampOffset.x + STAMP_DATE_OFFSET_X
      this.#dateStamp.y = this.#y + this.#stampOffset.y + STAMP_DATE_OFFSET_Y
    }

    let y = this.#y + TEXT_OFFSET_Y

    for (const field of Object.values(this.#fields)) {
      field.x = this.#x + TEXT_OFFSET_X
      field.y = y
      y += field.height + TEXT_DISTANCE
    }
  }

  /**
   * Formats a date the way it is printed in the passport, for example "1971.03.12".
   *
   * @param {Date} date - The date to format.
   * @returns {string} The formatted date.
   */
  #formatDate(date) {
    const day = String(date.getUTCDate()).padStart(2, '0')
    const month = String(date.getUTCMonth() + 1).padStart(2, '0')
    const year = String(date.getUTCFullYear())

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
   * Returns if the passport is stamped.
   *
   * @returns {boolean} True if the passport has a stamp marker.
   */
  get isStamped() {
    return this.#stampOffset !== null
  }

  /**
   * Returns if the passport is approved
   *
   * @returns {boolean} True if the latest stamp approves the passport.
   */
  get isApproved() {
    return this.#approved
  }

  /**
   * Returns whether a passport is shown and lies closed in the booth.
   *
   * @returns {boolean} True if the passport is in the booth.
   */
  get isInBooth() {
    return this.#passport !== null && !this.#isOpen
  }

  /**
   * Moves the passport so its top left corner is at the given position, and opens or closes it
   * depending on which side it is on. Stops it from falling, for example when the player grabs it.
   *
   * @param {number} x - The new x coordinate, in canvas pixels.
   * @param {number} y - The new y coordinate, in canvas pixels.
   */
  moveTo(x, y) {
    this.#isFalling = false
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

  /**
   * Puts a stamp marker on the open passport, centred on the given point.
   * Does nothing if the passport is closed or the point is not on it.
   *
   * @param {number} x - The x coordinate of the stamp's centre, in canvas pixels.
   * @param {number} y - The y coordinate of the stamp's centre, in canvas pixels.
   * @param {boolean} approves - True for the approve stamp, false for the deny stamp.
   */
  stampAt(x, y, approves) {
    if (!this.#isOpen || !this.contains(x, y)) {
      return
    }

    this.#approved = approves
    this.#stampOffset = {
      x: x - this.#x - STAMP_WIDTH / 2,
      y: y - this.#y - STAMP_HEIGHT / 2
    }

    this.#showStampMarker()
    this.#placeAll()
  }

  /**
   * Shows the marker for the latest stamp and hides the other one. 
   * Sets the current game date on the stamp and colors it based on the approved status.
   */
  #showStampMarker() {
    const shown = this.#approved ? this.#approveStamp : this.#denyStamp
    const hidden = this.#approved ? this.#denyStamp : this.#approveStamp

    this.#dateStamp.text = this.#formatDate(this.#gameDate)
    this.#dateStamp.textColor = this.#approved ? '#1a5c1a' : '#8b1a1a'

    shown.width = STAMP_WIDTH
    shown.height = STAMP_HEIGHT
    hidden.width = 0
    hidden.height = 0
  }

  /**
   * Set that the passport is currently falling.
   */
  fall() {
    this.#isFalling = true
  }

  /**
   * Moves a falling passport towards the booth counter, without falling past it.
   * Does nothing if the passport is not falling.
   *
   * @param {number} deltaTime - Milliseconds since the last frame.
   */
  update(deltaTime) {
    if (!this.#isFalling) return

    const distance = COUNTER_Y - this.#y
    const step = Math.min(Math.abs(distance), FALL_SPEED * deltaTime)

    this.#y += Math.sign(distance) * step
    this.#placeAll()

    if (this.#y === COUNTER_Y) {
      this.#isFalling = false
    }
  }
}
