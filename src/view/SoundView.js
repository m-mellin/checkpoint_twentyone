import { BlockSprite, TextSprite } from "2d-sprite-renderer";
import { TextLine } from "./TextLine";
import { SliderView } from "./SliderView";

const SLIDER_WIDTH = 400
const SLIDER_DISTANCE = 100

export class SoundView {
  #volumeSliders

  constructor(renderer, gameWidth, gameHeight, volumeSettings) {
    const background = new BlockSprite(gameWidth, gameHeight, {x: 0, y: 0, color: 'rgba(0, 0, 0, 0.9)'})
    const title = new TextLine('SOUND SETTINGS', {color: 'rgba(255, 255, 255, 1)', font: '18px "Press Start 2P"'})
    title.x = (gameWidth - title.width) / 2
    title.y = gameHeight / 4

    renderer.add(background)
    renderer.add(title.sprite)

    this.#volumeSliders = volumeSettings.map((setting, index) => new SliderView(renderer, {
      label: setting.label,
      x: (gameWidth - SLIDER_WIDTH) / 2,
      y: gameHeight / 2 + index * SLIDER_DISTANCE,
      width: SLIDER_WIDTH,
      onChange: setting.onChange
    }))
  }

  get volumeSliders() {
    return this.#volumeSliders
  }
}