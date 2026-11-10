# Claude / Coding Agent Handoff

This repository is a **design-first project**. Do not assume it contains an implemented Django app. Your first task is to read the documentation and propose a milestone-sized implementation; do not attempt the full MMO.

## Authoritative specification order

1. `docs/FOLKLORE_POLICY.md` for names and source attribution
2. `docs/ART_STYLE_BIBLE.md` and `docs/ASSET_PIPELINE.md` for visual compatibility
3. `docs/GAME_DESIGN.md` for gameplay and scope
4. `docs/IMPLEMENTATION_PLAN.md` for task order
5. `data/creature_registry.json` for provisional creature records

If conflicts exist, **report the conflict** and update the documentation before implementation. No unsourced renaming of traditional beings. In particular, **Tikbalang ≠ Tikbalan** and **Bakunawa ≠ Bakunara**. Traditional beings must be marked as folklore-based; invented designs/names must be marked original.

## Proposed architecture

- `backend/`: Python, Django, Django REST Framework, SQLite for local dev; PostgreSQL-ready configuration.
- `frontend/`: TypeScript, Phaser, Vite; client handles rendering and UI, not authoritative battle rewards or inventory changes.
- `assets/`: approved original or licensed spritesheets, tilesets, maps, audio; track origin/license in a manifest.
- `docs/`: GDD, art bible, folklore research, implementation plan.
- `tests/`: backend deterministic combat tests and frontend smoke/integration tests.

The system must be portable: include `.env.example`, pinned/lockable dependencies, migration instructions, scripts for Windows/Linux, reproducible seed data, and a README runbook. Never commit secrets or runtime databases.

## Non-negotiables

- Start with single-player persistent browser gameplay, not live multiplayer.
- Server validates battle outcomes, recruited creatures, economy and experience.
- Build a deterministic rules engine separate from HTTP endpoints; seed the battle RNG for tests.
- Use schema/migration-backed creature and move identifiers; no hardcoded display names as primary keys.
- Data-driven encounters, dialogue, maps and species.
- Check texture dimensions, grid alignment, collision layers and nearest-neighbor scaling.
- Create original assets; do not scrape or copy copyrighted images from the folklore research site.
- Attribute regional traditions separately; avoid implying one nationwide standardized mythology.
- Introduce tests and a working end-to-end demo at every milestone.

## First coding milestone only

Scaffold Django + DRF and Phaser + TypeScript with a single README setup path, basic health endpoint, one blank Phaser scene, and automated smoke tests. Then implement player movement and the first map as the next milestone. Ask for approval before major changes to the design bible.
