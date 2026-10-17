import { SpriteRenderer } from '2d-sprite-renderer'
import './style.css'
import { GameController } from './controller/GameController.js'
import { GameView } from './view/GameView'
import { DragController } from './controller/DragController'
import { SoundController } from './controller/SoundController'
import { ClickController } from './controller/ClickController'
import { DISCREPANCY_TEXTS } from './view/DiscrepancyView'

const PIXEL_FONT = '16px "Press Start 2P"'
await document.fonts.load(PIXEL_FONT)

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
soundController.createSound('Next', '/assets/next_tack.wav')

soundController.setVolume('Ambient_Music', 0)
soundController.setVolume('Document', 0)
soundController.setVolume('Ambient_Talking', 0)

soundController.play('Ambient_Talking')
soundController.loop('Ambient_Talking')

soundController.play('Ambient_Music')
soundController.loop('Ambient_Music')

const gameController = new GameController()
gameController.startGame('hard')

const gameView = new GameView(renderer, {
  gameWidth: GAME_WIDTH,
  gameHeight: GAME_HEIGHT,
  difficulty: gameController.difficulty,
  volumeSettings: [
    {
      label: 'Ambient volume',
      onChange: (value) =>
        soundController.setVolume('Ambient_Talking', value) +
        soundController.setVolume('Ambient_Music', value)
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
  [
    gameView.passport,
    gameView.discrepancyList,
    ...gameView.stamps,
    ...gameView.citations,
    ...gameView.volumeSliders
  ],
  (dropped) => gameView.dropped(dropped)
)

gameView.gameDate = gameController.gameDate

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

gameView.onPassportReturned = (approved) => {
  const { isCorrect, discrepancy } = gameController.judge(approved)
  if (!isCorrect) {
    console.log('Incorrect')
    const reason = discrepancy ? DISCREPANCY_TEXTS[discrepancy.code] : 'DENIED A VALID PASSPORT'
    gameView.addCitation(reason)
  }

  callNextTraveller()
  setTimeout(() => soundController.play('Next'), 1000)
  setTimeout(() => soundController.play('Document'), 4000)
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
  const deltaTime =
    previousTimestamp === null ? 0 : timestamp - previousTimestamp
  previousTimestamp = timestamp

  gameView.update(Math.min(deltaTime, MAX_DELTA_TIME))
  renderer.render()

  requestAnimationFrame(gameLoop)
}


requestAnimationFrame(gameLoop)
