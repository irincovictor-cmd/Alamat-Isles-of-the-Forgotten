# ALAMAT Visual Production — Phase 01

Status: production specification / **no approved image assets yet**. Owner choice: Modern HD pixel art. Artwork created by an external AI is reviewed and committed before Claude uses it.

## Assignment of responsibilities

- PixelLab / external artwork AI: original character concepts, directional sprites, tileable terrain, buildings, environment objects.
- Human owner: review visual quality, copyright/licensing, cultural accuracy and approve final images.
- Claude: build Django and Phaser; import *approved* images only, using asset manifests and Tiled maps.
- GitHub: all approved game assets, provenance, metadata and implementation notes.

## Build order and acceptance checkpoints

### A. Player explorer

Produce a single approved **master reference sheet** before any rotations. Design: original young Filipino island explorer, practical contemporary/fantasy travel clothes, short dark hair, dark teal tunic/jacket with sand accents, small cross-body satchel, sturdy brown footwear. Gender presentation and accessories can be revised by owner; default is gender-neutral. No weapons as default, no copied franchise look.

Deliverables:
- concept sheet: front/back/left/right; readable silhouette; palette swatches
- four direction sprites aligned to 64x64 frame cell, transparent PNG, feet anchored at bottom center
- walking animation: 4 frames per direction (16 frames), plus 4 idle directions
- preview GIF optional; do not substitute GIF for transparent game frames
- data metadata: frame order, frame dimensions, direction names, origin license, approved status

Acceptance: identical outfit/proportions all directions; feet anchors stable; no floating character, no fake antialiasing or mixed pixel density.

### B. Lumina Village architectural kit

Create *modular reusable assets*, not a one-piece illustration. All buildings match 32px ground tiles and top-down 3/4 viewpoint. Starting palette: warm sand, light brown bamboo/wood, muted terracotta/corrugated roofs, deep teal/forest green, lantern gold.

Core set, in this order:
1. Explorer starting home — modest raised timber-and-bamboo coastal dwelling; readable south-facing door; approximate logical footprint 5x4 ground tiles.
2. Research/guardian center — civic structure with original science/folklore-inspired motifs (avoid depicting sacred ethnic symbols generically); 8x6 tiles.
3. Healing house — recognizable by warm teal textile/sign and herbal garden; 6x5 tiles.
4. Market stall and item shop — 4x3 tiles each.
5. 2–3 variants of small village houses — reusable facades/roof variations.

For each: transparent PNG exterior, separate shadow if needed, base/roof collision guide, door interaction tile and no baked readable words. Footprint dimensions are provisional: preserve 32px alignment and adjust after Tiled placement tests.

### C. Environment kit

Create tileable 32x32 terrain textures: light/dark grass, dirt trail, sand, compacted village ground, shallow sea water, water edge transitions. Create separate reusable sprites: coconut palm, broadleaf tropical tree, balete-style root/tree (avoid treating a specific sacred tree as generic decorative shrine), bushes, rocks, fences, lantern post, plants, baskets and well.

Produce grass/dirt/water connections as **actual seamless autotile variations**, not unrelated attractive tiles. Map collision objects need clear visible ground footprints. Foreground canopy should render above player while its trunk is blocked.

### D. The first test map

Create *Lumina Village prototype* at 40x30 tiles (1280x960 logical world pixels) in **Tiled JSON**, with separate tile layers: ground, paths, water, decorations-low, foreground-high; object layers: collision, NPCs, exits, interactions, spawn, camera boundaries. Map exact scale may adjust after player test. Provide screenshots for approval, but JSON + images remain canonical.

## Locked art rules for Phase 01

- Tile grid: 32x32 logical pixels; sprite cell: 64x64.
- Top-down orthographic mapping with consistent 3/4-visible character/building faces, not isometric diamond grid.
- Light from upper-left; no contradictory cast shadows.
- Crisply clustered modern HD pixel art; no blur/photorealism/smooth vector edges.
- Building doors are on walkable southern faces, occupy an explicit tile interaction area.
- No text baked into sprites; no branded characters or game franchise cues.
- Do not use exact traditional folklore iconography for generic decorations without source research.
- Export transparent sprites as PNG and maps in editable JSON.

## Source-of-truth naming and paths

```
assets/concepts/player_explorer_master.png
assets/characters/player_explorer_idle.png
assets/characters/player_explorer_walk.png
assets/tilesets/tiles_lumina_ground.png
assets/tilesets/tiles_lumina_structures.png
assets/tilesets/tiles_lumina_nature.png
assets/tilemaps/map_lumina_village_v01.json
assets/manifest.json
```

Only put real exported assets at these paths. No screenshots from other games or scraped reference pictures. Claude should not invent sprite-sheet order: read approved metadata and manifest.
