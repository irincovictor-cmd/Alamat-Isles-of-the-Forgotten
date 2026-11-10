# Claude Visual Integration Handoff

## Read first

- `CLAUDE.md`
- `docs/VISUAL_PRODUCTION_PHASE_01.md`
- `docs/AI_ART_PROMPTS_PHASE_01.md`
- `docs/ART_STYLE_BIBLE.md`
- `docs/ASSET_PIPELINE.md`

## Important status

**Art assets are not yet generated/approved.** Do not write code that pretends that the proposed PNGs or map JSON already exist. You may scaffold code with clearly marked geometric placeholders, but never silently substitute random internet art or incompatible sprites.

## Integration specification

- Phaser orthographic top-down scene, logical 32px tile grid.
- Player frame 64x64, feet anchored bottom center; check per-animation metadata.
- Tile collision from Tiled object/terrain layers; player should be able to walk behind tree canopies (foreground layer) while trunks remain solid.
- Maintain z-depth based on sprite y-foot where relevant; fore/background layers explicit.
- Door tile regions are interactable and transitions use stable IDs, no hardcoded pixel coordinates in gameplay logic.
- Parse Tiled JSON and bind with asset manifest, not screenshot pixel colors.
- Supports nearest-neighbor texture sampling and crisp scaling at runtime.
- Show clear error if an approved asset is missing, rather than rendering broken sprites without explanation.
- Create developer-only visual inspector for collision tiles, spawn, interactions and sprite anchors.
- Add smoke tests: map loads; player is visible; blocked terrain stops movement; interaction opens dialogue; layer order remains correct.
- Maintain reproducible local setup on Windows/Linux and avoid assumptions about developer machine paths.

## Handoff command

"Read CLAUDE.md, VISUAL_PRODUCTION_PHASE_01.md and CLAUDE_VISUAL_HANDOFF.md. Begin Stage 1 portable Django+Phaser scaffold, then build a map and sprite loader with temporary geometric placeholders and clear approved-asset swap points. Do not fabricate sprites or treat unapproved reference mockups as game maps. Demonstrate a loaded scene and passing smoke tests before adding more features."
