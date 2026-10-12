import { TextSprite } from "2d-sprite-renderer"

export class Transcript {
  /**
   * The TextSprites managed by the Transcript Class
   * 
   * @type {Array<TextSprite>}
   */
  #texts

  /**
   * @type {number}
   */
  #x

  /**
   * @type {number}
   */
  #y

  /**
   * @type {CanvasRenderingContext2D | null}
   */
  #context = document.createElement('canvas').getContext('2d')
  
  constructor () {
    this.#texts = []
  }

  /**
   * 
   * @param {TextSprite} sprite 
   */
  addTranscript (sprite) {
    this.#texts.push(sprite)
  }

  /**
   * 
   * @returns {Array<TextSprite>}
   */
  getTranscripts () {
    return Array.from(this.#texts)
  }

  /**
   * 
   */
  clearTranscript () {
    this.#texts = []
  }

  /**
   * 
   * @param {TextSprite} sprite 
   * @returns 
   */
  measureText (sprite) {
    if (this.#context == null) throw new Error('Can not be null')

    this.#context.font = sprite.font
    const metrics = this.#context.measureText(sprite.text)

    return {
      width: Math.ceil(metrics.width),
      height: Math.ceil(metrics.fontBoundingBoxAscent + metrics.fontBoundingBoxDescent)
    }
  }
  
  #setTextSpritePosition() {
    for (let sprite of this.#texts) {
      
    }
  }
}