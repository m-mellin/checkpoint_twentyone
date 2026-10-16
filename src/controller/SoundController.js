import { Sound } from "../model/Sound"

export class SoundController {
  /**
   * @type {Sound[]}
   */
  #sounds = []

  /**
   * 
   * @param {Sound} sound 
   */
  add(sound) {
    this.#sounds.push(sound)
  }

  /**
   * 
   * @param {Sound} sound 
   */
  remove(sound) {
    const index = this.#sounds.indexOf(sound)

    if (index === -1) {
      throw new RangeError('Sound not found')
    }

    this.#sounds.splice(index, 1)
  }

  /**
   * 
   * @param {Sound} sound 
   */
  play(sound) {
    sound.play()
  }

  /**
   * 
   * @param {Sound} sound 
   * @param {number} volume 
   */
  setVolume(sound, volume) {
    sound.volume = volume
  }
}