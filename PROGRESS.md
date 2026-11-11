# ALAMAT — progress

## Current playable client
- `alamat-prototype.html` — single-file canvas prototype
- Battle VFX: loads `assets/fx/explosion/Explosion_1.png` … `_10.png` (CraftPix)
- UI: Reset view, Party, Save, Load, Account
- Map travel loading screen; fade auto-clears

## Django
- Auth + cloud save API under `/api/`
- Game served at `/play/` when using Django

## Assets
Put explosion frames in `assets/fx/explosion/` (see README there).

## Next
- Phaser client migration
- More FX packs / pixel-matched art
