import { Sprite, SpriteRegion, SpriteRenderer } from '2d-sprite-renderer'
import { TextLine } from './TextLine.js'
import { Passport } from '../model/Passport.js'
import { InspectableItemView } from './InspectableItemView.js'
import { formatDate } from './formatDate.js'
import portraitData from '../data/portraits.json'

/**
 * Images of the passport in its open and closed variants.
 */
const OPEN_SRC = 'assets/passport.png'
const CLOSED_SRC = 'assets/passport_small.png'

/**
 * The spritesheet used for the passport portrait photo.
 */
const TRAVELLERS_SRC = 'assets/travellers.png'

/**
 * The approve and deny markers, when a user stamps the passport.
 */
const APPROVE_MARKER_SRC = 'assets/approve_stamp_marker.png'
const DENY_MARKER_SRC = 'assets/deny_stamp_marker.png'

/**
 * The width and height of the open passport.
 */
const OPEN_WIDTH = 1404 / 1.7
const OPEN_HEIGHT = 1120 / 1.7

/**
 * The width and height of the closed passport.
 */
const CLOSED_WIDTH = 169
const CLOSED_HEIGHT = 186

/**
 * The starting positions of the passport.
 */
const START_X = 600
const START_Y = 700

/**
 * The scale of the passports portrait photo.
 */
const PHOTO_SCALE = 1

/**
 * The offset of the passport portrait photo from
 * the passports top-left corner.
 */
const PHOTO_OFFSET_X = 450
const PHOTO_OFFSET_Y = 100

/**
 * The color of the text on the passport.
 */
const TEXT_COLOR = '#2a1a1a'

/**
 * The offset of the text from the passports top-left corner.
 */
const TEXT_OFFSET_X = 450
const TEXT_OFFSET_Y = 300

/**
 * The distance between TextLine objects.
 */
const TEXT_DISTANCE = 10

/**
 * The markers width and height.
 */
const MARKER_WIDTH = 150
const MARKER_HEIGHT = 150

/**
 * How far to the right of the stamp marker's left edge the date is printed, in pixels.
 */
const MARKER_DATE_OFFSET_X = 30

/**
 * How far below the stamp marker's top edge the date is printed, in pixels.
 */
const MARKER_DATE_OFFSET_Y = 112.5

/**
 * The color for the approved and deny stamp.
 */
const APPROVED_COLOR = '#1a5c1a'
const DENIED_COLOR = '#8b1a1a'

/**
 * The font used for the date on the marker.
 */
const MARKER_FONT = '9px "Press Start 2P"'

/**
 * Shows the passport on the screen. It is hidden until a traveller hands it over, and can be
 * dragged: open with all its details on the inspection desk, and closed and small in the booth.
 */
export class PassportView extends InspectableItemView {
  /**
   * The photo on the open passport.
   *
   * @type {Sprite}
   */
  #passportPhoto = new Sprite(TRAVELLERS_SRC)

  /**
   * The marker shown on the open passport when it has been approved.
   *
   * @type {Sprite}
   */
  #approveMarker = new Sprite(APPROVE_MARKER_SRC)

  /**
   * The marker shown on the open passport when it has been denied.
   *
   * @type {Sprite}
   */
  #denyMarker = new Sprite(DENY_MARKER_SRC)

  /**
   * The date printed on the stamp marker.
   *
   * @type {TextLine}
   */
  #markerDate = new TextLine('', { color: TEXT_COLOR, font: MARKER_FONT })

  /**
   * The passport being shown, or null if none.
   *
   * @type {Passport | null}
   */
  #passport = null

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
   * Today's date in the game, printed on new stamps.
   *
   * @type {Date}
   */
  #gameDate = new Date()

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
   * Adds the photo, the text fields and the stamp markers to the renderer, on top of the passport
   * images the base class adds. The passport stays hidden until a traveller hands it over.
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

    renderer.add(this.#passportPhoto)

    for (const field of Object.values(this.#fields)) {
      renderer.add(field.sprite)
    }

    renderer.add(this.#approveMarker)
    renderer.add(this.#denyMarker)
    renderer.add(this.#markerDate.sprite)

    this.hide()
  }

  /**
   * Sets the current game date. Used for setting the correct date on the stamp.
   *
   * @param {Date} date - The current game date.
   */
  set gameDate(date) {
    this.#gameDate = date
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
   * Returns if the passport is approved.
   *
   * @returns {boolean} True if the latest stamp approves the passport.
   */
  get isApproved() {
    return this.#approved
  }

  /**
   * Shows a new passport, closed on the booth counter and without stamps.
   *
   * @param {Passport} passport - The passport to show.
   */
  showPassport(passport) {
    this.#passport = passport
    this.#approved = false
    this.#stampOffset = null
    this.moveTo(START_X, START_Y)
    this.show()
  }

  /**
   * Hides the passport and forgets it and its stamp, for example when the traveller leaves.
   */
  hide() {
    this.#stampOffset = null
    this.#passport = null

    super.hide()
  }

  /**
   * Puts a stamp marker on the open passport, centred on the given point.
   * Does nothing if the passport is not on the inspection desk.
   *
   * @param {number} x - The x coordinate of the stamp's centre, in canvas pixels.
   * @param {number} y - The y coordinate of the stamp's centre, in canvas pixels.
   * @param {boolean} approves - True for the approve stamp, false for the deny stamp.
   * @returns {boolean} True if the passport was stamped.
   */
  stampAt(x, y, approves) {
    if (!this.isOnInspectionDesk || !this.contains(x, y)) {
      return false
    }

    this.#approved = approves
    this.#stampOffset = {
      x: x - this.x - MARKER_WIDTH / 2,
      y: y - this.y - MARKER_HEIGHT / 2
    }

    this.updateContent()
    this.placeContent()

    return true
  }

  /**
   * Places the photo, the text lines and the stamp marker relative to the passport's position.
   *
   * @protected
   */
  placeContent() {
    this.#passportPhoto.x = this.x + PHOTO_OFFSET_X
    this.#passportPhoto.y = this.y + PHOTO_OFFSET_Y

    let y = this.y + TEXT_OFFSET_Y

    for (const field of Object.values(this.#fields)) {
      field.x = this.x + TEXT_OFFSET_X
      field.y = y
      y += field.height + TEXT_DISTANCE
    }

    if (this.#stampOffset !== null) {
      for (const marker of [this.#approveMarker, this.#denyMarker]) {
        marker.x = this.x + this.#stampOffset.x
        marker.y = this.y + this.#stampOffset.y
      }

      this.#markerDate.x = this.x + this.#stampOffset.x + MARKER_DATE_OFFSET_X
      this.#markerDate.y = this.y + this.#stampOffset.y + MARKER_DATE_OFFSET_Y
    }
  }

  /**
   * Shows the photo, details and stamp on the inspection desk, and hides them everywhere else.
   *
   * @protected
   */
  updateContent() {
    if (this.isOnInspectionDesk && this.#passport !== null) {
      this.#showDetails(this.#passport)
      this.#showStampMarker()
    } else {
      this.#hideDetails()
    }
  }

  /**
   * Shows the photo and fills in every text line from the passport.
   *
   * @param {Passport} passport - The passport to show.
   */
  #showDetails(passport) {
    this.#showPhoto(passport.photo)

    this.#fields.name.text =
      `NAME: ${passport.surname} ${passport.firstName}`.toUpperCase()
    this.#fields.dateOfBirth.text = `BORN: ${formatDate(passport.dateOfBirth)}`
    this.#fields.sex.text = `SEX: ${passport.sex}`
    this.#fields.nationality.text =
      `NATIONALITY: ${passport.nationality.name}`.toUpperCase()
    this.#fields.birthplace.text =
      `BIRTHPLACE: ${passport.birthplace}`.toUpperCase()
    this.#fields.height.text = `HEIGHT: ${passport.heightInCm} CM`
    this.#fields.issuingCity.text =
      `ISSUED IN: ${passport.issuingCity}`.toUpperCase()
    this.#fields.issueDate.text = `ISSUED: ${formatDate(passport.issueDate)}`
    this.#fields.expiryDate.text = `EXPIRES: ${formatDate(passport.expiryDate)}`
    this.#fields.identification.text = `ID: ${passport.identificationString}`
  }

  /**
   * Hides the photo, the text lines and the stamp marker.
   */
  #hideDetails() {
    this.#passportPhoto.width = 0
    this.#passportPhoto.height = 0

    for (const field of Object.values(this.#fields)) {
      field.text = ''
    }

    this.#resizeMarker(this.#approveMarker, false)
    this.#resizeMarker(this.#denyMarker, false)
    this.#markerDate.text = ''
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
   * Shows the marker and date for the latest stamp, or nothing if the passport is not stamped.
   * The date is coloured after whether the passport was approved or denied.
   */
  #showStampMarker() {
    const isStamped = this.#stampOffset !== null

    this.#resizeMarker(this.#approveMarker, isStamped && this.#approved)
    this.#resizeMarker(this.#denyMarker, isStamped && !this.#approved)

    this.#markerDate.text = isStamped ? formatDate(this.#gameDate) : ''
    this.#markerDate.textColor = this.#approved ? APPROVED_COLOR : DENIED_COLOR
  }

  /**
   * Shows or hides a stamp marker.
   *
   * @param {Sprite} marker - The marker to show or hide.
   * @param {boolean} isShown - True to show it.
   */
  #resizeMarker(marker, isShown) {
    marker.width = isShown ? MARKER_WIDTH : 0
    marker.height = isShown ? MARKER_HEIGHT : 0
  }
}
