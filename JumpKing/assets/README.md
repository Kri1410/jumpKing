# Assets

This project now has asset folders ready for custom art.

## Runtime-loaded files

The browser build looks for these files automatically:

- `assets/characters/custom/player.png`
- `assets/characters/custom/player.webp`
- `assets/characters/custom/player.jpg`
- `assets/textures/ledge.png`
- `assets/textures/wall.png`
- `assets/textures/background.png`
- `assets/textures/goal.png`

If a matching file exists, it replaces the fallback painted art in the game.

## Built-in character pack

The game also ships with selectable characters from:

- `assets/characters/fighter`
- `assets/characters/samurai`
- `assets/characters/shinobi`

The UI selector uses each character's `Idle.png`, `Run.png`, and `Jump.png` files.

The original imported pack is now archived in:

- `assets/source-packs/craftpix-shinobi-pack`

That archive is split into:

- `sprites/`
- `source-sheets/`
- `docs/`

## Model storage

Put source character files, references, or model exports in `assets/models`.
That folder is not rendered directly by the current 2D prototype.
