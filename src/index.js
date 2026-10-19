import './style.css'
import { App } from './App.js'

/**
 * The pixel font used for all text. It must be loaded before any text is measured.
 */
const PIXEL_FONT = '16px "Press Start 2P"'

await document.fonts.load(PIXEL_FONT)

const canvas = document.createElement('canvas')
canvas.width = window.innerWidth
canvas.height = window.innerHeight
document.body.appendChild(canvas)

new App(canvas).start()