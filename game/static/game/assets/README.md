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
