# Alamat — drop-in visual assets

PNG files placed here automatically replace matching procedural art after refreshing the game page. Missing files, broken images, or unrecognized names retain the current code-drawn visuals. No JavaScript changes or build step required.

## Folder layout

- `creatures/<species-id>.png`: square creature art, ideally 32×32, transparent background. IDs: `tarsilaw`, `agilunos`, `bagaon`, `alitaptap`, `lumot`, `pakpak`, `bato`, `dagat`.
- `characters/player.png`: 256×256 sheet (64×64 cells) OR compact 128×192 sheet (32×48 cells). Four columns = walking frames 0–3; four rows = down, up, left, right. Single PNGs are also supported but stay static while moving.
- `characters/luz.png`, `characters/dina.png`, `characters/tonyo.png`: NPC replacements, either the same four-direction sheet layout or a single static transparent PNG.
- `tiles/grass.png`, `forest_grass.png`, `dirt.png`, `sand.png`, `water.png`, `tall_grass.png`, `dark_grass.png`: each 32×32, seamless edges recommended.
- `environment/objects/lantern.png`, `well.png`, `fence.png`, `sign.png`, `stall.png`, `palm.png`, `tree.png`, `btree.png`, `shrine.png`: environment props; displayed at the dimensions of the current generated sprite. Favor transparent PNGs.
- `environment/buildings/house.png`: optional *shared* replacement for all houses, scaled to each house's existing canvas dimensions. Distinct building art can be supported in a future pass.

## Rules

1. Use exact **lowercase filenames** and matching folder paths. Keep the `.png` extension.
2. Refresh the running Django game page (Ctrl+F5 if the browser cached the old script).
3. If nothing appears, check the browser Network tab: the PNG should return HTTP 200, not 404. Files under Django's static directory are served by Django during local development with DEBUG enabled; a deployed site must collect and serve static files correctly.
4. A missing asset does not break gameplay. The code-drawn artwork remains until the image is loaded.
5. Art changes only appearance, not collision boundaries or gameplay sizes. A building PNG is stretched to the original building footprint.
6. Keep the visual style coherent: modern HD pixel art, clear silhouettes, consistent outlines and light direction, Philippine mythology grounded in the project's design documents. Avoid assets lifted from copyrighted games.
7. Record all third-party images and their licenses/attribution in `manifest.json`. CC0 typically needs no attribution; CC-BY does.

The fallback renderer and asset filenames are maintained in `game/static/game/alamat.js`.

## Last tick 2D Forest 128×128 atlas integration

The environment renderer supports two **optional 512×512 transparent sprite atlases**:
- `environment/forest/green.png` — copy the creator's `tree1.png` here. Used for leafy trees in Lumina Village and Balete Forest.
- `environment/forest/bare.png` — copy `tree2.png` here. Used for leafless trees around the Ancient Shrine.

Each atlas contains 15 tree sprites arranged in a 4×4 grid of 128×128 cells; the sixteenth cell is empty. The renderer selects a stable variant based on map coordinates, scales each tree to 112×112 pixels, anchors the sprite at its trunk tile, and keeps the original one-tile collision plus scene depth ordering. Palm trees stay procedural. If either PNG is absent, the existing hand-drawn tree art remains as fallback.

**Academic asset permission:** The creator of this tree pack granted academic-use permission to the project owner. This repository intentionally does not include the licensed tree PNGs: obtain them from the creator and place them at the paths above. Redistribution in a public source repository requires separately confirmed permission. Source: https://last-tick.itch.io/2d-forest-free-128x128.

## Szadi Art Houses Pack — current building replacement

Place `game/static/game/assets/environment/buildings/szadi_houses.png` (the original 1024×1024 `houses.png` atlas) in your local project. The game assembles roofs and walls into complete building facades, with variants for the player home, research center, healing house, and neighbors. Collisions, map footprints, and interactions remain unchanged. Missing atlas files fall back to the original procedural buildings.

Installation package: `Alamat_Szadi_Houses_Local.zip` in the private Google Drive folder **Alamat Game Assets**. Unzip it at the project root (`C:\\Users\\vtemp\\alamat`) and merge the `game` directory.

Art by Szadi Art: https://szadiart.itch.io/houses-pack. The included license permits personal/commercial use and modifications without mandatory credit; reselling the asset pack is not permitted. The prior Quiet Village atlas is no longer referenced by the current building renderer and can be archived or removed locally after verifying the replacement.

Note: Building proportions and appearance still need verification in the running browser, as the game uses different map-sized building footprints.
