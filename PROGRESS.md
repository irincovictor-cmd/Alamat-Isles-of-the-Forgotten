# ALAMAT — Session progress (2026-11-11)

## Status summary

| Item | Status |
|------|--------|
| Playable HTML prototype | **Done** — improved gameplay |
| GitHub Pages–ready client | **Yes** — single `alamat-prototype.html` |
| Minimal Django API (auth + save) | **Scaffolded** — not required to play |
| Pushed to GitHub | This commit |
| Full Phaser client / server battles | Not started (by design for now) |

The official design docs still describe Django + Phaser long-term. With limited resources we shipped a **working vertical slice in pure HTML/JS** and a **lightweight Django API** only for accounts and cloud saves.

---

## 1. HTML prototype (`alamat-prototype.html`)

Self-contained 2D pixel prototype (Philippine folklore–inspired creature RPG).

### Gameplay implemented

- Title → **Lumina Village** → **Balete Forest** → **Ancient Shrine**
- Movement, collisions, camera, NPCs, dialogue
- Starter choice: Tarsilaw / Agilunos / Bagaon
- Wild encounters, turn-based battle
- Trust + **Selyo** bonding; party max 3
- XP / levels, simple type effectiveness, herbs
- Party menu (**P**), home rest heal
- **F5** save / **F9** load (localStorage)
- Mobile on-screen pad; **F2** collision inspector
- Self-tests in footer (target 10/10)

### Controls

| Key | Action |
|-----|--------|
| Arrows / WASD | Move |
| E / Space / Enter | Interact |
| P | Party |
| X / Esc | Back |
| F5 | Save (local) |
| F9 | Load (local) |
| F2 | Collision overlay |

### How to play (no install)

Open `alamat-prototype.html` in a browser, or host it on **GitHub Pages** as `index.html`.

---

## 2. Minimal Django backend

**Purpose:** register / login / cloud save only. Combat stays on the client for now.

### Endpoints

| Method | Path | Auth | Purpose |
|--------|------|------|---------|
| GET | `/api/health/` | public | Liveness |
| POST | `/api/auth/register/` | public | `{username, password}` → token |
| POST | `/api/auth/login/` | public | `{username, password}` → token |
| POST | `/api/auth/logout/` | token | Invalidate token |
| GET | `/api/save/` | token | Load save JSON |
| PUT | `/api/save/` | token | `{ "data": { ... } }` |

Save payload matches the prototype localStorage shape:  
`party`, `selyo`, `herbs`, `f`, `mapId`, `x`, `y`, `dir`.

### Run locally (Windows example)

```powershell
cd C:\Users\vtemp\alamat
python -m venv .venv
.\venv\Scripts\Activate.ps1
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```

Details: [README_BACKEND.md](README_BACKEND.md)

---

## 3. What was intentionally not done

- No Phaser / TypeScript client yet
- No server-authoritative battle resolution
- HTML client not yet wired to the Django save API (still localStorage)
- Traditional beings (Tikbalang, Bakunawa, Kapre) remain lore-only

---

## 4. Suggested next steps

1. Playtest the HTML loop; tune balance / bugs  
2. Optionally wire F5/F9 to `/api/save/` when logged in  
3. Enable GitHub Pages on this repo (serve `alamat-prototype.html` or rename to `index.html`)  
4. When ready: server-side combat rules + Phaser client per original plan  

---

## 5. Folklore / design notes

- Follow existing `docs/FOLKLORE_POLICY.md` and `data/creature_registry.json`
- Original species only for recruitment in this prototype
- Do not treat game inventions (Selyo, Lilim, bonding) as traditional practice
