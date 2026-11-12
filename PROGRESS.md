# ALAMAT — progress

## Current
- Django is the main app: `/register/`, `/login/`, `/play/`, `/api/save/` (see README.md, README_BACKEND.md).
- Client: `game/static/game/alamat.js` (canvas game), data from `game/data/game_data.json`.
- Tests: `python manage.py test` (60 backend tests).

## Fixed in this milestone
- Fade freeze: every battle/map warp hung until F3 (fade stepped 0.12 but only stopped within 0.03).
- Faster wild creature skipped the player's whole turn; forced swap used the wrong creature's move.
- Root Guard permanently raised base DEF and stacked; now a capped, per-battle buff.
- Full party + successful bond lost the creature; now the player chooses a swap.
- Reset view during a battle soft-locked it.
- Encounters were identical every session (fixed RNG seed) and could trigger on the first step.
- Auth: case-variant duplicate usernames, case-sensitive login, 500s on non-string input, no brute-force
  protection, mismatched password rules, unvalidated `next`, no `/play/` route, tampered saves accepted.

## Next
- Server-side battle resolution (Stage 3), art assets, Phaser/TypeScript migration (optional).
