import { Sound } from "../model/Sound"

export class SoundController {
  /**
   * @type {Sound[]}
   */
  #sounds = []

  createSound(name, sound) {
    this.#add(new Sound(name, new Audio(sound)))
  }

  /**
   * 
   * @param {Sound} sound 
   */
  #add(sound) {
    this.#sounds.push(sound)
  }

  /**
   * 
   * @param {string} name 
   */
  play(name) {
    this.#findSound(name).play()
  }

  loop(name) {
    this.#findSound(name).loop()
  }

  /**
   * 
   * @param {string} name 
   * @param {number} volume 
   */
  setVolume(name, volume) {
    this.#findSound(name).volume = volume
  }

  #findSound(name) {
    const sound = this.#sounds.find((s) => s.name === name)

    if (!sound) {
      throw new TypeError(`${name} does not exists as a sound`)
    }

    return sound
  }
}