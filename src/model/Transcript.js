// import { TextSprite } from '2d-sprite-renderer'

// /**
//  * A line of text in a transcript. Wraps a TextSprite and knows its own size.
//  */
// export class Transcript {
//   /**
//    * The sprite that draws the text. Holds the text, color, font and position.
//    *
//    * @type {TextSprite}
//    */
//   #sprite

//   /**
//    * The width of the text in pixels.
//    *
//    * @type {number}
//    */
//   #width = 0

//   /**
//    * The height of the text in pixels.
//    *
//    * @type {number}
//    */
//   #height = 0

//   /**
//    * Shared context used only for measuring text.
//    *
//    * @type {CanvasRenderingContext2D | null}
//    */
//   static #context = document.createElement('canvas').getContext('2d')

//   /**
//    * Creates a Transcript.
//    *
//    * @param {string} text - The text to draw.
//    * @param {string} textColor - The CSS color of the text.
//    * @param {string} [font='16px sans-serif'] - The CSS font of the text.
//    */
//   constructor(text, textColor, font = '16px sans-serif') {
//     this.#sprite = new TextSprite(text, { color: textColor, font })
//     this.#measureTextAndSetSize()
//   }

//   /**
//    * Returns the sprite that draws the text.
//    *
//    * @returns {TextSprite} The sprite.
//    */
//   get sprite() {
//     return this.#sprite
//   }

//   /**
//    * Returns the text.
//    *
//    * @returns {string} The text.
//    */
//   get text() {
//     return this.#sprite.text
//   }

//   /**
//    * Sets the text and measures its new size.
//    *
//    * @param {string} text - The text to draw.
//    */
//   set text(text) {
//     this.#sprite.text = text
//     this.#measureTextAndSetSize()
//   }

//   /**
//    * Returns the CSS color of the text.
//    *
//    * @returns {string} The CSS color.
//    */
//   get textColor() {
//     return this.#sprite.color
//   }

//   /**
//    * Sets the CSS color of the text.
//    *
//    * @param {string} textColor - The CSS color.
//    */
//   set textColor(textColor) {
//     this.#sprite.color = textColor
//   }

//   /**
//    * Returns the X coordinate of the text.
//    *
//    * @returns {number} The X coordinate in pixels.
//    */
//   get x() {
//     return this.#sprite.x
//   }

//   /**
//    * Sets the X coordinate of the text.
//    *
//    * @param {number} x - The X coordinate in pixels.
//    */
//   set x(x) {
//     this.#sprite.x = x
//   }

//   /**
//    * Returns the Y coordinate of the top of the text.
//    *
//    * @returns {number} The Y coordinate in pixels.
//    */
//   get y() {
//     return this.#sprite.y
//   }

//   /**
//    * Sets the Y coordinate of the top of the text.
//    *
//    * @param {number} y - The Y coordinate in pixels.
//    */
//   set y(y) {
//     this.#sprite.y = y
//   }

//   /**
//    * Returns the width of the text.
//    *
//    * @returns {number} The width in pixels.
//    */
//   get width() {
//     return this.#width
//   }

//   /**
//    * Returns the height of the text.
//    *
//    * @returns {number} The height in pixels.
//    */
//   get height() {
//     return this.#height
//   }

//   /**
//    * Measures the text with the sprite's font and stores its width and height.
//    */
//   #measureTextAndSetSize() {
//     const context = Transcript.#context
//     if (context === null)
//       throw new Error('Could not create a 2D context for measuring text')

//     context.font = this.#sprite.font
//     const metrics = context.measureText(this.#sprite.text)

//     this.#width = Math.ceil(metrics.width)
//     this.#height = Math.ceil(
//       metrics.fontBoundingBoxAscent + metrics.fontBoundingBoxDescent
//     )
//   }
// }
