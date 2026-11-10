# Visual Asset Pipeline and Handoff

## Current state

**No approved creature sprite, animation sheet, tileset, map or concept illustration is committed.** Prior chat image-search examples were illustrative only and may be third-party works. Never download and redistribute them into this repository. The companion design files supply specifications and prompts, not a completed asset pack.

## Planned repo paths

```text
assets/
  README.md
  concepts/          # approved original concept references
  characters/        # transparent PNG sprite sheets
  creatures/         # species-specific sprites and animations
  tilesets/          # PNG tilesheets
  tilemaps/          # Tiled JSON maps
  ui/                # scalable UI skins and icons
  audio/             # licensed music and SFX
  manifest.json      # license + provenance for every asset
```

Directories will be created when real assets exist. Do not use borrowed site art as placeholders.

## Approval pipeline

1. Research and tag source/inspiration: folklore creature vs wildlife-based original.
2. Generate/draw original concept sheet; record author/tool and prompt.
3. Review folklore naming, visual silhouette, regional details and originality.
4. Produce pixel-correct frames; align feet anchor; no stretched or blurred frames.
5. Export PNG and sprite-sheet metadata; pack using predictable naming.
6. Add manifest record: path, kind, creator/tool, source inspiration URL, date, license/usage rights, dimensions, frame grid, reviewer/status.
7. Test in Phaser on actual map with both bright/dark backgrounds and 1x/2x/3x scaling.
8. Mark approved only after visual + technical QA; reject/refine mismatches.

## Asset naming conventions

- `player_explorer_walk_down.png`
- `creature_tarsilaw_overworld.png` (original concept, not yet approved)
- `creature_tikbalang_concept.png` (only if an approved folklore-based adaptation)
- `tiles_lumina_village_v01.png`
- `map_lumina_village_v01.json`

**Rule:** Artwork and code must refer to stable asset IDs. Image filenames must not silently change without updating the manifest and scene configuration.

## AI tooling

PixelLab or another pixel-specific generator may be used for concepts and frames; a raster pixel editor plus Tiled will generally still be needed to fix seams and layer maps. Claude handles code integration. Every AI output requires human review, licensing checks and QA. Tool subscription terms may differ between free and paid plans; verify before distributing the game.
