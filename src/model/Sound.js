export class Sound {

  /**
   * @type {string}
   */
  #name

  /**
   * @type {HTMLAudioElement}
   */
  #sound

  constructor(name, sound) {
    this.#name = name
    this.#sound = sound
  }

  get name() {
    return this.#name
  }

  get sound() {
    return this.#sound
  }

  play() {
    this.#sound.play()
  }

  loop() {
    this.#sound.loop = true
  }

  get volume() {
    return this.#sound.volume
  }

  set volume(value) {
    this.#sound.volume = value
  }
}