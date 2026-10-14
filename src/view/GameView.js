import { SpriteRenderer } from "2d-sprite-renderer"
import { Traveller } from "../model/Traveller"
import { TranscriptView } from "./TranscriptView"
import { TravellerView } from "./TravellerView"
import { DeskView } from "./DeskView"

export class GameView {
  #travellerView
  #deskView

  /**
   * 
   * @param {SpriteRenderer} renderer 
   */
  constructor(renderer) {
    this.#travellerView = new TravellerView(renderer)
    this.#deskView = new DeskView(renderer)
  }

  /**
   * 
   * @param {Traveller} traveller 
   */
  showTraveller(traveller) {
    this.#travellerView.show(traveller)
  }

  update(deltaTime) {
    this.#travellerView.update(deltaTime)
  }

  move (deltaTime) {
    this.#travellerView.move(deltaTime)
  }
}