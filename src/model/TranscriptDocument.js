import { Transcript } from './Transcript'

/**
 * A document that stacks transcripts vertically, one below the other.
 */
export class TranscriptDocument {
  /**
   * The transcripts in the document, in order from top to bottom.
   *
   * @type {Array<Transcript>}
   */
  #texts = []

  /**
   * The X coordinate of every transcript in pixels.
   *
   * @type {number}
   */
  #x = 60

  /**
   * The Y coordinate of the first transcript in pixels.
   *
   * @type {number}
   */
  #y = 20

  /**
   * The vertical space between two transcripts in pixels.
   *
   * @type {number}
   */
  #distance

  /**
   * Creates a TranscriptDocument.
   *
   * @param {number} [distance=60] - The vertical space between two transcripts in pixels.
   */
  constructor(distance = 60) {
    this.#distance = distance
  }

  /**
   * Adds a transcript at the bottom of the document.
   *
   * @param {Transcript} transcript - The transcript to add.
   */
  addTranscript(transcript) {
    this.#texts.push(transcript)
    this.#setTranscriptPosition()
  }

  /**
   * Returns a copy of the list of transcripts.
   *
   * @returns {Array<Transcript>} The transcripts, from top to bottom.
   */
  getTranscripts() {
    return Array.from(this.#texts)
  }

  /**
   * Removes all transcripts from the document.
   */
  clearTranscript() {
    this.#texts = []
  }

  /**
   * Places each transcript below the previous one.
   */
  #setTranscriptPosition() {
    let y = this.#y

    for (const transcript of this.#texts) {
      transcript.x = this.#x
      transcript.y = y
      y += transcript.height + this.#distance
    }
  }
}
