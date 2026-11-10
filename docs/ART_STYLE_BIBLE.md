# Art Style Bible — Modern HD Pixel Art, v0.1

**Status:** Art direction **specification**, not an approved asset pack. The illustrative images shared in earlier conversation are inspiration only, not source files or automatically reusable art.

## Identity

A magical Philippine-inspired tropical archipelago: colorful but grounded architecture, dense vegetation, luminous spirit effects, gentle atmospheric depth, and crisp pixel clusters. Avoid generic medieval European buildings and vague pan-Asian temple motifs.

## Camera and geometry

- Orthographic top-down maps, with consistent 3/4-view humanoid/creature sprites.
- Standard logical tile size: **32 × 32 px**.
- Player animation cell: **64 × 64 px** (art may occupy less; preserve feet/bottom-center anchor).
- Overworld creature frame: **64 × 64** or **96 × 96 px**, standardized by size class.
- Battle illustrations: max **192 × 192 px** per normal creature; bosses may use special larger frames, not distorted sprites.
- 4-direction movement: front/down, back/up, left, right. Four directional idle frames and at least four walking frames per direction for the eventual character sheet.
- Design baseline: **1280 × 720** logical UI space; game camera/canvas responsiveness defined separately from native art dimensions.
- Use nearest-neighbor texture filtering and integer display scales where possible; never run a photographic upscaler on finalized sprite sheets.

## Art rules

- Strong, legible silhouettes at actual game zoom.
- Consistent outline thickness, internal pixel clusters, shadow direction and light-source logic.
- Restrained glow as **separate effect layer**, never permanent blur over sprite edges.
- No mismatched perspective, smoothed vector-looking silhouettes or inconsistent pixel density.
- Animation sheets must share canvas size, feet anchors, frame order and palette.
- Transparent RGBA PNG for movable entities; lossless PNG tilesets; Tiled JSON for maps.
- No lettering/text baked into decorative art; UI strings stay localization-ready.

## Preliminary palette (subject to in-engine review)

| Role | Hex |
|---|---|
| Deep midnight navy | `#142638` |
| Tropical forest green | `#397A57` |
| Fern highlight | `#83B66A` |
| Sea teal | `#317F91` |
| Warm sand | `#D7B779` |
| Lantern gold | `#F1C66A` |
| Spirit cyan | `#76D8D2` |
| Corruption violet | `#75538C` |
| Neutral off-white UI | `#F5F0E7` |

Treat values as initial art-direction anchors, not mandatory uniform colors for every regional biome.

## Environment kit priorities

1. Lumina Village: simple Philippine coastal-settlement-inspired buildings, paths, coconut palms, fences, wells, market stalls, NPC signs.
2. Balete Forest: trunk and canopy layers, roots, leaf litter, undergrowth, rocks, blocking objects and encounter terrain.
3. Coast: sand, foam edges, docks, boats and tidal shallows.
4. Cave and shrine later; do not produce a single flattened AI-generated map in place of reusable tiles.

## Character and creature sheets

Each approved character/species requires: source or original declaration; silhouette exploration; front/side/back views; final palette; overworld idle/walk frames where applicable; battle front/back frames or explicitly approved battle-display policy; anchor dimensions; export tests. For regional folkloric beings, attach evidence notes and avoid asserting one depiction is the sole authentic appearance.

## Prompts for asset tools (concept stage)

**Player concept:** "Original youthful explorer for a Philippine-inspired tropical fantasy creature RPG; 3/4 view modern HD pixel art; 64x64 design target, crisp pixel clusters, consistent warm upper-left lighting, simple travel satchel and practical island clothing, readable silhouette, no logo, no text, no copyrighted character likeness."

**Forest tileset concepts:** "32x32 tileable top-down modern HD pixel art forest tileset for a tropical Philippine-inspired RPG; repeatable dirt paths, leafy ground, roots, stones, canopy edges and collision-ready tree trunks; same pixel density, consistent upper-left light, crisp edges, no text, no preassembled map."

**Original wildlife creature concept:** "Original small forest-dwelling fantasy creature inspired by Philippine tarsier habitat, not a literal copy of any existing game creature; distinctive anatomy, clear silhouette, modern HD pixel art, front/side/back concept sheet, restrained spirit glow, clean pixel edges, no background, no labels."

Do **not** call the output production-ready until reviewed for pixel grid, transparency, perspective, clipping, licensing and sprite sheet alignment.
