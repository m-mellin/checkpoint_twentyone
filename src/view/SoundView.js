import { BlockSprite, TextSprite } from "2d-sprite-renderer";
import { TextLine } from "./TextLine";
import { SliderView } from "./SliderView";

export class SoundView {
  #volumeSlider

  constructor(renderer, gameWidth, gameHeight, onAmbientVolumeChange) {
    const background = new BlockSprite(gameWidth, gameHeight, {x: 0, y: 0, color: 'rgba(0, 0, 0, 0.9)'})
    const title = new TextLine('SOUND SETTINGS', {color: 'rgba(255, 255, 255, 1)', font: '18px "Press Start 2P"'})
    title.x = (gameWidth - title.width) / 2
    title.y = gameHeight / 4

    renderer.add(background)
    renderer.add(title.sprite)

    this.#volumeSlider = new SliderView(renderer, {
      label: 'Ambient volume',
      x: gameWidth / 2 - 200,
      y: gameHeight / 2,
      width: 400,
      onChange: onAmbientVolumeChange
    })
  }

  get volumeSlider() {
    return this.#volumeSlider
  }
}