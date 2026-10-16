export class ClickController {
  #canvas
  #buttons

  constructor(canvas, buttons) {
    this.#canvas = canvas
    this.#buttons = buttons

    canvas.addEventListener('click', (event) => this.#click(event))
  }

  #click(event) {
    const rect = this.#canvas.getBoundingClientRect()
    const x = (event.clientX - rect.left) * (this.#canvas.width / rect.width)
    const y = (event.clientY - rect.top) * (this.#canvas.height / rect.height)

    const button = this.#buttons.find((b) => b.contains(x, y))

    if (button) {
      button.click()
    }
  }
}