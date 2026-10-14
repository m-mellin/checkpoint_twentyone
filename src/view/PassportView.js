import { Sprite, SpriteRegion, SpriteRenderer } from "2d-sprite-renderer";
import { Traveller } from "../model/Traveller";
import { TextLine } from "./TextLine";
import { Passport } from "../model/Passport";

import portraitData from '../data/potraits.json'

const PASSPORT_SRC = 'assets/passport.png'
const TRAVELLERS_SRC = 'assets/travellers.png'

const PASSPORT_X = 1400
const PASSPORT_Y = 0
const PASSPORT_WIDTH = 1404 / 1.7
const PASSPORT_HEIGHT = 1120 / 1.7

const PHOTO_X = PASSPORT_X + 450
const PHOTO_Y = PASSPORT_Y + 100
const PHOTO_SCALE = 1

const TEXT_X = PASSPORT_X + 450
const TEXT_Y = PASSPORT_Y + 300
const TEXT_DISTANCE = 10
const TEXT_COLOR = '#2a1a1a'

export class PassportView {
  #paper = new Sprite(PASSPORT_SRC, {x: PASSPORT_X, y: PASSPORT_Y})
  #photo = new Sprite(TRAVELLERS_SRC, {x: PHOTO_X, y: PHOTO_Y})

  #fields = {
    name: new TextLine('', {color: TEXT_COLOR}),
    dateOfBirth: new TextLine('', {color: TEXT_COLOR}),
    sex: new TextLine('', {color: TEXT_COLOR}),
    nationality: new TextLine('', {color: TEXT_COLOR}),
    birthplace: new TextLine('', {color: TEXT_COLOR}),
    height: new TextLine('', {color: TEXT_COLOR}),
    issuingCity: new TextLine('', {color: TEXT_COLOR}),
    issueDate: new TextLine('', {color: TEXT_COLOR}),
    expiryDate: new TextLine('', {color: TEXT_COLOR}),
    identification: new TextLine('', {color: TEXT_COLOR})
  }
  /**
   * 
   * @param {SpriteRenderer} renderer
   * @param {Traveller} traveller
   */
  constructor(renderer) {
    renderer.add(this.#paper)
    renderer.add(this.#photo)

    for (const field of Object.values(this.#fields)) {
      renderer.add(field.sprite)
    }

    this.#placeFields()
    this.hide()
  }

  /**
   * 
   * @param {Passport} passport 
   */
  show(passport) {
    this.#paper.width = PASSPORT_WIDTH
    this.#paper.height = PASSPORT_HEIGHT
    this.#showPhoto(passport.photo)

    this.#fields.name.text = `NAME: ${passport.surname} ${passport.firstName}`.toUpperCase()
    this.#fields.dateOfBirth.text = `BORN: ${this.#formatDate(passport.dateOfBirth)}`
    this.#fields.sex.text = `SEX: ${passport.sex}`
    this.#fields.nationality.text = `NATIONALITY: ${passport.nationality.name}`.toUpperCase()
    this.#fields.birthplace.text = `BIRTHPLACE: ${passport.birthplace}`.toUpperCase()
    this.#fields.height.text = `HEIGHT: ${passport.heightInCm} CM`
    this.#fields.issuingCity.text = `ISSUED IN: ${passport.issuingCity}`.toUpperCase()
    this.#fields.issueDate.text = `ISSUED: ${this.#formatDate(passport.issueDate)}`
    this.#fields.expiryDate.text = `EXPIRES: ${this.#formatDate(passport.expiryDate)}`
    this.#fields.identification.text = `ID: ${passport.identificationString}`
  }

  hide() {
    this.#paper.width = 0
    this.#paper.height = 0
    this.#photo.width = 0
    this.#photo.height = 0

    for (const field of Object.values(this.#fields)) {
      field.text = ''
    }
  }

  /**
   * 
   * @param {string} photoId 
   */
  #showPhoto(photoId) {
    const portrait = portraitData.find((p) => p.id === photoId)

    if (!portrait) {
      throw new RangeError(`No portrait with id ${photoId}`)
    }

    this.#photo.region = new SpriteRegion(portrait.region)
    this.#photo.width = portrait.region.width * PHOTO_SCALE
    this.#photo.height = portrait.region.height * PHOTO_SCALE
  }

  /**
   * -
   */
  #placeFields() {
    let y = TEXT_Y

    for (const field of Object.values(this.#fields)) {
      field.x = TEXT_X
      field.y = y
      y += field.height + TEXT_DISTANCE
    }
  }

  /**
   * 
   * @param {Date} date
   * @returns {string} 
   */
  #formatDate(date) {
    const day = String(date.getUTCDate()).padStart(2, '0')
    const month = String(date.getUTCMonth() + 1).padStart(2, '0')
    const year = String(date.getUTCFullYear()).slice(-2)

    return `${day}.${month}.${year}`
  }
}