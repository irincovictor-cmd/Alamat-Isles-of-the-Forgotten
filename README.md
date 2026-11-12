# ALAMAT: Isles of the Forgotten

**Status:** Playable HTML prototype + minimal Django API (auth/save)  
**Style:** Modern HD pixel art, top-down 2D browser RPG  
**Core stack (planned long-term):** Django + DRF + Phaser + TypeScript  
**Current playable client:** single-file HTML/JS prototype (no install required)  
**Source-of-truth for folklore:** The Aswang Project, with article-level citations and regional attribution.

ALAMAT is an original creature-collecting RPG set across a fictional Philippine-inspired archipelago. Explore settlements, forests, and coastlines; encounter beings inspired by Philippine wildlife and folklore; build bonds; and investigate an original supernatural disturbance called the **Lilim**.

> Important: Traditional figures keep their documented names (e.g. **Tikbalang**, **Bakunawa**, **Kapre**). Original game species must be identified as original creations. The Aswang Project is a research reference, **not an art-asset library or blanket permission to reproduce its text/images**.

## Play now (Django is the main app)

```bash
python -m venv .venv
source .venv/bin/activate          # Windows: .venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env               # optional for local dev
python manage.py migrate
python manage.py runserver
```

Open <http://127.0.0.1:8000/>. Create an account at `/register/`, then play at `/play/`.
Progress autosaves to your account (after map changes and battles); **F5** saves, **F9** loads.
Run the tests with `python manage.py test`.

### Creating an administrator (for new installations)

After `python manage.py migrate`, the person **running the server locally** can open a terminal in the project folder and run:

```bash
python manage.py setupadmin
```

Follow Django's interactive prompts to enter a **new, unique username and strong password**. Django hides the password while typing. The command creates a Django superuser, who can sign in to `/admin/` and the game at `/play/`. This setup command runs only from a local interactive terminal; there is **no public "register as admin" option**.

If the username already exists as a regular player, choose a different username for the admin account. To change a current admin's password, run `python manage.py changepassword <username>`.

**Security:** Giving out the source code does not share your personal admin account or database. Never commit `db.sqlite3`, `.env`, or your credentials; each installation must create its own admin. The optional **Load All Creatures** test tool is visible only to staff/superusers in development mode (`DJANGO_DEBUG=1`) and replaces that admin account's test collection.



| Key | Action |
|-----|--------|
| Arrows / WASD | Move |
| E / Space / Enter | Interact |
| P | Party menu |
| X / Esc | Back |
| F5 / F9 | Save to / load from your account |
| N (title screen) | New game |
| F3 / Reset view | Clear a stuck overlay (not during a battle) |
| F2 | Collision inspector |

Pages: `/login/`, `/register/`, `/logout/` (POST), `/play/`. JSON API: `/api/` (see [README_BACKEND.md](README_BACKEND.md)).

> `alamat-prototype.html` is the old standalone snapshot (offline, localStorage). It only received the
> fade-freeze fix; new work happens in `game/static/game/alamat.js` + Django.

Full session notes: **[PROGRESS.md](PROGRESS.md)**

### Vertical slice included

- Lumina Village → Balete Forest → Ancient Shrine
- Starter selection, wild encounters, turn-based battle
- Trust + Selyo bonding, party (max 3), herbs, XP/levels (cap 30)
- NPCs, dialogue, account save/load

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
