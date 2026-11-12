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

## Szadi Art Houses Pack — finished houses (current)

The current renderer loads **complete house sprites**, avoiding transparent roof/wall gaps and duplicate overlaid doors. Extract `Alamat_Houses_Fixed.zip` from the private Google Drive folder **Alamat Game Assets** into your project root (`C:\\Users\\vtemp\\alamat`), merging the `game` folder.

Expected files inside `game/static/game/assets/environment/buildings/finished/`:
- `home.png`
- `research.png`
- `healing.png`
- `neighbor_a.png`
- `neighbor_b.png`

Each image is preassembled from Szadi Art's original modular Houses Pack, with its original wooden door preserved. The game keeps the existing building footprint, collision, and interaction positions. When a finished image is missing, the code-generated fallback is used.

The older `environment/buildings/szadi_houses.png` and `quiet_village.png` are no longer used by the house renderer and may be archived locally once the new buildings are verified. Source: https://szadiart.itch.io/houses-pack. Follow the creator's license for game use and distribution.

## Pocket Atlas Essentials — terrain (current)

The terrain renderer supports the optional `game/static/game/assets/tiles/pocket_atlas.png`, a compact 256×192 atlas made from 45 original 32×32 Pocket Atlas Essentials sprites. Install `Alamat_Pocket_Atlas_Terrain.zip` from the private Google Drive folder **Alamat Game Assets** by extracting into the project root and merging the `game` folder.

With the atlas installed, Lumina Village uses textured grass, dirt, sand and shallow water. Path edges and grass shoreline boundaries use matching edge/corner tiles; grass-meadow and leaf variations are deterministic by map coordinates. Balete Forest retains a darker ground tint, while tall-grass encounter zones keep their distinctive vegetation and collision/encounter rules. If the atlas is missing, the original procedural tiles render instead. The atlas is not pushed to this public repository; it is intended for local game use.

Source: Ridge Works Studios, *Pocket Atlas Essentials*: https://ridgeworksstudio.itch.io/pocket-atlas-essentials. The included license permits personal/commercial project use and modification and prohibits resale/redistribution of the assets on their own or in another asset pack. The assembled atlas is therefore distributed only within the owner's private asset workflow.

Note: Current auto-tiling supports direct cardinal edges and adjacent outer corners. More complex mixed-terrain junctions and shoreline animation may need a later art pass after visual testing.

## Agilunos battle front/back sprites

The game now loads optional `creatures/agilunos/battle_front.png` and `creatures/agilunos/battle_back.png` for enemy and allied battle perspectives respectively. Both are transparent 64×64 PNG crops chosen from the owner's PixelLab generation. These PNGs are separate from the older overworld `creatures/agilunos.png` and are shown at battle scale using nearest-neighbor rendering. All other species continue to use their existing artwork until their own battle sprites are added. Missing front/back images fall back to the procedural creature sprite. The private asset package is `Alamat_Agilunos_Battle_Assets.zip` in the Google Drive folder `Alamat Game Assets`.
