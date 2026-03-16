# Jump King Prototype

Small browser prototype inspired by Jump King. It uses a local Node static server and plain canvas rendering, so no install step is required.

## Start

Run one of these commands from this folder:

```powershell
node server.js
```

or:

```powershell
npm.cmd start
```

Then open `http://localhost:3000`.

## Controls

- `Space` or mouse hold: charge jump
- `A/D` or arrow keys: aim left or right
- Release `Space` or mouse: jump
- `R`: restart

## Character Selection

Use the in-game character dropdown to switch between the sprite sets in:

- `assets/characters/fighter`
- `assets/characters/samurai`
- `assets/characters/shinobi`
- `assets/characters/destiny`

The game uses each character's `Idle.png`, `Run.png`, and `Jump.png` strips and remembers your selection in the browser.

## Custom Art

The game will automatically use matching files if you place them in these folders:

- `assets/characters/custom/player.png` or `.webp` or `.jpg`
- `assets/textures/ledge.png` or `.webp` or `.jpg`
- `assets/textures/wall.png` or `.webp` or `.jpg`
- `assets/textures/background.png` or `.webp` or `.jpg`
- `assets/textures/goal.png` or `.webp` or `.jpg`

There is also an `assets/models` folder for source files or reference models, but the current build only renders 2D sprites and textures on the canvas.
