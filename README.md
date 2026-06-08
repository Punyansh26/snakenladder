# 🎲 Ultimate Snakes & Ladders: Strategy Edition

A premium, highly animated, and responsive **Snakes & Ladders** game built using React, TypeScript, Vite, TailwindCSS v4, and Framer Motion. 

This is not just a classic automated board game; it is a **Strategy Edition** featuring custom **Power-Up Cards**, **Dynamic Themes**, **Programmatic Audio Synthesis**, and four levels of **Mathematically Optimized AI Opponents**.

---

## ✨ Key Features

### 🎮 Gameplay & Game Modes
* **Local Player vs Player**: Pass-and-play turn-based mode with full player indicators and logs.
* **Player vs Computer**: Battle against modular computer brains in easy, medium, hard, or impossible modes.
* **Exact Landing Win Logic**: Landing exactly on tile 100 is required to win. Overshooting keeps the player in place.
* **Persistent Session (Save & Resume)**: State is synchronized to `localStorage` dynamically, letting you refresh or leave the tab without losing game progress.
* **Achievement System**: Unlock rewards like *Snake Survivor*, *Ladder Master*, *Lucky Roller*, and *AI Crusher*!

### 🎒 Strategic Power-Ups (Strategy Mode)
Unlike traditional versions where outcomes are purely random, players are equipped with strategic cards to tilt the odds:
* 🛡️ **Shield**: Passive protection. Automatically consumes 1 charge to block slides when landing on a snake.
* 🔄 **Reroll**: Active card. Lets you discard your roll outcome and roll again.
* ⚡ **Boost**: Active card. Adds a flat **+2** to your roll to leap over snake zones.
* 🟢 **Safe Roll**: Active card. Replaces standard die (1-6) with a safe die (1-3) to carefully bypass hazards.
* 🎲 *Extra Turn Reward*: Rolling a **6** grants an extra turn and awards a random power-up card!

### 🧠 Mathematically Optimized AI Opponents
* 🟢 **Easy AI**: Makes random rolls and occasionally uses cards without strategy.
* 🟡 **Medium AI**: Uses simple heuristics to deploy shields or safe rolls when snakes are within 6 cells.
* 🟠 **Hard AI**: Expected Value (EV) calculator. Projects outcomes 1 turn ahead to select the best card/dice choice.
* 🔴 **Impossible AI**: Uses **Value Iteration** on a Markov Decision Process (MDP) to precompute the exact expected turns to win from every tile, playing the mathematically perfect card at all times.

### 🎹 Programmatic Web Audio Synthesizer
* **0-Byte Footprint**: Uses the browser's native `AudioContext` to synthesize audio waves on-the-fly. No heavy MP3/WAV files to load, meaning it works 100% offline and loads instantly.
* **Dynamic Sound Effects**: Custom envelopes for dice roll rumbles, rising arpeggios for ladders, pitch-bending swoops for snakes, clicks for hops, and fanfares for victory.
* **Background Music**: Low-volume synthesized ambient chord loops with master mute controls.

### 🎨 Visuals, Themes, and Animations
* **60 FPS Smooth Movement**: Framer Motion controls vertical hopping arc vectors tile-by-tile instead of sliding straight across.
* **SVG Vector Canvas Overlay**: Curved winding snake bodies (with tongues and glowing eyes) and detailed parallel ladder rails scale dynamically to any responsive screen width.
* **3D CSS Rotating Die**: A true 3D cube utilizing CSS 3D transforms that tumbles, glows, and lands on the rolled face.
* **Thematic Board Swaps**:
  * 🪵 *Classic Wood*: Warm parchment board tiles with wood borders and serif fonts.
  * 🌌 *Space Galaxy*: Starry background, nebula tiles, cosmic energy beams, and glowing trails.
  * 🎛️ *Neon Cyberpunk*: Glow borders, scanner grids, cyberpunk fonts, and pink/cyan vectors.
  * 🌿 *Jungle Nature*: Earth borders, foliage tiles, and leaf vectors.

---

## 🛠️ Tech Stack

* **Core**: React 19, TypeScript
* **Build System**: Vite 8
* **Styling**: Tailwind CSS v4.0 (utilizing `@tailwindcss/vite` plugin compilation)
* **Animations**: Framer Motion
* **Vector Graphics & UI Icons**: SVG, React Icons (Gi, Fa)
* **Visual Effects**: HTML5 Canvas particle generator, `canvas-confetti` (fireworks)

---

## 📂 Project Structure

```bash
src/
├── ai/
│   └── aiEngine.ts            # Dynamic programming & expected value AI calculations
├── assets/                    # Static images and SVGs
├── components/
│   ├── Animations/
│   │   └── ScreenWrapper.tsx  # Framer Motion transitions for screen changes
│   ├── Board/
│   │   ├── Board.tsx          # 10x10 Grid wrapper and cell layouts
│   │   ├── SnakeLadderSVG.tsx # Responsive vector drawing layer for board hazards
│   │   └── Token.tsx          # Pawn components with hop path physics and overlap offsets
│   ├── Dice/
│   │   └── 3DDie.tsx          # 3D CSS cube die with tumble animations
│   └── UI/
│       ├── Button.tsx         # Animated sound-integrated buttons
│       ├── Card.tsx           # Glassmorphic containers
│       └── ParticleEffect.tsx # Canvas sparkles & canvas-confetti victory explosions
├── context/
│   └── GameContext.tsx        # Global state provider (volume, speed, history, stats, saves)
├── data/
│   └── board.ts               # Static hazard index definitions
├── hooks/
│   ├── useAI.ts               # Automated CPU turn listener
│   └── useGame.ts             # Custom game hook accessor
├── pages/
│   ├── Home/
│   │   └── HomeScreen.tsx     # Animated landing screen with modes & achievements
│   ├── Rules/
│   │   └── RulesScreen.tsx    # Scrollable tutorial rules and card guides
│   ├── Game/
│   │   └── GameScreen.tsx     # Split-panel board play layout with history logs
│   ├── Settings/
│   │   └── SettingsScreen.tsx # Control deck for volume, speed, themes, and data wipe
│   └── Winner/
│       └── WinnerScreen.tsx   # Triumphant screen with matches history and stats
├── types/
│   └── game.ts                # Shared TypeScript definitions
├── utils/
│   ├── audioSynth.ts          # Synthesized AudioContext audio manager
│   ├── gameLogic.ts           # Grid row/col index mappings & path math
│   └── themes.ts              # Aesthetic parameters for themes
├── App.tsx                    # Route controller wrapper
└── main.tsx                   # StrictMode initializer
```

---

## 🚀 Getting Started

### Prerequisites
Make sure you have [Node.js](https://nodejs.org/) installed (v18+ recommended).

### Installation
1. Clone the repository and navigate to the project folder.
2. Install the package dependencies:
   ```bash
   npm install
   ```

### Running Locally
To launch the development server and run the game locally:
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

### Building for Production
To compile and bundle the project into optimized, minified assets for deployment:
```bash
npm run build
```
The compiled files will be created in the `dist/` directory. You can preview the production bundle locally:
```bash
npm run preview
```

### Code Verification
To run TypeScript compiler checks and ESLint rules validation:
```bash
# Type check and lint
npm run build && npm run lint
```

---

## 📜 License
Distributed under the MIT License. See `LICENSE` for more information.
