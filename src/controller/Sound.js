/**
 * A named sound the game can play, for example the stamp or the background music.
 */
export class Sound {
  /**
   * The name of the Sound object.
   *
   * @type {string}
   */
  #name

  /**
   * The audio element.
   *
   * @type {HTMLAudioElement}
   */
  #sound

  /**
   * Creates a sound from a sound file.
   *
   * @param {string} name - The name used to find the sound, for example "Stamp".
   * @param {string} src - The path to the sound file.
   */
  constructor(name, src) {
    this.#name = name
    this.#sound = new Audio(src)
  }

  /**
   * Returns the name of the sound.
   *
   * @returns {string} The name, for example "Stamp".
   */
  get name() {
    return this.#name
  }

  /**
   * Returns the volume of the audio element.
   *
   * @returns {number} The volume, from 0 (silent) to 1 (full).
   */
  get volume() {
    return this.#sound.volume
  }

  /**
   * Sets the volume of the audio element.
   *
   * @param {number} value - The volume, from 0 (silent) to 1 (full).
   * @throws {RangeError} If the volume is not between 0 and 1.
   */
  set volume(value) {
    if (!Number.isFinite(value) || value < 0 || value > 1) {
      throw new RangeError('volume must be between 0 and 1')
    }

    this.#sound.volume = value
  }

  /**
   * Plays the sound from the start. Does nothing if the browser blocks it,
   * for example before the player has clicked on the page.
   */
  play() {
    this.#sound.currentTime = 0
    this.#sound.play().catch(() => {})
  }

  /**
   * Pauses the sound from playing and resets it to the start of the track.
   */
  stop() {
    this.#sound.pause()
    this.#sound.currentTime = 0
  }

  /**
   * Makes the sound start over each time it ends.
   */
  loop() {
    this.#sound.loop = true
  }
}
