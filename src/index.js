import { Sprite, SpriteAnimation, SpriteRegion, SpriteRenderer } from '2d-sprite-renderer'
import './style.css'
import { TranscriptDocument } from './model/TranscriptDocument'
import { Transcript } from './model/Transcript'
import { Repository } from './repository/Repository'
import { Nation } from './model/Nation.js'
import { NationController } from './controller/NationController'
import { TravellerGenerator } from './model/TravellerGenerator'

const GAME_WIDTH = 1920
const GAME_HEIGHT = 1080

const canvas = document.createElement('canvas')
canvas.width = GAME_WIDTH
canvas.height = GAME_HEIGHT

const PIXEL_FONT = '16px "Press Start 2P"'

const renderer = new SpriteRenderer(canvas)

const body = document.querySelector('body')
body?.appendChild(canvas)

const travellersSrc = 'assets/travellers.png'
const travellers = new Sprite(travellersSrc, {x: 960, y: 108, width: 240 * 2, height: 187 * 2 })

const boardSrc = 'assets/desk3.png'
const board = new Sprite(boardSrc, { x: 760, y: 0, width: 1536 / 1.7, height: 1824 / 1.7 })

const transcriptSrc = 'assets/transkript.png'
const transcript = new Sprite(transcriptSrc, {x: 0, y: 0, width: 1272 / 1.7, height: 1824 / 1.7 })

const travellerOne = new SpriteRegion({x: 31, y: 0, width: 240, height: 187})
travellers.region = travellerOne

const nationController = new NationController()
const now = new Date()
const generator = new TravellerGenerator(new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate())))
generator.createPeople(20, nationController.nations)
// const travellerController = new TravellerController()
// travellerController.createTraveller(5, nationController.nations)

// console.log(travellerController.travellers.getAllItems())

const travellerEffect = [
  new SpriteRegion({x: 31, y: 0, width: 240, height: 187}),
  new SpriteRegion({x: 31, y: -1, width: 240, height: 187}),
  new SpriteRegion({x: 31, y: -2, width: 240, height: 187}),
  new SpriteRegion({x: 31, y: -3, width: 240, height: 187}),
  new SpriteRegion({x: 31, y: -4, width: 240, height: 187}),
  new SpriteRegion({x: 31, y: -5, width: 240, height: 187}),
  new SpriteRegion({x: 31, y: -6, width: 240, height: 187}),
  new SpriteRegion({x: 31, y: -5, width: 240, height: 187}),
  new SpriteRegion({x: 31, y: -4, width: 240, height: 187}),
  new SpriteRegion({x: 31, y: -3, width: 240, height: 187}),
  new SpriteRegion({x: 31, y: -2, width: 240, height: 187}),
  new SpriteRegion({x: 31, y: -1, width: 240, height: 187}),
]
const travellerAnimation = new SpriteAnimation(travellerEffect, 400)

const lightEffect = new Sprite(`assets/effect.png`, {x: 639+760, y: 201, width: 24, height: 23})
const lightRegion = [
  new SpriteRegion({x: 0, y: 0, width: 24, height: 24}),
  new SpriteRegion({x: 24, y: 0, width: 24, height: 24}),
  new SpriteRegion({x: 48, y: 0, width: 24, height: 24}),
  new SpriteRegion({x: 72, y: 0, width: 24, height: 24}),
  new SpriteRegion({x: 96, y: 0, width: 24, height: 24}),
  new SpriteRegion({x: 120, y: 0, width: 24, height: 24}),
  new SpriteRegion({x: 144, y: 0, width: 24, height: 24}),
  new SpriteRegion({x: 168, y: 0, width: 24, height: 24}),
  new SpriteRegion({x: 192, y: 0, width: 24, height: 24}),
  new SpriteRegion({x: 216, y: 0, width: 24, height: 24}),
]
const lightAnimation = new SpriteAnimation(lightRegion, 400)

const transcriptDocument = new TranscriptDocument()

// const transcriptOne = new TextSprite('ERIK LINDQVIST', {
//   font: PIXEL_FONT,
//   x: 60,
//   color: '#2b2b2b'
// })
// const transcriptTwo = new TextSprite('ERIK LINDQVIST', {
//   font: PIXEL_FONT,
//   x: 60,
//   color: '#2b2b2b'
// })
// const transcriptThree = new TextSprite('ERIK LINDQVIST', {
//   font: PIXEL_FONT,
//   x: 60,
//   color: '#2b2b2b'
// })

await document.fonts.load(PIXEL_FONT)

const transcriptOne = new Transcript('ERIK LINDQVIST', '#2b2b2b', PIXEL_FONT)
const transcriptTwo = new Transcript('ERIK LINDQVIST', '#2b2b2b', PIXEL_FONT)
const transcriptThree = new Transcript('ERIK LINDQVIST', '#2b2b2b', PIXEL_FONT)

const nations = new Repository(Nation)
const transcripts = new Repository(Transcript)
transcripts.add(transcriptOne)
transcripts.add(transcriptTwo)
transcripts.add(transcriptThree)

console.log(transcripts.getAllItems())

transcriptDocument.addTranscript(transcriptOne)
transcriptDocument.addTranscript(transcriptTwo)
transcriptDocument.addTranscript(transcriptThree)

// const transcriptMeasureOne = transcriptContainer.measureText(transcriptOne)
// const transcriptMeasureTwo = transcriptContainer.measureText(transcriptTwo)
// const transcriptMeasureThree = transcriptContainer.measureText(transcriptThree)

// transcriptOne.y = 20
// transcriptTwo.y = transcriptOne.y + transcriptMeasureOne.height
// transcriptThree.y = transcriptTwo.y + transcriptMeasureThree.height

renderer.add(board)
renderer.add(travellers)
renderer.add(lightEffect)
renderer.add(transcript)
renderer.add(transcriptOne.sprite)
renderer.add(transcriptTwo.sprite)
renderer.add(transcriptThree.sprite)
renderer.render()

let previousTimestamp = 0;

/**
 * Runs the main game loop, updating the current animation and
 * re-rendering the character each frame.
 *
 * @param {number} timestamp - The current frame time, provided by requestAnimationFrame.
 * @returns {void}
 */
function gameLoop (timestamp) {
  const deltaTime = timestamp - previousTimestamp
  previousTimestamp = timestamp

  lightAnimation.update(deltaTime)
  travellerAnimation.update(deltaTime)

  lightEffect.region = lightAnimation.region
  travellers.region = travellerAnimation.region
  renderer.render()

  requestAnimationFrame(gameLoop)
}

requestAnimationFrame(gameLoop)