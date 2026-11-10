# ALAMAT: Isles of the Forgotten

**Status:** Pre-production / design documentation (no playable game yet)  
**Style:** Modern HD pixel art, top-down 2D browser RPG  
**Core stack (planned):** Django + Django REST Framework + Phaser + TypeScript  
**Source-of-truth:** The Aswang Project, with article-level citations and regional attribution.

ALAMAT is an original creature-collecting RPG set across a fictional Philippine-inspired archipelago. Explore settlements, forests, and coastlines; encounter beings inspired by Philippine wildlife and folklore; build bonds; and investigate an original supernatural disturbance called the **Lilim**.

> Important: Traditional figures keep their documented names (e.g. **Tikbalang**, **Bakunawa**, **Kapre**). Original game species must be identified as original creations. The Aswang Project is a research reference, **not an art-asset library or blanket permission to reproduce its text/images**.

## Start here (for Claude or another development agent)

1. Read [CLAUDE.md](CLAUDE.md) for development expectations and handoff.
2. Read [docs/GAME_DESIGN.md](docs/GAME_DESIGN.md) for game systems and MVP requirements.
3. Read [docs/ART_STYLE_BIBLE.md](docs/ART_STYLE_BIBLE.md) before producing any artwork.
4. Read [docs/FOLKLORE_POLICY.md](docs/FOLKLORE_POLICY.md) and [data/creature_registry.json](data/creature_registry.json) before adding creatures or lore.
5. Read [docs/ASSET_PIPELINE.md](docs/ASSET_PIPELINE.md) for sprites, tiles and asset approval.
6. Follow [docs/IMPLEMENTATION_PLAN.md](docs/IMPLEMENTATION_PLAN.md) in small tested milestones.

## First playable vertical slice

- Account creation/login and saved progress
- Lumina Village and a small traversable area of Balete Forest
- 4-direction player movement, collisions, camera, NPC dialogue
- Starter selection, one wild encounter, one turn-based battle
- A Selyo-based bonding attempt, party/inventory persistence
- Django authoritative persistence; Phaser display/input client

## Decisions that remain provisional

Working title, place names, original species names, narrative details, balance numbers, and finalized artworks. The art samples in chat are **not** approved or licensed project assets. No finished sprite sheets or maps are committed yet.

## Research links

- [Bikolano mythology](https://www.aswangproject.com/philippine-mythology/bikolano-mythology-beliefs/) (user-specified starting point)
- [Philippine mythologies by cultural group](https://www.aswangproject.com/philippine-mythologies-by-cultural-group/)
- [Creatures compendium](https://www.aswangproject.com/creatures-mythical-beings-philippine-folklore-mythology/)
- [Tikbalang source article](https://www.aswangproject.com/tikbalang/)
- [Bakunawa source article](https://www.aswangproject.com/bakunawa/)

Research details and licensing rules: [docs/FOLKLORE_POLICY.md](docs/FOLKLORE_POLICY.md).
