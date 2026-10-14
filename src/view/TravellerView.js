import { Sprite, SpriteRegion, SpriteRenderer } from "2d-sprite-renderer"
import portraitData from '../data/potraits.json'
import { Traveller } from "../model/Traveller"

const DESK_SRC = 'assets/desk3.png'
const TRAVELLERS_SRC = 'assets/travellers.png'
const PORTRAIT_SCALE = 2
const TRAVELLER_Y = 108
const BOB_SPEED = 400
const BOB_HEIGHT = 3

/**
 *
 */
export class TravellerView {
  #desk = new Sprite(DESK_SRC, {x: 760, y: 0, width: 1536 / 1.7, height: 1824 / 1.7})
  #traveller = new Sprite(TRAVELLERS_SRC, {x: 960, y: TRAVELLER_Y})
  #elapsed = 0

  /**
   * 
   * @param {SpriteRenderer} renderer 
   */
  constructor(renderer) {
    renderer.add(this.#desk)
    renderer.add(this.#traveller)
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

  /**
   * 
   * @param {number} deltaTime 
   */
  update(deltaTime) {
    this.#elapsed += deltaTime
    this.#traveller.y = TRAVELLER_Y + Math.round(Math.sin(this.#elapsed / BOB_SPEED) * BOB_HEIGHT)
  }


}