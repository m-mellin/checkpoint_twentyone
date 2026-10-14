import { Sprite, SpriteRenderer } from "2d-sprite-renderer"

const TRANSCRIPT_VIEW_SRC = 'assets/transkript.png'

/**
 * 
 */
export class TranscriptView {
  #transcript = new Sprite(TRANSCRIPT_VIEW_SRC, {x: 0, y: 0, width: 1272 / 1.7, height: 1824 / 1.7})

  /**
   * 
   * @param {SpriteRenderer} renderer 
   */
  constructor (renderer) {
    renderer.add(this.#transcript)
  }
}