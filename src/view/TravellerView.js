import { Sprite, SpriteRegion, SpriteRenderer } from "2d-sprite-renderer"
import portraitData from '../data/potraits.json'
import { Traveller } from "../model/Traveller"

const DESK_SRC = 'assets/desk_final_2.png'
const BG_SRC = 'assets/background_final_2.png'
const TRAVELLERS_SRC = 'assets/travellers.png'
const PORTRAIT_SCALE = 2
const TRAVELLER_Y = 260
const BOB_SPEED = 400
const BOB_HEIGHT = 3

/**
 *
 */
export class TravellerView {
  #background = new Sprite(BG_SRC, {x: 0, y: 0, width: 1367, height: 629})
  #desk = new Sprite(DESK_SRC, {x: 0, y: 520, width: 1367, height: 511 })
  #traveller = new Sprite(TRAVELLERS_SRC, {x: 480, y: TRAVELLER_Y})
  #elapsed = 0

  /**
   * 
   * @param {SpriteRenderer} renderer 
   */
  constructor(renderer) {
    renderer.add(this.#background)
    renderer.add(this.#traveller)
    renderer.add(this.#desk)
  }

  /**
   * 
   * @param {Traveller} traveller 
   */
  show(traveller) {
    const portrait = portraitData.find((p) => p.id === traveller.person.apperance)

    this.#traveller.region = new SpriteRegion(portrait?.region)
    this.#traveller.width = portrait?.region.width * PORTRAIT_SCALE
    this.#traveller.height = portrait?.region.height * PORTRAIT_SCALE
  }

  move (deltaTime) {
    this.#elapsed += deltaTime
    this.#traveller.x = this.#traveller.x + Math.round(Math.sin(this.#elapsed / 2000) * 2)
  }

  /**
   * 
   * @param {number} deltaTime 
   */
  update(deltaTime) {
    this.#elapsed += deltaTime
    this.#traveller.y = TRAVELLER_Y + Math.round(Math.sin(this.#elapsed / BOB_SPEED) * BOB_HEIGHT)
  }
}