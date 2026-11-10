# Implementation Roadmap and Acceptance Gates

## Stage 0 — Documentation and decisions (current)

- [x] Choose Modern HD pixel art
- [x] Establish Django + Phaser division
- [x] Create GDD, art bible, folklore policy, asset pipeline
- [x] Correct Tikbalang / Bakunawa naming
- [ ] Approve starter roster and original creature names
- [ ] Approve concept sheets and player style
- [ ] Approve first Lumina Village map layout

## Stage 1 — Portable project scaffold

- [ ] Django, DRF, configuration via environment file, SQLite development DB
- [ ] Phaser + TypeScript, Vite, empty scene
- [ ] Lock dependency versions; provide reproducible setup for Windows/Linux
- [ ] API health check, CORS/dev proxy, lint/test scripts
- [ ] CI run on every push or PR

**Gate:** Fresh clone launches backend and frontend by following README without copying developer-specific directories or secrets.

## Stage 2 — Explore

- [ ] Player profile, saved location
- [ ] Player sprites/movement/animation, camera follow
- [ ] Lumina Village Tiled map with solid and passable layers
- [ ] NPC interactions, dialogue, map transitions
- [ ] Forest test area and basic encounter triggers

**Gate:** Walk between maps, reload and retain position.

## Stage 3 — Battle and collect

- [ ] Data schemas: species, individual creatures, moves, encounter tables, active battle
- [ ] Starter selection, simple 1v1 turn-based battles
- [ ] Trust + Selyo recruitment, experience, inventory/team
- [ ] Atomic server-side persistence, anti-tampering checks
- [ ] Deterministic rules tests and browser smoke tests

**Gate:** Encounter -> battle -> bond -> team -> logout/login -> saved state.

## Stage 4 — Content polish

- [ ] 10 approved species and source metadata
- [ ] Five connected island zones
- [ ] Introductory quests, healing, sound, accessibility controls
- [ ] Consistent artwork and load performance

**Gate:** Complete short beginning-to-end playable chapter, no blockers.

## Stage 5 — Later only

Multiplayer, creature trading, PvP, economy, seasonal events, advanced evolutions/awakening, additional islands. These must not block Stage 1–3.

## Process

For each stage: requirements -> architecture/UI/data -> implementation -> automated and GUI tests -> fix/reverify -> GitHub update and clean deliverable -> documentation. Prefer small PRs with tests and screen recordings/screenshots of actual running gameplay (never stock images presented as gameplay).
