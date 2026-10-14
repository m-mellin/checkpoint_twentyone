import { SpriteRenderer } from "2d-sprite-renderer"
import { Traveller } from "../model/Traveller"
import { TranscriptView } from "./TranscriptView"
import { TravellerView } from "./TravellerView"

export class GameView {
  #transcriptView
  #travellerView

  /**
   * 
   * @param {SpriteRenderer} renderer 
   */
  constructor(renderer) {
    this.#transcriptView = new TranscriptView(renderer)
    this.#travellerView = new TravellerView(renderer)
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
}