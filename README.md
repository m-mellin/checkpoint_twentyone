# Checkpoint Twentyone

A border control game in the browser. You are the officer at a Swedish checkpoint.
Travellers come to your window one at a time, and you decide who gets in by checking
their passport against the rules of the day.

## Vision

Checkpoint Twentyone is a short, focused puzzle game for anyone who likes paying attention
to details. Every passport tells a story, and some of them are lies. The player must compare
what the passport says with what they can see and measure, approve the genuine ones and deny
the forgeries – under pressure, since every mistake is written down. The game should be easy
to start (one click, no installation), quick to understand, and get harder with each
difficulty, so that it rewards careful reading rather than fast clicking.

## How to play

Currently playable at: https://m-mellin.github.io/checkpoint_twentyone/

1. Choose a difficulty: **Easy**, **Medium** or **Hard**.
2. A traveller walks up to the window and hands over their passport.
3. Drag the passport to the inspection desk on the right to open it.
4. Open the **list of possible discrepancies** the same way, and compare:
   - the passport's details with each other and with the rules in the list,
   - the traveller's real height on the display with the height in the passport,
   - the dates in the passport with today's date on the display.
5. Drag the **approve** or **deny** stamp onto the open passport.
6. Drag the stamped passport back to the traveller in the booth.
7. A wrong decision gives you a **citation** that says what you missed.
   Three citations in one day and the game is over.
8. After 15 travellers the day ends, and a new day begins.

## Requirements

| Id  | Requirement |
| --- | ----------- |
| R1  | The player can start a game by choosing Easy, Medium or Hard on a start screen. |
| R2  | The difficulty decides which nations and which kinds of discrepancies occur (Easy: 4 nations, 4 discrepancies; Medium: 6 and 7; Hard: 10 and 12). |
| R3  | Travellers come to the window one at a time. Their passport is put on the counter when they arrive. |
| R4  | The passport, the list of discrepancies, the stamps and the citations can be dragged between the counter, where they are small, and the inspection desk, where they are large. An item released above the counter falls down onto it. |
| R5  | The open passport shows the holder's details and photo. The displays show the traveller's real height and today's date. |
| R6  | Some passports are forged with exactly one discrepancy, which can be found by comparing the passport with the list, the displays and the traveller. |
| R7  | The player can stamp the open passport as approved or denied. The stamp leaves a mark with today's date and plays a sound. |
| R8  | A stamped passport can be handed back to the traveller. The decision is judged, the traveller leaves and the next one comes. |
| R9  | A wrong decision prints a citation that says what the player missed. |
| R10 | After the last traveller of the day, a screen shows the new day and date. The citations are removed and the items go back to where they started. |
| R11 | Three citations in one day end the game. |
| R12 | The end screen shows the days played, the passports judged right and the passports missed, and lets the player start a new game. |
| R13 | The volume of the background sounds and of the voices can be changed in the settings. |

## For developers

### Run it locally

You need Node.js 24 or later.

```bash
git clone https://github.com/m-mellin/checkpoint_twentyone.git
cd checkpoint_twentyone
npm install
npm run dev
```

Open the address Vite prints, usually http://localhost:5173.

| Command | What it does |
| ------- | ------------ |
| `npm run dev` | Starts the development server. |
| `npm run build` | Builds the game into `dist/`. |
| `npm test` | Runs the unit tests in watch mode. |
| `npm run test:run` | Runs the unit tests once. |
| `npm run lint` | Checks the code with ESLint. |
| `npm run format` | Formats the code with Prettier. |

### Structure

The code follows Model–View–Controller:

```text
src/
├── model/        # The game's rules: nations, people, passports, travellers, forgeries
├── view/         # Everything drawn on the canvas, one class per part of the screen
├── controller/   # Runs the game and handles dragging, clicking and sound
├── repository/   # A small typed collection used by the controllers
├── data/         # Nations, difficulties, discrepancies and portraits as JSON
└── index.js      # Starts the game
```

- **Model** knows nothing about the screen. `TravellerGenerator` creates the travellers of a day
  and forges some of their passports. `GameController` judges the player's decisions.
- **View** draws with `2d-sprite-renderer`. `GameView` creates every other view and is the only
  view the controllers talk to.
- **Controllers** connect the two and react to the player.

### Modules

| Module | Used for |
| ------ | -------- |
| [2d-sprite-renderer](https://github.com/m-mellin/2d-sprite-renderer) (my own) | Draws every image, text and coloured block on the canvas. |
| [dice-rng-toolkit](https://github.com/ThJoker3/Dice-RNG-Toolkit) | Seedable randomness for creating travellers and forgeries, wrapped in `src/model/Random.js`. |

## Credits and licenses

- Code: [MIT](LICENSE)
- Font: [Press Start 2P](https://fonts.google.com/specimen/Press+Start+2P) by CodeMan38, SIL Open Font License
- Stamp sound: [Pixabay](https://pixabay.com/sound-effects/film-special-effects-traditional-stamp-44189/), Pixabay Content License
- Other sounds: Where created using ChatGPT 6, with some cropping made with online tools.
- Images and portraits: Where created using ChatGPT 6, with some changes made with photoshop.
