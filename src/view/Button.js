import { Sprite } from '2d-sprite-renderer'

export class Button {
  #sprite
  #onClick

  constructor(renderer, { src, x, y, width, height, onClick }) {
    this.#sprite = new Sprite(src, { x, y, width, height })
    this.#onClick = onClick

    renderer.add(this.#sprite)
  }

  contains(x, y) {
    return (
      x >= this.#sprite.x &&
      x <= this.#sprite.x + this.#sprite.width &&
      y >= this.#sprite.y &&
      y <= this.#sprite.y + this.#sprite.height
    )
  }

  click() {
    this.#onClick()
  }
}
