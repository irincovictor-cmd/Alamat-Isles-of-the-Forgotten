# ALAMAT: Isles of the Forgotten

**Status:** Playable HTML prototype + minimal Django API (auth/save)  
**Style:** Modern HD pixel art, top-down 2D browser RPG  
**Core stack (planned long-term):** Django + DRF + Phaser + TypeScript  
**Current playable client:** single-file HTML/JS prototype (no install required)  
**Source-of-truth for folklore:** The Aswang Project, with article-level citations and regional attribution.

ALAMAT is an original creature-collecting RPG set across a fictional Philippine-inspired archipelago. Explore settlements, forests, and coastlines; encounter beings inspired by Philippine wildlife and folklore; build bonds; and investigate an original supernatural disturbance called the **Lilim**.

> Important: Traditional figures keep their documented names (e.g. **Tikbalang**, **Bakunawa**, **Kapre**). Original game species must be identified as original creations. The Aswang Project is a research reference, **not an art-asset library or blanket permission to reproduce its text/images**.

## Play now

1. Open **`alamat-prototype.html`** in a browser (or use GitHub Pages once that file is the site root / `index.html`).
2. No Python/Django required for local playtesting.
3. **F5** save / **F9** load use browser localStorage.

Full session notes: **[PROGRESS.md](PROGRESS.md)**  
Backend setup: **[README_BACKEND.md](README_BACKEND.md)**

### Prototype controls

| Key | Action |
|-----|--------|
| Arrows / WASD | Move |
| E / Space / Enter | Interact |
| P | Party menu |
| X / Esc | Back |
| F5 | Save |
| F9 | Load |
| F2 | Collision inspector |

### Vertical slice included

- Lumina Village → Balete Forest → Ancient Shrine
- Starter selection, wild encounters, turn-based battle
- Trust + Selyo bonding, party (max 3), herbs, XP/levels
- NPCs, dialogue, local save/load

## Minimal Django API (optional)

Auth + cloud save only. Not required to play the HTML prototype.

```bash
python -m venv .venv
source .venv/bin/activate   # Windows: .venv\Scripts\activate
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```

- `GET /api/health/`
- `POST /api/auth/register/` / `login/`
- `GET|PUT /api/save/` (token auth)

## Design docs (still authoritative for scope/lore)

1. [CLAUDE.md](CLAUDE.md) — agent handoff
2. [docs/GAME_DESIGN.md](docs/GAME_DESIGN.md)
3. [docs/ART_STYLE_BIBLE.md](docs/ART_STYLE_BIBLE.md)
4. [docs/FOLKLORE_POLICY.md](docs/FOLKLORE_POLICY.md)
5. [data/creature_registry.json](data/creature_registry.json)
6. [docs/IMPLEMENTATION_PLAN.md](docs/IMPLEMENTATION_PLAN.md)

## Research links

- [Bikolano mythology](https://www.aswangproject.com/philippine-mythology/bikolano-mythology-beliefs/)
- [Mythologies by cultural group](https://www.aswangproject.com/philippine-mythologies-by-cultural-group/)
- [Creatures compendium](https://www.aswangproject.com/creatures-mythical-beings-philippine-folklore-mythology/)
- [Tikbalang](https://www.aswangproject.com/tikbalang/)
- [Bakunawa](https://www.aswangproject.com/bakunawa/)
