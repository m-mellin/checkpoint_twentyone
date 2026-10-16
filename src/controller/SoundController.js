import { Sound } from './Sound'

/**
 * Keeps track of the game's sounds by name, and plays them and sets their volume.
 */
export class SoundController {
  /**
   * Every sound that has been created.
   *
   * @type {Sound[]}
   */
  #sounds = []

  /**
   * Creates a sound that can later be played by its name.
   *
   * @param {string} name - The name to use for the sound, for example "Stamp".
   * @param {string} src - The path to the sound file.
   * @throws {Error} If a sound with the name already exists.
   */
  createSound(name, src) {
    if (this.#sounds.some((s) => s.name === name)) {
      throw new Error(`A sound named ${name} already exists`)
    }

    this.#sounds.push(new Sound(name, src))
  }

  /**
   * Plays a sound from the start.
   *
   * @param {string} name - The name of the sound.
   * @throws {RangeError} If there is no sound with the name.
   */
  play(name) {
    this.#findSound(name).play()
  }

  /**
   * Makes a sound start over when it ends.
   *
   * @param {string} name - The name of the sound.
   * @throws {RangeError} If there is no sound with the name.
   */
  loop(name) {
    this.#findSound(name).loop()
  }

  /**
   * Sets the volume of a sound.
   *
   * @param {string} name - The name of the sound.
   * @param {number} volume - The volume, from 0 (silent) to 1 (full).
   * @throws {RangeError} If there is no sound with the name.
   */
  setVolume(name, volume) {
    this.#findSound(name).volume = volume
  }
  
  /**
   * Returns the sound with the given name.
   *
   * @param {string} name - The name of the sound.
   * @returns {Sound} The sound.
   * @throws {RangeError} If there is no sound with the name.
   */
  #findSound(name) {
    const sound = this.#sounds.find((s) => s.name === name)

    if (!sound) {
      throw new TypeError(`${name} does not exists as a sound`)
    }

    return sound
  }
}
