import { SpriteRenderer } from '2d-sprite-renderer'
import './style.css'
import { GameController } from './controller/GameController.js'
import { GameView } from './view/GameView'
import { DragController } from './controller/DragController'
import { SoundController } from './controller/SoundController'
import { ClickController } from './controller/ClickController'

const GAME_WIDTH = window.innerWidth
const GAME_HEIGHT = window.innerHeight
const MAX_DELTA_TIME = 100

const canvas = document.createElement('canvas')
canvas.width = GAME_WIDTH
canvas.height = GAME_HEIGHT

const body = document.querySelector('body')
body?.appendChild(canvas)

const renderer = new SpriteRenderer(canvas)

const soundController = new SoundController()

soundController.createSound('Ambient_Talking', '/assets/ambient_talking.wav')
soundController.createSound('Ambient_Music', '/assets/ambient.wav')
soundController.createSound('Document', '/assets/dokument_tack.wav')
soundController.createSound('Stamp', '/assets/stamp.mp3')

soundController.play('Ambient_Talking')
soundController.loop('Ambient_Talking')

soundController.play('Ambient_Music')
soundController.loop('Ambient_Music')

const gameView = new GameView(renderer, {
  gameWidth: GAME_WIDTH,
  gameHeight: GAME_HEIGHT,
  volumeSettings: [
    {
      label: 'Ambient volume',
      onChange: (value) => soundController.setVolume('Ambient_Talking', value) + soundController.setVolume('Ambient_Music', value)
    },
    {
      label: 'Voice volume',
      onChange: (value) => soundController.setVolume('Document', value)
    }
  ]
})

const clickController = new ClickController(canvas, gameView.buttons)

new DragController(
  canvas,
  [gameView.passport, ...gameView.stamps, ...gameView.volumeSliders],
  (dropped) => gameView.dropped(dropped)
)

const gameController = new GameController()
gameController.startGame('easy')
gameView.gameDate = gameController.gameDate



const PIXEL_FONT = '16px "Press Start 2P"'

/**
 * @type {number | null}
 */
let previousTimestamp = null


function callNextTraveller() {
  const traveller = gameController.callNextTraveller()

  if (traveller === null) {
    gameView.travellerLeaves()
  } else {
    gameView.showTraveller(traveller)
  }
}
setTimeout(() => soundController.play('Document'), 2100)
callNextTraveller()

gameView.onPassportReturned = () => {
  callNextTraveller()
  setTimeout(() => soundController.play('Document'), 4500)
}

gameView.onStamp = () => {
  soundController.play('Stamp')
}


/**
 * GameLoop
 *
 * @param {number} timestamp
 */
function gameLoop(timestamp) {
  const deltaTime = previousTimestamp === null ? 0 : timestamp - previousTimestamp
  previousTimestamp = timestamp

  gameView.update(Math.min(deltaTime, MAX_DELTA_TIME))
  renderer.render()

  requestAnimationFrame(gameLoop)
}

await document.fonts.load(PIXEL_FONT)
requestAnimationFrame(gameLoop)

// const travellersSrc = 'assets/travellers.png'
// const travellers = new Sprite(travellersSrc, {
//   x: 960,
//   y: 108,
//   width: 240 * 2,
//   height: 187 * 2
// })

// const boardSrc = 'assets/desk3.png'
// const board = new Sprite(boardSrc, {
//   x: 760,
//   y: 0,
//   width: 1536 / 1.7,
//   height: 1824 / 1.7
// })

// const transcriptSrc = 'assets/transkript.png'
// const transcript = new Sprite(transcriptSrc, {
//   x: 0,
//   y: 0,
//   width: 1272 / 1.7,
//   height: 1824 / 1.7
// })

// const travellerOne = new SpriteRegion({ x: 31, y: 0, width: 240, height: 187 })
// travellers.region = travellerOne

// const travellerEffect = [
//   new SpriteRegion({ x: 31, y: 0, width: 240, height: 187 }),
//   new SpriteRegion({ x: 31, y: -1, width: 240, height: 187 }),
//   new SpriteRegion({ x: 31, y: -2, width: 240, height: 187 }),
//   new SpriteRegion({ x: 31, y: -3, width: 240, height: 187 }),
//   new SpriteRegion({ x: 31, y: -4, width: 240, height: 187 }),
//   new SpriteRegion({ x: 31, y: -5, width: 240, height: 187 }),
//   new SpriteRegion({ x: 31, y: -6, width: 240, height: 187 }),
//   new SpriteRegion({ x: 31, y: -5, width: 240, height: 187 }),
//   new SpriteRegion({ x: 31, y: -4, width: 240, height: 187 }),
//   new SpriteRegion({ x: 31, y: -3, width: 240, height: 187 }),
//   new SpriteRegion({ x: 31, y: -2, width: 240, height: 187 }),
//   new SpriteRegion({ x: 31, y: -1, width: 240, height: 187 })
// ]
// const travellerAnimation = new SpriteAnimation(travellerEffect, 400)

// const lightEffect = new Sprite(`assets/effect.png`, {
//   x: 639 + 760,
//   y: 201,
//   width: 24,
//   height: 23
// })
// const lightRegion = [
//   new SpriteRegion({ x: 0, y: 0, width: 24, height: 24 }),
//   new SpriteRegion({ x: 24, y: 0, width: 24, height: 24 }),
//   new SpriteRegion({ x: 48, y: 0, width: 24, height: 24 }),
//   new SpriteRegion({ x: 72, y: 0, width: 24, height: 24 }),
//   new SpriteRegion({ x: 96, y: 0, width: 24, height: 24 }),
//   new SpriteRegion({ x: 120, y: 0, width: 24, height: 24 }),
//   new SpriteRegion({ x: 144, y: 0, width: 24, height: 24 }),
//   new SpriteRegion({ x: 168, y: 0, width: 24, height: 24 }),
//   new SpriteRegion({ x: 192, y: 0, width: 24, height: 24 }),
//   new SpriteRegion({ x: 216, y: 0, width: 24, height: 24 })
// ]
// const lightAnimation = new SpriteAnimation(lightRegion, 400)

// const transcriptDocument = new TranscriptDocument()

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

// const transcriptOne = new Transcript('ERIK LINDQVIST', '#2b2b2b', PIXEL_FONT)
// const transcriptTwo = new Transcript('ERIK LINDQVIST', '#2b2b2b', PIXEL_FONT)
// const transcriptThree = new Transcript('ERIK LINDQVIST', '#2b2b2b', PIXEL_FONT)

// const transcripts = new Repository(Transcript)
// transcripts.add(transcriptOne)
// transcripts.add(transcriptTwo)
// transcripts.add(transcriptThree)

// transcriptDocument.addTranscript(transcriptOne)
// transcriptDocument.addTranscript(transcriptTwo)
// transcriptDocument.addTranscript(transcriptThree)

// renderer.add(travellers)
// renderer.add(lightEffect)
// renderer.add(transcriptOne.sprite)
// renderer.add(transcriptTwo.sprite)
// renderer.add(transcriptThree.sprite)
// renderer.render()

// let previousTimestamp = 0

// /**
//  * Runs the main game loop, updating the current animation and
//  * re-rendering the character each frame.
//  *
//  * @param {number} timestamp - The current frame time, provided by requestAnimationFrame.
//  * @returns {void}
//  */
// function gameLoop(timestamp) {
//   const deltaTime = timestamp - previousTimestamp
//   previousTimestamp = timestamp

//   // lightAnimation.update(deltaTime)
//   // travellerAnimation.update(deltaTime)

//   // lightEffect.region = lightAnimation.region
//   // travellers.region = travellerAnimation.region
//   renderer.render()

//   requestAnimationFrame(gameLoop)
// }

// requestAnimationFrame(gameLoop)
