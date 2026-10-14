import { Sprite, SpriteRenderer } from "2d-sprite-renderer";

const DESK_SRC = 'assets/inspection_desk.png'

/**
 * 
 */
export class DeskView {
  #desk = new Sprite(DESK_SRC, {x: 1370, y: 0, width: 950, height: 1150})

  /**
   * 
   * @param {SpriteRenderer} renderer 
   */
  constructor(renderer) {
    renderer.add(this.#desk)
  }
}