# ALAMAT — Django backend

Django serves the game (`/play/`), owns accounts (session login) and stores progress.
Species, moves and the type chart live in `game/data/game_data.json` and are used by both the
server (`game/rules.py`) and the browser (injected with `json_script`) — one source of truth.

## Pages
`/` (redirects), `/register/`, `/login/`, `/logout/` (POST), `/play/` (login required).
Usernames are not case-sensitive. Sign-in is throttled (default 8 failures / 5 min per IP+username;
`ALAMAT_LOGIN_MAX_FAILURES`, `ALAMAT_LOGIN_LOCKOUT_SECONDS`).

## JSON API (`/api/`)
| Endpoint | Auth | Purpose |
|---|---|---|
| `GET /api/health/` | – | liveness |
| `POST /api/auth/register/` `{username,password}` | – | 201 + token |
| `POST /api/auth/login/` | – | token (400 bad credentials, 429 locked out) |
| `POST /api/auth/logout/` | token | delete tokens |
| `GET /api/save/` | session or token | `{data, exists, revision, updated_at}` |
| `PUT /api/save/` `{data, revision?}` | session (+CSRF) or token | validated save; **409** if `revision` is stale |

Saves are validated by `game/rules.py:sanitize_save`: creature name/type/stats/moves are recomputed from
species + level, level ≤ 30, item counts capped, story flags and locations must be consistent, malformed
payloads return 400. Out-of-range values are corrected and listed in `adjusted`.

**Known limit:** battles still resolve in the browser, so a hand-crafted but *valid* save (e.g. a level-30
starter) is accepted. Server-side battle resolution is the next milestone (docs/IMPLEMENTATION_PLAN.md, Stage 3).

## Quick test with curl
```bash
curl -X POST localhost:8000/api/auth/register/ -H 'Content-Type: application/json' \
     -d '{"username":"traveler","password":"Violet-Lantern-42"}'
```
